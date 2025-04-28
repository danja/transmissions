# transmissions

---

After _No Code_ and _Lo Code_ comes _Marginally Less Code_

**Transmissions** is a micro-framework intended to simplify construction of small pipeliney data processing applications in JavaScript (assuming you are already familiar with JavaScript and RDF).

The code is in active development, ie. **not stable**, subject to arbitrary changes.

A bit like `make` or a `package.json` builder. But much harder work (and fun).

Applications are defined in several places, the bits of interest are eg. Postcraft's [transmissions.ttl](https://github.com/danja/transmissions/blob/main/src/applications/postcraft/transmissions.ttl) and [services.ttl](https://github.com/danja/transmissions/blob/main/src/applications/postcraft/services.ttl).
The former defines the flow, the latter config of the services (under [src/services](https://github.com/danja/transmissions/tree/main/src/services)). The runtime instance of the application is given in the target [manifest.ttl](https://github.com/danja/postcraft/blob/main/danny.ayers.name/manifest.ttl).

### Installation etc.

This is not ready yet. But if you really must...

Make a fresh dir. Clone this repo and [Postcraft](https://github.com/danja/postcraft) into it.

```
cd transmissions
npm i
```

This may or may not work :

```
npm run test
```

Then if you do :

```
./trans postcraft /home/danny/github-danny/postcraft/danny.ayers.name
```

it may build a site (my blog - this is dogfooding to the max) under `public/home`

```
./trans
```

on its own should list the applications available. Most of these won't work, the code has been shapeshifting a lot.

### Status

**2024-09-02** Getting used as a serrrrriously over-engineered, feature-lacking static site builder, proof of concept is [Postcraft](https://github.com/danja/postcraft), as evinced by my [blog](https://danny.ayers.name/) (where, for now at least you will find update on this). But it mostly works as intended. Docs lagging. But now I have a documentation engine...

Documentation will be lagging behind code, be incomplete and out of date.

**2024-03-24** : a couple of simple data processing pipelines working and wired up as Jasmine e2e tests in place; started to develop actually useful pipelines for [foaf-archive](https://github.com/danja/foaf-archive) project

## Motivation

This was prompted by something of a ~~perfect storm~~ serendipitous convergence of ideas, requirements and environment.

- I had the realization that much of the software I want to write in the near future has the same basic high level **architecture** : pipeline-like, ie. a series of steps each of which transform data from one form into another ([Wikipedia](<https://en.wikipedia.org/wiki/Pipeline_(software)>)).
- **Pipelines** are approachable using concepts from Design Patterns like [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection), [Inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) etc. A key benefit of such patterns is that, because the components are loosely coupled, they can largely be developed in isolation as small standalone units before integration into a larger application.
- **Large Language Models** currently struggle with large codebases and complex architectures (mostly due to [context window](https://en.wikipedia.org/wiki/Large_language_model#Prompt_engineering,_attention_mechanism,_and_context_window) limitations). But they are very good at building small, simple, self-contained units of code.

reused in different contexts.

_I'm writing this with GitHub Copilot enabled for markdown, which can be helpful, but sometimes it goes off on one... After the first point above it offered :_

```
This is true of a blog engine, a personal knowledge management system, a chatbot, a mail archive miner, a web scraper, a data visualizer, a data importer/exporter, a data transformer, a data validator, a data filter, a data aggregator, a data splitter, a data joiner, a data normalizer, a data summarizer, a data classifier, a data indexer, a data search engine, a data storage system, a data retrieval system, a data synchronization system, a data backup system, a data migration system, a data versioning system, a data sharing system, a data access control system, a data privacy system, a data security system, a data integrity system, a data quality system, a data governance system, a data provenance system, a data lineage system, a data lifecycle system, a data archiving system, a data retention system, a data deletion system, a data recovery system, a data discovery system, a data exploration system, a data analysis system, a data visualization system, a data reporting system, a data monitoring system, a data alerting system, a data forecasting system, a data prediction system, a data recommendation system, a data personalization system, a data optimization system, a data simulation system, a data modeling system, a data inference system, a data learning system, a data reasoning system, a data decision system, a data planning system, a data execution system, a data monitoring system, a data feedback system, a data control system, a data automation system, a data orchestration system, a data integration system, a data federation system, a data interoperability system, a data exchange system, a data transformation system, a data migration system, a data synchronization system, a data replication system, a data federation system, a data virtualization system, a data streaming system, a data batch system, a data real-time system, a data near-real-time system, a data historical system, a data temporal system, a data spatial system, a data geospatial system, a data network system, a data graph system, a data tree system, a data list system, a data set system, a data table system, a data document system, a data record system, a data entity system, a data attribute system, a data value system, a data type system, a data format system, a data encoding system, a data serialization
```

_... which is a little over the top, but it's a fair list of things that might be helped by a micro-framework like this. Remarkably the first 5 are pretty much my immediate intended uses for this._

**Docs below need updating**

for later :

The [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer) uses [Components.js](https://componentsjs.readthedocs.io/en/latest/) to specify how modules and components need to be wired together at runtime. Components.js is a dependency injection framework for JavaScript applications.

## What it is

A low-level system for data processing pipelines/networks. Wherever convenient functionality will be defined declaratively with JSON-LD configuration files.

Dependency injection is used internally to allow loose coupling of components.

## What it isn't

There are several sophisticated frameworks for building interfaces between software applications and creating data processing networks. NodeRed, NoFlo etc. This is not one of them. This is much more basic and bare bones, down in the details.

See also [David Booth](https://github.com/dbooth-boston)'s [RDF Pipeline Framework](https://github.com/rdf-pipeline)

_I do eventually want to use this with NodeRed or whatever, but the entities created by transmissions will be at the level of nodes in such networks, not the network itself._

## Motivation

I'm in the process of writing yet another blog engine (Postcraft). I've also started working on a playground for interconnecting intelligent agents in an XMPP multiuser chat environment (Kia). I'm also revising a system for managing a personal knowledge base in the world of LLMs (HKMS). These all share functionality around connectivity to external data/messaging systems and internal data transformation. Might as well write this bit once only, and avoid thinking about software architecture more than I have to.

### Goals

To facilate :

- rapid development of small applications
- reuse of components in a loosely-couple environment
- versatility

### Soft Goals

- performance - low on the list
- scalability - ditto
- security - ditto
