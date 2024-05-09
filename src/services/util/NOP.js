import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class NOP extends Service {

    async execute(data, context) {
        this.emit('message', data, context)
    }

    double(string) {
        return string + string
    }
    //
}

export default NOP
