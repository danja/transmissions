import { expect } from 'chai'
import path from 'path'
import Application from '../../src/model/Application.js'

describe('Application', () => {
    let app

    beforeEach(() => {
        app = new Application()
    })

    describe('constructor', () => {
        it('should initialize with default values', () => {
            expect(app.appsDir).to.equal('src/applications')
            expect(app.transmissionFilename).to.equal('transmissions.ttl')
            expect(app.configFilename).to.equal('config.ttl')
            expect(app.appName).to.be.null
            expect(app.dataset).to.be.null
        })

        it('should accept custom options', () => {
            const customApp = new Application({
                appName: 'test-app',
                appPath: '/custom/path',
                subtask: 'custom-task'
            })
            expect(customApp.appName).to.equal('test-app')
            expect(customApp.appPath).to.equal('/custom/path')
            expect(customApp.subtask).to.equal('custom-task')
        })
    })

    describe('resolveApplicationPath', () => {
        it('should handle absolute paths', () => {
            const absolutePath = '/absolute/path/to/app'
            expect(app.resolveApplicationPath(absolutePath)).to.equal(absolutePath)
        })

        it('should handle relative paths', () => {
            const relativePath = '../relative/path'
            const expected = path.resolve(process.cwd(), relativePath)
            expect(app.resolveApplicationPath(relativePath)).to.equal(expected)
        })

        it('should resolve paths under appsDir', () => {
            const appName = 'test-app'
            const expected = path.join(process.cwd(), app.appsDir, appName)
            expect(app.resolveApplicationPath(appName)).to.equal(expected)
        })

        it('should throw error for empty app name', () => {
            expect(() => app.resolveApplicationPath()).to.throw('Application name is required')
        })
    })

    describe('initialize', () => {
        it('should set up application with valid parameters', async () => {
            const appName = 'test-app'
            const appPath = '/test/path'
            const subtask = 'test-task'
            const target = '/test/target'

            await app.initialize(appName, appPath, subtask, target)

            expect(app.appName).to.equal(appName)
            expect(app.appPath).to.equal(appPath)
            expect(app.subtask).to.equal(subtask)
            expect(app.targetPath).to.equal(target)
            expect(app.manifestFilename).to.equal(path.join(target, 'manifest.ttl'))
        })
    })

    describe('toMessage', () => {
        it('should generate correct message object', () => {
            const testApp = new Application({
                appName: 'test-app',
                appPath: '/test/path',
                subtask: 'test-task',
                targetPath: '/test/target'
            })

            const message = testApp.toMessage()

            expect(message).to.have.property('appName', 'test-app')
            expect(message).to.have.property('appPath', '/test/path')
            expect(message).to.have.property('subtask', 'test-task')
            expect(message).to.have.property('targetPath', '/test/target')
            expect(message).to.have.property('dataDir').that.includes('data')
            expect(message).to.have.property('dataset')
        })
    })
})
