# bookmark-get Application

## Description

Fetches HTML content for bookmarks with HTTP status 200, converts to Markdown, and stores in SPARQL graph.

## Runner

```sh
cd ~/hyperdata/transmissions
./trans bookmark-get
```

## Workflow

1. **SPARQLSelect** - Query bookmarks with status 200 that don't have content yet
2. **ForEach** - Iterate over each bookmark
3. **Restructure** - Extract target URL and bookmark URI
4. **HttpClient** - Fetch HTML page
5. **HTMLToMarkdown** - Convert HTML to Markdown
6. **Restructure** - Prepare data for update
7. **SPARQLUpdate** - Store markdown content in graph
8. **ShowMessage** - Debug output

## SPARQL Data Model

**Input Query:**
```sparql
PREFIX bm: <http://purl.org/stuff/bm/>
SELECT ?bookmark ?target ?title
WHERE {
  ?bookmark a bm:Bookmark ;
            bm:target ?target ;
            bm:status 200 .
  FILTER NOT EXISTS { ?bookmark bm:content ?content }
}
```

**Output Update:**
```sparql
PREFIX bm: <http://purl.org/stuff/bm/>
INSERT DATA {
  GRAPH <http://hyperdata.it/content> {
    <bookmark-uri> bm:content "markdown content" ;
                   bm:contentType "text/markdown" ;
                   bm:fetched "2025-09-30T12:00:00Z"^^xsd:dateTime .
  }
}
```

## Verification Query

To verify the pipeline has worked, check which bookmarks have content:

```sparql
PREFIX bm: <http://purl.org/stuff/bm/>

SELECT ?target ?title (SUBSTR(?content, 1, 100) AS ?preview) ?fetched
FROM <http://hyperdata.it/content>
WHERE {
  ?bookmark a bm:Bookmark ;
            bm:target ?target ;
            bm:content ?content ;
            bm:fetched ?fetched .
  OPTIONAL { ?bookmark bm:title ?title }
}
ORDER BY DESC(?fetched)
```

Or via curl:

```sh
curl -s -H "Accept: text/plain" --user admin:admin123 \
  "http://localhost:3030/test/query?query=PREFIX%20bm%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fstuff%2Fbm%2F%3E%0ASELECT%20%3Ftarget%20%28EXISTS%7B%3Fbookmark%20bm%3Acontent%20%3Fcontent%7D%20AS%20%3FhasContent%29%20WHERE%20%7B%20GRAPH%20%3Chttp%3A%2F%2Fhyperdata.it%2Fcontent%3E%20%7B%20%3Fbookmark%20a%20bm%3ABookmark%20%3B%20bm%3Atarget%20%3Ftarget%20%7D%20%7D"
```

## Notes

- Only processes bookmarks with status 200 (successful HTTP)
- Skips bookmarks that already have content
- Removes scripts, styles, nav, footer, aside, header elements before conversion
- Preserves links, images, formatting, lists, code blocks, tables
- Handles nested HTML structures
- Second run will skip bookmarks that already have content