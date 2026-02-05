# src/apps/newsmonitor/clear-graph.sh
#!/usr/bin/env bash
set -euo pipefail

curl -sS -u "${SPARQL_USER:-admin}:${SPARQL_PASSWORD:-admin123}" \
  -X POST "https://fuseki.hyperdata.it/newsmonitor/update" \
  -H "Content-Type: application/sparql-update" \
  --data "DELETE { GRAPH <http://hyperdata.it/content> { ?s ?p ?o } } WHERE { GRAPH <http://hyperdata.it/content> { ?s ?p ?o } }"
