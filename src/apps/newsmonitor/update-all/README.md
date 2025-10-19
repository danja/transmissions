# NewsMonitor Update All Feeds

Batch update pipeline that fetches and stores entries from all subscribed feeds.

## Overview

This pipeline queries the SPARQL store for all subscribed feeds, then processes each one:

1. **Query Feeds** - Gets all feeds from `<http://hyperdata.it/feeds>` graph
2. **ForEach Feed** - Iterates over each subscribed feed
3. **Restructure** - Extracts feed URL and URI from SPARQL results
4. **Query Existing** - Gets existing entries for deduplication
5. **Fetch** - Downloads the feed content
6. **Parse** - Parses RSS/Atom/JSON feed
7. **ForEach Entry** - Iterates over feed entries (limit: 20 per feed)
8. **Deduplicate** - Checks for duplicate entries
9. **Build RDF** - Converts new entries to RDF
10. **Store** - Saves entries to `<http://hyperdata.it/content>` graph

## Usage

```bash
./trans src/apps/newsmonitor/update-all
```

## Configuration

Edit `config.ttl` to adjust:

- `:limit "20"` - Max entries per feed (in `:forEachSettings`)
- `:delay "50"` - Delay between processing entries (ms)
- `:timeout "10000"` - HTTP fetch timeout (ms)

## Pipeline Flow

```
SPARQLSelect (all feeds)
  → ForEach (each feed)
    → Restructure (extract feed data)
    → SPARQLSelect (existing entries for this feed)
    → HttpClient (fetch feed)
    → FeedParser (parse RSS/Atom/JSON)
    → ForEach (each entry, limit 20)
      → EntryDeduplicator (check if exists)
      → RDFBuilder (create RDF)
      → SPARQLUpdate (store in graph)
```

## Key Features

- **Automatic Discovery** - Queries SPARQL for all subscribed feeds
- **Deduplication** - Skips entries already in the store
- **Multi-Format** - Handles RSS 1.0, RSS 2.0, Atom, JSON Feed
- **Rate Limiting** - Configurable delays between operations
- **Per-Feed Limits** - Processes up to 20 entries per feed

## Dependencies

- SPARQL endpoint must be configured in `data/endpoints.json`
- Feeds must be subscribed via `../subscribe` pipeline first
- Uses shared templates in `../data/templates/`

## Example Output

```
4 feeds found
→ Processing: Emery Blogger (20 entries, 3 new)
→ Processing: Simon Willison (20 entries, 5 new)
→ Processing: Bob DuCharme (20 entries, 2 new)
→ Processing: Hacker News (20 entries, 0 new)
Total: 10 new entries stored
```

## See Also

- `../subscribe/` - Add new feeds to the system
- `../fetch-with-storage/` - Update a single feed by URL
- `../render-to-html/` - Generate HTML page from stored entries
