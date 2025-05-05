import path from 'path'
import fs from 'fs/promises'
import logger from './Logger.js'

class FSUtils {

    static async findInDirectory(dir, targetName, depth = 0) {
        logger.log(`AppResolver.findInDirectory
    dir : ${dir}
    targetName : ${targetName}
    depth : ${depth}`)
        // Check if the directory exists
        if (depth > 3) return null

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true })

            for (const entry of entries) {
                if (!entry.isDirectory()) continue

                const fullPath = path.join(dir, entry.name)

                // Check if this directory matches
                if (entry.name === targetName) {
                    const transmissionsFile = path.join(fullPath, this.transmissionFilename)
                    try {
                        await fs.access(transmissionsFile)
                        return fullPath
                    } catch {
                        // Has matching name but no transmissions.ttl
                    }
                }

                // Recurse into subdirectories
                const found = await this.findInDirectory(fullPath, targetName, depth + 1)
                if (found) return found
            }
        } catch (err) {
            logger.debug(`Error scanning directory ${dir}: ${err.message}`)
        }

        return null
    }
}
export default FSUtils