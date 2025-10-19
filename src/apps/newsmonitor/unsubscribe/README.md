# Unsubscribe App

Remove a feed and all its entries from NewsMonitor.

## Usage

```bash
./trans src/apps/newsmonitor/unsubscribe -m '{"url":"FEED_URL"}'
```

## Example

```bash
./trans src/apps/newsmonitor/unsubscribe -m '{"url":"https://emeryblogger.wordpress.com/feed"}'
```

## What it does

1. **Delete Feed Metadata**: Removes the feed (sioc:Forum) from the `<http://hyperdata.it/feeds>` graph
2. **Delete All Entries**: Removes all entries (sioc:Post) belonging to that feed from the `<http://hyperdata.it/content>` graph

## Pipeline

```
deleteFeed → deleteEntries → showSuccess
```

### Processors

1. **deleteFeed** (SPARQLUpdate)
   - Template: `data/sparql-templates/delete-feed.rq`
   - Deletes feed by URL from feeds graph

2. **deleteEntries** (SPARQLUpdate)
   - Template: `data/sparql-templates/delete-feed-entries.rq`
   - Finds and deletes all posts with `sioc:has_container` pointing to the feed

3. **showSuccess** (ShowMessage)
   - Displays completion message

## SPARQL Operations

### Delete Feed Query

```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>

DELETE WHERE {
  GRAPH <http://hyperdata.it/feeds> {
    ?feed sioc:feed_url <FEED_URL> ;
          ?p ?o .
  }
}
```

### Delete Entries Query

```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>

DELETE {
  GRAPH <http://hyperdata.it/content> {
    ?post ?p ?o .
  }
}
WHERE {
  GRAPH <http://hyperdata.it/feeds> {
    ?feed sioc:feed_url <FEED_URL> .
  }
  GRAPH <http://hyperdata.it/content> {
    ?post sioc:has_container ?feed ;
          ?p ?o .
  }
}
```

## Notes

- The feed URL must match exactly the URL used during subscription
- Both feed metadata and all associated entries are deleted
- This operation cannot be undone
- If the feed doesn't exist, the operation completes without error
