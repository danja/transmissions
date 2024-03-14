import { EventEmitter } from 'events'
import Queue from 'queue'

class Connector extends EventEmitter {

    constructor(fromName, toName) {
        super();
        this.fromName = fromName;
        this.toName = toName;
        this.queue = new Queue();
    }

    connect(services) {
        let fromService = services[this.fromName];
        let toService = services[this.toName];

        console.log('Connecting from:', this.fromName, 'to:', this.toName); // Add this line

        fromService.on('data', (data) => {
            toService.execute(data);
        });
        /*
      fromService.on('data', (data) => {
          // Add data to the queue
          this.queue.push(() => toService.execute(data));
      });

      // Start the queue
      this.queue.start();
  */
    }


}

export default Connector