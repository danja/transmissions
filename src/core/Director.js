class Director {
    constructor() {
        this.builder = new TransmissionBuilder()
        this.runner = new TransmissionRunner()
        this.procurer = new Procurer()
        this.proctor = new Proctor()
    }

    async initializeApplication(args) {
        const application = new Application()
        await this.procurer.loadResources(application, args)
        await this.builder.buildTransmissions(application)
        return application
    }

    async applyToTarget(application, target) {
        await this.runner.execute(application, target)
    }
}

export default Director