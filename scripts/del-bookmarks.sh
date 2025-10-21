#!/bin/bash
# scripts/del-bookmarks.sh
# Delete all bookmarks from the semem dataset

SPARQL_UPDATE='
PREFIX bm: <http://purl.org/stuff/bm/>

DELETE {
  GRAPH <http://hyperdata.it/content> {
    ?bookmark ?p ?o .
  }
}
WHERE {
  GRAPH <http://hyperdata.it/content> {
    ?bookmark a bm:Bookmark .
    ?bookmark ?p ?o .
  }
}
'

echo "Deleting all bookmarks from semem dataset..."

curl -X POST \
  -H "Content-Type: application/sparql-update" \
  --user admin:admin123 \
  --data-binary "$SPARQL_UPDATE" \
  http://localhost:3030/semem/update

echo ""
echo "Done. Checking count..."

# Verify deletion
curl -s -H "Accept: application/sparql-results+json" \
  --user admin:admin123 \
  "http://localhost:3030/semem/query" \
  --data-urlencode "query=PREFIX bm: <http://purl.org/stuff/bm/>
SELECT (COUNT(?bookmark) AS ?count)
FROM <http://hyperdata.it/content>
WHERE { ?bookmark a bm:Bookmark }" \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"Remaining bookmarks: {data['results']['bindings'][0]['count']['value']}\")"
