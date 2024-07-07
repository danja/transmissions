import SourceService from '../base/SourceService.js'

class StringSource extends SourceService {

    constructor(config) {
        super(config)
    }

    async execute(context) {
        console.log("context = " + context)
        console.log("data = " + data)
        this.emit('message', context)
    }
}

export default StringSource




