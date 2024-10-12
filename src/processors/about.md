# Creating a new Processor

- update repopacks for `transmissions` and `trans-apps`
- create a new chat session in existing Project
- upload repopacks to Claude, with anything else that might be relevant (handover from previous session?)
- follow the prompt model as in `/home/danny/workspaces_hkms-desktop/postcrafts-raw/transmissions/prompts/github-list.md`
- remember additions to `xProcessorsFactory.js` and `transmissions/src/engine/AbstractProcessorFactory.js`

#:todo add comment creation
#:todo check simples & application suitability
#:todo create document creation workflow
#:todo create manifest.ttl creation
#:todo make crossrefs.md, crossrefs.ttl
#:todo create manifest.ttl consumption
#:todo add test creation
#:todo wire to an API, include file creation ops
#:todo add support in #:hyperdata-desktop

#:todo dedicated transmissions model, fine-tuned on relevant docs

#:todo extract todos as something like :

```turtle
<http://hyperdata.it/transmissions/src/processors/about/nid123> a pv:ToDoItem ;
dc:source <http://hyperdata.it/transmissions/src/processors/about.md> ;
pv:semtag "#:todo" ;
dc:line "3" ;
dc:title "tbd" ;
dc:content "extract todos as something like :" .
```
