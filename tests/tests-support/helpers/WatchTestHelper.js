import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import FileTestHelper from './file-test-helper.js';
import logger from '../../../src/utils/Logger.js';

class WatchTestHelper extends FileTestHelper {
    constructor(baseDir) {
        super(baseDir);
        this.watchConfigs = new Map();
        this.mockLogFiles = [];
    }

    async setup() {
        await super.setup();
        
        // Create additional directories for watch testing
        await fs.mkdir(path.join(this.baseDir, 'watch-configs'), { recursive: true });
        await fs.mkdir(path.join(this.baseDir, 'logs'), { recursive: true });
        await fs.mkdir(path.join(this.baseDir, 'watched-dirs'), { recursive: true });
    }

    async cleanup() {
        // Clean up any created watch configs
        this.watchConfigs.clear();
        this.mockLogFiles = [];
        await super.cleanup();
    }

    /**
     * Create a watch configuration file for testing
     */
    async createWatchConfig(name, watchSets) {
        const configPath = path.join(this.baseDir, 'watch-configs', `${name}.json`);
        const config = JSON.stringify(watchSets, null, 2);
        
        await fs.writeFile(configPath, config);
        this.watchConfigs.set(name, configPath);
        
        return configPath;
    }

    /**
     * Create a simple watch configuration with test directories
     */
    async createSimpleWatchConfig(name = 'test-config') {
        const watchDir1 = path.join(this.baseDir, 'watched-dirs', 'dir1');
        const watchDir2 = path.join(this.baseDir, 'watched-dirs', 'dir2');
        
        // Create the watched directories
        await fs.mkdir(watchDir1, { recursive: true });
        await fs.mkdir(watchDir2, { recursive: true });
        
        const watchSets = [{
            "name": "test-watch-set",
            "dirs": [watchDir1, watchDir2],
            "apps": ["test-app-1", "test-app-2"]
        }];
        
        return await this.createWatchConfig(name, watchSets);
    }

    /**
     * Create a complex watch configuration with multiple watch sets
     */
    async createComplexWatchConfig(name = 'complex-config') {
        const watchDir1 = path.join(this.baseDir, 'watched-dirs', 'set1-dir1');
        const watchDir2 = path.join(this.baseDir, 'watched-dirs', 'set1-dir2');
        const watchDir3 = path.join(this.baseDir, 'watched-dirs', 'set2-dir1');
        
        // Create the watched directories
        await fs.mkdir(watchDir1, { recursive: true });
        await fs.mkdir(watchDir2, { recursive: true });
        await fs.mkdir(watchDir3, { recursive: true });
        
        const watchSets = [
            {
                "name": "test-watch-set-1",
                "dirs": [watchDir1, watchDir2],
                "apps": ["app-1", "app-2"]
            },
            {
                "name": "test-watch-set-2", 
                "dirs": [watchDir3],
                "apps": ["app-3"]
            }
        ];
        
        return await this.createWatchConfig(name, watchSets);
    }

    /**
     * Create a watch configuration with home directory expansion
     */
    async createHomePathConfig(name = 'home-path-config') {
        const relativeDir = path.join('test-watched-dirs', 'home-test');
        const absoluteDir = path.join(os.homedir(), relativeDir);
        
        // Create the directory in home
        await fs.mkdir(absoluteDir, { recursive: true });
        
        const watchSets = [{
            "name": "home-path-test",
            "dirs": [`~/${relativeDir}`],
            "apps": ["test-app"]
        }];
        
        const configPath = await this.createWatchConfig(name, watchSets);
        
        // Store the absolute path for cleanup
        this.homeTestDirs = this.homeTestDirs || [];
        this.homeTestDirs.push(absoluteDir);
        
        return { configPath, absoluteDir };
    }

    /**
     * Create invalid watch configurations for error testing
     */
    async createInvalidWatchConfig(name, invalidData) {
        const configPath = path.join(this.baseDir, 'watch-configs', `${name}.json`);
        
        if (typeof invalidData === 'string') {
            // Write raw invalid JSON
            await fs.writeFile(configPath, invalidData);
        } else {
            // Write valid JSON but with invalid structure
            await fs.writeFile(configPath, JSON.stringify(invalidData, null, 2));
        }
        
        return configPath;
    }

    /**
     * Create a test file in a watched directory
     */
    async createWatchedFile(watchDirName, fileName, content = 'test content') {
        const filePath = path.join(this.baseDir, 'watched-dirs', watchDirName, fileName);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content);
        return filePath;
    }

    /**
     * Modify a file to trigger watch events
     */
    async modifyWatchedFile(filePath, newContent) {
        await fs.writeFile(filePath, newContent);
        return filePath;
    }

    /**
     * Create a subdirectory in a watched directory
     */
    async createWatchedSubDir(watchDirName, subDirName) {
        const dirPath = path.join(this.baseDir, 'watched-dirs', watchDirName, subDirName);
        await fs.mkdir(dirPath, { recursive: true });
        return dirPath;
    }

    /**
     * Get the path to a watched directory
     */
    getWatchedDirPath(watchDirName) {
        return path.join(this.baseDir, 'watched-dirs', watchDirName);
    }

    /**
     * Create a mock log file for testing
     */
    async createMockLogFile(logContent = '') {
        const logPath = path.join(this.baseDir, 'logs', 'test-watch.log');
        await fs.writeFile(logPath, logContent);
        this.mockLogFiles.push(logPath);
        return logPath;
    }

    /**
     * Read log file content
     */
    async readLogFile(logPath) {
        try {
            return await fs.readFile(logPath, 'utf8');
        } catch (error) {
            return '';
        }
    }

    /**
     * Wait for log entries to appear (for async testing)
     */
    async waitForLogEntry(logPath, expectedText, timeoutMs = 5000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeoutMs) {
            const logContent = await this.readLogFile(logPath);
            if (logContent.includes(expectedText)) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return false;
    }

    /**
     * Parse log entries from log content
     */
    parseLogEntries(logContent) {
        const lines = logContent.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const match = line.match(/^\[([^\]]+)\] \[([^\]]+)\] \[([^\]]+)\] (.+)$/);
            if (match) {
                return {
                    timestamp: match[1],
                    component: match[2],
                    level: match[3],
                    message: match[4]
                };
            }
            return { raw: line };
        });
    }

    /**
     * Clean up home directory test files
     */
    async cleanupHomeDirs() {
        if (this.homeTestDirs) {
            for (const dir of this.homeTestDirs) {
                try {
                    await fs.rm(dir, { recursive: true, force: true });
                } catch (error) {
                    logger.warn(`Failed to cleanup home test dir ${dir}:`, error.message);
                }
            }
            this.homeTestDirs = [];
        }
    }

    async cleanup() {
        await this.cleanupHomeDirs();
        await super.cleanup();
    }
}

export default WatchTestHelper;