import path from 'path'
// import { fromFile } from 'rdf-utils-fs'
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

        this.appFilename = 'app.ttl' // this

        // Application identity
        this.appName = options.appName || null
        this.appPath = options.appPath || null
        this.subtask = options.subtask || null

        // Runtime paths
        this.rootDir = options.rootDir || null
        this.workingDir = options.workingDir || null
        this.target = options.target || null


        // RDF dataset from app.ttl
        this.dataset = options.dataset || null
    }

    // async initialize(appName, appPath, subtask, target, moduleDir, flags = {}) {
    async initialize(appOptions) {
        Object.assign(this, appOptions)
        logger.reveal(appOptions)
        //    process.exit()

        this.appPath = await this.resolveApplicationPath(this.appName)

        if (this.target) {

            //  this.appFilename = path.join(target, this.appFilename)
            const appFilename = path.join(target, this.appName, this.appFilename)
            logger.debug(`AppResolver, reading : ${appFilename}`)
            const ru = new RDFUtils() // TODO refactor
            //  this.dataset = await RDFUtils.readDataset(appFilename)
            this.dataset = await ru.readDataset(appFilename)
        }
    }


    // REFACTORHERE
    async loadModel(shortName, path) {
        //   const dataset = await RDFUtils.readDataset(path)
        const ru = new RDFUtils()
        const dataset = await ru.readDataset(path)
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
        logger.debug(`   resolveApplicationPath, appName = ${appName}`)
        logger.log(`******** this.target = ${this.targetPath}`)

        const baseDir = path.join(process.cwd(), this.appsDir)

        var appPath = await this.findInDirectory(baseDir, appName)
        //|| await this.findInDirectory(this.appsDir, appName)
        if (!appPath) {
            await this.findInDirectory(this.appsDir, appName)
        }
        // if (!appPath) {
        //   await this.findInDirectory(this.moduleDir, appName)
        // }

        logger.log(`this = ${this}`)
        //  process.exit()

        if (!appPath) {
            throw new Error(`Could not find 
                appName : ${appName}
                baseDir : ${baseDir}
(check the app dir is on local path and contains at least about.md and transmissions.ttl)`)
        }
        logger.debug(`   appPath = ${appPath}`)
        //   process.exit()
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
        if (this.target) {
            this.workingDir = this.target
        }
        if (!this.workingDir) {
            this.workingDir = path.join(this.appPath, this.dataSubDir)
        }
        return this.workingDir
    }

    toMessage() {
        // TODO tidy this up
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

    toString() {
        return `\n*** AppResolver ***
   this =  \n     ${JSON.stringify(this).replaceAll(',', ',\n      ')}`
    }
}
export default AppResolver