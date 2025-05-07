import path from 'path'
import fs from 'fs/promises'
import logger from './Logger.js'

class FSUtils {

    static async findSubdir(dir, targetName, depth = 0) {
        logger.trace(`AppResolver.findInDirectory
    dir : ${dir}
    targetName : ${targetName}
    depth : ${depth}`)
        // Check if the directory exists
        if (depth > 3) return null


        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
            if (!entry.isDirectory()) continue

            const fullPath = path.join(dir, entry.name)

            // Check if this directory matches
            if (entry.name === targetName) {
                return fullPath
            }

            // Recurse into subdirectories
            const found = await this.findSubdir(fullPath, targetName, depth + 1)
            if (found) return found
        }


        return null
    }
}
export default FSUtils