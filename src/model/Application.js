import path from 'path'
import { fromFile } from 'rdf-utils-fs'
import rdf from 'rdf-ext'
import logger from '../utils/Logger.js'

class Application {
    constructor(options = {}) {
        // Core paths
        this.appsDir = 'src/applications'
        this.transmissionFilename = 'transmissions.ttl'
        this.configFilename = 'config.ttl'
        this.moduleSubDir = 'processors'
        this.dataSubDir = 'data'
        this.manifestFilename = 'manifest.ttl'

        // Application identity
        this.appName = options.appName || null
        this.appPath = options.appPath || null
        this.subtask = options.subtask || null

        // Runtime paths
        this.rootDir = options.rootDir || null
        this.dataDir = options.dataDir || null
        this.targetPath = options.targetPath || null

        // RDF dataset from manifest
        this.dataset = options.dataset || null
    }

    async initialize(appName, appPath, subtask, target, flags = {}) {
        logger.debug(`Application.initialize,
            appName : ${appName}
            appPath : ${appPath}
            subtask : ${subtask}
            target : ${target}`)
        this.appName = appName
        this.appPath = this.resolveApplicationPath(appPath)
        // this.appPath = appPath
        //this.resolveApplicationPath(appName)
        this.subtask = subtask
        this.targetPath = target

        if (target) {
            this.manifestFilename = path.join(target, this.manifestFilename)
            await this.loadManifest()
        }

        return this
    }

    //////////////////// not used
    resolveApplicationPath(appName) {
        if (!appName) {
            throw new Error('Application name is required')
        }

        if (appName.startsWith('/')) {
            return appName
        }

        if (appName.startsWith('..')) {
            return path.resolve(process.cwd(), appName)
        }

        return path.join(process.cwd(), this.appsDir, appName)
    }

    async loadManifest() {
        try {
            logger.debug(`Application.loadManifest, loading: ${this.manifestFilename}`)
            const stream = fromFile(this.manifestFilename)
            this.dataset = await rdf.dataset().import(stream)
            return this.dataset
        } catch (err) {
            logger.debug(`Application.loadManifest, ${this.manifestFilename} not found, creating empty dataset`)
            this.dataset = rdf.dataset()
            return this.dataset
        }
    }

    getTransmissionsPath() {
        return path.join(this.appPath, this.transmissionFilename)
    }

    getConfigPath() {
        return path.join(this.appPath, this.configFilename)
    }

    getModulePath() {
        logger.debug(`Application.getModulePath,\nthis.appPath : ${this.appPath}\nthis.moduleSubDir : ${this.moduleSubDir}`)
        return path.join(this.appPath, this.moduleSubDir)
    }

    resolveDataDir() {
        if (!this.dataDir) {
            this.dataDir = path.join(this.appPath, this.dataSubDir)
        }
        return this.dataDir
    }

    toMessage() {
        return {
            appName: this.appName,
            appPath: this.appPath,
            subtask: this.subtask,
            rootDir: this.rootDir || this.appPath,
            dataDir: this.resolveDataDir(),
            targetPath: this.targetPath,
            dataset: this.dataset
        }
    }
}

export default Application