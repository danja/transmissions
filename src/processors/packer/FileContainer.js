import path from 'path';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import { commentStripper } from './CommentStripper.js';

class FileContainer extends Processor {
    constructor(config) {
        super(config);
        this.files = [];
        this.structure = [];
        this.totalSize = 0;
        this.fileCount = 0;
        this.stats = {};
    }

    async process(message) {
        if (message.done) {
            await this.generateOutput(message);
            return this.emit('message', message);
        }

        if (message.filepath) {
            const stripped = this.shouldStripComments(message.filepath) ?
                commentStripper(message.content, message.filepath) :
                message.content;

            this.files.push({
                path: message.filepath,
                content: stripped,
                size: stripped.length
            });

            this.updateStats(message.filepath, stripped.length);
            this.updateStructure(message.filepath);
        }

        return this.emit('message', message);
    }

    shouldStripComments(filepath) {
        const ext = path.extname(filepath).toLowerCase();
        return ['.js', '.jsx', '.ts', '.tsx', '.java', '.py', '.cpp', '.c', '.h'].includes(ext);
    }

    updateStats(filepath, size) {
        this.totalSize += size;
        this.fileCount++;

        const ext = path.extname(filepath).toLowerCase() || 'no_extension';
        if (!this.stats[ext]) {
            this.stats[ext] = { count: 0, size: 0 };
        }
        this.stats[ext].count++;
        this.stats[ext].size += size;
    }

    updateStructure(filepath) {
        const parts = filepath.split(path.sep);
        let current = this.structure;

        parts.forEach((part, index) => {
            let existing = current.find(item => item.name === part);
            if (!existing) {
                existing = {
                    name: part,
                    children: []
                };
                current.push(existing);
            }
            current = existing.children;
        });
    }

    formatStructure(node = this.structure, depth = 0) {
        let output = '';
        node.forEach(item => {
            output += ' '.repeat(depth * 2) + item.name + '\n';
            if (item.children.length > 0) {
                output += this.formatStructure(item.children, depth + 1);
            }
        });
        return output;
    }

    formatStats() {
        const lines = [];
        lines.push('File Statistics:');
        lines.push(`Total Files: ${this.fileCount}`);
        lines.push(`Total Size: ${this.formatBytes(this.totalSize)}\n`);
        lines.push('By Extension:');

        Object.entries(this.stats)
            .sort((a, b) => b[1].size - a[1].size)
            .forEach(([ext, stat]) => {
                lines.push(`${ext}: ${stat.count} files, ${this.formatBytes(stat.size)}`);
            });

        return lines.join('\n');
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async generateOutput(message) {
        let output = 'This file is a merged representation of the entire codebase.\n\n';
        output += '================================================================\n';
        output += this.formatStats();
        output += '\n\n================================================================\n';
        output += 'Repository Structure\n';
        output += '================================================================\n';
        output += this.formatStructure();
        output += '\n================================================================\n';
        output += 'Repository Files\n';
        output += '================================================================\n\n';

        for (const file of this.files) {
            output += '================\n';
            output += `File: ${file.path}\n`;
            output += '================\n';
            output += file.content + '\n\n';
        }

        message.content = output;
        message.filepath = 'packer-output.txt';
    }
}

export default FileContainer;