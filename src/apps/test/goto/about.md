`src/apps/test/goto.md`

# GOTO Test App `about.md`

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans goto
```

## Description

This app is a test of `src/processors/flow/GOTO.js`

The purpose of the GOTO processor is to trigger running of another transmission, which is identified in a settings property and will already have had an instance created from its definition in its caller's transmission, in this case src/apps/test/goto/transmissions.ttl

a method will be called in GOTO, probably in its ProcessorImpl superclass which will cause the transmission found in the property `ns.trn.gotoTarget` to be run with the current message passed in.

Coordination of this is probably best done via src/engine/AppManager.js
