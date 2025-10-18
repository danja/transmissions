# NewsMonitor - Feed Aggregator with SPARQL Backend

NewsMonitor is a semantic web-based feed aggregator built on the Transmissions framework. It fetches RSS, Atom, and JSON feeds, converts them to RDF using established Semantic Web vocabularies, and stores them in a SPARQL endpoint for rich semantic queries.

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

2. **Subscribe to a Feed**

```bash
./trans src/apps/newsmonitor/subscribe -m '{"url":"https://hnrss.org/frontpage"}'
```

3. **Fetch and Store Entries**

```bash
./trans src/apps/newsmonitor/fetch-with-storage
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

### 2. Fetch (`fetch/`)

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

### 3. Fetch-with-Storage (`fetch-with-storage/`)

Production pipeline with SPARQL storage and deduplication.

**Usage**:
```bash
./trans src/apps/newsmonitor/fetch-with-storage
```

**What it does**:
- Queries existing entries from SPARQL
- Fetches feed
- Parses entries
- Checks each for duplicates
- Skips duplicates
- Stores new entries in content graph

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

### Adding a New Feed

1. Subscribe:
```bash
./trans src/apps/newsmonitor/subscribe -m '{"url":"https://example.com/feed.xml"}'
```

2. Update fetch-with-storage config with new feed URI

3. Run fetcher:
```bash
./trans src/apps/newsmonitor/fetch-with-storage
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
