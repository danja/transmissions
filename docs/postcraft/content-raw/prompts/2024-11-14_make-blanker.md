Please generate a processor src/processors/json/Blanker.js that will walk an identified key in the message object and walk it recursively, replacing any string values with an empty string.
If no key is specified the whole message should be processed.
It should be runnable from the application defined in src/applications/test_blanker/transmissions.ttl and src/applications/test_blanker/processors-config.ttl
This should read the example src/applications/test_blanker/data/input/input-01.json and write src/applications/test_blanker/data/output/output-01.json with the contents as shown in src/applications/test_blanker/data/output/required-01.json
