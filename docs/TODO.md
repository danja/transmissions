# Consumer for Semem

## Phase 1 : link-consumer for markdown

* read data/workflowy_2025-09-21.md : FileReader
* parse links : new, src/processors/markup/MarkdownToLinks.js 
* for each link : src/processors/flow/ForEach
 * do a GET, record HTTP status, response type : src/processors/http/HttpClient.js
 * apply SPARQL template & upload to store

src/apps/md-to-sparqlstore

processors/util/ResourceMinter.js - mint URI, W3CDTF datetime, agent
properties : baseURI, agentURI

## Phase 2 : set of files link-consumer