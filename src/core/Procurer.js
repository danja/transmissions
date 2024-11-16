class Procurer {
    constructor() {
        this.moduleLoader = ModuleLoaderFactory.createModuleLoader()
    }

    async loadResources(application, args) {
        const config = await this.loadConfig(args.configPath)
        const manifest = await this.loadManifest(args.target)
        application.config = config
        application.manifest = manifest
    }
}

export default Procurer