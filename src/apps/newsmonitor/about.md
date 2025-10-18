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
- `fetch` - Periodically fetch all subscribed feeds
- `enhance` - Fetch full content for excerpt-only entries
- `search` - Query stored feeds by various criteria
- `export` - Generate RSS/Atom feeds from stored data
