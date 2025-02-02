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

        await fs.writeFile(path.join(testAppRoot, 'about.md'), '# Test App')
    }

    async function cleanupTestFiles() {
        try {
            await fs.rm(testAppRoot, { recursive: true, force: true })
        } catch (err) {
            if (err.code !== 'ENOENT') throw err
        }
    }

    describe('message processing', () => {
        it('should propagate application context in messages', async () => {
            await manager.initialize('test_app_manager', testAppRoot, null, testTarget)

            const testMessage = { test: 'value' }
            const result = await manager.start(testMessage)

            expect(result).to.have.property('success', true)
            expect(testMessage).to.have.property('appName', 'test_app_manager')
            expect(testMessage).to.have.property('appPath', testAppRoot)
            expect(testMessage).to.have.property('targetPath', testTarget)
            expect(testMessage).to.have.property('dataDir').that.includes('data')
        })
    })
})