# NewsMonitor: Feed Aggregator with Remote SPARQL Backend

## Executive Summary

NewsMonitor is a feed aggregator built on the Transmissions framework that uses a remote SPARQL store as its backend. This proposal outlines an architecture that leverages Transmissions' message-driven pipeline pattern to fetch, parse, normalize, and store feed data in RDF format, enabling semantic queries and rich data integration.

## Architecture Overview

### Core Principles

1. **Message-Driven Pipeline**: Follow Transmissions' pattern of processors transforming messages
2. **RDF-Native Storage**: Store all feed data as RDF in remote SPARQL endpoint
3. **Standards-Based**: Support RSS 1.0, RSS 2.0, Atom, and JSON Feed formats
4. **Semantic Integration**: Use established ontologies (SIOC, FOAF, schema.org)
5. **Incremental Updates**: Fetch only new items, avoid duplicate storage
6. **Extensible Processing**: Allow custom processors for content enrichment

### High-Level Flow

```
Feed URLs → Fetch → Parse → Normalize → Deduplicate → Store → Index
              ↓        ↓         ↓            ↓          ↓       ↓
         HttpClient  Parser  Transform    SPARQL    SPARQL  Search
```

## Data Model

### RDF Vocabularies

**Primary Ontologies:**
- **SIOC** (Semantically-Interlinked Online Communities): Core feed/post structure
  - `sioc:Forum` → Feed/Channel (subclass of RSS 1.0 `channel`)
  - `sioc:Post` → Feed item (subclass of RSS 1.0 `item`)
  - `sioc:content` → Plain text content
  - `content:encoded` → Rich HTML content (RSS 1.0 Content Module)

- **FOAF** (Friend of a Friend): Creator/author information
  - `foaf:Person` → Author/creator
  - `foaf:OnlineAccount` → Linked from `sioc:User`
  - `foaf:holdsAccount` → Links person to account

- **Schema.org**: Additional metadata
  - `schema:BlogPosting` → Blog post representation
  - `schema:Article` → News article representation
  - `schema:datePublished`, `schema:headline`, etc.

- **Dublin Core**: Standard metadata
  - `dc:date` → Publication date
  - `dc:title` → Entry title
  - `dc:creator` → Author

### Graph Structure

```turtle
# Example feed entry in RDF
@prefix sioc: <http://rdfs.org/sioc/ns#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix content: <http://purl.org/rss/1.0/modules/content/> .

<http://hyperdata.it/feeds/example-blog> a sioc:Forum ;
    dc:title "Example Blog" ;
    sioc:link <https://example.com/blog> ;
    sioc:feed_url <https://example.com/feed.xml> ;
    dc:date "2025-10-18T10:00:00Z"^^xsd:dateTime .

<http://hyperdata.it/posts/abc123> a sioc:Post ;
    sioc:has_container <http://hyperdata.it/feeds/example-blog> ;
    dc:title "Example Post" ;
    sioc:link <https://example.com/blog/post> ;
    dc:date "2025-10-18T09:30:00Z"^^xsd:dateTime ;
    sioc:content "Plain text summary..." ;
    content:encoded "<p>Rich HTML content...</p>" ;
    sioc:has_creator <http://hyperdata.it/users/author> ;
    dc:creator "Author Name" .

<http://hyperdata.it/users/author> a sioc:User ;
    foaf:name "Author Name" ;
    foaf:mbox <mailto:author@example.com> .
```

## Pipeline Architecture

### 1. Feed Subscription Flow

**Purpose**: Add new feed to monitoring system

```turtle
:subscribe a :Transmission ;
    :pipe (
        :HttpServer          # Receive POST /subscribe with feed URL
        :URLNormalizer       # Normalize feed URL
        :ValidateFeedURL     # Check URL validity (new processor)
        :CheckExisting       # Query if already subscribed (SPARQLSelect)
        :Choice              # Branch based on existence
        :CreateFeedEntry     # Generate feed RDF (Restructure)
        :SPARQLUpdate        # Store in graph
        :ResponseBuilder     # Return success/error
    ) .
```

**Input Message**: `{ url: "https://example.com/feed.xml" }`

**Output**: Feed subscription stored in SPARQL store

### 2. Feed Fetching Flow

**Purpose**: Periodically fetch all subscribed feeds

```turtle
:fetch-feeds a :Transmission ;
    :pipe (
        :GetSubscribedFeeds  # SPARQLSelect: Get all feed URLs
        :ForEach             # Process each feed
        :FetchFeed           # HttpClient: GET feed content
        :HandleFeedError     # Log/skip on HTTP errors
        :ParseFeed           # Parse RSS/Atom/JSON (new processor)
        :NormalizeFeed       # Convert to standard format (Restructure)
        :UpdateFeedMeta      # SPARQLUpdate: Update feed metadata
        :ExtractEntries      # Extract items array (Restructure)
        :ProcessEntries      # Fork to entry processing
    ) .
```

**Scheduling**: Run via cron/timer every 15-60 minutes

### 3. Entry Processing Flow

**Purpose**: Process individual feed entries

```turtle
:process-entries a :Transmission ;
    :pipe (
        :ForEach              # Iterate over entries
        :GenerateEntryURI     # Create unique URI (ResourceMinter)
        :CheckDuplicate       # SPARQLSelect: Check if exists
        :Choice               # Skip if duplicate
        :NormalizeEntry       # Convert to standard format
        :ExtractContent       # Get title, content, link, date
        :ExtractAuthor        # Parse author information
        :EnrichMetadata       # Add computed fields
        :FetchFullContent     # Optional: GET original page
        :ExtractMainContent   # Optional: Extract article body
        :ConvertToMarkdown    # Optional: HTMLToMarkdown
        :BuildEntryRDF        # Create RDF statements
        :SPARQLUpdate         # Store entry
        :UpdateIndex          # Update search index (optional)
        :TriggerNotifications # Optional: Notify on keywords
    ) .
```

### 4. Content Enhancement Flow (Optional)

**Purpose**: Fetch full article content for excerpt-only feeds

```turtle
:enhance-content a :Transmission ;
    :pipe (
        :GetPartialEntries    # SPARQLSelect: Entries without full content
        :ForEach              # Process each
        :HttpClient           # Fetch original URL
        :MetadataExtractor    # Extract Open Graph, schema.org
        :HTMLToMarkdown       # Convert to markdown
        :ExtractMainContent   # Remove nav, ads, etc. (new processor)
        :LinkFinder           # Extract outbound links
        :SPARQLUpdate         # Update entry with full content
    ) .
```

### 5. Query/Search Flow

**Purpose**: Query stored feeds by various criteria

```turtle
:search-entries a :Transmission ;
    :pipe (
        :HttpServer           # Receive search query
        :BuildSPARQLQuery     # Construct SPARQL from parameters
        :SPARQLSelect         # Execute query
        :Accumulate           # Collect results
        :FormatResults        # Transform to JSON/RSS/Atom
        :ResponseBuilder      # Return to client
    ) .
```

**Example Queries**:
- Recent entries from specific feeds
- Full-text search across content
- Entries by date range
- Entries by author
- Unread/read status tracking

### 6. Feed Export Flow

**Purpose**: Generate RSS/Atom feeds from stored data

```turtle
:export-feed a :Transmission ;
    :pipe (
        :HttpServer           # Receive GET /feeds/:id
        :GetFeedEntries       # SPARQLSelect: Query entries
        :Accumulate           # Collect all entries
        :SortEntries          # Order by date (Restructure)
        :BuildFeedXML         # Generate RSS/Atom XML (new processor)
        :ResponseBuilder      # Return feed
    ) .
```

## New Processors Required

### 1. FeedParser
**Location**: `src/processors/markup/FeedParser.js`

**Purpose**: Parse RSS 1.0, RSS 2.0, Atom, JSON Feed formats

**Dependencies**:
- Consider `feedparser` npm package (tested, mature)
- Alternative: `rss-parser` (simpler, actively maintained)

**Input**: `message.http.data` (feed XML/JSON string)

**Output**:
```javascript
message.feed = {
  type: 'rss2.0' | 'rss1.0' | 'atom' | 'json-feed',
  meta: { title, description, link, feedUrl, updated },
  entries: [
    { title, link, content, summary, published, author, guid, ... }
  ]
}
```

### 2. FeedValidator
**Location**: `src/processors/markup/FeedValidator.js`

**Purpose**: Validate feed URL and basic accessibility

**Input**: `message.url`

**Output**: `message.valid = true/false`, `message.validationError`

### 3. EntryDeduplicator
**Location**: `src/processors/util/EntryDeduplicator.js`

**Purpose**: Check if entry exists using GUID, link, or content hash

**Uses**: SPARQLSelect internally

**Output**: `message.isDuplicate = true/false`, `message.existingURI`

### 4. RDFBuilder
**Location**: `src/processors/rdf/RDFBuilder.js`

**Purpose**: Build RDF triples from structured data using templates

**Dependencies**: Use existing `rdf-ext`, `grapoi`, `@rdfjs/namespace`

**Input**: `message.data` + template

**Output**: `message.rdf` (Turtle/N-Triples/JSON-LD)

### 5. FeedGenerator
**Location**: `src/processors/markup/FeedGenerator.js`

**Purpose**: Generate RSS/Atom XML from entries array

**Dependencies**: Consider `feed` npm package

**Input**: `message.entries` (array of normalized entries)

**Output**: `message.feedXML`

### 6. ContentExtractor
**Location**: `src/processors/markup/ContentExtractor.js`

**Purpose**: Extract main article content from HTML (remove nav, ads, etc.)

**Dependencies**: Consider `@mozilla/readability` or `node-readability`

**Input**: `message.http.data` (HTML)

**Output**: `message.mainContent` (cleaned HTML/text)

## SPARQL Patterns

### Check for Existing Feed
```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?feed WHERE {
  GRAPH <http://hyperdata.it/feeds> {
    ?feed a sioc:Forum ;
          sioc:feed_url "{{feedUrl}}" .
  }
}
```

### Check for Duplicate Entry
```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>

SELECT ?post WHERE {
  GRAPH <http://hyperdata.it/content> {
    ?post a sioc:Post ;
          sioc:link "{{entryLink}}" .
  }
}
# Alternative: Check by GUID
# sioc:id "{{guid}}"
```

### Get Recent Entries from Feed
```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?post ?title ?link ?date ?content WHERE {
  GRAPH <http://hyperdata.it/content> {
    ?post a sioc:Post ;
          sioc:has_container <{{feedUri}}> ;
          dc:title ?title ;
          sioc:link ?link ;
          dc:date ?date .
    OPTIONAL { ?post sioc:content ?content }
  }
}
ORDER BY DESC(?date)
LIMIT 50
```

### Get Unread Entries (with user state)
```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX nm: <http://hyperdata.it/ns/newsmonitor#>

SELECT ?post ?title ?feed WHERE {
  GRAPH <http://hyperdata.it/content> {
    ?post a sioc:Post ;
          dc:title ?title ;
          sioc:has_container ?feed .
  }
  GRAPH <http://hyperdata.it/user/{{userId}}> {
    ?feed nm:subscribed true .
    FILTER NOT EXISTS { ?post nm:read true }
  }
}
ORDER BY DESC(?date)
```

### Search Full Text (if endpoint supports)
```sparql
PREFIX sioc: <http://rdfs.org/sioc/ns#>
PREFIX bif: <bif:>

SELECT ?post ?title ?score WHERE {
  GRAPH <http://hyperdata.it/content> {
    ?post a sioc:Post ;
          dc:title ?title ;
          sioc:content ?content .
    ?content bif:contains "{{searchTerms}}" OPTION (score ?score) .
  }
}
ORDER BY DESC(?score)
LIMIT 100
```

## Configuration

### endpoints.json
```json
{
  "query": {
    "url": "https://sparql.example.org/query",
    "credentials": {
      "username": "reader",
      "password": "..."
    }
  },
  "update": {
    "url": "https://sparql.example.org/update",
    "credentials": {
      "username": "writer",
      "password": "..."
    }
  }
}
```

### config.ttl
```turtle
@prefix : <http://hyperdata.it/transmissions/> .
@prefix trn: <http://hyperdata.it/transmissions/> .

:fetchConfig a :ConfigSet ;
    trn:targetPath "." ;
    trn:endpointSettings "endpoints.json" ;
    trn:feedsGraph <http://hyperdata.it/feeds> ;
    trn:contentGraph <http://hyperdata.it/content> ;
    trn:fetchInterval "1800000" ;  # 30 minutes in ms
    trn:userAgent "NewsMonitor/1.0" ;
    trn:timeout "30000" .

:parserConfig a :ConfigSet ;
    trn:maxContentLength "1000000" ;  # 1MB limit
    trn:fetchFullContent "false" ;     # Set true to fetch original pages
    trn:convertToMarkdown "true" .

:deduplicationConfig a :ConfigSet ;
    trn:guidField "guid" ;
    trn:linkField "link" ;
    trn:useContentHash "true" .
```

## Implementation Guide

### Using Transmissions Skills

This project includes two Claude Code skills to streamline development:

**transmissions-app skill**: Creates application structure
- Invoke with: `/skill transmissions-app`
- Choose core development (recommended for NewsMonitor)
- Creates app in `src/apps/newsmonitor/`
- Generates `transmissions.ttl`, `config.ttl`, and `about.md`
- Tests basic pipeline execution

**transmissions-processor skill**: Creates custom processors
- Invoke with: `/skill transmissions-processor`
- Use for each new processor (FeedParser, RDFBuilder, etc.)
- Choose core development for reusable processors
- Handles factory registration automatically
- Creates test apps for validation

### Implementation Phases

### Phase 1: Project Setup & Core Infrastructure (Week 1-2)

**Step 1.1: Create NewsMonitor App**
```bash
# Use transmissions-app skill
/skill transmissions-app
# Choose: core development, name: newsmonitor
```

**Step 1.2: Create FeedParser Processor**
```bash
# Use transmissions-processor skill
/skill transmissions-processor
# Name: FeedParser, Group: markup, Location: core
```
- Install dependency: `npm install rss-parser`
- Implement parsing for RSS 2.0, RSS 1.0, Atom, JSON Feed
- Add test app with sample feeds

**Step 1.3: Create RDFBuilder Processor**
```bash
/skill transmissions-processor
# Name: RDFBuilder, Group: rdf (new), Location: core
```
- Use existing rdf-ext, grapoi dependencies
- Support Nunjucks templates for RDF generation
- Test with SIOC/FOAF examples

**Step 1.4: Set Up SPARQL Configuration**
- Create `endpoints.json` for remote SPARQL store
- Configure authentication
- Test SPARQLSelect and SPARQLUpdate with simple queries
- Verify remote connectivity

**Step 1.5: Implement Subscription Flow**
- Build pipeline in `src/apps/newsmonitor/subscribe/transmissions.ttl`
- Use URLNormalizer, FeedParser, RDFBuilder, SPARQLUpdate
- Test adding feeds to SPARQL store

### Phase 2: Feed Fetching & Entry Processing (Week 2-3)

**Step 2.1: Create EntryDeduplicator Processor**
```bash
/skill transmissions-processor
# Name: EntryDeduplicator, Group: util, Location: core
```
- Implement GUID/link/hash-based deduplication
- Use SPARQLSelect internally
- Test with duplicate entries

**Step 2.2: Build Fetch Pipeline**
- Create `src/apps/newsmonitor/fetch/transmissions.ttl`
- SPARQLSelect → ForEach → HttpClient → FeedParser → ForEach → Process
- Implement error handling for HTTP failures (timeouts, 404s)
- Add delay configuration for rate limiting

**Step 2.3: Build Entry Processing Pipeline**
- Create `src/apps/newsmonitor/process-entry/transmissions.ttl`
- EntryDeduplicator → Choice → RDFBuilder → SPARQLUpdate
- Test with multiple feed formats (RSS 1.0, 2.0, Atom, JSON)
- Verify SIOC/FOAF RDF structure

**Step 2.4: Integration Testing**
- Add 10+ real-world feeds
- Run full fetch cycle
- Verify deduplication works
- Check SPARQL store content

### Phase 3: Content Enhancement (Week 3-4)

**Step 3.1: Create FeedValidator Processor**
```bash
/skill transmissions-processor
# Name: FeedValidator, Group: markup, Location: core
```
- Validate URL format
- Check HTTP accessibility
- Verify feed format validity

**Step 3.2: Create ContentExtractor Processor**
```bash
/skill transmissions-processor
# Name: ContentExtractor, Group: markup, Location: core
```
- Install: `npm install @mozilla/readability jsdom`
- Extract main article content from HTML
- Remove ads, navigation, footers
- Test with news sites and blogs

**Step 3.3: Build Content Enhancement Pipeline**
- Create `src/apps/newsmonitor/enhance/transmissions.ttl`
- SPARQLSelect (partial entries) → ForEach → HttpClient → ContentExtractor
- HTMLToMarkdown → SPARQLUpdate
- Test with excerpt-only feeds

**Step 3.4: Link Extraction**
- Integrate existing LinkFinder processor
- Store outbound links in RDF
- Test with link-heavy content

### Phase 4: Query & Export (Week 4-5)

**Step 4.1: Create FeedGenerator Processor**
```bash
/skill transmissions-processor
# Name: FeedGenerator, Group: markup, Location: core
```
- Install: `npm install feed`
- Generate RSS 2.0 and Atom 1.0 XML
- Test roundtrip: fetch → store → export

**Step 4.2: Build Search Pipeline**
- Create `src/apps/newsmonitor/search/transmissions.ttl`
- HttpServer → BuildQuery → SPARQLSelect → Accumulate → Format
- Create SPARQL query templates for common searches
- Test date ranges, keyword searches, feed filters

**Step 4.3: Build Export Pipeline**
- Create `src/apps/newsmonitor/export/transmissions.ttl`
- HttpServer → SPARQLSelect → Accumulate → FeedGenerator → Response
- Support RSS and Atom output formats
- Test with feed readers (Feedly, NewsBlur, etc.)

**Step 4.4: Create HTTP API**
- Configure HttpServer in main transmissions.ttl
- Route to different pipelines (subscribe, search, export)
- Add basic authentication
- Performance test with 1000+ entries

### Phase 5: User Features & Polish (Week 5-6)

**Step 5.1: User Subscription Management**
- Extend RDF model with user graphs
- Add per-user subscription tracking
- Implement subscribe/unsubscribe endpoints
- Test multi-user scenarios

**Step 5.2: Read/Unread Tracking**
- Add `nm:read` property to entries
- Create mark-as-read endpoint
- Query for unread entries per user
- Test performance with large unread counts

**Step 5.3: Keyword Notifications**
- Create KeywordMatcher processor (if needed)
- Add notification pipeline
- Support email/webhook delivery
- Test with keyword patterns

**Step 5.4: Web UI (Optional)**
- Create simple HTML frontend
- Use HttpServer to serve static files
- AJAX calls to search/export APIs
- Basic feed management interface

**Step 5.5: Documentation & Deployment**
- Complete `about.md` for each pipeline
- Document API endpoints
- Create deployment guide for SPARQL store
- Performance tuning and optimization

## Advantages of This Architecture

### 1. **Semantic Queries**
- Rich queries across feeds using SPARQL
- Join data with other RDF sources
- Federated queries across multiple endpoints
- Reasoning capabilities with ontologies

### 2. **Standards-Based**
- Uses established vocabularies (SIOC, FOAF, Dublin Core)
- Compatible with other Semantic Web tools
- RDF export for data portability
- Standards-compliant feed generation

### 3. **Transmissions Integration**
- Leverages existing processors (HttpClient, ForEach, Restructure)
- Familiar pipeline patterns
- Easy to extend with custom processors
- Declarative configuration in Turtle

### 4. **Scalability**
- Remote SPARQL store handles storage scaling
- Stateless processors enable horizontal scaling
- ForEach enables parallel processing
- Incremental updates minimize bandwidth

### 5. **Extensibility**
- Easy to add NLP/AI processors for classification
- Can integrate sentiment analysis
- Support for multiple output formats
- Plugin architecture for custom enrichment

## Performance Considerations

### Deduplication Strategy
- Use GUID as primary key (most reliable)
- Fallback to link URL (normalized)
- Last resort: content hash (for feeds without GUID)
- Index on `sioc:id`, `sioc:link`, `dc:date` in SPARQL store

### Batch Processing
- Use ForEach with configurable delay
- Process feeds in parallel where possible
- Implement exponential backoff for failing feeds
- Rate limiting per domain

### Caching
- Cache feed metadata in message whiteboard
- Reuse HTTP connections (keep-alive)
- Cache SPARQL query endpoints
- Consider Redis for session state

### Monitoring
- Log fetch success/failure rates
- Track processing time per feed
- Monitor SPARQL endpoint performance
- Alert on repeated fetch failures

## Example Use Cases

### 1. Personal News Aggregator
Subscribe to blogs, news sites, podcasts. Read in web interface or native client via custom RSS export.

### 2. Research Monitor
Track academic journals, preprint servers, conference feeds. Query by author, topic, institution using SPARQL.

### 3. Social Media Archive
Aggregate social media RSS feeds (Mastodon, Bluesky). Cross-reference with FOAF network data.

### 4. Content Curation
Collect feeds by topic. Apply ML classification. Generate curated topic feeds for others.

### 5. Link Blog
Fetch feeds, extract links with LinkFinder. Store link graph in RDF. Analyze link patterns.

## Testing Strategy

### Unit Tests
- Test each processor in isolation
- Mock SPARQL endpoints
- Test feed parsing with sample files
- Test RDF generation/validation

### Integration Tests
- End-to-end pipeline tests
- Test against real SPARQL endpoint (test instance)
- Test with various feed formats
- Test error handling (timeouts, 404s, malformed feeds)

### Performance Tests
- Fetch 100+ feeds concurrently
- Process 10,000+ entries
- Query response time with large datasets
- Memory usage profiling

## Security Considerations

### Input Validation
- Validate feed URLs before fetching
- Sanitize HTML content before storage
- Limit feed size to prevent DoS
- Timeout long-running HTTP requests

### Authentication
- Secure SPARQL endpoint with authentication
- Use HTTPS for all external requests
- Separate read/write credentials
- Consider OAuth for user authentication

### Content Safety
- Strip JavaScript from stored HTML
- Validate RDF before SPARQL insert
- Rate limit API endpoints
- Consider content filtering for sensitive material

## Conclusion

This architecture combines Transmissions' strengths (message-driven pipelines, modular processors) with Semantic Web technologies (RDF, SPARQL, ontologies) to create a powerful, extensible feed aggregator. The use of established vocabularies enables rich queries and integration with other data sources, while the pipeline architecture ensures maintainability and extensibility.

The phased implementation approach allows for incremental development and testing, with each phase building on the previous one. The result is a system that can handle feed aggregation at scale while providing semantic query capabilities that go far beyond traditional feed readers.

## References

### Vocabularies
- SIOC Core Ontology: http://rdfs.org/sioc/spec/
- FOAF Vocabulary: http://xmlns.com/foaf/spec/
- RSS 1.0 Specification: http://web.resource.org/rss/1.0/spec
- Atom Specification: https://www.rfc-editor.org/rfc/rfc4287
- RSS 1.0 Content Module: http://web.resource.org/rss/1.0/modules/content/

### Libraries (Candidates)
- feedparser: https://github.com/danmactough/node-feedparser
- rss-parser: https://github.com/rbren/rss-parser
- feed: https://github.com/jpmonette/feed
- @mozilla/readability: https://github.com/mozilla/readability

### Research
- "From RDF to RSS and Atom: Content Syndication with Linked Data" (ACM 2013)
- Virtuoso SPARQL Query Service: https://virtuoso.openlinksw.com/
- OpenLink Data Spaces (ODS): SIOC/FOAF implementation examples
