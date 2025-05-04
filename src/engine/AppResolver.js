import path from 'path'
// import { fromFile } from 'rdf-utils-fs'
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

        this.appFilename = 'tt.ttl' // this

        // Application identity
        this.appName = options.appName || null
        this.appPath = options.appPath || null
        this.subtask = options.subtask || null

        // Runtime paths
        this.rootDir = options.rootDir || null
        this.workingDir = options.workingDir || null
        this.targetBaseDir = options.targetBaseDir || null // TODO targetBaseDir???


        // RDF dataset from tt.ttl
        this.targetDataset = options.targetDataset || null
    }



    // REFACTORHERE
    async loadDataset(shortName, path) {
        logger.debug(`${shortName}, ${path}`)
        //    process.exit()

        //   const dataset = await RDFUtils.readDataset(path)
        const ru = new RDFUtils()
        const dataset = await ru.readDataset(path)
        const model = new Model(shortName, dataset)
        return model
    }


    async findInDirectory(dir, targetName, depth = 0) {
        logger.log(`AppResolver.findInDirectory
    dir : ${dir}
    targetName : ${targetName}
    depth : ${depth}`)
        // Check if the directory exists
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

    // remove
    async resolveApplicationPath(appName) {

        logger.log(` = ${this.targetBaseDir}`)

        const baseDir = this.targetBaseDir || path.join(process.cwd(), this.appsDir)
        const filename = 'tt.ttl'
        const appPath = await this.findInDirectory(baseDir, appName)
        logger.log(`APP PATH = ${appPath}`)
        process.exit()
        //  const appPath = await this.findInDirectory(baseDir, filename)
        if (!appPath) {
            throw new Error(`Could not find 
                appName : ${appName}
                baseDir : ${baseDir}
(check the app dir is on local path and contains at least about.md and transmissions.ttl)`)
        }

        return appPath
    }

    getTransmissionsPath() {
        logger.debug(`\nAppResolver.getTransmissionsPath`)
        console.trace()
        logger.reveal(this)

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
        if (this.targetBaseDir) {
            this.workingDir = this.targetBaseDir
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
            targetBaseDir: this.targetBaseDir,
            dataset: this.targetDataset
        }
    }
}

export default AppResolver