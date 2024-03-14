import SourceService from '../../mill/SourceService.js';

class StringSource extends SourceService {

    async execute(data) {
        this.emit('data', data)
    }
}

export default StringSource




