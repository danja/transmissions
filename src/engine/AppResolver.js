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