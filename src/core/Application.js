class Application {
    constructor() {
        this.transmissions = new Map()
        this.config = null
        this.manifest = null
    }

    addTransmission(id, transmission) {
        this.transmissions.set(id, transmission)
    }
}