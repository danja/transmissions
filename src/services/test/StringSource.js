import SourceService from '../base/SourceService.js'

class StringSource extends SourceService {

    async execute(data) {
        this.emit('data', data)
    }
}

export default StringSource




