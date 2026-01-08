# NewsMonitor Frontend

Modern, responsive web interface for the NewsMonitor feed aggregator.

## Files

- `index.html` - Main HTML structure
- `style.css` - Responsive CSS styling
- `app.js` - JavaScript for dynamic content loading

## Features

### Display
- Post cards with title, date, author, feed source
- Truncated summaries with "Read more" links
- Relative timestamps (e.g., "2 hours ago")
- Feed badges for source identification

### Functionality
- **Search**: Real-time filtering by title, content, author, or feed
- **Pagination**: Navigate through large result sets
- **Auto-refresh**: Updates every 5 minutes automatically
- **Responsive**: Mobile-friendly layout

### UI Controls
- Refresh button for manual updates
- Posts per page selector (10, 25, 50, 100)
- Search input with live filtering
- Previous/Next pagination controls

## API Integration

The frontend consumes these REST endpoints:

```javascript
GET /api/posts?limit=50&offset=0
// Returns: { posts: [...], count: 50 }

GET /api/count
// Returns: { count: 1234 }

GET /api/feeds
// Returns: { feeds: [...] }
```

## Customization

### Change Default Posts Per Page

Edit `app.js`:
```javascript
let postsPerPage = 50  // Change to 25, 100, etc.
```

### Change Auto-refresh Interval

Edit `app.js`:
```javascript
setInterval(() => {
  loadPosts(true)
  loadStats()
}, 300000)  // 300000ms = 5 minutes
```

### Modify Styling

Edit `style.css` to change:
- Colors (CSS variables in `:root`)
- Layout and spacing
- Typography
- Responsive breakpoints

## CSS Variables

```css
:root {
    --primary: #2563eb;      /* Primary brand color */
    --secondary: #64748b;    /* Secondary text color */
    --background: #f8fafc;   /* Page background */
    --surface: #ffffff;      /* Card background */
    --text: #1e293b;         /* Primary text */
    --text-light: #64748b;   /* Secondary text */
    --border: #e2e8f0;       /* Border color */
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- Fetch API for network requests
- CSS Grid and Flexbox layouts
