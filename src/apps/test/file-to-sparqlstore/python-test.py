#!/usr/bin/env python3
import requests
import json
from base64 import b64encode
from datetime import datetime

# Configuration
ENDPOINT_QUERY = "http://localhost:3030/test/query"
ENDPOINT_UPDATE = "http://localhost:3030/test/update" 
AUTH_USER = "admin"
AUTH_PASS = "admin123"

# Authentication header
auth_string = b64encode(f"{AUTH_USER}:{AUTH_PASS}".encode()).decode()
HEADERS = {
    'Authorization': f'Basic {auth_string}',
    'Accept': 'application/json'
}

def run_query(query):
    """Execute a SPARQL query and return results"""
    headers = {**HEADERS, 'Content-Type': 'application/sparql-query'}
    response = requests.post(ENDPOINT_QUERY, 
                           headers=headers,
                           data=query)
    response.raise_for_status()
    return response.json()

def run_update(update):
    """Execute a SPARQL update"""
    headers = {**HEADERS, 'Content-Type': 'application/sparql-update'}
    response = requests.post(ENDPOINT_UPDATE,
                           headers=headers,
                           data=update)
    response.raise_for_status()
    return response.status_code

def test_queries():
    # Insert test data
    insert_query = """
    PREFIX schema: <http://schema.org/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {
      <http://example.com/posts/test-123> a schema:BlogPosting ;
        schema:headline "Python Test Post" ;
        schema:description "Test content from Python" ;
        schema:datePublished "2024-01-16T10:00:00Z"^^xsd:dateTime ;
        schema:dateModified "2024-01-16T10:00:00Z"^^xsd:dateTime ;
        schema:author [
          a schema:Person ;
          schema:name "Python Test User" ;
          schema:email "python@example.com"
        ] .
    }
    """
    print("Inserting test data...")
    status = run_update(insert_query)
    print(f"Insert status: {status}")

    # Query all posts
    select_query = """
    PREFIX schema: <http://schema.org/>
    SELECT ?post ?title ?date ?author 
    WHERE {
      ?post a schema:BlogPosting ;
            schema:headline ?title ;
            schema:datePublished ?date ;
            schema:author/schema:name ?author .
    } ORDER BY DESC(?date)
    """
    print("\nQuerying all posts...")
    results = run_query(select_query)
    print(json.dumps(results, indent=2))

    # Delete test data
    delete_query = """
    PREFIX schema: <http://schema.org/>
    DELETE WHERE {
      <http://example.com/posts/test-123> ?p ?o .
      OPTIONAL { ?o ?p2 ?o2 }
    }
    """
    print("\nDeleting test data...")
    status = run_update(delete_query)
    print(f"Delete status: {status}")

if __name__ == "__main__":
    try:
        test_queries()
    except requests.exceptions.RequestException as e:
        print(f"Error during SPARQL operations: {e}")