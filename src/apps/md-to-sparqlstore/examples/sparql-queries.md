# Query all blog posts
PREFIX schema: <http://schema.org/>
SELECT ?post ?title ?date ?author WHERE {
  ?post a schema:BlogPosting ;
        schema:headline ?title ;
        schema:datePublished ?date ;
        schema:author/schema:name ?author .
} ORDER BY DESC(?date)

# Query posts by specific author
PREFIX schema: <http://schema.org/>
SELECT ?post ?title ?date WHERE {
  ?post a schema:BlogPosting ;
        schema:headline ?title ;
        schema:datePublished ?date ;
        schema:author [ schema:name "Test User" ] .
} ORDER BY DESC(?date)

# Query posts in date range
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?post ?title ?date WHERE {
  ?post a schema:BlogPosting ;
        schema:headline ?title ;
        schema:datePublished ?date .
  FILTER(?date >= "2024-01-01T00:00:00Z"^^xsd:dateTime && 
         ?date <= "2024-12-31T23:59:59Z"^^xsd:dateTime)
} ORDER BY DESC(?date)

# Update/Insert new blog post
PREFIX schema: <http://schema.org/>
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
}

# Delete a blog post
PREFIX schema: <http://schema.org/>
DELETE WHERE {
  <http://example.com/posts/test-123> ?p ?o .
  OPTIONAL { ?o ?p2 ?o2 }
}