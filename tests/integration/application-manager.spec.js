import { expect } from 'chai'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import ApplicationManager from '../../src/engine/ApplicationManager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('ApplicationManager Integration', () => {
    let manager
    const testAppRoot = path.join(__dirname, '../../src/applications/test_app_manager')
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

        await fs.writeFile(path.join(testAppRoot, 'about.md'), '# Test App')
        await fs.writeFile(path.join(testAppRoot, 'transmissions.ttl'), `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix : <http://purl.org/stuff/transmissions/> .
:test a :Transmission ;
    :pipe (:p10) .
:p10 a :NOP .`)
        await fs.writeFile(path.join(testAppRoot, 'config.ttl'), `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix : <http://purl.org/stuff/transmissions/> .
:config a :ConfigSet .`)
    }

    async function cleanupTestFiles() {
        try {
            await fs.rm(testAppRoot, { recursive: true, force: true })
        } catch (err) {
            if (err.code !== 'ENOENT') throw err
        }
    }

    describe('initialization', () => {
        it('should initialize with valid application path', async () => {
            const appName = 'test_app_manager'
            await manager.initialize(appName, testAppRoot, null, testTarget)
            
            expect(manager.app.appName).to.equal(appName)
            expect(manager.app.appPath).to.equal(testAppRoot)
            expect(manager.app.targetPath).to.equal(testTarget)
            expect(manager.moduleLoader).to.not.be.null
        })

        it('should initialize in test mode', async () => {
            const result = await manager.initialize('test_app', null, null, null, { test: true })
            expect(result.constructor.name).to.equal('MockApplicationManager')
        })

        it('should handle missing target directory', async () => {
            const invalidTarget = path.join(testAppRoot, 'nonexistent')
            await manager.initialize('test_app_manager', testAppRoot, null, invalidTarget)
            
            expect(manager.app.dataset).to.not.be.null
            expect(manager.app.dataset.size).to.equal(0)
        })
    })

    describe('application listing', () => {
        it('should list valid applications', async () => {
            const apps = await manager.listApplications()
            expect(apps).to.be.an('array')
            expect(apps).to.include('test_app_manager')
        })

        it('should exclude invalid directories', async () => {
            await fs.mkdir(path.join(manager.app.appsDir, 'invalid_app'), { recursive: true })
            const apps = await manager.listApplications()
            expect(apps).to.not.include('invalid_app')
        })
    })

    describe('message processing', () => {
        it('should propagate application context in messages', async () => {
            await manager.initialize('test_app_manager', testAppRoot, null, testTarget)
            
            const testMessage = { test: 'value' }
            const result = await manager.start(testMessage)
            
            expect(result.success).to.be.true
            expect(testMessage.appName).to.equal('test_app_manager')
            expect(testMessage.appPath).to.equal(testAppRoot)
            expect(testMessage.targetPath).to.equal(testTarget)
            expect(testMessage.dataDir).to.include('data')
        })

        it('should handle subtask filtering', async () => {
            await manager.initialize('test_app_manager', testAppRoot, 'specific_task', testTarget)
            const result = await manager.start({})
            expect(result.success).to.be.true
        })
    })

    describe('error handling', () => {
        it('should handle missing transmissions file', async () => {
            await fs.unlink(path.join(testAppRoot, 'transmissions.ttl'))
            await manager.initialize('test_app_manager', testAppRoot, null, testTarget)
            
            try {
                await manager.start({})
                expect.fail('Should have thrown error')
            } catch (err) {
                expect(err.message).to.include('ENOENT')
            }
        })

        it('should handle invalid RDF in config', async () => {
            await fs.writeFile(path.join(testAppRoot, 'config.ttl'), 'invalid ttl content')
            await manager.initialize('test_app_manager', testAppRoot, null, testTarget)
            
            try {
                await manager.start({})
                expect.fail('Should have thrown error')
            } catch (err) {
                expect(err).to.exist
            }
        })
    })
})
