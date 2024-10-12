# Conditional processor module for Transmissions

Your Goal is to write a processor module for Transmissions that will initiate multiple processing pipelines based on a list provided in the incoming message. First review these instructions as a whole, and then identify the subgoals. Then, taking each subgoal in turn, break it down into a concrete series of tasks. Carry out the sequence of tasks.  
You have plenty of time, so don't rush, try to be as careful in understanding and operation as possible.
Existing source code may be found in the Project Knowledge files.

Two modules are required -

1. `Conditional` located in :
```sh
./transmissions/src/processors/flow/Conditional.js
```
modeled on :
```sh
./transmissions/src/processors/templates/ProcessorTemplate.js
```

The input message will be in the form of this example :
```json
{
  "data" : {
    "person":{
      "name" : "Steve",
      "female": "false",  
      "properties" : {
        "height": "100",
        "width":"50"
    }
  }
  }
  "conditions" :
  [
    {
      "label": "label2",
      "type": "boolean",
      "pointer": "data.person.female"
    },
    {
      "label": "label1",
      "type": "match",
      "pointer": "data.name",
      "test":   {    
        "properties" : {
            "height": "100",
            "width":"50"
          }
        }
    }
  ]
}
```

The `data` block is arbitrary, could be any shape, dependent on previous Processors.
The `conditional` block is used by the `Conditional` processor to examine the message as a whole and extract a boolean value.
Here there are two types of conditional test, others may be added later so structure the code for easy extension.
In both cases `label` will be a simple string which may be used in debugging.
`pointer` will locate a position in the data tree following standard Javascript style referencing.
The `boolean` type of test will simply check for a true/false value at the given pointer.
The `match` type of test will compare the values within its `test` structure against the message. Only the keys and values defined in `test` will be checked, everything else is ignored. `true` is the default, but there is an mismatch, the value `true` is produced.

 The results of individual condition will be combined using an operator which will be supplied in the `config.operator` value of the instance of `Condition`. It will default to logical `or`.

The resultant behavior will be to emit the input message to subsequent processors using existing engine infrastructure, similar in operation to :
```sh
transmissions/src/processors/util/Fork.js
```

Each message emitted will be a structuredClone of the input message.  

Once this code is completed, create application definitions in the form of these examples :
```sh
transmissions/src/applications/test_conditional/transmissions.ttl
transmissions/src/applications/test_conditional/processors-config.ttl
```

Then create `transmissions/src/simples/conditional.js` following the shape of the example in `transmissions/src/simples/env-loader/env-loader.js`.

After you have finished all these, re-read the high level Goal and taking each of your derived subgoals in turn, review your code to ensure that it fulfils the requirements.
Show me the full source of the implementations.

---

/home/danny/github-danny/postcraft/danny.ayers.name/content-raw/entries/2024-09-27_lively-distractions.md

https://github.com/github/rest-api-description
