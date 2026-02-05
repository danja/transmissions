// docker/public/admin.js
const ADMIN_AUTH_KEY = 'newsmonitorAdminAuth'
const ADMIN_USER_KEY = 'newsmonitorAdminUser'

let allFeeds = []
let filteredFeeds = []
let pendingUnsubscribe = null
let adminAuth = null
let adminUser = null
let isAdminLoggedIn = false

document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin().catch(err => {
        console.error('Admin init error:', err)
    })
})

async function initializeAdmin() {
    setupEventListeners()
    await restoreAdminAuth()
    loadFeeds()
}

function setupEventListeners() {
    // Update all feeds button
    document.getElementById('update-all-btn').addEventListener('click', updateAllFeeds)

    // Subscribe button
    document.getElementById('subscribe-btn').addEventListener('click', subscribeToFeeds)

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('feed-urls').value = ''
        hideStatus()
    })

    // Filter input
    document.getElementById('filter-feeds').addEventListener('input', (e) => {
        filterFeeds(e.target.value)
    })

    // Sort select
    document.getElementById('sort-select').addEventListener('change', (e) => {
        sortFeeds(e.target.value)
    })

    // Modal buttons
    document.getElementById('confirm-yes').addEventListener('click', confirmUnsubscribe)
    document.getElementById('confirm-no').addEventListener('click', closeModal)

    // Close modal on background click
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
        if (e.target.id === 'confirm-modal') {
            closeModal()
        }
    })

    // OPML import
    document.getElementById('opml-import-btn').addEventListener('click', importOpml)
    document.getElementById('opml-clear-btn').addEventListener('click', clearOpmlForm)
    document.getElementById('opml-file').addEventListener('change', handleOpmlFileChange)

    // OPML export
    document.getElementById('opml-export-btn').addEventListener('click', exportOpml)

    // Cleanup posts
    document.getElementById('cleanup-btn').addEventListener('click', cleanupPosts)

    // Login modal buttons
    document.getElementById('admin-login-btn').addEventListener('click', toggleLoginModal)
    document.getElementById('login-confirm').addEventListener('click', attemptLogin)
    document.getElementById('login-cancel').addEventListener('click', closeLoginModal)

    document.getElementById('login-modal').addEventListener('click', (e) => {
        if (e.target.id === 'login-modal') {
            closeLoginModal()
        }
    })

    document.getElementById('login-password').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            attemptLogin()
        }
    })
}

async function loadFeeds() {
    const loading = document.getElementById('loading')
    const error = document.getElementById('error')
    const container = document.getElementById('feeds-container')

    loading.style.display = 'block'
    error.style.display = 'none'
    container.innerHTML = ''

    try {
        const response = await fetch('/api/feeds')

        if (!response.ok) {
            throw new Error('Failed to fetch feeds')
        }

        const data = await response.json()
        allFeeds = data.feeds
        filteredFeeds = allFeeds

        loading.style.display = 'none'
        updateFeedCount()
        renderFeeds()

    } catch (err) {
        console.error('Error loading feeds:', err)
        loading.style.display = 'none'
        error.innerHTML = `
            <p>⚠️ Error loading feeds</p>
            <button onclick="loadFeeds()" class="btn-primary">Retry</button>
        `
        error.style.display = 'block'
    }
}

async function updateAllFeeds() {
    if (!isAdminLoggedIn) {
        showUpdateStatus('Admin login required to update feeds.', 'error')
        openLoginModal('Log in to update feeds.')
        return
    }

    const button = document.getElementById('update-all-btn')
    const statusDiv = document.getElementById('update-status')

    button.disabled = true
    button.textContent = '⏳ Updating...'

    showUpdateStatus('🔄 Updating all feeds... This may take a few minutes.', 'info')

    try {
        const response = await fetch('/api/update-feeds', {
            method: 'POST',
            headers: buildAdminHeaders()
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await parseJsonSafe(response)

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update feeds')
        }

        if (data?.jobId) {
            showUpdateStatus(`Update queued. Job ID: ${escapeHtml(data.jobId)}`, 'info')
            await pollUpdateJob(data.jobId)
        } else {
            showUpdateStatus('✓ Feed update completed! All feeds have been updated.', 'success')
            setTimeout(() => {
                loadFeeds()
            }, 2000)
        }

    } catch (err) {
        console.error('Error updating feeds:', err)
        showUpdateStatus(`✗ Update failed: ${escapeHtml(err.message)}`, 'error')
    } finally {
        button.disabled = false
        button.textContent = '🔄 Update All Feeds'

        // Hide status after 10 seconds
        setTimeout(() => {
            hideUpdateStatus()
        }, 10000)
    }
}

async function pollUpdateJob(jobId) {
    showUpdateStatus('Update queued. Working...', 'info')

    let attempts = 0
    const maxAttempts = 180

    while (attempts < maxAttempts) {
        attempts += 1
        await sleep(2000)

        const response = await fetch(`/api/update-feeds/status?jobId=${encodeURIComponent(jobId)}`, {
            headers: buildAdminHeaders()
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await parseJsonSafe(response)
        if (!response.ok || !data) {
            showUpdateStatus('Update status unavailable.', 'error')
            return
        }

        if (data.status === 'running') {
            const step = data.currentStep ? ` (${escapeHtml(data.currentStep)})` : ''
            showUpdateStatus(`Update running${step}...`, 'info')
            continue
        }

        if (data.status === 'completed') {
            showUpdateStatus('✓ Feed update completed! All feeds have been updated.', 'success')
            await loadFeeds()
            return
        }

        if (data.status === 'failed') {
            const message = data.stderr || 'Update failed.'
            showUpdateStatus(`✗ Update failed: ${escapeHtml(message)}`, 'error')
            return
        }
    }

    showUpdateStatus('Update still running. Check back later.', 'info')
}

async function subscribeToFeeds() {
    if (!isAdminLoggedIn) {
        showStatus('Admin login required to subscribe to feeds.', 'error')
        openLoginModal('Log in to add feeds.')
        return
    }

    const textarea = document.getElementById('feed-urls')
    const urls = textarea.value
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0)

    if (urls.length === 0) {
        showStatus('Please enter at least one feed URL', 'error')
        return
    }

    const button = document.getElementById('subscribe-btn')
    button.disabled = true
    button.textContent = 'Subscribing...'

    showStatus('Subscribing to feeds...', 'info')

    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: buildAdminHeaders(),
            body: JSON.stringify({ urls })
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Failed to subscribe')
        }

        // Show results
        const successCount = data.results.filter(r => r.success).length
        const failCount = data.results.filter(r => !r.success).length

        let message = `<strong>Subscription Results:</strong><br>`
        message += `✓ ${successCount} succeeded, ✗ ${failCount} failed<br>`

        if (failCount > 0) {
            message += `<ul>`
            data.results
                .filter(r => !r.success)
                .forEach(r => {
                    message += `<li>${escapeHtml(r.url)}: ${escapeHtml(r.error)}</li>`
                })
            message += `</ul>`
        }

        showStatus(message, successCount > 0 ? 'success' : 'error')

        // Clear textarea on success
        if (successCount > 0) {
            textarea.value = ''
            // Reload feeds
            await loadFeeds()
        }

    } catch (err) {
        console.error('Error subscribing:', err)
        showStatus(`Error: ${escapeHtml(err.message)}`, 'error')
    } finally {
        button.disabled = false
        button.textContent = '➕ Subscribe to Feeds'
    }
}

async function unsubscribeFeed(feedUri, feedTitle) {
    if (!isAdminLoggedIn) {
        showStatus('Admin login required to remove feeds.', 'error')
        openLoginModal('Log in to remove feeds.')
        return
    }

    pendingUnsubscribe = { uri: feedUri, title: feedTitle }

    const message = document.getElementById('confirm-message')
    message.innerHTML = `
        Are you sure you want to unsubscribe from:<br>
        <strong>${escapeHtml(feedTitle)}</strong>
    `

    document.getElementById('confirm-modal').style.display = 'flex'
}

async function confirmUnsubscribe() {
    if (!pendingUnsubscribe) return

    // Save values before closing modal (which sets pendingUnsubscribe to null)
    const { uri, title } = pendingUnsubscribe

    closeModal()

    try {
        const response = await fetch('/api/unsubscribe', {
            method: 'POST',
            headers: buildAdminHeaders(),
            body: JSON.stringify({ feedUri: uri })
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Failed to unsubscribe')
        }

        // Show success message
        showStatus(`Successfully unsubscribed from "${title}"`, 'success')

        // Reload feeds
        await loadFeeds()

    } catch (err) {
        console.error('Error unsubscribing:', err)
        showStatus(`Error: ${escapeHtml(err.message)}`, 'error')
    }
}

function closeModal() {
    document.getElementById('confirm-modal').style.display = 'none'
    pendingUnsubscribe = null
}

function filterFeeds(query) {
    if (!query.trim()) {
        filteredFeeds = allFeeds
    } else {
        const searchTerm = query.toLowerCase()
        filteredFeeds = allFeeds.filter(feed =>
            feed.title.toLowerCase().includes(searchTerm) ||
            feed.feedUrl.toLowerCase().includes(searchTerm)
        )
    }

    updateFeedCount()
    renderFeeds()
}

function sortFeeds(sortBy) {
    switch (sortBy) {
        case 'posts':
            filteredFeeds.sort((a, b) => b.postCount - a.postCount)
            break
        case 'title':
            filteredFeeds.sort((a, b) => a.title.localeCompare(b.title))
            break
        case 'recent':
            // Could add last_updated field if available
            filteredFeeds.sort((a, b) => b.postCount - a.postCount)
            break
    }

    renderFeeds()
}

function renderFeeds() {
    const container = document.getElementById('feeds-container')

    if (filteredFeeds.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No feeds found</h3>
                <p>Subscribe to feeds using the form above</p>
            </div>
        `
        return
    }

    container.innerHTML = filteredFeeds.map(feed => renderFeedCard(feed)).join('')
}

function renderFeedCard(feed) {
    const actionLabel = isAdminLoggedIn ? '🗑️ Unsubscribe' : '🔒 Login to Unsubscribe'
    return `
        <div class="feed-card">
            <div class="feed-card-header">
                <div class="feed-info">
                    <div class="feed-title">${escapeHtml(feed.title)}</div>
                    <div class="feed-url">
                        <a href="${escapeHtml(feed.feedUrl)}" target="_blank" rel="noopener">
                            ${escapeHtml(feed.feedUrl)}
                        </a>
                    </div>
                    <div class="feed-metadata">
                        <div class="feed-stat">
                            <span class="feed-stat-icon">📄</span>
                            <span>${feed.postCount} posts</span>
                        </div>
                    </div>
                </div>
                <div class="feed-actions">
                    <button
                        class="btn-danger"
                        onclick='unsubscribeFeed("${escapeHtml(feed.uri)}", "${escapeHtml(feed.title).replace(/'/g, "\\'")}")'
                    >
                        ${actionLabel}
                    </button>
                </div>
            </div>
        </div>
    `
}

function updateFeedCount() {
    document.getElementById('feed-count').textContent = filteredFeeds.length
}

function showStatus(message, type) {
    const status = document.getElementById('subscribe-status')
    status.innerHTML = message
    status.className = `status-message ${type}`
    status.style.display = 'block'
}

function hideStatus() {
    const status = document.getElementById('subscribe-status')
    status.style.display = 'none'
}

function showUpdateStatus(message, type) {
    const status = document.getElementById('update-status')
    status.innerHTML = message
    status.className = `status-message ${type}`
    status.style.display = 'block'
}

function hideUpdateStatus() {
    const status = document.getElementById('update-status')
    status.style.display = 'none'
}

function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

async function handleOpmlFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) {
        return
    }

    const reader = new FileReader()
    reader.onload = () => {
        document.getElementById('opml-text').value = reader.result || ''
    }
    reader.readAsText(file)
}

function clearOpmlForm() {
    document.getElementById('opml-file').value = ''
    document.getElementById('opml-text').value = ''
    hideOpmlStatus()
}

async function importOpml() {
    if (!isAdminLoggedIn) {
        showOpmlStatus('Admin login required to import OPML.', 'error')
        openLoginModal('Log in to import OPML.')
        return
    }

    const opmlText = document.getElementById('opml-text').value.trim()
    if (!opmlText) {
        showOpmlStatus('Please select an OPML file or paste OPML content.', 'error')
        return
    }

    const button = document.getElementById('opml-import-btn')
    button.disabled = true
    button.textContent = 'Importing...'
    showOpmlStatus('Importing OPML feeds...', 'info')

    try {
        const response = await fetch('/api/subscribe-opml', {
            method: 'POST',
            headers: buildAdminHeaders(),
            body: JSON.stringify({ opmlText })
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await parseJsonSafe(response)
        if (!response.ok) {
            const message = data?.error || `Failed to import OPML (HTTP ${response.status})`
            throw new Error(message)
        }

        if (data?.jobId) {
            showOpmlStatus(`Import queued. Job ID: ${escapeHtml(data.jobId)}`, 'info')
            await pollOpmlJob(data.jobId)
        } else {
            showOpmlStatus('✓ OPML import completed. Existing feeds were skipped.', 'success')
            await loadFeeds()
        }
    } catch (err) {
        console.error('Error importing OPML:', err)
        showOpmlStatus(`✗ OPML import failed: ${escapeHtml(err.message)}`, 'error')
    } finally {
        button.disabled = false
        button.textContent = '📥 Import OPML'
    }
}

function showOpmlStatus(message, type) {
    const status = document.getElementById('opml-status')
    status.innerHTML = message
    status.className = `status-message ${type}`
    status.style.display = 'block'
}

function hideOpmlStatus() {
    const status = document.getElementById('opml-status')
    status.style.display = 'none'
}

async function pollOpmlJob(jobId) {
    showOpmlStatus('Import queued. Working...', 'info')

    let attempts = 0
    const maxAttempts = 120

    while (attempts < maxAttempts) {
        attempts += 1
        await sleep(2000)

        const response = await fetch(`/api/subscribe-opml/status?jobId=${encodeURIComponent(jobId)}`, {
            headers: buildAdminHeaders()
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await parseJsonSafe(response)
        if (!response.ok || !data) {
            showOpmlStatus('Import status unavailable.', 'error')
            return
        }

        if (data.status === 'running') {
            showOpmlStatus('Import running...', 'info')
            continue
        }

        if (data.status === 'completed') {
            showOpmlStatus('✓ OPML import completed. Existing feeds were skipped.', 'success')
            await loadFeeds()
            return
        }

        if (data.status === 'failed') {
            const message = data.stderr || 'Import failed.'
            showOpmlStatus(`✗ OPML import failed: ${escapeHtml(message)}`, 'error')
            return
        }
    }

    showOpmlStatus('Import still running. Check back later.', 'info')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function exportOpml() {
    if (!isAdminLoggedIn) {
        showExportStatus('Admin login required to export OPML.', 'error')
        openLoginModal('Log in to export OPML.')
        return
    }

    const button = document.getElementById('opml-export-btn')
    button.disabled = true
    button.textContent = 'Preparing...'
    showExportStatus('Preparing OPML export...', 'info')

    try {
        const response = await fetch('/api/export-opml', {
            method: 'POST',
            headers: buildAdminHeaders()
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        if (!response.ok) {
            const data = await parseJsonSafe(response)
            const message = data?.error || `Failed to export OPML (HTTP ${response.status})`
            throw new Error(message)
        }

        const blob = await response.blob()
        const filename = getDownloadFilename(response) || 'newsmonitor-feeds.opml'
        downloadBlob(blob, filename)
        showExportStatus('✓ OPML export ready for download.', 'success')
    } catch (err) {
        console.error('Error exporting OPML:', err)
        showExportStatus(`✗ OPML export failed: ${escapeHtml(err.message)}`, 'error')
    } finally {
        button.disabled = false
        button.textContent = '⬇️ Download OPML'
    }
}

function showExportStatus(message, type) {
    const status = document.getElementById('opml-export-status')
    status.innerHTML = message
    status.className = `status-message ${type}`
    status.style.display = 'block'
}

function getDownloadFilename(response) {
    const disposition = response.headers.get('content-disposition') || ''
    const match = disposition.match(/filename=\"?([^\";]+)\"?/i)
    return match ? match[1] : null
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
}

async function parseJsonSafe(response) {
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
        const text = await response.text()
        console.warn('Non-JSON response:', text.slice(0, 200))
        return null
    }
    try {
        return await response.json()
    } catch (error) {
        return null
    }
}

async function cleanupPosts() {
    if (!isAdminLoggedIn) {
        showCleanupStatus('Admin login required to run cleanup.', 'error')
        openLoginModal('Log in to run cleanup.')
        return
    }

    const daysValue = Number(document.getElementById('cleanup-days').value)
    const keepValue = Number(document.getElementById('cleanup-keep').value)

    const days = Number.isFinite(daysValue) && daysValue > 0 ? Math.floor(daysValue) : 7
    const keepCount = Number.isFinite(keepValue) && keepValue > 0 ? Math.floor(keepValue) : 10

    const button = document.getElementById('cleanup-btn')
    button.disabled = true
    button.textContent = 'Running...'
    showCleanupStatus('Cleanup queued. Working...', 'info')

    try {
        const response = await fetch('/api/cleanup-posts', {
            method: 'POST',
            headers: buildAdminHeaders(),
            body: JSON.stringify({ days, keepCount })
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await parseJsonSafe(response)
        if (!response.ok) {
            const message = data?.error || `Cleanup failed (HTTP ${response.status})`
            throw new Error(message)
        }

        if (data?.jobId) {
            showCleanupStatus(`Cleanup queued. Job ID: ${escapeHtml(data.jobId)}`, 'info')
            await pollCleanupJob(data.jobId)
        } else {
            showCleanupStatus('Cleanup completed.', 'success')
        }
    } catch (err) {
        console.error('Cleanup error:', err)
        showCleanupStatus(`✗ Cleanup failed: ${escapeHtml(err.message)}`, 'error')
    } finally {
        button.disabled = false
        button.textContent = '🧹 Run Cleanup'
    }
}

async function pollCleanupJob(jobId) {
    let attempts = 0
    const maxAttempts = 120

    while (attempts < maxAttempts) {
        attempts += 1
        await sleep(2000)

        const response = await fetch(`/api/subscribe-opml/status?jobId=${encodeURIComponent(jobId)}`, {
            headers: buildAdminHeaders()
        })

        if (response.status === 401) {
            handleUnauthorized()
            return
        }

        const data = await parseJsonSafe(response)
        if (!response.ok || !data) {
            showCleanupStatus('Cleanup status unavailable.', 'error')
            return
        }

        if (data.status === 'running') {
            showCleanupStatus('Cleanup running...', 'info')
            continue
        }

        if (data.status === 'completed') {
            showCleanupStatus('✓ Cleanup completed.', 'success')
            await loadFeeds()
            return
        }

        if (data.status === 'failed') {
            const message = data.stderr || 'Cleanup failed.'
            showCleanupStatus(`✗ Cleanup failed: ${escapeHtml(message)}`, 'error')
            return
        }
    }

    showCleanupStatus('Cleanup still running. Check back later.', 'info')
}

function showCleanupStatus(message, type) {
    const status = document.getElementById('cleanup-status')
    status.innerHTML = message
    status.className = `status-message ${type}`
    status.style.display = 'block'
}

async function restoreAdminAuth() {
    adminAuth = sessionStorage.getItem(ADMIN_AUTH_KEY)
    adminUser = sessionStorage.getItem(ADMIN_USER_KEY)

    if (!adminAuth) {
        setAdminState(false)
        return
    }

    const valid = await verifyAdminAuth(adminAuth)
    if (!valid) {
        clearAdminAuth()
    }
}

function buildAdminHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    }
    if (adminAuth) {
        headers.Authorization = `Basic ${adminAuth}`
    }
    return headers
}

async function verifyAdminAuth(encodedAuth) {
    try {
        const response = await fetch('/api/admin-check', {
            headers: {
                Authorization: `Basic ${encodedAuth}`
            }
        })
        if (response.ok) {
            setAdminState(true)
            return true
        }
        setAdminState(false)
        return false
    } catch (err) {
        console.error('Admin auth check failed:', err)
        setAdminState(false)
        return false
    }
}

function setAdminState(loggedIn) {
    isAdminLoggedIn = loggedIn
    updateAdminStatus()
    renderFeeds()
}

function updateAdminStatus() {
    const status = document.getElementById('admin-status')
    const button = document.getElementById('admin-login-btn')

    if (isAdminLoggedIn) {
        status.textContent = `Admin: ${adminUser || 'authenticated'}`
        button.textContent = 'Log out'
    } else {
        status.textContent = 'Admin: logged out'
        button.textContent = 'Admin Login'
    }
}

function toggleLoginModal() {
    if (isAdminLoggedIn) {
        clearAdminAuth()
        showStatus('Admin session ended.', 'info')
        return
    }
    openLoginModal()
}

function openLoginModal(message) {
    const modal = document.getElementById('login-modal')
    const error = document.getElementById('login-error')
    const messageEl = document.getElementById('login-message')
    const usernameInput = document.getElementById('login-username')
    const passwordInput = document.getElementById('login-password')

    error.style.display = 'none'
    if (message) {
        messageEl.textContent = message
    } else {
        messageEl.textContent = 'Log in to add or remove feeds.'
    }

    if (adminUser) {
        usernameInput.value = adminUser
    }

    passwordInput.value = ''
    modal.style.display = 'flex'
    usernameInput.focus()
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none'
}

async function attemptLogin() {
    const usernameInput = document.getElementById('login-username')
    const passwordInput = document.getElementById('login-password')
    const error = document.getElementById('login-error')

    const username = usernameInput.value.trim()
    const password = passwordInput.value

    if (!username || !password) {
        error.textContent = 'Username and password are required.'
        error.style.display = 'block'
        return
    }

    const encoded = btoa(`${username}:${password}`)
    try {
        const response = await fetch('/api/admin-check', {
            headers: {
                Authorization: `Basic ${encoded}`
            }
        })

        if (response.ok) {
            adminAuth = encoded
            adminUser = username
            sessionStorage.setItem(ADMIN_AUTH_KEY, adminAuth)
            sessionStorage.setItem(ADMIN_USER_KEY, adminUser)
            setAdminState(true)
            closeLoginModal()
            showStatus('Admin login successful.', 'success')
            return
        }

        if (response.status === 401) {
            error.textContent = 'Invalid username or password.'
        } else if (response.status === 503) {
            error.textContent = 'Admin password not configured on the server.'
        } else {
            error.textContent = 'Unable to verify credentials.'
        }
        error.style.display = 'block'
    } catch (err) {
        console.error('Admin login error:', err)
        error.textContent = 'Unable to reach the server.'
        error.style.display = 'block'
    }
}

function handleUnauthorized() {
    clearAdminAuth()
    showStatus('Admin login required. Please log in to continue.', 'error')
    openLoginModal('Admin login required.')
}

function clearAdminAuth() {
    adminAuth = null
    adminUser = null
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
    sessionStorage.removeItem(ADMIN_USER_KEY)
    setAdminState(false)
}
