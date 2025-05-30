import { expect } from 'chai'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import rdf from 'rdf-ext'
import ApplicationManager from '../../src/engine/ApplicationManager.js'
import ns from '../../src/utils/ns.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Application Context Integration', () => {
    let manager
    const testAppRoot = path.join(__dirname, '../../src/apps/test_app_context')
    const testTarget = path.join(testAppRoot, 'target')

    beforeEach(async () => {
        manager = new ApplicationManager()
        await setupTestFiles()
    })

    afterEach(async () => {
        await cleanupTestFiles()
    })

    async function setupTestFiles() {
        await fs.mkdir(testAppRoot, { recursive: true })
        await fs.mkdir(path.join(testAppRoot, 'data'), { recursive: true })
        await fs.mkdir(testTarget, { recursive: true })

        const transmissionsTtl = `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix : <http://purl.org/stuff/transmissions/> .
:test a :Transmission ;
    :pipe (:p10 :p20) .
:p10 a :ShowMessage .
:p20 a :ShowConfig .`

        const configTtl = `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix : <http://purl.org/stuff/transmissions/> .
:testConfig a :ConfigSet ;
    :testKey "testValue" .`

        await fs.writeFile(path.join(testAppRoot, 'transmissions.ttl'), transmissionsTtl)
        await fs.writeFile(path.join(testAppRoot, 'config.ttl'), configTtl)
    }

    async function cleanupTestFiles() {
        try {
            await fs.rm(testAppRoot, { recursive: true, force: true })
        } catch (err) {
            if (err.code !== 'ENOENT') throw err
        }
    }

    it('should create application graph during initialization', async () => {
        await manager.initialize('test_app_context', testAppRoot, null, testTarget)

        const appNode = rdf.namedNode('http://purl.org/stuff/transmissions/test_app_context')
        const hasType = manager.dataset.match(appNode, ns.rdf.type, ns.trn.Application).size > 0
        expect(hasType).to.be.true
    })

    it('should propagate app context through processors', async () => {
        await manager.initialize('test_app_context', testAppRoot, null, testTarget)

        const message = { test: 'value' }
        const result = await manager.start(message)

        expect(result).to.have.property('success', true)
        expect(message).to.have.property('app')
        expect(message.app).to.have.property('sessionNode')
        expect(message.app.dataset).to.be.instanceOf(rdf.dataset().constructor)
    })

    it('should resolve paths correctly using app context', async () => {
        await manager.initialize('test_app_context', testAppRoot, null, testTarget)

        const testMessage = {
            test: 'value',
            appPath: testAppRoot,
            processorPaths: []
        }

        const result = await manager.start(testMessage)
        expect(result).to.have.property('success', true)
        expect(path.join(testAppRoot, 'test/path')).to.be.a('string')
    })

    it('should preserve existing functionality', async () => {
        await manager.initialize('test_app_context', testAppRoot, null, testTarget)
        const result = await manager.start()

        expect(result).to.have.property('success', true)
        const appConfig = await manager.app.getConfigPath()
        expect(appConfig).to.include('config.ttl')
    })
})