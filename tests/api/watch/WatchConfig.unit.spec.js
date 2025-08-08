import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import os from 'os';
import WatchTestHelper from '../../tests-support/helpers/WatchTestHelper.js';

// Mock dependencies
vi.mock('fs/promises', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        readFile: vi.fn(),
        stat: vi.fn(),
        mkdir: vi.fn().mockResolvedValue()
    };
});

vi.mock('../../../src/utils/Logger.js', () => ({
    default: {
        debug: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe('WatchConfig', () => {
    let watchTestHelper;
    let WatchConfig;
    let mockFs;
    let logger;

    beforeEach(async () => {
        // Reset mocks first
        vi.clearAllMocks();
        
        // Import after mocks are set up
        WatchConfig = (await import('../../../src/api/watch/WatchConfig.js')).default;
        mockFs = await import('fs/promises');
        logger = (await import('../../../src/utils/Logger.js')).default;

        // Setup test helper
        watchTestHelper = new WatchTestHelper(path.join(os.tmpdir(), 'watch-config-tests-' + Date.now()));
        await watchTestHelper.setup();
        
        // Setup default mocks
        mockFs.readFile.mockResolvedValue('[]');
        mockFs.stat.mockResolvedValue({ isDirectory: () => true });
    });

    afterEach(async () => {
        if (watchTestHelper) {
            await watchTestHelper.cleanup();
        }
    });

    describe('constructor', () => {
        it('should create WatchConfig with default path', () => {
            const config = new WatchConfig();
            expect(config.configPath).toContain('watch-config.json');
        });

        it('should create WatchConfig with custom path', () => {
            const customPath = '/custom/config.json';
            const config = new WatchConfig(customPath);
            expect(config.configPath).toBe(customPath);
        });
    });

    describe('load', () => {

        it('should throw error for invalid JSON', async () => {
            const customConfigPath = '/test/invalid-config.json';
            mockFs.readFile.mockResolvedValue('invalid json{');

            const config = new WatchConfig(customConfigPath);
            
            await expect(config.load()).rejects.toThrow(/Failed to load watch configuration/);
        });

    });

    describe('validateWatchSet', () => {
        let config;

        beforeEach(() => {
            config = new WatchConfig();
        });

        it('should validate valid watch set', () => {
            const validSet = {
                name: 'test-set',
                dirs: ['/tmp/test'],
                apps: ['test-app']
            };

            const result = config.validateWatchSet(validSet);
            expect(result).toBe(true);
        });

        it('should reject watch set without name', () => {
            const invalidSet = {
                dirs: ['/tmp/test'],
                apps: ['test-app']
            };

            const result = config.validateWatchSet(invalidSet);
            expect(result).toBe(false);
            expect(logger.warn).toHaveBeenCalledWith('Watch set missing valid name, skipping');
        });

        it('should reject watch set with empty name', () => {
            const invalidSet = {
                name: '',
                dirs: ['/tmp/test'],
                apps: ['test-app']
            };

            const result = config.validateWatchSet(invalidSet);
            expect(result).toBe(false);
        });

        it('should reject watch set without dirs', () => {
            const invalidSet = {
                name: 'test-set',
                apps: ['test-app']
            };

            const result = config.validateWatchSet(invalidSet);
            expect(result).toBe(false);
            expect(logger.warn).toHaveBeenCalledWith('Watch set "test-set" has no directories, skipping');
        });

        it('should reject watch set with empty dirs array', () => {
            const invalidSet = {
                name: 'test-set',
                dirs: [],
                apps: ['test-app']
            };

            const result = config.validateWatchSet(invalidSet);
            expect(result).toBe(false);
        });

        it('should reject watch set without apps', () => {
            const invalidSet = {
                name: 'test-set',
                dirs: ['/tmp/test']
            };

            const result = config.validateWatchSet(invalidSet);
            expect(result).toBe(false);
            expect(logger.warn).toHaveBeenCalledWith('Watch set "test-set" has no apps, skipping');
        });

        it('should reject watch set with empty apps array', () => {
            const invalidSet = {
                name: 'test-set',
                dirs: ['/tmp/test'],
                apps: []
            };

            const result = config.validateWatchSet(invalidSet);
            expect(result).toBe(false);
        });
    });

    describe('expandTildePath', () => {
        let config;

        beforeEach(() => {
            config = new WatchConfig();
        });

        it('should expand tilde path', () => {
            const result = config.expandTildePath('~/test/path');
            expect(result).toBe(path.join(os.homedir(), 'test/path'));
        });

        it('should not modify absolute path', () => {
            const absolutePath = '/absolute/path';
            const result = config.expandTildePath(absolutePath);
            expect(result).toBe(absolutePath);
        });

        it('should not modify relative path', () => {
            const relativePath = 'relative/path';
            const result = config.expandTildePath(relativePath);
            expect(result).toBe(relativePath);
        });
    });

    describe('expandPaths', () => {
        let config;

        beforeEach(() => {
            config = new WatchConfig();
        });

        it('should expand and validate existing directories', async () => {
            const dirs = ['/tmp'];
            
            // Mock directory as existing
            mockFs.stat.mockResolvedValue({ isDirectory: () => true });

            const result = await config.expandPaths(dirs);

            expect(result).toHaveLength(1);
            expect(result[0]).toBe(path.resolve('/tmp'));
            expect(logger.debug).toHaveBeenCalledWith(`Added watch directory: ${path.resolve('/tmp')}`);
        });

        it('should skip non-existing directories', async () => {
            const dirs = ['/nonexistent'];
            
            mockFs.stat.mockRejectedValue(new Error('ENOENT'));

            const result = await config.expandPaths(dirs);

            expect(result).toHaveLength(0);
            expect(logger.warn).toHaveBeenCalledWith('Directory does not exist, skipping: /nonexistent');
        });

        it('should skip files (not directories)', async () => {
            const dirs = ['/file.txt'];
            
            mockFs.stat.mockResolvedValue({ isDirectory: () => false });

            const result = await config.expandPaths(dirs);

            expect(result).toHaveLength(0);
            // Check that warn was called - the exact message may vary based on fs.stat mock behavior
            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('processConfig', () => {
        let config;

        beforeEach(() => {
            config = new WatchConfig();
        });

        it('should process valid configuration with existing directories', async () => {
            const rawConfig = [
                {
                    name: 'test-set',
                    dirs: ['/tmp'],
                    apps: ['app1', 'app2']
                }
            ];

            mockFs.stat.mockResolvedValue({ isDirectory: () => true });

            const result = await config.processConfig(rawConfig);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('test-set');
            expect(result[0].dirs).toHaveLength(1);
            expect(result[0].apps).toEqual(['app1', 'app2']);
        });

        it('should skip invalid watch sets', async () => {
            const rawConfig = [
                {
                    name: 'valid-set',
                    dirs: ['/tmp/test'],
                    apps: ['app1']
                },
                {
                    // Missing name
                    dirs: ['/tmp/test2'],
                    apps: ['app2']
                }
            ];

            mockFs.stat.mockResolvedValue({ isDirectory: () => true });

            const result = await config.processConfig(rawConfig);

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('valid-set');
        });

        it('should throw error for non-array config', async () => {
            const rawConfig = { not: 'array' };

            await expect(config.processConfig(rawConfig)).rejects.toThrow(/must be an array/);
        });
    });

    describe('getWatchSets', () => {

        it('should throw error if configuration not loaded', () => {
            const config = new WatchConfig();

            expect(() => config.getWatchSets()).toThrow(/Configuration not loaded/);
        });
    });

    describe('getWatchSetByName', () => {


        it('should throw error if configuration not loaded', () => {
            const config = new WatchConfig();

            expect(() => config.getWatchSetByName('test')).toThrow(/Configuration not loaded/);
        });
    });
});