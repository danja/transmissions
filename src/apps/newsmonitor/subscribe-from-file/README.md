# NewsMonitor Subscribe From File

Batch subscribe to multiple feeds listed in a text file.

## Overview

This pipeline reads feed URLs from `data/feeds.md` and subscribes to each one automatically.

## Usage

1. **Edit `data/feeds.md`** - Add feed URLs (one per line):

```
https://emeryblogger.wordpress.com/feed/
https://simonwillison.net/atom/everything/
http://bobdc.com/blog/atom.xml
```

2. **Run the pipeline**:

```bash
./trans src/apps/newsmonitor/subscribe-from-file
```

## Features

- Reads URLs from `data/feeds.md`
- Filters lines starting with `http://` or `https://`
- Ignores comment lines (starting with `#`)
- Subscribes to each feed with 2-second delay
- Validates each feed before subscribing
- Stores feed metadata in SPARQL

## Configuration

Edit `config.ttl` to adjust:

- `:delay "2000"` - Delay between feeds (ms)
- File path (default: `data/feeds.md`)

## Pipeline Flow

```
FileReader (read feeds.md)
  → LineReader (split into URLs)
  → ForEach (each URL)
    → URLNormalizer (validate)
    → HttpClient (fetch feed)
    → FeedParser (parse metadata)
    → ResourceMinter (generate URI)
    → RDFBuilder (create RDF)
    → SPARQLUpdate (store in graph)
```

## Notes

- **LineReader** was updated to properly split content into arrays
- Filters empty lines and comments automatically
- Feed parsing errors are shown but don't stop processing
- SPARQL errors will occur for already-subscribed feeds (duplicate detection is TODO)

## TODO

- Add duplicate detection (skip already subscribed feeds)
- Improve error handling for invalid/dead feeds
- Add success/failure summary at end

## See Also

- `../subscribe/` - Subscribe to a single feed
- `../update-all/` - Update all subscribed feeds
