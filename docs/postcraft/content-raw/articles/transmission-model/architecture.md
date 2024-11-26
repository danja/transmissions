# Transmissions Architecture

**Provisional - this needs cycling through implementation**

* #:link trm.ttl - vocab
* #:link trm.md - namespace doc


Transmissions is a quasi-functional data processing framework with a hierarchical composite structure. The unit of data is the #:t:message. Messages are expressed as JSON objects, but it should be noted that eg. `message.dataset` is an RDF payload, the contents of which is open-ended.


## Message Schema

 #:todo JSON schema

 move system-level bits (currently just paths) into their own block

 `message.dataset` is a bit overloaded, need `message.manifest` as the core one

## Bits

#:note I need to find an alternative word for 'framework', it carries too much baggage. 'System' is too vague.

#:todo #:tag #:mis = 'make it so' = implement
