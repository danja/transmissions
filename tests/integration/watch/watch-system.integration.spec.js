import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import os from 'os';
import WatchTestHelper from '../../tests-support/helpers/WatchTestHelper.js';
import MockAppHelper from '../../tests-support/helpers/MockAppHelper.js';
import TimingTestHelper from '../../tests-support/helpers/TimingTestHelper.js';
import WatchConfig from '../../../src/api/watch/WatchConfig.js';

// Mock child process to avoid executing real apps
vi.mock('child_process', () => ({
    spawn: vi.fn()
}));

describe('Watch System Integration', () => {
    let watchTestHelper;
    let mockAppHelper;
    let timingHelper;
    let mockSpawn;

    beforeEach(async () => {
        // Import mock after setting up
        mockSpawn = (await import('child_process')).spawn;
        
        // Setup test helpers
        watchTestHelper = new WatchTestHelper(path.join(os.tmpdir(), 'watch-integration-' + Date.now()));
        await watchTestHelper.setup();
        
        mockAppHelper = new MockAppHelper();
        mockSpawn.mockImplementation(mockAppHelper.getSpawnMock());
        
        timingHelper = new TimingTestHelper();
        
        // Set default app behaviors
        mockAppHelper.setAppToSucceed('test-app-1', 'App 1 completed');
        mockAppHelper.setAppToSucceed('test-app-2', 'App 2 completed');
        mockAppHelper.setAppToSucceed('md-to-sparqlstore', 'MD conversion completed');
        mockAppHelper.setAppToSucceed('sparqlstore-to-html', 'HTML generation completed');
        mockAppHelper.setAppToSucceed('sparqlstore-to-site-indexes', 'Index generation completed');
    });

    afterEach(async () => {
        timingHelper.cleanup();
        mockAppHelper.reset();
        if (watchTestHelper) {
            await watchTestHelper.cleanup();
        }
        vi.clearAllMocks();
    });

    describe('WatchConfig Integration', () => {
        it('should load and process simple watch configuration', async () => {
            const configPath = await watchTestHelper.createSimpleWatchConfig();
            const watchConfig = new WatchConfig(configPath);
            
            const config = await watchConfig.load();
            
            expect(config).toHaveLength(1);
            expect(config[0].name).toBe('test-watch-set');
            expect(config[0].dirs).toHaveLength(2);
            expect(config[0].apps).toEqual(['test-app-1', 'test-app-2']);
            
            // Verify directories exist
            for (const dir of config[0].dirs) {
                expect(await watchTestHelper.fileExists(path.relative(watchTestHelper.baseDir, dir))).toBe(true);
            }
        });

        it('should expand home directory paths', async () => {
            const { configPath, absoluteDir } = await watchTestHelper.createHomePathConfig();
            const watchConfig = new WatchConfig(configPath);
            
            const config = await watchConfig.load();
            
            expect(config).toHaveLength(1);
            expect(config[0].dirs[0]).toBe(absoluteDir);
        });

        it('should handle complex configurations with multiple watch sets', async () => {
            const configPath = await watchTestHelper.createComplexWatchConfig();
            const watchConfig = new WatchConfig(configPath);
            
            const config = await watchConfig.load();
            
            expect(config).toHaveLength(2);
            expect(config[0].name).toBe('test-watch-set-1');
            expect(config[1].name).toBe('test-watch-set-2');
            expect(config[0].dirs).toHaveLength(2);
            expect(config[1].dirs).toHaveLength(1);
        });

        it('should skip non-existent directories', async () => {
            const watchSets = [{
                name: 'test-set',
                dirs: ['/nonexistent/path', watchTestHelper.getWatchedDirPath('dir1')],
                apps: ['test-app']
            }];
            
            // Create dir1 but not the nonexistent path
            await watchTestHelper.createWatchedFile('dir1', 'test.txt', 'test content');
            
            const configPath = await watchTestHelper.createWatchConfig('test-config', watchSets);
            const watchConfig = new WatchConfig(configPath);
            
            const config = await watchConfig.load();
            
            expect(config).toHaveLength(1);
            expect(config[0].dirs).toHaveLength(1); // Only the existing directory
            expect(config[0].dirs[0]).toContain('dir1');
        });

        it('should handle invalid JSON configuration gracefully', async () => {
            const configPath = await watchTestHelper.createInvalidWatchConfig('invalid', 'invalid json {');
            const watchConfig = new WatchConfig(configPath);
            
            await expect(watchConfig.load()).rejects.toThrow(/Failed to load watch configuration/);
        });

        it('should validate watch set structure', async () => {
            const invalidWatchSets = [
                { name: 'valid', dirs: ['/tmp'], apps: ['app'] },
                { dirs: ['/tmp'], apps: ['app'] }, // missing name
                { name: 'no-dirs', apps: ['app'] }, // missing dirs
                { name: 'no-apps', dirs: ['/tmp'] } // missing apps
            ];
            
            const configPath = await watchTestHelper.createWatchConfig('validation-test', invalidWatchSets);
            const watchConfig = new WatchConfig(configPath);
            
            const config = await watchConfig.load();
            
            // Should only include the valid watch set (/tmp exists on most systems)
            expect(config).toHaveLength(1);
            expect(config[0].name).toBe('valid');
            expect(config[0].dirs).toContain('/tmp');
            expect(config[0].apps).toEqual(['app']);
        });
    });

    describe('File Change Detection', () => {
        it('should detect file creation in watched directory', async () => {
            const configPath = await watchTestHelper.createSimpleWatchConfig();
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            
            const watch = new Watch(configPath, { debounceMs: 100 });
            
            // Mock file system watching by triggering change directly
            const watchSet = { name: 'test', dirs: [watchTestHelper.getWatchedDirPath('dir1')], apps: ['test-app-1'] };
            const executeAppsSpy = vi.spyOn(watch, 'executeAppsForWatchSet').mockResolvedValue();
            
            // Simulate file change
            watch.handleFileChange(watchTestHelper.getWatchedDirPath('dir1'), 'rename', 'newfile.txt', watchSet);
            
            // Wait for debounce
            await timingHelper.wait(150);
            
            expect(executeAppsSpy).toHaveBeenCalledWith(
                watchSet,
                watchTestHelper.getWatchedDirPath('dir1'),
                expect.objectContaining({
                    eventType: 'rename',
                    filename: 'newfile.txt'
                })
            );
        });

        it('should handle rapid file changes with debouncing', async () => {
            timingHelper.mockTimers();
            
            const configPath = await watchTestHelper.createSimpleWatchConfig();
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            
            const watch = new Watch(configPath, { debounceMs: 1000 });
            const watchSet = { name: 'test', dirs: [watchTestHelper.getWatchedDirPath('dir1')], apps: ['test-app-1'] };
            const executeAppsSpy = vi.spyOn(watch, 'executeAppsForWatchSet').mockResolvedValue();
            
            // Trigger multiple rapid changes
            watch.handleFileChange(watchTestHelper.getWatchedDirPath('dir1'), 'change', 'file.txt', watchSet);
            watch.handleFileChange(watchTestHelper.getWatchedDirPath('dir1'), 'change', 'file.txt', watchSet);
            watch.handleFileChange(watchTestHelper.getWatchedDirPath('dir1'), 'change', 'file.txt', watchSet);
            
            // Should only have one pending timer
            expect(timingHelper.getPendingTimersCount().timeouts).toBe(1);
            
            // Execute pending timers
            timingHelper.runAllTimers();
            
            // Should only execute once despite multiple changes
            expect(executeAppsSpy).toHaveBeenCalledTimes(1);
            
            timingHelper.restoreTimers();
        });

        it('should exclude files matching exclude patterns', async () => {
            const configPath = await watchTestHelper.createSimpleWatchConfig();
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            
            const watch = new Watch(configPath, { debounceMs: 100 });
            const watchSet = { name: 'test', dirs: [watchTestHelper.getWatchedDirPath('dir1')], apps: ['test-app-1'] };
            const executeAppsSpy = vi.spyOn(watch, 'executeAppsForWatchSet').mockResolvedValue();
            
            // Test various excluded file types
            const excludedFiles = ['file.tmp', 'file.swp', 'file~', '.DS_Store'];
            
            for (const filename of excludedFiles) {
                watch.handleFileChange(watchTestHelper.getWatchedDirPath('dir1'), 'change', filename, watchSet);
            }
            
            await timingHelper.wait(150);
            
            // None of the excluded files should trigger app execution
            expect(executeAppsSpy).not.toHaveBeenCalled();
        });
    });

    describe('App Execution', () => {
        it('should execute apps in sequence for file changes', async () => {
            const configPath = await watchTestHelper.createSimpleWatchConfig();
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            
            const watch = new Watch(configPath, { debounceMs: 50 });
            const watchDir = watchTestHelper.getWatchedDirPath('dir1');
            const watchSet = { 
                name: 'test', 
                dirs: [watchDir], 
                apps: ['test-app-1', 'test-app-2'] 
            };
            
            await watch.executeAppsForWatchSet(watchSet, watchDir, { filename: 'test.txt' });
            
            // Verify both apps were executed
            expect(mockAppHelper.wasAppExecuted('test-app-1')).toBe(true);
            expect(mockAppHelper.wasAppExecuted('test-app-2')).toBe(true);
            expect(mockAppHelper.getTotalExecutionCount()).toBe(2);
            
            // Verify execution was for correct directory
            expect(mockAppHelper.wasAppExecutedWithTarget('test-app-1', watchDir)).toBe(true);
            expect(mockAppHelper.wasAppExecutedWithTarget('test-app-2', watchDir)).toBe(true);
        });

        it('should execute apps for all directories in watch set', async () => {
            const configPath = await watchTestHelper.createComplexWatchConfig();
            const watchConfig = new WatchConfig(configPath);
            const config = await watchConfig.load();
            
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            const watch = new Watch(null, { debounceMs: 50 });
            
            // Execute apps for the first watch set which has 2 directories and 2 apps
            const watchSet = config[0]; // test-watch-set-1 with 2 dirs, 2 apps
            
            await watch.executeAppsForWatchSet(watchSet, watchSet.dirs[0], { filename: 'test.txt' });
            
            // Should execute: 2 dirs × 2 apps = 4 executions
            expect(mockAppHelper.getTotalExecutionCount()).toBe(4);
            
            // Verify each app was executed for each directory
            for (const dir of watchSet.dirs) {
                for (const app of watchSet.apps) {
                    expect(mockAppHelper.wasAppExecutedWithTarget(app, dir)).toBe(true);
                }
            }
        });

        it('should continue execution even if one app fails', async () => {
            const configPath = await watchTestHelper.createSimpleWatchConfig();
            const watchDir = watchTestHelper.getWatchedDirPath('dir1');
            const watchSet = { 
                name: 'test', 
                dirs: [watchDir], 
                apps: ['test-app-1', 'failing-app', 'test-app-2'] 
            };
            
            // Set one app to fail
            mockAppHelper.setAppToFail('failing-app', 1, 'App failed');
            
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            const watch = new Watch(configPath, { debounceMs: 50 });
            
            await watch.executeAppsForWatchSet(watchSet, watchDir, { filename: 'test.txt' });
            
            // All apps should have been attempted
            expect(mockAppHelper.getTotalExecutionCount()).toBe(3);
            expect(mockAppHelper.wasAppExecuted('test-app-1')).toBe(true);
            expect(mockAppHelper.wasAppExecuted('failing-app')).toBe(true);
            expect(mockAppHelper.wasAppExecuted('test-app-2')).toBe(true);
        });
    });

    describe('Cleanup and Error Handling', () => {
        it('should handle missing trans executable gracefully', async () => {
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            const watch = new Watch(null, { transPath: '/nonexistent/trans' });
            
            // Should fall back to default path without throwing
            expect(watch.transPath).toBe('/nonexistent/trans');
        });

        it('should clean up resources on stop', async () => {
            const Watch = (await import('../../../src/api/watch/Watch.js')).default;
            const watch = new Watch();
            
            // Add some mock watchers
            const mockWatcher1 = { close: vi.fn() };
            const mockWatcher2 = { close: vi.fn() };
            watch.watchers.set('set1:dir1', mockWatcher1);
            watch.watchers.set('set1:dir2', mockWatcher2);
            
            // Add some debounce timers
            const timer1 = setTimeout(() => {}, 1000);
            const timer2 = setTimeout(() => {}, 2000);
            watch.debounceTimers.set('key1', timer1);
            watch.debounceTimers.set('key2', timer2);
            
            watch.stop();
            
            // Verify cleanup
            expect(mockWatcher1.close).toHaveBeenCalled();
            expect(mockWatcher2.close).toHaveBeenCalled();
            expect(watch.watchers.size).toBe(0);
            expect(watch.debounceTimers.size).toBe(0);
        });
    });
});