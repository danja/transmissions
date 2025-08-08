import fs from 'fs/promises';
import path from 'path';
import logger from '../../../src/utils/Logger.js';

class FileTestHelper {
    constructor(baseDir) {
        this.baseDir = baseDir;
    }

    async setup() {
        await fs.mkdir(this.baseDir, { recursive: true });
        await fs.mkdir(path.join(this.baseDir, 'input'), { recursive: true });
        await fs.mkdir(path.join(this.baseDir, 'output'), { recursive: true });
    }

    async cleanup() {
        try {
            await fs.rm(this.baseDir, { recursive: true, force: true });
        } catch (error) {
            logger.error('Cleanup error:', error);
        }
    }

    async createTestFile(subPath, content) {
        const filePath = path.join(this.baseDir, subPath);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content);
        return filePath;
    }

    async compareFiles(actualPath, expectedPath) {
        try {
            const actual = await fs.readFile(actualPath, 'utf8');
            const expected = await fs.readFile(expectedPath, 'utf8');
            return {
                match: actual.trim() === expected.trim(),
                actual: actual.trim(),
                expected: expected.trim()
            };
        } catch (error) {
            logger.error('File comparison error:', error);
            return {
                match: false,
                error: error.message
            };
        }
    }

    async clearOutputFiles(pattern = 'output-*') {
        const outputDir = path.join(this.baseDir, 'output');
        const files = await fs.readdir(outputDir);
        for (const file of files) {
            if (file.match(pattern)) {
                await fs.unlink(path.join(outputDir, file));
            }
        }
    }

    async fileExists(filePath) {
        try {
            await fs.access(path.join(this.baseDir, filePath));
            return true;
        } catch {
            return false;
        }
    }
}

export default FileTestHelper;
