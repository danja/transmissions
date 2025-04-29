import path from 'path'
import fs from 'fs/promises'
import rdf from 'rdf-ext'
import AppResolver from '../../src/engine/AppResolver.js'
import RDFUtils from '../../src/utils/RDFUtils.js'
import logger from '../../src/utils/Logger.js'
import Model from '../../src/model/Model.js'

describe('AppResolver', () => {
    let resolver

    beforeEach(() => {
        // Initialize with default options
        resolver = new AppResolver()

        // Spy on logger methods
        spyOn(logger, 'debug').and.callThrough()
        spyOn(logger, 'error').and.callThrough()
    })

    describe('#constructor', () => {
        it('should initialize with default paths', () => {
            expect(resolver.appsDir).toBe('src/applications')
            expect(resolver.transmissionFilename).toBe('transmissions.ttl')
            expect(resolver.configFilename).toBe('config.ttl')
            expect(resolver.appName).toBeNull()
            expect(resolver.appPath).toBeNull()
            expect(resolver.subtask).toBeNull()
            expect(resolver.dataset).toBeNull()
        })

        it('should accept custom options', () => {
            const customOptions = {
                appName: 'test-app',
                appPath: '/custom/path',
                subtask: 'subtask1',
                rootDir: '/root/dir',
                dataset: rdf.dataset()
            }

            resolver = new AppResolver(customOptions)

            expect(resolver.appName).toBe('test-app')
            expect(resolver.appPath).toBe('/custom/path')
            expect(resolver.subtask).toBe('subtask1')
            expect(resolver.rootDir).toBe('/root/dir')
            expect(resolver.dataset).toBe(customOptions.dataset)
        })
    })

    describe('#initialize', () => {
        beforeEach(() => {
            // Mock resolveApplicationPath
            spyOn(resolver, 'resolveApplicationPath').and.resolveTo('/resolved/app/path')

            // Mock RDFUtils.readDataset
            spyOn(RDFUtils, 'readDataset').and.resolveTo(rdf.dataset())
        })

        it('should initialize app settings with correct values', async () => {
            await resolver.initialize('test-app', 'app-path', 'subtask', '/target/path')

            expect(resolver.appName).toBe('test-app')
            expect(resolver.appPath).toBe('/resolved/app/path')
            expect(resolver.subtask).toBe('subtask')
            expect(resolver.targetPath).toBe('/target/path')

            // Should have attempted to read the app.ttl file
            expect(RDFUtils.readDataset).toHaveBeenCalledWith('/target/path/app.ttl')
        })

        it('should not attempt to read app.ttl if no target is provided', async () => {
            await resolver.initialize('test-app', 'app-path', 'subtask', null)

            expect(resolver.appName).toBe('test-app')
            expect(resolver.appPath).toBe('/resolved/app/path')
            expect(resolver.subtask).toBe('subtask')
            expect(resolver.targetPath).toBeNull()

            // Should not have attempted to read any RDF file
            expect(RDFUtils.readDataset).not.toHaveBeenCalled()
        })
    })

    describe('#loadModel', () => {
        it('should use RDFUtils to load a model', async () => {
            // Mock RDFUtils.readDataset
            const mockDataset = rdf.dataset()
            spyOn(RDFUtils, 'readDataset').and.resolveTo(mockDataset)

            const model = await resolver.loadModel('config', '/path/to/config.ttl')

            expect(RDFUtils.readDataset).toHaveBeenCalledWith('/path/to/config.ttl')
            expect(model).toBeInstanceOf(Model)
            expect(model.dataset).toBe(mockDataset)
        })
    })

    /*
    describe('#findInDirectory', () => {
        it('should recursively search for an application directory', async () => {
            // Mock fs.readdir
            const mockEntries = [
                { name: 'dir1', isDirectory: () => true },
                { name: 'file1', isDirectory: () => false },
                { name: 'target-app', isDirectory: () => true }
            ]
            
            spyOn(fs, 'readdir').and.resolveTo(mockEntries)
            
            // Mock fs.access to succeed for the target app's transmissions file
            spyOn(fs, 'access').and.callFake((filePath) => {
                if (filePath.includes('target-app/transmissions.ttl')) {
                    return Promise.resolve()
                }
                return Promise.reject(new Error('File not found'))
            })
            
            const result = await resolver.findInDirectory('/base/dir', 'target-app', 0)
            
            expect(result).toBe('/base/dir/target-app')
            expect(fs.readdir).toHaveBeenCalledWith('/base/dir', { withFileTypes: true })
            expect(fs.access).toHaveBeenCalledWith('/base/dir/target-app/transmissions.ttl')
        })
        
        it('should limit search depth', async () => {
            // Set up recursion test
            spyOn(fs, 'readdir').and.resolveTo([
                { name: 'nested', isDirectory: () => true }
            ])
            
            spyOn(fs, 'access').and.rejectWith(new Error('File not found'))
            
            const result = await resolver.findInDirectory('/base/dir', 'target-app', 3)
            
            // Should return null when max depth is reached
            expect(result).toBeNull()
        })
    })
    */
    describe('#resolveApplicationPath', () => {
        beforeEach(() => {
            spyOn(resolver, 'findInDirectory').and.resolveTo('/found/app/path')
        })

        it('should throw if no app name is provided', async () => {
            await expectAsync(resolver.resolveApplicationPath())
                .toBeRejectedWithError('Application name is required')
        })

        it('should call findInDirectory with correct paths', async () => {
            // Mock process.cwd
            spyOn(process, 'cwd').and.returnValue('/current/dir')

            const result = await resolver.resolveApplicationPath('test-app')

            expect(result).toBe('/found/app/path')
            expect(resolver.findInDirectory).toHaveBeenCalledWith('/current/dir/src/applications', 'test-app')
        })

        it('should throw if application cannot be found', async () => {
            // Make findInDirectory return null
            resolver.findInDirectory.and.resolveTo(null)

            await expectAsync(resolver.resolveApplicationPath('nonexistent-app'))
                .toBeRejectedWithError(/Could not find application/)
        })
    })

    describe('path utilities', () => {
        it('should return the correct transmissions path', () => {
            resolver.appPath = '/app/path'
            expect(resolver.getTransmissionsPath()).toBe('/app/path/transmissions.ttl')
        })

        it('should return the correct config path', () => {
            resolver.appPath = '/app/path'
            expect(resolver.getConfigPath()).toBe('/app/path/config.ttl')
        })

        it('should return the correct module path', () => {
            resolver.appPath = '/app/path'
            resolver.moduleSubDir = 'processors'
            expect(resolver.getModulePath()).toBe('/app/path/processors')
        })
    })

    describe('#resolveDataDir', () => {
        it('should use targetPath when available', () => {
            resolver.targetPath = '/target/path'
            expect(resolver.resolveDataDir()).toBe('/target/path')
            expect(resolver.workingDir).toBe('/target/path')
        })

        it('should fall back to appPath/dataSubDir when no targetPath', () => {
            resolver.appPath = '/app/path'
            resolver.dataSubDir = 'data'
            expect(resolver.resolveDataDir()).toBe('/app/path/data')
            expect(resolver.workingDir).toBe('/app/path/data')
        })
    })

    describe('#toMessage', () => {
        it('should return a correctly structured message object', () => {
            resolver.appName = 'test-app'
            resolver.appPath = '/app/path'
            resolver.subtask = 'subtask'
            resolver.rootDir = '/root/dir'
            resolver.targetPath = '/target/path'
            resolver.dataset = rdf.dataset()

            // Mock resolveDataDir
            spyOn(resolver, 'resolveDataDir').and.returnValue('/working/dir')

            const message = resolver.toMessage()

            expect(message.appName).toBe('test-app')
            expect(message.appPath).toBe('/app/path')
            expect(message.subtask).toBe('subtask')
            expect(message.rootDir).toBe('/root/dir')
            expect(message.workingDir).toBe('/working/dir')
            expect(message.targetPath).toBe('/target/path')
            expect(message.dataset).toBe(resolver.dataset)
        })

        it('should use appPath as rootDir if rootDir is not set', () => {
            resolver.appName = 'test-app'
            resolver.appPath = '/app/path'

            // Mock resolveDataDir
            spyOn(resolver, 'resolveDataDir').and.returnValue('/working/dir')

            const message = resolver.toMessage()

            expect(message.rootDir).toBe('/app/path')
        })
    })
})
