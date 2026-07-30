# scripts/del-dan.sh

ENDPOINT="http://localhost:3030/danny.ayers.name/update"

echo -e "\nDeleting data from ${ENDPOINT}"
curl -X POST "${ENDPOINT}" \
  -H "Authorization: Basic $(echo -n 'admin:admin123' | base64)" \
  -H "Content-Type: application/sparql-update" \
  -H "Accept: application/sparql-results+json" \
  --data "DELETE { ?s ?p ?o} WHERE { ?s ?p ?o }"

curl -X POST "${ENDPOINT}" \
  -H "Authorization: Basic $(echo -n 'admin:admin123' | base64)" \
  -H "Content-Type: application/sparql-update" \
  -H "Accept: application/sparql-results+json" \
  --data "DELETE {GRAPH ?g {?s ?p ?o}} WHERE {GRAPH ?g {?s ?p ?o}}"
