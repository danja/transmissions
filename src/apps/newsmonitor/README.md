# NewsMonitor - Feed Aggregator with SPARQL Backend

NewsMonitor is a semantic web-based feed aggregator built on the Transmissions framework. It fetches RSS, Atom, and JSON feeds, converts them to RDF using established Semantic Web vocabularies, and stores them in a SPARQL endpoint for rich semantic queries.

**tl;dr**
```sh
nano src/apps/newsmonitor/data/feeds.md

./trans src/apps/newsmonitor/subscribe-from-file
./trans src/apps/newsmonitor/update-all
./trans src/apps/newsmonitor/render-to-html

xdg-open src/apps/newsmonitor/data/index.html
```

## Features

- **Multi-Format Support**: RSS 1.0, RSS 2.0, Atom, JSON Feed
- **Semantic Web Standards**: Uses SIOC, FOAF, Dublin Core vocabularies
- **Intelligent Deduplication**: By GUID, link URL, or content hash
- **SPARQL Storage**: Remote SPARQL endpoint for scalable storage
- **Extensible Pipelines**: Easy to customize and extend

## Architecture

NewsMonitor uses a two-graph RDF architecture:

- `<http://hyperdata.it/feeds>` - Feed metadata (sioc:Forum)
- `<http://hyperdata.it/content>` - Feed entries (sioc:Post)

### Feed Discovery Integration

NewsMonitor integrates with two companion applications for feed discovery:

#### link-finder

**Purpose**: Discovers links from web pages and stores them as bookmarks.

**Integration**: Creates `bm:Bookmark` entries in the `<http://hyperdata.it/content>` graph with metadata including:
- `bm:target` - The discovered URL
- `bm:status` - HTTP status code from fetching
- `bm:contentType` - Content type of the resource

**Usage**:
```bash
./trans link-finder -m '{"url":"https://example.com/blogroll"}'
```

#### feed-finder

**Purpose**: Scans HTML bookmarks to discover RSS/Atom feeds and registers them with NewsMonitor.

**Integration**:
- Queries bookmarks from `semem` dataset (`<http://hyperdata.it/content>` graph)
- Extracts feed URLs from HTML `<link>` tags
- Stores feeds in TWO locations:
  1. `semem` dataset - Associates feeds with bookmarks via `bm:hasFeed`
  2. `newsmonitor` dataset - Registers feeds as `sioc:Forum` for NewsMonitor

**Usage**:
```bash
./trans feed-finder
```

**What it does**:
- Queries for HTML bookmarks with `status=200` and `contentType=text/html`
- Skips bookmarks that already have feeds
- For each bookmark:
  - Fetches HTML content
  - Extracts feed URL from `<link rel="alternate">` tags
  - Stores `bm:hasFeed` relationship in semem
  - Registers feed in newsmonitor dataset
- Processes 100 bookmarks per run (configurable via `LIMIT` in query)

**Typical Workflow**:
```bash
# 1. Discover links from a page
./trans link-finder -m '{"url":"https://example.com/blogroll"}'

# 2. Find feeds in discovered pages
./trans feed-finder

# 3. Fetch entries from discovered feeds
./trans src/apps/newsmonitor/update-all

# 4. Generate HTML
./trans src/apps/newsmonitor/render-to-html
```

**Feed Statistics**:

Check discovered feeds and their status:

```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX bm: <http://purl.org/stuff/bm/>

# Feed statistics
SELECT
  (COUNT(DISTINCT ?feed) as ?totalFeeds)
  (COUNT(DISTINCT ?post) as ?totalEntries)
  (MAX(?date) as ?mostRecentEntry)
FROM <http://hyperdata.it/feeds>
FROM <http://hyperdata.it/content>
WHERE {
  GRAPH <http://hyperdata.it/feeds> {
    ?feed a sioc:Forum ;
          dc:title ?title ;
          sioc:feed_url ?feedUrl .
  }
  OPTIONAL {
    GRAPH <http://hyperdata.it/content> {
      ?post a sioc:Post ;
            sioc:has_container ?feed ;
            dc:date ?date .
    }
  }
}
```

**Per-Feed Statistics**:

```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?feedTitle ?feedUrl (COUNT(?post) as ?entries) (MAX(?date) as ?latestEntry)
FROM <http://hyperdata.it/feeds>
FROM <http://hyperdata.it/content>
WHERE {
  GRAPH <http://hyperdata.it/feeds> {
    ?feed a sioc:Forum ;
          dc:title ?feedTitle ;
          sioc:feed_url ?feedUrl .
  }
  OPTIONAL {
    GRAPH <http://hyperdata.it/content> {
      ?post a sioc:Post ;
            sioc:has_container ?feed ;
            dc:date ?date .
    }
  }
}
GROUP BY ?feedTitle ?feedUrl
ORDER BY DESC(?entries)
```

## Quick Start

### Prerequisites

1. **SPARQL Endpoint**: Apache Jena Fuseki or compatible server
2. **Node.js**: v18+ with npm
3. **Transmissions**: Already installed

### Setup

1. **Configure SPARQL Endpoint**

```bash
cd src/apps/newsmonitor/data
cp endpoints.json.example endpoints.json
# Edit endpoints.json with your SPARQL server details
```

2. **Subscribe to Feeds**

Option A - Subscribe one at a time:
```bash
./trans src/apps/newsmonitor/subscribe -m '{"url":"https://hnrss.org/frontpage"}'
./trans src/apps/newsmonitor/subscribe -m '{"url":"https://simonwillison.net/atom/everything/"}'
./trans src/apps/newsmonitor/subscribe -m '{"url":"http://bobdc.com/blog/atom.xml"}'
```

Option B - Batch subscribe from file:
```bash
# Edit data/feeds.md to list your feeds
nano src/apps/newsmonitor/data/feeds.md

# Run batch subscription
./trans src/apps/newsmonitor/subscribe-from-file
```

Option C - Import from RDF file (76 semantic web blogs):
```bash
# Import all feeds from bloggers.rdf
./src/apps/newsmonitor/import-bloggers-rdf.sh

# Or with custom file and delay
./src/apps/newsmonitor/import-bloggers-rdf.sh path/to/feeds.rdf 3

# Docker:
docker compose exec newsmonitor ./src/apps/newsmonitor/import-bloggers-rdf.sh
```

The `bloggers.rdf` file contains 76 semantic web and RDF-related blog feeds in FOAF format.

3. **Fetch and Store Entries from All Feeds**

```bash
./trans src/apps/newsmonitor/update-all
```

4. **Generate HTML Page**

```bash
./trans src/apps/newsmonitor/render-to-html
xdg-open src/apps/newsmonitor/data/index.html
```

## Available Pipelines

### 1. Subscribe (`subscribe/`)

Subscribe to a new feed by validating, fetching, and storing its metadata.

**Usage**:
```bash
./trans src/apps/newsmonitor/subscribe -m '{"url":"FEED_URL"}'
```

**What it does**:
- Validates and normalizes URL
- Fetches feed to verify accessibility
- Extracts metadata (title, description, etc.)
- Generates feed URI
- Stores as sioc:Forum in feeds graph

### 2. Unsubscribe (`unsubscribe/`)

Remove a feed and all its entries from the system.

**Usage**:
```bash
./trans src/apps/newsmonitor/unsubscribe -m '{"url":"FEED_URL"}'
```

**What it does**:
- Deletes feed metadata from feeds graph
- Deletes all entries belonging to that feed from content graph
- Cleans up all associated RDF triples

### 3. Fetch (`fetch/`)

Simple fetch pipeline for testing - fetches and parses a feed, generates RDF.

**Usage**:
```bash
./trans src/apps/newsmonitor/fetch
```

**What it does**:
- Fetches hardcoded feed URL (Hacker News)
- Parses RSS/Atom
- Iterates entries
- Generates RDF for each
- Displays results (no storage)

### 4. Fetch-with-Storage (`fetch-with-storage/`)

Production pipeline with SPARQL storage and deduplication for a single feed.

**Usage**:
```bash
./trans src/apps/newsmonitor/fetch-with-storage -m '{"url":"FEED_URL"}'
```

**What it does**:
- Queries existing entries from SPARQL
- Fetches specified feed
- Parses entries
- Checks each for duplicates
- Skips duplicates
- Stores new entries in content graph

### 5. Update All (`update-all/`)

Batch update all subscribed feeds automatically.

**Usage**:
```bash
./trans src/apps/newsmonitor/update-all
```

**What it does**:
- Queries SPARQL for all subscribed feeds
- For each feed:
  - Fetches feed content
  - Parses entries (up to 20 per feed)
  - Checks for duplicates
  - Stores new entries in content graph
- Processes all feeds in one command

**Configuration** (edit `update-all/config.ttl`):
- `:limit "20"` - Max entries per feed
- `:delay "50"` - Delay between entries (ms)
- `:timeout "10000"` - HTTP timeout (ms)

### 6. Render to HTML (`render-to-html/`)

Generate HTML page from all stored entries.

**Usage**:
```bash
./trans src/apps/newsmonitor/render-to-html
xdg-open src/apps/newsmonitor/data/index.html
```

**What it does**:
- Queries the 10 most recent entries from SPARQL store (sorted by date descending)
- Renders modern HTML page using Nunjucks template
- Displays entries with titles, authors, dates, excerpts
- Creates responsive web interface
- Output: `src/apps/newsmonitor/data/index.html`

**Configuration** (edit `render-to-html/data/sparql-templates/get-all-for-page.rq`):
- `LIMIT 10` - Number of entries to display
- `ORDER BY DESC(?date)` - Reverse chronological order

### 7. Subscribe from File (`subscribe-from-file/`)

Batch subscribe to multiple feeds from a text file.

**Usage**:
```bash
# 1. Edit the feed list
nano src/apps/newsmonitor/data/feeds.md

# 2. Run the batch subscription
./trans src/apps/newsmonitor/subscribe-from-file
```

**What it does**:
- Reads feed URLs from `data/feeds.md` (one per line)
- Filters empty lines and comments (lines starting with `#`)
- For each URL:
  - Validates and normalizes
  - Fetches feed content
  - Parses metadata
  - Generates feed URI
  - Stores in feeds graph
- Processes with 2-second delay between feeds

**Feed list format** (`data/feeds.md`):
```
# Feed Subscriptions
# Lines starting with # are comments

https://emeryblogger.wordpress.com/feed/
https://simonwillison.net/atom/everything/
http://bobdc.com/blog/atom.xml
```

**Note**: Currently no duplicate detection - already-subscribed feeds will cause SPARQL errors but won't corrupt data. See `subscribe-from-file/TODO.md` for planned enhancements.

## Data Model

### Feed (sioc:Forum)

```turtle
<http://hyperdata.it/feeds/hacker-news> a sioc:Forum ;
    dc:title "Hacker News" ;
    dc:description "Feed description" ;
    sioc:link <https://news.ycombinator.com> ;
    sioc:feed_url <https://hnrss.org/frontpage> ;
    dc:date "2025-10-18T12:00:00Z"^^xsd:dateTime ;
    sioc:num_items 20 ;
    sioc:format "rss2.0" ;
    dc:created "2025-10-18T14:30:00Z"^^xsd:dateTime .
```

### Entry (sioc:Post)

```turtle
<http://hyperdata.it/posts/abc123> a sioc:Post ;
    dc:title "Entry Title" ;
    sioc:link <https://example.com/article> ;
    sioc:id "unique-guid" ;
    dc:date "2025-10-18T10:00:00Z"^^xsd:dateTime ;
    dc:creator "Author Name" ;
    sioc:content "Plain text summary" ;
    content:encoded "<p>HTML content</p>" ;
    sioc:has_container <http://hyperdata.it/feeds/hacker-news> .
```

## SPARQL Queries

### List All Feeds

```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?feed ?title ?url
FROM <http://hyperdata.it/feeds>
WHERE {
  ?feed a sioc:Forum ;
        dc:title ?title ;
        sioc:feed_url ?url .
}
```

### Recent Entries from Feed

```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?post ?title ?link ?date
FROM <http://hyperdata.it/content>
WHERE {
  ?post a sioc:Post ;
        sioc:has_container <http://hyperdata.it/feeds/hacker-news> ;
        dc:title ?title ;
        sioc:link ?link ;
        dc:date ?date .
}
ORDER BY DESC(?date)
LIMIT 20
```

### Search Content

```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?post ?title ?content
FROM <http://hyperdata.it/content>
WHERE {
  ?post a sioc:Post ;
        dc:title ?title ;
        sioc:content ?content .
  FILTER(CONTAINS(LCASE(?content), "keyword"))
}
```

## Configuration

### Feed URLs

Edit `fetch-with-storage/config.ttl`:

```turtle
:fetchSettings a :ConfigSet ;
    :url "YOUR_FEED_URL" ;
    :method "GET" ;
    :timeout "10000" .
```

### Processing Limits

```turtle
:forEachSettings a :ConfigSet ;
    :forEach "feed.entries" ;
    :delay "50" ;      # ms between entries
    :limit "100" .     # max entries to process
```

### Deduplication

```turtle
:dedupeSettings a :ConfigSet ;
    :guidField "currentItem.guid" ;
    :linkField "currentItem.link" ;
    :useContentHash "true" ;
    :checkMethod "all" .  # guid | link | hash | all
```

## Processors

NewsMonitor introduces three new processors:

### FeedParser

Parses RSS/Atom/JSON feeds into normalized structure.

**Location**: `src/processors/markup/FeedParser.js`

### RDFBuilder

Generates RDF/Turtle from templates using Nunjucks.

**Location**: `src/processors/sparql/RDFBuilder.js`

### EntryDeduplicator

Checks for duplicate entries using GUID, link, or content hash.

**Location**: `src/processors/util/EntryDeduplicator.js`

## Development

### Typical Workflow

1. **Subscribe to feeds**:
```bash
./trans src/apps/newsmonitor/subscribe -m '{"url":"https://example.com/feed.xml"}'
```

2. **Update all feeds** (run periodically):
```bash
./trans src/apps/newsmonitor/update-all
```

3. **Generate HTML** (view results):
```bash
./trans src/apps/newsmonitor/render-to-html
```

### Adding a New Feed

Option A - Single feed:
```bash
./trans src/apps/newsmonitor/subscribe -m '{"url":"https://example.com/feed.xml"}'
```

Option B - Multiple feeds via file:
```bash
# Add URL to data/feeds.md
echo "https://example.com/feed.xml" >> src/apps/newsmonitor/data/feeds.md

# Run batch subscribe
./trans src/apps/newsmonitor/subscribe-from-file
```

**Note**: New feeds are automatically included in the next `update-all` run.

### Removing a Feed

```bash
./trans src/apps/newsmonitor/unsubscribe -m '{"url":"https://example.com/feed.xml"}'
```

This will remove the feed metadata and all entries from that feed.

### Docker Deployment

Run NewsMonitor as a containerized service with automatic updates and HTTP server.

**Quick Start:**

```bash
# 1. Configure environment
cp .env.example .env
nano .env  # Add Fuseki credentials

# 2. Build and run
docker-compose build
docker-compose up -d

# 3. View logs
docker-compose logs -f newsmonitor

# 4. Configure HTTPS proxy to forward to http://localhost:6010
```

**Features:**
- **Dynamic Web Frontend**: Modern, responsive UI with search and pagination
- **REST API**: JSON endpoints for posts, feeds, and statistics
- **Automatic Updates**: Periodic feed updates (default: every hour)
- **Auto-refresh**: Frontend updates every 5 minutes
- **HTTP Server**: Serves frontend and API on port 6010
- **Configurable**: Update intervals via environment variables
- **Persistent Storage**: Data survives container restarts

**Configuration:**

Edit `.env`:
```bash
NODE_ENV=production
FUSEKI_USERNAME=admin
FUSEKI_PASSWORD=your-password
FUSEKI_BASEURL=https://fuseki.hyperdata.it
UPDATE_INTERVAL=3600000    # 1 hour in ms
RENDER_INTERVAL=300000     # 5 minutes in ms
# Port configured in config/services.json (default: 6010)
```

**Manual Operations:**

```bash
# Subscribe to new feed
docker-compose exec newsmonitor ./trans src/apps/newsmonitor/subscribe -m '{"url":"https://example.com/feed.xml"}'

# Force update now
docker-compose exec newsmonitor ./trans src/apps/newsmonitor/update-all

# Force render now
docker-compose exec newsmonitor ./trans src/apps/newsmonitor/render-to-html
```

See [DOCKER.md](../../../DOCKER.md) for complete deployment guide.

### Scheduled Updates (Non-Docker)

Set up a cron job to run `update-all` periodically:

```bash
# Update all feeds every hour
0 * * * * cd /path/to/transmissions && ./trans src/apps/newsmonitor/update-all >> /var/log/newsmonitor.log 2>&1

# Generate HTML page every 6 hours
0 */6 * * * cd /path/to/transmissions && ./trans src/apps/newsmonitor/render-to-html >> /var/log/newsmonitor.log 2>&1
```

### Customizing RDF Templates

Templates are in `data/templates/`:
- `feed-entry-to-rdf.njk` - Entry to RDF
- `feed-to-rdf.njk` - Feed metadata to RDF

Use Nunjucks syntax with helper functions:
- `{{ uri(str) }}` - URI-safe string
- `{{ hash(str) }}` - MD5 hash
- `{{ escape(str) }}` - Escape RDF literals
- `{{ now() }}` - Current timestamp
- `{{ isoDate(str) }}` - Convert date to ISO 8601 format

### Testing

```bash
# Test FeedParser alone
./trans src/apps/test/feedparser-test

# Test fetch pipeline (no storage)
./trans src/apps/newsmonitor/fetch

# Test with verbose output
./trans src/apps/newsmonitor/fetch -v
```

## Troubleshooting

### SPARQL Connection Errors

Check `endpoints.json` configuration:
- Verify endpoint URLs are correct
- Test endpoints manually with curl
- Check credentials if authentication is enabled

### No Entries Stored

- Check deduplication - entries may be marked as duplicates
- Verify feed URL is accessible
- Check SPARQL update permissions
- Review logs with `-v` flag

### Template Errors

- Template paths are relative to subtask directory
- Use `../data/templates/` for sibling data directory
- Check template syntax with Nunjucks online validator

## Performance

**Typical Performance** (20 entries):
- Feed fetch: ~1 second
- Parsing: <100ms
- RDF generation: ~5-10ms per entry
- SPARQL storage: ~50-100ms per entry
- Total: ~3-5 seconds

**Scalability**:
- Processes entries sequentially (configurable delay)
- SPARQL updates are bottleneck (network latency)
- Can process multiple feeds in parallel
- Consider batching for high-volume feeds

## License

Part of the Transmissions framework.

## Documentation

- **Proposal**: `docs/NEWSMONITOR-PROPOSAL.md` - Complete architecture
- **Implementation**: `docs/NEWSMONITOR-IMPLEMENTATION.md` - Status and testing
- **About**: `about.md` - Quick overview

## Support

For issues or questions, refer to Transmissions documentation or create an issue in the repository.
