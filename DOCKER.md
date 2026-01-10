# Docker Deployment Guide

## Overview

Transmissions can be deployed as a Docker service, running NewsMonitor as a continuously updating feed aggregator with an HTTP server for generated HTML.

## Architecture

- **Transmissions Container**: Runs periodic feed updates and serves dynamic web frontend via HTTP
- **Web Frontend**: Modern, responsive UI with real-time post summaries and search
- **REST API**: JSON endpoints for posts, feeds, and statistics
- **Fuseki Server**: External SPARQL endpoint (fuseki.hyperdata.it or localhost:3030)
- **HTTPS Proxy**: Your existing proxy forwards HTTPS traffic to the HTTP port

## Features

### Dynamic Web Interface

The NewsMonitor frontend provides:
- **Real-time Updates**: Auto-refreshes every 5 minutes
- **Search**: Filter posts by title, content, author, or feed
- **Pagination**: Browse through posts with customizable page size
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Feed Statistics**: View total posts and subscribed feeds

### REST API Endpoints

- `GET /api/posts?limit=50&offset=0` - Get recent posts with summaries
- `GET /api/count` - Get total post count
- `GET /api/feeds` - Get list of subscribed feeds with statistics

## Quick Start

### 1. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env
```

Production .env example:
```bash
NODE_ENV=production
FUSEKI_USERNAME=admin
FUSEKI_PASSWORD=your-secure-password
FUSEKI_BASEURL=https://fuseki.hyperdata.it
NEWSMONITOR_PORT=6010
UPDATE_INTERVAL=3600000
RENDER_INTERVAL=300000
```

### 2. Build and Run

```bash
# Build the image
docker compose build --no-cache

# Start the service
docker compose up -d

# View logs
docker compose logs -f newsmonitor
```

### 3. Configure HTTPS Proxy

Point your existing HTTPS proxy to:
- **Target**: `http://localhost:6010` (or your configured NEWSMONITOR_PORT)
- **Path**: Forward all requests to the container

Example nginx configuration:
```nginx
server {
    listen 443 ssl;
    server_name newsmonitor.hyperdata.it;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:6010;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment (development/production/test) |
| `FUSEKI_USERNAME` | - | Fuseki admin username |
| `FUSEKI_PASSWORD` | - | Fuseki admin password |
| `FUSEKI_BASEURL` | From config | Override Fuseki base URL |
| `NEWSMONITOR_PORT` | `6010` | HTTP server port |
| `UPDATE_INTERVAL` | `3600000` | Feed update interval (ms) |
| `RENDER_INTERVAL` | `300000` | HTML render interval (ms) |

### Service Configuration

Edit `config/services.json` for:
- Environment-specific endpoints
- Port defaults
- Dataset configurations

## Operations

### Start Service
```bash
docker compose up -d
```

### Stop Service
```bash
docker compose stop
```

### Restart Service
```bash
docker compose restart
```

### View Logs
```bash
# Follow logs
docker compose logs -f newsmonitor

# Last 100 lines
docker compose logs --tail=100 newsmonitor
```

### Update Service
```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d
```

### Manual Commands

Run transmissions commands inside the container:

```bash
# Subscribe to a new feed
docker compose exec newsmonitor ./trans src/apps/newsmonitor/subscribe -m '{"url":"https://example.com/feed.xml"}'

# Update all feeds now
docker compose exec newsmonitor ./trans src/apps/newsmonitor/update-all

# Render HTML now
docker compose exec newsmonitor ./trans src/apps/newsmonitor/render-to-html

# Shell access
docker compose exec newsmonitor sh
```

## Data Persistence

The container mounts `./src/apps/newsmonitor/data` for persistence:
- Generated HTML files
- Feed lists
- Configuration files

This directory persists across container restarts.

## Scheduler Behavior

The scheduler (`docker/newsmonitor-scheduler.js`):

1. **Startup**: Generates endpoints.json from Config
2. **Initial Run**: Updates feeds and renders HTML
3. **Periodic Updates**: Fetches new entries from all subscribed feeds
4. **Periodic Rendering**: Regenerates HTML from SPARQL data
5. **HTTP Server**: Serves generated HTML on configured port

## Monitoring

### Health Checks

Docker health check runs every 30 seconds:
```bash
# Check health status
docker compose ps
```

### Log Monitoring

```bash
# Watch for errors
docker compose logs -f newsmonitor | grep -i error

# Watch for updates
docker compose logs -f newsmonitor | grep -i "updating all feeds"
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker compose logs newsmonitor
```

Common issues:
- Missing `.env` file
- Invalid Fuseki credentials
- Port conflict on 6010

### No Feed Updates

1. Check Fuseki connectivity:
```bash
docker compose exec newsmonitor curl -u admin:password http://fuseki-host:3030/newsmonitor/query
```

2. Check feed subscriptions:
```bash
docker compose exec newsmonitor ./trans src/apps/newsmonitor/subscribe -m '{"url":"https://hnrss.org/frontpage"}'
```

3. Force update:
```bash
docker compose exec newsmonitor ./trans src/apps/newsmonitor/update-all
```

### HTML Not Generated

1. Force render:
```bash
docker compose exec newsmonitor ./trans src/apps/newsmonitor/render-to-html
```

2. Check output file:
```bash
ls -lah src/apps/newsmonitor/data/index.html
```

### Connection Refused from Proxy

1. Verify container is running:
```bash
docker compose ps
```

2. Test HTTP endpoint:
```bash
curl http://localhost:6010/
```

3. Check port mapping:
```bash
docker compose port newsmonitor 6010
```

## Development Mode

For local development with localhost Fuseki:

```bash
# .env for development
NODE_ENV=development
FUSEKI_USERNAME=admin
FUSEKI_PASSWORD=admin123
NEWSMONITOR_PORT=6010
```

Run without Docker:
```bash
# Generate endpoints
node src/apps/newsmonitor/generate-endpoints.js

# Run scheduler locally
node docker/newsmonitor-scheduler.js
```

## Backup and Restore

### Backup Feed Data

```bash
# Backup SPARQL data (via Fuseki admin interface or backup tools)
# Backup feed list
cp src/apps/newsmonitor/data/feeds.md feeds.md.backup
```

### Restore

```bash
# Restore feed list
cp feeds.md.backup src/apps/newsmonitor/data/feeds.md

# Re-subscribe
docker compose exec newsmonitor ./trans src/apps/newsmonitor/subscribe-from-file

# Update all
docker compose exec newsmonitor ./trans src/apps/newsmonitor/update-all
```

## Security Considerations

1. **Credentials**: Never commit `.env` to version control
2. **HTTPS**: Always use HTTPS proxy in production
3. **Firewall**: Don't expose Docker port directly to internet
4. **Updates**: Keep base image and dependencies updated

## Performance Tuning

### Update Intervals

Balance freshness vs. server load:
- **High-frequency**: `UPDATE_INTERVAL=1800000` (30 minutes)
- **Standard**: `UPDATE_INTERVAL=3600000` (1 hour)
- **Low-frequency**: `UPDATE_INTERVAL=21600000` (6 hours)

### Memory Limits

Add to docker compose.yml:
```yaml
services:
  newsmonitor:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## Support

For issues:
1. Check logs: `docker compose logs newsmonitor`
2. Verify configuration in `config/services.json`
3. Test Fuseki connectivity
4. Review [NewsMonitor README](src/apps/newsmonitor/README.md)
