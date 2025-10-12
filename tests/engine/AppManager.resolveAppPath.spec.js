// tests/engine/AppManager.resolveAppPath.spec.js
import path from 'path'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'os'
import AppManager from '../../src/engine/AppManager.js'

describe('AppManager.resolveAppPath', () => {
    let appManager
    let tempArtifacts = []

    beforeEach(() => {
        appManager = new AppManager()
        tempArtifacts = []
    })

    afterEach(() => {
        return Promise.allSettled(
            tempArtifacts.reverse().map(entry => rm(entry, { recursive: true, force: true }))
        )
    })

    it('returns the explicit application path when provided', async () => {
        const explicitPath = await mkdtemp(path.join(os.tmpdir(), 'app-manager-'))
        tempArtifacts.push(explicitPath)

        const resolved = await appManager.resolveAppPath('ignored', explicitPath)

        expect(resolved).toBe(path.resolve(explicitPath))
    })

    it('throws when the explicit path is not a directory', async () => {
        const tempDir = await mkdtemp(path.join(os.tmpdir(), 'app-manager-file-'))
        const tempFile = path.join(tempDir, 'not-a-dir')
        await writeFile(tempFile, '')
        tempArtifacts.push(tempDir, tempFile)

        await expect(appManager.resolveAppPath('ignored', tempFile))
            .rejects
            .toThrow(/Application path must be a directory/)
    })
})
