import { EventEmitter } from 'events'

class Connector extends EventEmitter {


    constructor(fromName, toName) {
        super();
        this.fromName = fromName
        this.toName = toName
    }

    connect(services) {
        let fromService = services[this.fromName]
        let toService = services[this.toName]

        console.log('Connecting from:', this.fromName, 'to:', this.toName)

        fromService.on('data', (data) => {
            toService.execute(data);
        })
    }


}

export default Connector