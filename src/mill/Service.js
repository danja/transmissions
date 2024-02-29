class Service {
    constructor(config) {
        //   this.type = type;
        this.config = config
    }

    async execute(data) {
        throw new Error('execute method not implemented');
    }
}

export default Service 