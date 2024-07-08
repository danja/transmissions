import SourceService from '../base/SourceService.js'

class StringSource extends SourceService {

    constructor(config) {
        super(config)
    }

    async execute(message) {
        console.log("message = " + message)
        console.log("data = " + data)
        this.emit('message', message)
    }
}

export default StringSource




