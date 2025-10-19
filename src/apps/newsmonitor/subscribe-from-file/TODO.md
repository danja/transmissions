# TODO: subscribe-from-file

## Current Status

✅ **WORKING** - Pipeline successfully reads feeds.md and processes each URL

## Completed

1. ✅ Fixed LineReader processor to properly split content into arrays
2. ✅ Replaced BashCommand with FileReader + LineReader
3. ✅ Pipeline correctly filters comments and empty lines

## Current Limitations

1. **No duplicate detection** - Feeds that are already subscribed will cause SPARQL errors
   - Errors are logged but don't stop processing
   - Won't corrupt existing data
   - Simply skips to next feed

2. **No error summary** - Pipeline doesn't report how many succeeded/failed

## Proposed Solutions

### Option 1: Query Existing Feeds First (Recommended)

Add pipeline steps at the beginning:
1. SPARQLSelect - Get all existing feed URLs
2. Custom FeedDuplicateChecker processor - Compare URLs
3. Skip already-subscribed feeds before attempting to fetch

### Option 2: SPARQL INSERT with Conditional

Modify SPARQL update template to use `INSERT WHERE NOT EXISTS` pattern:
```sparql
INSERT {
  GRAPH <http://hyperdata.it/feeds> {
    ?feed a sioc:Forum .
    # ... other triples
  }
}
WHERE {
  FILTER NOT EXISTS {
    ?existingFeed sioc:feed_url <{{normalizedURL}}> .
  }
}
```

### Option 3: Error-Tolerant Approach

Add Choice processor after FeedParser:
- Check if `feed.meta.title` exists (indicates successful parse)
- Skip to next feed if parse failed
- Only proceed to storage if valid

## Implementation Priority

1. Add duplicate detection via SPARQL query (Option 1)
2. Add success/failure counting and summary
3. Improve error handling with Choice processor (Option 3)

## Workaround

Current behavior: Will attempt to subscribe all feeds in the list. Already-subscribed feeds will cause SPARQL 400 errors but won't break the system. New feeds will be successfully added.
