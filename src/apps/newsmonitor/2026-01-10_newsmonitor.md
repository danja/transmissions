# NewsMonitor: A Semantic Feed Aggregator

**Date:** January 10, 2026
**Application:** NewsMonitor
**Framework:** Transmissions

## Overview

NewsMonitor is a feed aggregator application built on the Transmissions message processing framework. It subscribes to RSS, Atom, and RDF feeds, stores their content in a SPARQL triple store, and provides a web interface for browsing aggregated posts.

## Core Functionality

The application performs three primary functions:

1. **Feed Subscription**: Accepts feed URLs and stores feed metadata in RDF format
2. **Content Retrieval**: Fetches feed entries on a scheduled basis and stores them as RDF triples
3. **Content Presentation**: Provides a web interface for browsing and searching aggregated content

## Architecture

NewsMonitor consists of several components:

- **Backend**: Node.js application using the Transmissions framework for message processing
- **Storage**: Apache Jena Fuseki SPARQL server for RDF data persistence
- **Frontend**: Static HTML/CSS/JavaScript interface served via HTTP
- **Scheduler**: Automated feed update process running at configurable intervals

Data is stored in two named graphs:
- `http://hyperdata.it/feeds` - Feed metadata (titles, URLs, format information)
- `http://hyperdata.it/content` - Individual post entries with titles, links, dates, and content summaries

## Feed Processing Pipeline

When subscribing to a feed, NewsMonitor executes a pipeline of processors:

1. HTTP client fetches the feed XML
2. Feed parser extracts individual entries
3. Deduplicator checks for existing entries using GUIDs and content hashes
4. RDF builder converts entries to RDF triples using Nunjucks templates
5. SPARQL updater inserts new entries into the triple store

The `update-all` pipeline iterates through all subscribed feeds, fetching new entries and storing them. Updates run automatically every hour by default, with the interval configurable via environment variables.

## Web Interface

The application provides two web interfaces:

**Main Feed View** (`/`)
- Displays recent posts across all subscribed feeds
- Shows post titles, dates, feed sources, and content summaries
- Includes search and filtering capabilities
- Pagination for browsing large result sets
- Mobile-responsive layout

**Admin Interface** (`/admin.html`)
- Subscribe to new feeds (bulk entry supported)
- View all subscribed feeds with post counts
- Unsubscribe from feeds
- Manually trigger feed updates
- Filter and sort feed lists

## API Endpoints

NewsMonitor exposes several HTTP endpoints:

- `GET /api/posts` - Retrieve recent posts with pagination
- `GET /api/feeds` - List all subscribed feeds
- `GET /api/count` - Get total post count
- `POST /api/subscribe` - Subscribe to new feeds
- `POST /api/unsubscribe` - Remove feed subscriptions
- `POST /api/update-feeds` - Trigger manual feed update
- `GET /api/health` - Service health check
- `GET /api/diagnostics` - SPARQL connectivity diagnostics

## Deployment

The application runs as a Docker container with the following configuration:

- **Port**: 6010 (configurable)
- **Update Interval**: 3600000ms (1 hour, configurable)
- **Render Interval**: 300000ms (5 minutes, configurable)
- **Dependencies**: Requires access to a Fuseki SPARQL endpoint

Environment variables control Fuseki connectivity, authentication, and update schedules. The container can be deployed behind nginx for SSL termination and load balancing.

## Data Model

NewsMonitor uses the SIOC (Semantically-Interlinked Online Communities) vocabulary for representing feeds and posts:

- Feeds are typed as `sioc:Forum`
- Posts are typed as `sioc:Post`
- Dublin Core terms (`dc:title`, `dc:date`, `dc:creator`) provide metadata
- Posts link to their source feeds via `sioc:has_container`

This RDF-based storage enables SPARQL queries for flexible content retrieval and integration with other semantic web applications.

## Current Status

As of January 2026, NewsMonitor successfully aggregates content from multiple feed formats. The application handles feed parsing, deduplication, and storage of posts with their associated metadata including titles, links, publication dates, authors, and content summaries.

The system has been tested with feeds containing hundreds of entries and handles updates without blocking the web interface. Feed subscriptions persist across container restarts, and the SPARQL store maintains a queryable archive of all retrieved content.

## Technical Notes

- Built using ES modules and modern JavaScript features
- SPARQL queries use named graphs to separate feeds from content
- Deduplication prevents duplicate entries using multiple matching strategies
- Templates use Nunjucks for RDF generation from feed data
- Mobile interface uses responsive CSS with touch-friendly controls
- Feed updates run in separate processes to avoid blocking the API

## Files

Key application files:
- `src/apps/newsmonitor/subscribe/` - Feed subscription pipeline
- `src/apps/newsmonitor/update-all/` - Batch feed update pipeline
- `src/apps/newsmonitor/render-to-html/` - Legacy HTML rendering
- `docker/newsmonitor-scheduler.js` - Scheduling and HTTP server
- `docker/api-handler.js` - REST API implementation
- `docker/public/` - Frontend HTML, CSS, and JavaScript

Configuration uses RDF/Turtle files (`transmissions.ttl`, `config.ttl`) to define processor pipelines and settings, following Transmissions framework conventions.
