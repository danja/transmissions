# NewsMonitor

## Runner

```sh
./trans newsmonitor
```

## Description

NewsMonitor is a feed aggregator built on Transmissions that uses a remote SPARQL store as its backend. It fetches RSS, Atom, and JSON feeds, converts them to RDF using established Semantic Web vocabularies (SIOC, FOAF, Dublin Core), and stores them in a SPARQL endpoint for rich semantic queries.

### Features

- Multi-format feed support (RSS 1.0, RSS 2.0, Atom, JSON Feed)
- RDF-native storage with SPARQL query interface
- Standards-based using SIOC, FOAF, schema.org vocabularies
- Deduplication by GUID, link, or content hash
- Optional full-content extraction for excerpt-only feeds
- Feed export to RSS/Atom formats
- Extensible pipeline architecture

### Pipelines

- `subscribe` - Add new feed subscriptions
- `unsubscribe` - Remove feeds and their entries
- `subscribe-from-file` - Batch subscribe from feed list
- `fetch-with-storage` - Fetch single feed with deduplication
- `update-all` - Fetch all subscribed feeds
- `render-to-html` - Generate HTML page from stored entries
