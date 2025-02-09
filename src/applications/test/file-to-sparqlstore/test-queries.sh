#!/bin/bash

# Configuration
ENDPOINT_QUERY="http://localhost:3030/test/query"
ENDPOINT_UPDATE="http://localhost:3030/test/update"
AUTH_USER="admin"
AUTH_PASS="admin123"
AUTH_HEADER="Authorization: Basic $(echo -n ${AUTH_USER}:${AUTH_PASS} | base64)"

# Function to URL encode query
urlencode() {
  local string="${1}"
  echo "${string}" | curl -Gso /dev/null -w %{url_effective} --data-urlencode @- "" | cut -c 3-
}

# Test Query - Get all posts
echo "Testing: Get all posts"
curl -X POST $ENDPOINT_QUERY \
  -H "Content-Type: application/sparql-query" \
  -H "Accept: application/json" \
  -H "$AUTH_HEADER" \
  --data-raw 'PREFIX schema: <http://schema.org/>
  SELECT ?post ?title ?date ?author 
  WHERE {
    ?post a schema:BlogPosting ;
          schema:headline ?title ;
          schema:datePublished ?date ;
          schema:author/schema:name ?author .
  } ORDER BY DESC(?date)'

# Test Query - Get posts by author
echo -e "\nTesting: Get posts by author"
curl -X POST $ENDPOINT_QUERY \
  -H "Content-Type: application/sparql-query" \
  -H "Accept: application/json" \
  -H "$AUTH_HEADER" \
  --data-raw 'PREFIX schema: <http://schema.org/>
  SELECT ?post ?title ?date 
  WHERE {
    ?post a schema:BlogPosting ;
          schema:headline ?title ;
          schema:datePublished ?date ;
          schema:author [ schema:name "Test User" ] .
  } ORDER BY DESC(?date)'

# Test Update - Insert new post
echo -e "\nTesting: Insert new post"
curl -X POST $ENDPOINT_UPDATE \
  -H "Content-Type: application/sparql-update" \
  -H "$AUTH_HEADER" \
  --data-raw 'PREFIX schema: <http://schema.org/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  INSERT DATA {
    <http://example.com/posts/test-123> a schema:BlogPosting ;
      schema:headline "Test Post" ;
      schema:description "Test content" ;
      schema:datePublished "2024-01-16T10:00:00Z"^^xsd:dateTime ;
      schema:dateModified "2024-01-16T10:00:00Z"^^xsd:dateTime ;
      schema:author [
        a schema:Person ;
        schema:name "Test User" ;
        schema:email "test@example.com"
      ] .
  }'

# Test Update - Delete post
echo -e "\nTesting: Delete post"
curl -X POST $ENDPOINT_UPDATE \
  -H "Content-Type: application/sparql-update" \
  -H "$AUTH_HEADER" \
  --data-raw 'PREFIX schema: <http://schema.org/>
  DELETE WHERE {
    <http://example.com/posts/test-123> ?p ?o .
    OPTIONAL { ?o ?p2 ?o2 }
  }'