# Bookmark Management Applications

**Date:** 2025-10-02

## Overview

Two Transmissions applications have been implemented for managing web bookmarks in a SPARQL triple store: `link-finder` for discovering and storing bookmarks, and `bookmark-get` for fetching and converting web content.

## link-finder

Extracts URLs from Markdown files, checks their HTTP status, and stores bookmark metadata in a SPARQL graph.

### Pipeline

1. **FileReader** - Reads Markdown file
2. **MarkdownToLinks** - Extracts URLs and link text
3. **ForEach** - Iterates over each link
4. **HttpClient** - Fetches URL (10-second timeout)
5. **URLNormalizer** - Removes trailing slashes for consistent matching
6. **ResourceMinter** - Generates URIs for new bookmarks
7. **SPARQLSelect** - Checks if bookmark already exists
8. **Choice** - Reuses existing URI or creates new one
9. **SPARQLUpdate** - Stores bookmark data (500ms delay between updates)

### Data Model

Bookmarks use the `http://purl.org/stuff/bm/` vocabulary:

```turtle
<http://purl.org/stuff/instance/abc123> a bm:Bookmark ;
    bm:target <https://example.com> ;
    bm:title "Example Site" ;
    bm:status 200 ;
    bm:created "2025-10-02T10:00:00Z"^^xsd:dateTime ;
    bm:agent <http://purl.org/stuff/agent/transmissions> .
```

### Features

- **URI Recycling** - Reuses bookmark URIs when the same URL is encountered
- **URL Normalization** - JavaScript's URL class adds trailing slashes to bare domains; URLNormalizer removes them for consistent matching
- **Progress Logging** - ForEach processor reports progress every 5% through large lists
- **Timeout Handling** - HttpClient has configurable timeout to prevent hanging on unresponsive sites
- **SPARQL Rate Limiting** - 500ms delay between updates prevents overloading the endpoint

### Configuration

Located in `src/apps/link-finder/config.ttl`:
- Source file: Configurable Markdown file path
- HTTP timeout: 10 seconds
- SPARQL delay: 500ms
- Graph: `<http://hyperdata.it/content>`

### Performance

Processing 4000+ URLs takes approximately 30-60 minutes depending on network conditions and site response times. The majority of time is spent in HTTP requests and SPARQL update delays.

## bookmark-get

Retrieves HTML content for bookmarks with successful HTTP status, converts to Markdown, and stores in the SPARQL graph.

### Pipeline

1. **SPARQLSelect** - Queries bookmarks with status 200 lacking content
2. **ForEach** - Iterates over results
3. **Restructure** - Extracts target URL and bookmark URI
4. **HttpClient** - Fetches HTML page
5. **HTMLToMarkdown** - Converts HTML to Markdown
6. **Restructure** - Prepares data for storage
7. **SPARQLUpdate** - Stores Markdown content

### Query

Selects bookmarks that need content:

```sparql
PREFIX bm: <http://purl.org/stuff/bm/>
SELECT ?bookmark ?target ?title
FROM <http://hyperdata.it/content>
WHERE {
  ?bookmark a bm:Bookmark ;
            bm:target ?target ;
            bm:status 200 .
  OPTIONAL { ?bookmark bm:title ?title }
  FILTER NOT EXISTS { ?bookmark bm:content ?content }
}
```

### HTML to Markdown Conversion

The HTMLToMarkdown processor uses cheerio to:
- Remove scripts, styles, navigation, headers, footers
- Convert headers (h1-h6) to Markdown syntax
- Preserve links, images, lists, code blocks, tables
- Handle nested structures and inline formatting

### Stored Content

For each bookmark:

```turtle
<bookmark-uri> bm:content "# Page Title\n\nContent..." ;
               bm:contentType "text/markdown" ;
               bm:fetched "2025-10-02T11:00:00Z"^^xsd:dateTime .
```

### Configuration

Located in `src/apps/bookmark-get/config.ttl`:
- Endpoint: Configurable SPARQL endpoint (default: `http://localhost:3030/semem`)
- Graph: `<http://hyperdata.it/content>`
- Clean selectors: Elements to remove before conversion

### Endpoints Configuration

A bug was fixed in `SessionEnvironment.js` where `applyEnvOverrides()` had inverted logic. It was ignoring `endpoints.json` and using hardcoded environment variable URLs. The fix ensures `endpoints.json` is used by default, allowing different applications to target different SPARQL datasets.

## Integration

These applications work together:

1. `link-finder` discovers URLs and creates bookmarks with metadata
2. `bookmark-get` fetches HTML content and converts to Markdown
3. Both use the same SPARQL graph for data persistence

The bookmark vocabulary allows additional processors to work with this data, such as extracting concepts, generating summaries, or building knowledge graphs from the stored content.

## Technical Notes

### ForEach Progress Logging

The ForEach processor was enhanced to show progress through large datasets. A critical fix was required: resetting `this.eachCounter = 0` at the start of each `process()` call. Without this, the counter would accumulate across invocations, breaking progress reporting logic.

### HttpClient Timeout

HttpClient now supports timeout via AbortController:

```javascript
const controller = new AbortController()
options.signal = controller.signal
setTimeout(() => controller.abort(), timeout)
```

Default timeout is 30 seconds; link-finder uses 10 seconds.

### URL Normalization

Created URLNormalizer processor to handle JavaScript URL class behavior where `new URL('https://example.com').toString()` returns `'https://example.com/'`. This processor removes trailing slashes from non-root paths for consistent URL matching in SPARQL queries.

### SPARQL Performance

With large datasets (2000+ bookmarks), SPARQL update delays are essential. Testing showed that 100ms delays caused progressive slowdown as the endpoint became overwhelmed. Increasing to 500ms provides stable performance throughout the workflow.

## Files Modified

- `src/processors/flow/ForEach.js` - Progress logging and counter reset
- `src/processors/http/HttpClient.js` - Timeout support
- `src/processors/util/URLNormalizer.js` - New processor for URL normalization
- `src/processors/markup/HTMLToMarkdown.js` - New processor for HTML conversion
- `src/processors/sparql/SessionEnvironment.js` - Fixed endpoints.json usage
- `src/apps/link-finder/` - Complete application
- `src/apps/bookmark-get/` - Complete application
- `CLAUDE.md` - Added framework documentation

## Verification

Count bookmarks in the store:

```bash
curl -s -H "Accept: text/plain" --user admin:admin123 \
  "http://localhost:3030/semem/query?query=PREFIX%20bm%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fstuff%2Fbm%2F%3E%0ASELECT%20%28COUNT%28%3Fbookmark%29%20AS%20%3Fcount%29%20FROM%20%3Chttp%3A%2F%2Fhyperdata.it%2Fcontent%3E%20WHERE%20%7B%20%3Fbookmark%20a%20bm%3ABookmark%20%7D"
```

Check bookmarks with content:

```sparql
PREFIX bm: <http://purl.org/stuff/bm/>

SELECT ?target (EXISTS{?bookmark bm:content ?content} AS ?hasContent)
FROM <http://hyperdata.it/content>
WHERE {
  ?bookmark a bm:Bookmark ;
            bm:target ?target .
}
```
