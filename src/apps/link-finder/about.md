`src/apps/link-finder/about.md`

# link-finder Application `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans link-finder
```


scripts/del-fuseki-test-store-local.sh

## Description

Inserts bookmark statements into a named graph for a given target URL that looks like this :

```turtle
@prefix bm: <http://purl.org/stuff/bm/> .

  <http://purl.org/stuff/instance/eprxly1u> a bm:Bookmark ;
        bm:target <https://tensegrity.it/> ;
        bm:agent <http://purl.org/stuff/agent/transmissions> ;
        bm:created "2025-09-28" ;
        bm:title "Tensegrity" ;
        bm:status "404"^^xsd:integer .
```
Templating is in place to insert the bookmark URI.
If no entry exists for the bm:target, then this new one is created. Otherwise the existing statement block is updated, so :

```turtle
@prefix bm: <http://purl.org/stuff/bm/> .

  <http://purl.org/stuff/instance/eprxly1u> a bm:Bookmark ;
        bm:target <https://tensegrity.it/> ;
        bm:agent <http://purl.org/stuff/agent/transmissions> ;
        bm:created "2025-09-29" ;
        bm:title "Tensegrity" ;
        bm:status "200"^^xsd:integer .
```

## Performance & Configuration

### Timeouts
HttpClient has a 10-second timeout for fetching URLs to prevent hanging on slow/unresponsive sites. URLs that timeout will have an error recorded in the message but the workflow continues processing remaining URLs.

### Progress Logging
ForEach processor reports progress every 5% when processing large lists of URLs:
- Shows total item count at start
- Progress updates (e.g., "Progress 206/4127 (5%)")
- Final count when complete

### SPARQL Update Delay
A 500ms delay between SPARQL updates prevents overloading the endpoint. For large URL lists (4000+), expect processing time of ~30-60 minutes depending on network conditions.

### Configuration
- `httpSettings :timeout "10000"` - 10 second HTTP timeout
- `updateBookmark :delay "500"` - 500ms delay between SPARQL updates

## Verification Query

Count bookmarks in the store:

```sparql
PREFIX bm: <http://purl.org/stuff/bm/>

SELECT (COUNT(?bookmark) AS ?count)
FROM <http://hyperdata.it/content>
WHERE {
  ?bookmark a bm:Bookmark .
}
```

Or via curl:

```sh
curl -s -H "Accept: text/plain" --user admin:admin123 \
  "http://localhost:3030/test/query?query=PREFIX%20bm%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fstuff%2Fbm%2F%3E%0ASELECT%20%28COUNT%28%3Fbookmark%29%20AS%20%3Fcount%29%20FROM%20%3Chttp%3A%2F%2Fhyperdata.it%2Fcontent%3E%20WHERE%20%7B%20%3Fbookmark%20a%20bm%3ABookmark%20%7D"
```
