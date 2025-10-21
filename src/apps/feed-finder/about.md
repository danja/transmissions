# feed-finder Application

## Runner

```sh
cd ~/hyperdata/transmissions # adjust to your local path
./trans feed-finder
```

## Description

Discovers RSS and Atom feeds from web pages previously cataloged by the link-finder application.

**Pipeline Flow:**
1. Queries SPARQL store for HTML bookmarks with status 200 (from link-finder)
2. Fetches HTML content for each page
3. Extracts feed URLs from `<link rel="alternate">` tags
4. Accumulates discovered feed URLs
5. Saves list to `data/feeds.md`

**Feed Types Detected:**
- RSS 2.0 (`application/rss+xml`)
- RSS 1.0 (`application/rdf+xml`)
- Atom (`application/atom+xml`)
- JSON Feed (`application/feed+json`)

## Prerequisites

1. **SPARQL Store**: Running Fuseki instance at `http://localhost:3030/test`
2. **Existing Data**: Bookmarks must exist in `<http://hyperdata.it/content>` graph (created by link-finder)
3. **Network Access**: HTTP access to fetch pages

## Configuration

### SPARQL Query
Queries `<http://hyperdata.it/content>` graph for:
- Bookmarks with `bm:status "200"`
- Content type containing `text/html`

### HTTP Settings
- Timeout: 10 seconds (prevents hanging on slow sites)
- Skips pages with errors or timeouts

### Output
- File: `src/apps/feed-finder/data/feeds.md`
- Format: One feed URL per line

## Performance

- Processing time depends on number of HTML bookmarks in store
- HTTP timeout of 10 seconds per page
- For large datasets, expect ~30-60 minutes per 1000 pages

## Verification

Check discovered feeds:

```sh
cat src/apps/feed-finder/data/feeds.md
```

Count feeds found:

```sh
wc -l src/apps/feed-finder/data/feeds.md
```

## Example Output

```
https://example.com/feed
https://blog.example.org/rss.xml
https://news.example.net/atom.xml
```

## Troubleshooting

**No feeds found:**
- Verify link-finder has populated the SPARQL store
- Check that pages have status 200 and HTML content type
- Run with `-v` flag for verbose logging

**HTTP timeouts:**
- Increase timeout in config.ttl: `:httpSettings :timeout "20000"`
- Check network connectivity

**SPARQL connection errors:**
- Verify Fuseki is running: `http://localhost:3030/test`
- Check endpoints.json configuration

## Related Apps

- **link-finder**: Discovers links from markdown files, stores in SPARQL
- **newsmonitor**: Subscribes to feeds and monitors content

## Next Steps

After finding feeds:
1. Review `data/feeds.md` for relevant feeds
2. Use newsmonitor/subscribe to add feeds to monitoring
3. Fetch and process feed content with newsmonitor/fetch-with-storage
