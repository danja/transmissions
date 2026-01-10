// admin.js
let allFeeds = []
let filteredFeeds = []
let pendingUnsubscribe = null

document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin()
})

function initializeAdmin() {
    setupEventListeners()
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
    const button = document.getElementById('update-all-btn')
    const statusDiv = document.getElementById('update-status')

    button.disabled = true
    button.textContent = '⏳ Updating...'

    statusDiv.innerHTML = `
        <strong>🔄 Updating all feeds...</strong><br>
        This may take a few minutes depending on the number of feeds.
    `
    statusDiv.className = 'status-message info'
    statusDiv.style.display = 'block'

    try {
        const response = await fetch('/api/update-feeds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update feeds')
        }

        statusDiv.innerHTML = `
            <strong>✓ Feed update completed!</strong><br>
            All subscribed feeds have been updated with new content.
        `
        statusDiv.className = 'status-message success'

        // Reload feeds to show updated post counts
        setTimeout(() => {
            loadFeeds()
        }, 2000)

    } catch (err) {
        console.error('Error updating feeds:', err)
        statusDiv.innerHTML = `
            <strong>✗ Update failed</strong><br>
            ${escapeHtml(err.message)}
        `
        statusDiv.className = 'status-message error'
    } finally {
        button.disabled = false
        button.textContent = '🔄 Update All Feeds'

        // Hide status after 10 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none'
        }, 10000)
    }
}

async function subscribeToFeeds() {
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ urls })
        })

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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ feedUri: uri })
        })

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
                        🗑️ Unsubscribe
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

function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}
