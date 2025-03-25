import path from 'path'
import { fromFile } from 'rdf-utils-fs'
import fs from 'fs/promises'
import rdf from 'rdf-ext'
import logger from '../utils/Logger.js'
import RDFUtils from '../utils/RDFUtils.js'

class AppResolver {
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
            this.manifestFilename = path.join(target, this.manifestFilename)
            logger.debug(`AppResolver, found manifest : ${this.manifestFilename}`)
            try {
                this.dataset = await RDFUtils.readDataset(this.manifestFilename)
            } catch (e) {
                this.dataset = rdf.dataset()
            }
        }
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
            throw new Error(`Could not find application ${appName} with transmissions.ttl in any subdirectory`)
        }

        return appPath
    }

    /*
    async loadManifest() {
        try {
            logger.debug(`AppResolver.loadManifest, loading: ${this.manifestFilename}`)
            const stream = fromFile(this.manifestFilename)
            this.dataset = await rdf.dataset().import(stream)
            return this.dataset
        } catch (err) {
            logger.debug(`AppResolver.loadManifest, ${this.manifestFilename} not found, creating empty dataset`)
            this.dataset = rdf.dataset()
            return this.dataset
        }
    }
*/
    getTransmissionsPath() {
        return path.join(this.appPath, this.transmissionFilename)
    }

    getConfigPath() {
        return path.join(this.appPath, this.configFilename)
    }

    getModulePath() {
        logger.debug(`AppResolver.getModulePath,\nthis.appPath : ${this.appPath}\nthis.moduleSubDir : ${this.moduleSubDir}`)
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

export default AppResolver