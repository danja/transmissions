// run.js

// Option 1: Using the file handler (backward compatible)
import { processFiles } from './fileHandler.js';
await processFiles();

// Option 2: Using the JsonRestructurer directly
import { JsonRestructurer } from './JsonRestructurer.js';

// Example direct usage:
/*
const mappings = {
    "mappings": [
        {
            "pre": "A",
            "post": "U"
        }
    ]
};
const inputData = {
    "A": "zero"
};

const restructurer = new JsonRestructurer(mappings);
const result = restructurer.restructure(inputData);
console.log(result);  // { "U": "zero" }
*/