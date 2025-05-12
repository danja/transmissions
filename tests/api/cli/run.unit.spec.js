import { describe, it, expect, vi } from 'vitest'

// Mock dependencies
vi.mock('yargs', () => ({
    default: () => ({
        usage: vi.fn().mockReturnThis(),
        option: vi.fn().mockReturnThis(),
        command: vi.fn().mockReturnThis(),
        showHelp: vi.fn(),
        argv: Promise.resolve({})
    })
}))
vi.mock('yargs/helpers', () => ({ hideBin: vi.fn(() => []) }))
vi.mock('../common/CommandUtils.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        launchEditor: vi.fn(),
        listApps: vi.fn().mockResolvedValue(['app1', 'app2']),
        handleOptions: vi.fn()
    }))
}))
vi.mock('../http/server/WebRunner.js', () => ({}))
vi.mock('chalk', () => {
    const mockChalk = {
        magentaBright: (s) => s,
        cyan: (s) => s,
        cyanBright: (s) => s,
        yellow: (s) => s,
        green: (s) => s
    }
    return { ...mockChalk, default: mockChalk }
})

// Use a test double for readFileSync
vi.mock('fs', async () => {
    const actual = await import('fs')
    return {
        ...actual,
        readFileSync: vi.fn(() => JSON.stringify({ version: '1.2.3' }))
    }
})

// Use a test double for path.join
vi.mock('path', async () => {
    const actual = await import('path')
    return {
        ...actual,
        join: vi.fn(() => '/fake/path/package.json')
    }
})

describe('run.js', () => {
    it('should print the banner and call yargs', async () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
        await import('../../../src/api/cli/run.js')
        expect(logSpy).toHaveBeenCalled()
        logSpy.mockRestore()
    })
})
