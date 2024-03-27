import SourceService from '../base/SourceService.js'

class StringSource extends SourceService {

    async execute(data, context) {
        console.log("context = " + context)
        console.log("data = " + data)
        this.emit('data', data, context)
    }
}

export default StringSource




