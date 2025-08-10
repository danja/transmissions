import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import os from 'os';
import { EventEmitter } from 'events';
import WatchTestHelper from '../../tests-support/helpers/WatchTestHelper.js';
import MockAppHelper from '../../tests-support/helpers/MockAppHelper.js';
import TimingTestHelper from '../../tests-support/helpers/TimingTestHelper.js';

// Mock dependencies
vi.mock('fs', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        watch: vi.fn(),
        existsSync: vi.fn(),
        accessSync: vi.fn(),
        mkdirSync: vi.fn(),
        constants: { X_OK: 1 }
    };
});

vi.mock('fs/promises', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        readdir: vi.fn(),
        stat: vi.fn(),
        mkdir: vi.fn().mockResolvedValue(),
        appendFile: vi.fn().mockResolvedValue()
    };
});

vi.mock('child_process', () => ({
    spawn: vi.fn()
}));

vi.mock('../../../src/api/watch/WatchConfig.js', () => ({
    default: vi.fn()
}));

vi.mock('../../../src/utils/Logger.js', () => ({
    default: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe('Watch', () => {
    let watchTestHelper;
    let mockAppHelper;
    let timingHelper;
    let Watch;
    let WatchConfig;
    let mockFs;
    let mockFsPromises;
    let mockSpawn;
    let logger;

    beforeEach(async () => {
        // Reset all mocks
        vi.clearAllMocks();

        // Import after mocks are set up
        Watch = (await import('../../../src/api/watch/Watch.js')).default;
        WatchConfig = (await import('../../../src/api/watch/WatchConfig.js')).default;
        mockFs = await import('fs');
        mockFsPromises = await import('fs/promises');
        mockSpawn = (await import('child_process')).spawn;
        logger = (await import('../../../src/utils/Logger.js')).default;

        // Setup test helpers
        watchTestHelper = new WatchTestHelper(path.join(os.tmpdir(), 'watch-tests-' + Date.now()));
        await watchTestHelper.setup();

        mockAppHelper = new MockAppHelper();
        timingHelper = new TimingTestHelper();

        // Mock trans executable exists and setup default mocks
        mockFs.existsSync.mockReturnValue(true);
        mockFs.accessSync.mockReturnValue(true);
        mockFs.mkdirSync.mockReturnValue();
        mockFsPromises.mkdir.mockResolvedValue();
        mockFsPromises.appendFile.mockResolvedValue();
        
        // Increase max listeners to avoid memory leak warnings
        process.setMaxListeners(50);
    });

    afterEach(async () => {
        timingHelper.cleanup();
        mockAppHelper.reset();
        if (watchTestHelper) {
            await watchTestHelper.cleanup();
        }
        
        // Reset max listeners back to default
        process.setMaxListeners(10);
    });

    describe('constructor', () => {
        it('should create Watch instance with default options', () => {
            const watch = new Watch();
            
            expect(watch.debounceMs).toBe(1000);
            expect(watch.excludePatterns).toHaveLength(7); // Default exclude patterns
            expect(watch.transPath).toBeDefined();
        });

        it('should create Watch instance with custom options', () => {
            const options = {
                debounceMs: 2000,
                transPath: '/custom/trans',
                excludePatterns: [/custom/]
            };

            const watch = new Watch(null, options);

            expect(watch.debounceMs).toBe(2000);
            expect(watch.transPath).toBe('/custom/trans');
            expect(watch.excludePatterns).toContain(options.excludePatterns[0]);
        });

        it('should set up watch logger', () => {
            const watch = new Watch();
            
            expect(typeof watch.logWatch).toBe('function');
            expect(watch.watchLogFile).toContain('watch.log');
        });
    });

    describe('findTransExecutable', () => {
        it('should find trans executable in default locations', () => {
            mockFs.existsSync.mockReturnValue(false);
            mockFs.accessSync.mockImplementation((path) => {
                if (path.endsWith('trans')) return true;
                throw new Error('Not executable');
            });

            const watch = new Watch();
            const transPath = watch.findTransExecutable();

            expect(transPath).toContain('trans');
        });

        it('should use fallback if trans not found', () => {
            mockFs.existsSync.mockReturnValue(false);
            mockFs.accessSync.mockImplementation(() => {
                throw new Error('Not found');
            });

            const watch = new Watch();
            const transPath = watch.findTransExecutable();

            // Should return the first fallback path that was checked
            expect(transPath).toContain('trans');
        });
    });

    describe('shouldExclude', () => {
        let watch;

        beforeEach(() => {
            watch = new Watch();
        });

        it('should exclude node_modules', () => {
            expect(watch.shouldExclude('/path/node_modules/file.js')).toBe(true);
        });

        it('should exclude .git directories', () => {
            expect(watch.shouldExclude('/path/.git/config')).toBe(true);
        });

        it('should exclude temporary files', () => {
            expect(watch.shouldExclude('/path/file.tmp')).toBe(true);
            expect(watch.shouldExclude('/path/file.swp')).toBe(true);
            expect(watch.shouldExclude('/path/file~')).toBe(true);
        });

        it('should not exclude regular files', () => {
            expect(watch.shouldExclude('/path/file.js')).toBe(false);
            expect(watch.shouldExclude('/path/document.md')).toBe(false);
        });
    });

    describe('start', () => {
        it('should start watching with valid configuration', async () => {
            const mockWatchConfig = {
                load: vi.fn().mockResolvedValue(),
                getWatchSets: vi.fn().mockReturnValue([
                    {
                        name: 'test-set',
                        dirs: ['/tmp/test'],
                        apps: ['test-app']
                    }
                ])
            };

            WatchConfig.mockImplementation(() => mockWatchConfig);

            const watch = new Watch();
            vi.spyOn(watch, 'startWatchSet').mockResolvedValue();

            await watch.start();

            expect(mockWatchConfig.load).toHaveBeenCalled();
            expect(mockWatchConfig.getWatchSets).toHaveBeenCalled();
            expect(watch.startWatchSet).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'test-set' })
            );
        });

        it('should warn if no watch sets found', async () => {
            const mockWatchConfig = {
                load: vi.fn().mockResolvedValue(),
                getWatchSets: vi.fn().mockReturnValue([])
            };

            WatchConfig.mockImplementation(() => mockWatchConfig);

            const watch = new Watch();
            await watch.start();

            expect(logger.warn).toHaveBeenCalledWith('No valid watch sets found in configuration');
        });

        it('should exit on configuration load error', async () => {
            const mockWatchConfig = {
                load: vi.fn().mockRejectedValue(new Error('Config error'))
            };

            WatchConfig.mockImplementation(() => mockWatchConfig);

            const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});

            const watch = new Watch();
            await watch.start();

            expect(mockExit).toHaveBeenCalledWith(1);
            mockExit.mockRestore();
        });
    });

    describe('watchRecursively', () => {
        it('should skip excluded directories', async () => {
            const watch = new Watch();
            const watchSet = { name: 'test-set', dirs: ['/tmp/test'], apps: ['test-app'] };

            await watch.watchRecursively('/tmp/test/node_modules', watchSet);

            expect(mockFs.watch).not.toHaveBeenCalled();
        });
    });

    describe('handleFileChange', () => {
        let watch;

        beforeEach(() => {
            timingHelper.mockTimers();
            watch = new Watch(null, { debounceMs: 1000 });
        });

        afterEach(() => {
            timingHelper.restoreTimers();
        });

        it('should ignore changes without filename', () => {
            const watchSet = { name: 'test-set', dirs: ['/tmp/test'], apps: ['test-app'] };
            vi.spyOn(watch, 'executeAppsForWatchSet').mockResolvedValue();

            watch.handleFileChange('/tmp/test', 'change', null, watchSet);
            timingHelper.runAllTimers();

            expect(watch.executeAppsForWatchSet).not.toHaveBeenCalled();
        });

        it('should debounce rapid file changes', async () => {
            const watchSet = { name: 'test-set', dirs: ['/tmp/test'], apps: ['test-app'] };
            vi.spyOn(watch, 'executeAppsForWatchSet').mockResolvedValue();

            // Trigger multiple changes rapidly
            watch.handleFileChange('/tmp/test', 'change', 'file.txt', watchSet);
            watch.handleFileChange('/tmp/test', 'change', 'file.txt', watchSet);
            watch.handleFileChange('/tmp/test', 'change', 'file.txt', watchSet);

            // Should only have one timer set
            expect(timingHelper.getPendingTimersCount().timeouts).toBe(1);

            timingHelper.runAllTimers();

            // Should execute apps only once
            expect(watch.executeAppsForWatchSet).toHaveBeenCalledTimes(1);
        });

        it('should skip excluded files', () => {
            const watchSet = { name: 'test-set', dirs: ['/tmp/test'], apps: ['test-app'] };
            vi.spyOn(watch, 'executeAppsForWatchSet').mockResolvedValue();

            watch.handleFileChange('/tmp/test', 'change', 'file.tmp', watchSet);
            timingHelper.runAllTimers();

            expect(watch.executeAppsForWatchSet).not.toHaveBeenCalled();
        });

    });

    describe('executeTransApp', () => {
        let watch;

        beforeEach(() => {
            watch = new Watch();
            mockSpawn.mockImplementation(mockAppHelper.getSpawnMock());
        });

        it('should execute app successfully without change info', async () => {
            mockAppHelper.setAppToSucceed('test-app', 'Success output');

            const result = await watch.executeTransApp('test-app', '/tmp/target');

            expect(mockSpawn).toHaveBeenCalledWith(expect.stringContaining('trans'), ['test-app', '/tmp/target'], expect.any(Object));
            expect(result).toBe('Success output');
        });

        it('should execute app with change info when provided', async () => {
            const changeInfo = {
                eventType: 'change',
                path: 'test.md',
                fullPath: '/tmp/test.md',
                watchDir: '/tmp',
                timestamp: '2025-01-01T00:00:00.000Z'
            };
            
            mockAppHelper.setAppToSucceed('test-app', 'Success with change info');

            const result = await watch.executeTransApp('test-app', '/tmp/target', changeInfo);

            expect(mockSpawn).toHaveBeenCalledWith(
                expect.stringContaining('trans'), 
                ['test-app', '-m', JSON.stringify(changeInfo), '/tmp/target'], 
                expect.any(Object)
            );
            expect(result).toBe('Success with change info');
        });

        it('should execute app with config arguments when provided', async () => {
            mockAppHelper.setAppToSucceed('test-app', 'Success with config args');

            const result = await watch.executeTransApp('test-app --verbose /custom/path', '/tmp/target');

            expect(mockSpawn).toHaveBeenCalledWith(
                expect.stringContaining('trans'), 
                ['test-app', '--verbose', '/custom/path'], 
                expect.any(Object)
            );
            expect(result).toBe('Success with config args');
        });

        it('should use config arguments over change info when both available', async () => {
            const changeInfo = {
                eventType: 'change',
                path: 'test.md',
                fullPath: '/tmp/test.md',
                watchDir: '/tmp',
                timestamp: '2025-01-01T00:00:00.000Z'
            };
            
            mockAppHelper.setAppToSucceed('test-app', 'Success with config args override');

            const result = await watch.executeTransApp('test-app /override/path', '/tmp/target', changeInfo);

            // Should use config args AND include change info (new behavior)
            expect(mockSpawn).toHaveBeenCalledWith(
                expect.stringContaining('trans'), 
                ['test-app', '-m', expect.stringContaining('"eventType":"change"'), '/override/path'], 
                expect.any(Object)
            );
            expect(result).toBe('Success with config args override');
        });

        it('should expand tilde paths in config arguments', async () => {
            mockAppHelper.setAppToSucceed('test-app', 'Success with expanded path');

            const result = await watch.executeTransApp('test-app ~/custom/path', '/tmp/target');

            // Should expand ~/custom/path to /home/user/custom/path
            const expectedPath = require('path').join(require('os').homedir(), 'custom/path');
            expect(mockSpawn).toHaveBeenCalledWith(
                expect.stringContaining('trans'), 
                ['test-app', expectedPath], 
                expect.any(Object)
            );
            expect(result).toBe('Success with expanded path');
        });

        it('should handle app execution failure', async () => {
            mockAppHelper.setAppToFail('test-app', 1, 'Error output');

            await expect(watch.executeTransApp('test-app', '/tmp/target')).rejects.toThrow();
        });

        it('should handle spawn error', async () => {
            mockSpawn.mockImplementation(() => {
                const mockProcess = new EventEmitter();
                mockProcess.stdout = new EventEmitter();
                mockProcess.stderr = new EventEmitter();
                
                setTimeout(() => {
                    mockProcess.emit('error', new Error('Spawn failed'));
                }, 10);
                
                return mockProcess;
            });

            await expect(watch.executeTransApp('test-app', '/tmp/target')).rejects.toThrow('Spawn failed');
        });
    });

    describe('executeAppsForWatchSet', () => {
        let watch;

        beforeEach(() => {
            watch = new Watch();
            vi.spyOn(watch, 'executeTransApp').mockResolvedValue('success');
        });

        it('should execute all apps for all directories in watch set', async () => {
            const watchSet = {
                name: 'test-set',
                dirs: ['/tmp/dir1', '/tmp/dir2'],
                apps: ['app1', 'app2']
            };
            const changeInfo = { filename: 'test.txt', sourcePath: '/tmp/dir1/test.txt' };

            await watch.executeAppsForWatchSet(watchSet, '/tmp/dir1', changeInfo);

            expect(watch.executeTransApp).toHaveBeenCalledTimes(4); // 2 dirs × 2 apps
            // Verify apps were called with change info
            expect(watch.executeTransApp).toHaveBeenCalledWith('app1', '/tmp/dir1', changeInfo);
            expect(watch.executeTransApp).toHaveBeenCalledWith('app1', '/tmp/dir2', changeInfo);
            expect(watch.executeTransApp).toHaveBeenCalledWith('app2', '/tmp/dir1', changeInfo);
            expect(watch.executeTransApp).toHaveBeenCalledWith('app2', '/tmp/dir2', changeInfo);
        });

        it('should continue execution even if one app fails', async () => {
            const watchSet = {
                name: 'test-set',
                dirs: ['/tmp/dir1'],
                apps: ['app1', 'app2', 'app3']
            };
            const changeInfo = { filename: 'test.txt', sourcePath: '/tmp/dir1/test.txt' };

            // Make second app fail
            watch.executeTransApp
                .mockResolvedValueOnce('success') // app1
                .mockRejectedValueOnce(new Error('app2 failed')) // app2
                .mockResolvedValueOnce('success'); // app3

            await watch.executeAppsForWatchSet(watchSet, '/tmp/dir1', changeInfo);

            expect(watch.executeTransApp).toHaveBeenCalledTimes(3);
        });
    });

    describe('stop', () => {
        let watch;

        beforeEach(() => {
            watch = new Watch();
        });

        it('should close all watchers and clear timers', () => {
            const mockWatcher1 = { close: vi.fn() };
            const mockWatcher2 = { close: vi.fn() };
            
            watch.watchers.set('set1:/tmp/dir1', mockWatcher1);
            watch.watchers.set('set1:/tmp/dir2', mockWatcher2);
            
            // Add some debounce timers
            const timer1 = setTimeout(() => {}, 1000);
            const timer2 = setTimeout(() => {}, 2000);
            watch.debounceTimers.set('key1', timer1);
            watch.debounceTimers.set('key2', timer2);

            watch.stop();

            expect(mockWatcher1.close).toHaveBeenCalled();
            expect(mockWatcher2.close).toHaveBeenCalled();
            expect(watch.watchers.size).toBe(0);
            expect(watch.debounceTimers.size).toBe(0);
        });

        it('should handle watcher close errors gracefully', () => {
            const mockWatcher = { 
                close: vi.fn().mockImplementation(() => {
                    throw new Error('Close failed');
                })
            };
            
            watch.watchers.set('set1:/tmp/dir1', mockWatcher);

            expect(() => watch.stop()).not.toThrow();
            expect(mockWatcher.close).toHaveBeenCalled();
        });
    });

    describe('setupSignalHandlers', () => {
        it('should set up SIGINT and SIGTERM handlers', () => {
            const processOnSpy = vi.spyOn(process, 'on').mockImplementation(() => {});
            const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});

            new Watch();

            expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
            expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));

            processOnSpy.mockRestore();
            processExitSpy.mockRestore();
        });
    });
});