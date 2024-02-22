class Service {
    constructor(type) {
        this.type = type;
    }

    async execute(data, config) {
        throw new Error('execute method not implemented');
    }
}
