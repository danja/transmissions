I would like to document my code by means of 'signatures', which will describe processors and applications using consistent conventions that will be both human and machine-readable. I tried putting these inside the code as comments, as in the example below, but these started getting too messy. So now for every processor or application, I would like to create a pair of files containing the signature in markdown and RDF Turtle formats.
Please read the example below and create samples for both formats I can use as a template. For the RDF version, please use terms from existing vocabularies where appropriate, especially rpp in your project knowledge. 

```javascript
/*
* ###  JSONWalker Signature
*
* Implementation src/processors/json/JSONWalker.js
* Description
* #### ***Config Properties***
* ***`ns.trm.targetDir`** - Target directory path relative to current working directory
*
* #### ***Input***
* ***`message.payload`** - JSON object to process
*
* #### ***Output***
* * Emits a message for each item in the input payload
* * Final message has `done: true` flag
* * Each emitted message contains:
*   * ***`message.item`** - Current item being processed
*   * ***`message.payload`** - Empty object (configurable)
*
* #### ***Behavior***
* * Validates input is a JSON object
* * Creates separate message for each value in payload
* * Clones messages to prevent cross-contamination
* * Signals completion with done flag
*
* #### *** Tests and Example Usage **
tests/unit/NOP.spec.js
tests/integration/fs-rw_simple.spec.js
tests/integration/fs-rw.spec.js

*/
```
