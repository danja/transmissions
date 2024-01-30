# Treadmill

A micro-framework to simplify construction of small data processing applications in JavaScript.

![Treadmill](https://github.com/danja/treadmill/blob/main/docs/images/treadmill.jpg)

### Status

2024-01-30 : roughed out, not yet working

## What it is

A low-level system for data processing pipelines/networks. Wherever convenient functionality will be defined declaratively with JSON-LD configuration files.

Dependency injection is used internally to allow loose coupling of components.

## What it isn't

There are several sophisticated frameworks for building interfaces between software applications and creating data processing networks. NodeRed, NoFlo etc. This is not one of them. This is much more basic and bare bones, down in the details.

See also [David Booth](https://github.com/dbooth-boston)'s [RDF Pipeline Framework](https://github.com/rdf-pipeline)

_I do eventually want to use this with NodeRed or whatever, but the entities created by Treadmill will be at the level of nodes in such networks, not the network itself._

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
