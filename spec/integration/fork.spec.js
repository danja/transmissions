// tests/integration/fork.spec.js
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { exec } from 'child_process'

describe('fork test', function () {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const logFile = path.join(__dirname, '../../latest.log')

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

    it('should create correct number of message paths', (done) => {
        exec('node src/api/cli/run.js test_fork', async (error, stdout, stderr) => {
            if (error) {
                console.error('Exec error:', error)
                done(error)
                return
            }

            try {
                // Parse log file to count NOP processor executions
                const logs = stdout.toString()
                const nopMatches = logs.match(/NOP at/g)
                const nopCount = nopMatches ? nopMatches.length : 0

                // nForks=2 (default) should result in 2 NOP executions + 1 for done message
                expect(nopCount).to.equal(3)
                done()
            } catch (err) {
                console.error('Test error:', err)
                done(err)
            }
        })
    })
})