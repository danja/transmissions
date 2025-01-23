import Processor from '../../base/Processor.js'

class StringSource extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {
        console.log("message = " + message)
        console.log("data = " + data)
        return this.emit('message', message)
    }
}

export default StringSource




