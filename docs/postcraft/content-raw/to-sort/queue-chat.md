The services in my pipeline have this general shape:

class ProcessService extends Service {
constructor(config) {
super(config)
}

    async process(data, context) {
        this.emit('message', data, context)
    }

}

These are key parts of how the pipeline is constructed as a Transmission object :

const transmission = new Transmission()
...
for (let i = 0; i < pipenodes.length; i++) {
let node = pipenodes[i]
let serviceName = node.value
...
let service = AbstractServiceFactory.createService(serviceType, servicesConfig)
...
transmission.register(serviceName, service)
...
transmission.connect(previousName, serviceName)
previousName = serviceName
}

How do I incorporate the queue functionality as previously discussed into this?
