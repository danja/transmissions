// examples/http/test-stop-node.js

/**
 * Node.js programmatic test client for graceful shutdown
 */

const port = process.argv[2] || 4500
const host = 'localhost'
const url = `http://${host}:${port}/api/echo`

console.log('Testing graceful shutdown with Node.js')
console.log('=======================================')
console.log(`URL: ${url}`)
console.log()

/**
 * Make HTTP POST request
 * @param {Object} data - JSON data to send
 * @param {number} timeout - Request timeout in ms
 */
async function makeRequest(data, timeout = 5000) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        return {
            success: true,
            status: response.status,
            data: await response.json()
        }
    } catch (error) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
            return { success: false, error: 'Request timeout' }
        }
        return { success: false, error: error.message }
    }
}

/**
 * Wait for specified time
 * @param {number} ms - Milliseconds to wait
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function testGracefulShutdown() {
    try {
        console.log('Sending stop command to server...')
        const stopResponse = await makeRequest({ system: 'stop' })
        
        if (stopResponse.success) {
            console.log(`✅ Stop command accepted (Status: ${stopResponse.status})`)
            console.log('Response:', JSON.stringify(stopResponse.data, null, 2))
        } else {
            console.log(`❌ Stop command failed: ${stopResponse.error}`)
            process.exit(1)
        }
        
        console.log()
        console.log('Waiting 3 seconds for server to shutdown...')
        await sleep(3000)
        
        console.log('Testing if server is still running...')
        const testResponse = await makeRequest(
            { test: 'after shutdown' },
            3000 // 3 second timeout
        )
        
        if (testResponse.success) {
            console.log('❌ Server is still running (unexpected)')
            console.log('Response:', JSON.stringify(testResponse.data, null, 2))
            process.exit(1)
        } else {
            console.log('✅ Server shutdown successfully')
            console.log(`Connection failed as expected: ${testResponse.error}`)
        }
        
        console.log()
        console.log('✅ Graceful shutdown test completed successfully!')
        
    } catch (error) {
        console.error('❌ Test failed:', error.message)
        process.exit(1)
    }
}

testGracefulShutdown()