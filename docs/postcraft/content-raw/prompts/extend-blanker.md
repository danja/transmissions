```prompt
Please add functionality to `src/processors/json/Blanker.js` such that certain specified nodes in the JSON tree won't be blanked. An example of required behaviour is in `src/applications/test_blanker`. The node is specified in `src/applications/test_blanker/config.ttl` via : `trm:preserve "content.payload.test.third"`.
When `./trans test_blanker` is run as configured, taking input as `src/applications/test_blanker/data/input/input-01.json`, it should give the output as in `src/applications/test_blanker/data/output/required-01.json`.
```
