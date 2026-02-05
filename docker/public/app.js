// app.js
let currentPosts = []
let filteredPosts = []
let currentPage = 0
let postsPerPage = 50

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp()
})

async function initializeApp() {
    setupEventListeners()
    await loadPosts()
    await loadStats()
    await loadFeeds()

    // Auto-refresh every 5 minutes
    setInterval(() => {
        loadPosts(true)
        loadStats()
    }, 300000)
}

function setupEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadPosts()
        loadStats()
    })

    document.getElementById('limit-select').addEventListener('change', (e) => {
        postsPerPage = parseInt(e.target.value)
        loadPosts()
    })

    document.getElementById('search-input').addEventListener('input', (e) => {
        filterPosts(e.target.value)
    })

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--
            renderPosts()
        }
    })

    document.getElementById('next-btn').addEventListener('click', () => {
        if ((currentPage + 1) * postsPerPage < filteredPosts.length) {
            currentPage++
            renderPosts()
        }
    })
}

async function loadPosts(silent = false) {
    const container = document.getElementById('posts-container')
    const loading = document.getElementById('loading')
    const error = document.getElementById('error')

    if (!silent) {
        loading.style.display = 'block'
        container.innerHTML = ''
        error.style.display = 'none'
    }

    try {
        const limit = parseInt(document.getElementById('limit-select').value)
        const response = await fetch(`/api/posts?limit=${limit}`)

        if (!response.ok) {
            throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        currentPosts = data.posts
        filteredPosts = currentPosts
        currentPage = 0

        loading.style.display = 'none'
        renderPosts()
        updateLastUpdate()

    } catch (err) {
        console.error('Error loading posts:', err)
        loading.style.display = 'none'

        // Show helpful error message
        error.innerHTML = `
            <p>⚠️ Unable to load posts</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">
                This could mean:
                <ul style="text-align: left; margin: 10px auto; max-width: 400px;">
                    <li>SPARQL endpoint is not reachable</li>
                    <li>No feeds subscribed yet</li>
                    <li>Dataset hasn't been created</li>
                </ul>
            </p>
            <p style="font-size: 0.9rem;">Check <a href="/api/health" target="_blank">/api/health</a> for endpoint status</p>
            <button onclick="loadPosts()" class="btn-primary" style="margin-top: 10px;">Retry</button>
        `
        error.style.display = 'block'
    }
}

async function loadStats() {
    try {
        const [countResponse, feedsResponse] = await Promise.all([
            fetch('/api/count'),
            fetch('/api/feeds')
        ])

        const countData = await countResponse.json()
        const feedsData = await feedsResponse.json()

        document.getElementById('post-count').textContent =
            `${countData.count} total posts`
        document.getElementById('feed-count').textContent =
            `${feedsData.feeds.length} feeds`

    } catch (err) {
        console.error('Error loading stats:', err)
    }
}

async function loadFeeds() {
    try {
        const response = await fetch('/api/feeds')
        const data = await response.json()

        const feedsList = document.getElementById('feeds-list')
        const sidebar = document.getElementById('feeds-sidebar')

        if (data.feeds.length > 0) {
            feedsList.innerHTML = data.feeds.map(feed => `
                <div class="feed-item">
                    <div class="feed-title">${escapeHtml(feed.title)}</div>
                    <div class="feed-count">${feed.postCount} posts</div>
                </div>
            `).join('')

            sidebar.style.display = 'block'
        }

    } catch (err) {
        console.error('Error loading feeds:', err)
    }
}

function filterPosts(query) {
    if (!query.trim()) {
        filteredPosts = currentPosts
    } else {
        const searchTerm = query.toLowerCase()
        filteredPosts = currentPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.summary.toLowerCase().includes(searchTerm) ||
            post.feedTitle.toLowerCase().includes(searchTerm) ||
            (post.creator && post.creator.toLowerCase().includes(searchTerm))
        )
    }

    currentPage = 0
    renderPosts()
}

function renderPosts() {
    const container = document.getElementById('posts-container')
    const pagination = document.getElementById('pagination')

    if (filteredPosts.length === 0) {
        container.innerHTML = '<div class="loading"><p>No posts found</p></div>'
        pagination.style.display = 'none'
        return
    }

    const start = currentPage * postsPerPage
    const end = start + postsPerPage
    const postsToShow = filteredPosts.slice(start, end)

    container.innerHTML = postsToShow.map(post => renderPost(post)).join('')

    // Update pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    document.getElementById('page-info').textContent =
        `Page ${currentPage + 1} of ${totalPages}`
    document.getElementById('prev-btn').disabled = currentPage === 0
    document.getElementById('next-btn').disabled = currentPage >= totalPages - 1
    pagination.style.display = totalPages > 1 ? 'flex' : 'none'
}

function renderPost(post) {
    const date = formatDate(post.date)
    const creator = post.creator ?
        `<span>👤 ${escapeHtml(post.creator)}</span>` : ''

    const formattedSummary = post.summary
        ? formatSummary(post.summary)
        : ''

    return `
        <article class="post-card">
            <div class="post-header">
                <h2 class="post-title">
                    <a href="${escapeHtml(post.link)}" target="_blank" rel="noopener">
                        ${escapeHtml(post.title)}
                    </a>
                </h2>
                <span class="post-date">${date}</span>
            </div>
            <div class="post-meta">
                <span class="feed-badge">${escapeHtml(post.feedTitle)}</span>
                ${creator}
            </div>
            ${formattedSummary ? `
                <div class="post-summary"><p>${formattedSummary}</p></div>
            ` : ''}
            <a href="${escapeHtml(post.link)}" class="post-link" target="_blank" rel="noopener">
                Read more →
            </a>
        </article>
    `
}

function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
}

function updateLastUpdate() {
    const now = new Date()
    document.getElementById('last-update').textContent =
        now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
}

function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

function formatSummary(summary) {
    const unescaped = summary
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
    const decoded = decodeHtmlEntities(unescaped)
    if (/<[^>]+>/.test(decoded)) {
        return sanitizeHtml(decoded)
    }
    return escapeHtml(decoded).replace(/\n\n/g, '</p><p>')
}

function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
}

function sanitizeHtml(html) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    doc.querySelectorAll('script, style').forEach(node => node.remove())

    doc.querySelectorAll('*').forEach(node => {
        [...node.attributes].forEach(attr => {
            const name = attr.name.toLowerCase()
            const value = attr.value || ''
            if (name.startsWith('on')) {
                node.removeAttribute(attr.name)
            }
            if ((name === 'href' || name === 'src') && value.trim().toLowerCase().startsWith('javascript:')) {
                node.removeAttribute(attr.name)
            }
        })
    })

    return doc.body.innerHTML
}
