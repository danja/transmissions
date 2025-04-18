import path from 'path'
import { fromFile } from 'rdf-utils-fs'
import fs from 'fs/promises'
import rdf from 'rdf-ext'
import logger from '../utils/Logger.js'
import RDFUtils from '../utils/RDFUtils.js'
import Model from '../model/Model.js'

class AppResolver {
    constructor(options = {}) {
        // Core paths
        this.appsDir = 'src/applications'
        this.transmissionFilename = 'transmissions.ttl'
        this.configFilename = 'config.ttl'
        this.moduleSubDir = 'processors'
        this.dataSubDir = 'data'
        this.manifestFilename = 'manifest.ttl' // TODO deprecate in favour of
        this.appFilename = 'app.ttl' // this

        // Application identity
        this.appName = options.appName || null
        this.appPath = options.appPath || null
        this.subtask = options.subtask || null

        // Runtime paths
        this.rootDir = options.rootDir || null
        this.workingDir = options.workingDir || null
        this.targetPath = options.targetPath || null

        // RDF dataset from manifest
        this.dataset = options.dataset || null
    }

    async initialize(appName, appPath, subtask, target, flags = {}) {
        logger.debug(`AppResolver.initialize,
            appName : ${appName}
            appPath : ${appPath}
            subtask : ${subtask}
            target : ${target}`)

        this.appName = appName
        this.appPath = await this.resolveApplicationPath(appName)
        this.subtask = subtask
        this.targetPath = target



        if (target) {
            this.appFilename = path.join(target, this.appFilename)
            this.manifestFilename = path.join(target, this.manifestFilename) // TODO deprecate

            //   logger.debug(`AppResolver, found manifest : ${this.manifestFilename}`)
            try {
                logger.debug(`AppResolver, trying : ${this.appFilename}`)
                this.dataset = await RDFUtils.readDataset(this.appFilename)

                logger.debug(`Loaded.`)
            } catch (e) {
                try {
                    // TODO deprecate
                    logger.debug(`AppResolver, trying : ${this.manifestFilename}`)
                    this.dataset = await RDFUtils.readDataset(this.manifestFilename)

                    logger.debug(`Loaded.`)
                } catch (e) {

                }
            }
        }
        if (!this.dataset) {
            logger.debug(`AppResolver, falling back to empty dataset`)
            this.dataset = rdf.dataset()
        }
        this.dataset.kind = 'app'
    }

    // REFACTORHERE
    async loadModel(shortName, path) {
        const dataset = await RDFUtils.readDataset(path)
        const model = new Model(shortName, dataset)
        return model
    }


    async findInDirectory(dir, targetName, depth = 0) {
        if (depth > 3) return null

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true })

            for (const entry of entries) {
                if (!entry.isDirectory()) continue

                const fullPath = path.join(dir, entry.name)

                // Check if this directory matches
                if (entry.name === targetName) {
                    const transmissionsFile = path.join(fullPath, this.transmissionFilename)
                    try {
                        await fs.access(transmissionsFile)
                        return fullPath
                    } catch {
                        // Has matching name but no transmissions.ttl
                    }
                }

                // Recurse into subdirectories
                const found = await this.findInDirectory(fullPath, targetName, depth + 1)
                if (found) return found
            }
        } catch (err) {
            logger.debug(`Error scanning directory ${dir}: ${err.message}`)
        }

        return null
    }

    async resolveApplicationPath(appName) {
        if (!appName) {
            throw new Error('Application name is required')
        }

        const baseDir = path.join(process.cwd(), this.appsDir)
        const appPath = await this.findInDirectory(baseDir, appName)

        if (!appPath) {
            throw new Error(`Could not find application ${appName}
(check the app dir is on local path and contains at least about.md and transmissions.ttl)`)
        }

        return appPath
    }

    getTransmissionsPath() {
        return path.join(this.appPath, this.transmissionFilename)
    }

    getConfigPath() {
        return path.join(this.appPath, this.configFilename)
    }

    getModulePath() {
        logger.debug(`AppResolver.getModulePath
    this.appPath : ${this.appPath}
    this.moduleSubDir : ${this.moduleSubDir}`)
        return path.join(this.appPath, this.moduleSubDir)
    }

    resolveDataDir() {
        if (this.targetPath) {
            this.workingDir = this.targetPath
        }
        if (!this.workingDir) {
            this.workingDir = path.join(this.appPath, this.dataSubDir)
        }
        return this.workingDir
    }

    toMessage() {
        return {
            appName: this.appName,
            appPath: this.appPath,
            subtask: this.subtask,
            rootDir: this.rootDir || this.appPath,
            workingDir: this.resolveDataDir(),
            targetPath: this.targetPath,
            dataset: this.dataset
        }
    }
}

export default AppResolver