import { readdir } from 'fs/promises'
import { join, extname } from 'path'

// List of desired file extensions
const desiredExtensions = ['.html', '.txt']

async function crawlDirectory(dirPath) {
    // const cwd = process.cwd()
    try {
        const entries = await readdir(dirPath, { withFileTypes: true })
        for (const entry of entries) {
            const fullPath = join(dirPath, entry.name)
            if (entry.isDirectory()) {
                await crawlDirectory(fullPath)
            } else {
                // Check if the file extension is in the list of desired extensions
                if (desiredExtensions.includes(extname(entry.name))) {
                    console.log(fullPath)
                }
            }
        }
    } catch (error) {
        console.error('An error occurred:', error)
    }
}

// Example usage
crawlDirectory('../data/mail-archive-sample')
