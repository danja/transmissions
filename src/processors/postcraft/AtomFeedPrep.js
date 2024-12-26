import fs from 'fs/promises';
import path from 'path';
import Processor from '../base/Processor.js';
import logger from '../../utils/Logger.js';

class AtomFeedPrep extends Processor {
    constructor(config) {
        super(config);
    }

    async process(message) {
        logger.setLogLevel('debug')
        const entries = message.slugs || [];
        const siteUrl = message.site?.url || 'https://danny.ayers.name';

        if (message.targetPath) {
            message.templateFilename = path.join(message.targetPath, message.atomFeed.templateFilename)
        } else {
            message.templateFilename = path.join(message.rootDir, message.atomFeed.templateFilename)
        }

        const feed = {
            title: message.site?.title || "Danny Ayers' Blog",
            subtitle: message.site?.subtitle || '',
            updated: new Date().toISOString(),
            id: siteUrl,
            link: siteUrl,
            author: {
                name: "Danny Ayers",
                email: "danny.ayers@gmail.com"
            },
            entries: []
        };

        // Get same number of entries as front page
        const entryCount = Math.min(5, entries.length);
        const rangeStart = entries.length - entryCount;
        const rangeEnd = entries.length - 1;

        for (let i = rangeEnd; i >= rangeStart; i--) {
            const slug = entries[i];
            if (slug) {
                let filePath;
                if (message.targetPath) {
                    filePath = path.join(message.targetPath, message.entryContentMeta.targetDir, slug + '.html');
                } else {
                    filePath = path.join(message.rootDir, message.entryContentMeta.targetDir, slug + '.html');
                }

                const entry = {
                    title: `Entry ${slug}`, // TODO: Extract real title
                    id: `${siteUrl}/entries/${slug}.html`,
                    link: `${siteUrl}/entries/${slug}.html`,
                    updated: message.contentBlocks?.updated || new Date().toISOString(),
                    content: await this.getEntryContent(filePath)
                };

                feed.entries.push(entry);
            }
        }

        message.contentBlocks = feed;
        message.filepath = path.join(message.targetPath || message.rootDir, 'public/home/atom.xml');

        return this.emit('message', message);
    }

    async getEntryContent(filePath) {
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            logger.error(`Error reading entry file ${filePath}: ${error}`);
            return '';
        }
    }
}

export default AtomFeedPrep;