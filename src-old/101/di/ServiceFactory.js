
export class ServiceFactory {
    static createService(type, config) {

        if (type === 'SomeService') {
            return new SomeService(config);
        }
        return null;

    }
}