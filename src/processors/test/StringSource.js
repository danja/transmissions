import SourceProcessor from '../base/SourceProcessor.js'

class StringSource extends SourceProcessor {

    constructor(config) {
        super(config)
    }

    async process(message) {
        console.log("message = " + message)
        console.log("data = " + data)
        this.emit('message', message)
    }
}

export default StringSource




