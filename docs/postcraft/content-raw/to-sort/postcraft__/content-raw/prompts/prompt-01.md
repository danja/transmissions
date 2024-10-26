# Transmissions Prompt 01

Transmissions is a pipeline runner which applies a series of processes to an object `message`. Each process is defined an a class with a single method `execute(message)`. In the present system the pipeline is defined declaratively and an engine is used to instantiate the processor classes and connect them together by means of event listeners. At run time the object is sent to the first processor which does its operation and passes the message to the next processor in the pipeline with `emit()`.
To simplify testing I'm trying to make hardcoded pipeline runners that isolate the processors from the pipeline engine. To do this I've started by added a return value to the processor's `execute()` method. Here is an example.

```javascript
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class NOP extends Processor {

    constructor(config) {
        super(config);
    }

    async process(message) {
      this.emit('message', message)
      return message
    }
}
export default NOP
```

The simple runner for this is :

```javascript
// nop-runner.js
import NOP from '../../processors/util/NOP.js'

const config = {}

const nop = new NOP(config)

var message = { 'value': '42' }

message = await nop.process(message)

console.log('value = ' + message.value)
```

But my problem now is that some of the processors are designed to emit a series of processed messages to be handled independently in the follow parts of the pipeline, which in effect becomes a tree of operations.

Here is an example of such a processor :

```javascript
// Fork.js
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class Fork extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {
        var nForks = 2
        if (message.nForks) {
            nForks = message.nForks
        }

        for (let i = 0; i < nForks; i++) {
            var messageClone = structuredClone(message)
            messageClone.forkN = i
            this.emit('message', message)
        }

        message.done = true // one extra to flag completion

        this.emit('message', message)
    }
}

export default Fork
```

Can you suggest a way of making a simple runner in the style of `nop-runner.js` but which handles the case of multiple outputs. It must be general-purpose and require only minimal, non-breaking changes to existing code. All processors share a common superclass `Process` which would be suitable for adding any facilities to all processors. Note that some of the processor's internal processing rely on the values in `config` as well as the incoming message.  
