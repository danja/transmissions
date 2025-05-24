// examples/http/test-echo-node.js

/**
 * Node.js programmatic test client for echo endpoint
 */

const port = process.argv[2] || 4500
const host = 'localhost'
const url = `http://${host}:${port}/api/echo`

console.log('Testing HTTP API with Node.js')
console.log('==============================')
console.log(`URL: ${url}`)
console.log()

/**
 * Make HTTP POST request
 * @param {Object} data - JSON data to send
 * @param {string} description - Test description
 */
async function testRequest(data, description) {
    console.log(`${description}:`)
    const startTime = Date.now()
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        
        const duration = Date.now() - startTime
        const result = await response.json()
        
        console.log(`Status: ${response.status}`)
        console.log(`Time: ${duration}ms`)
        console.log('Response:', JSON.stringify(result, null, 2))
        console.log()
        
        return { success: response.ok, result, status: response.status }
    } catch (error) {
        const duration = Date.now() - startTime
        console.log(`❌ Error: ${error.message}`)
        console.log(`Time: ${duration}ms`)
        console.log()
        
        return { success: false, error: error.message }
    }
}

async function runTests() {
    try {
        // Test 1: Basic echo
        await testRequest({
            text: 'Hello from Node.js!',
            timestamp: new Date().toISOString()
        }, '1. Testing basic echo message')

        // Test 2: Empty message
        await testRequest({}, '2. Testing empty message')

        // Test 3: Complex message
        await testRequest({
            message: 'Complex test message',
            data: {
                numbers: [1, 2, 3],
                nested: {
                    key: 'value'
                }
            },
            metadata: {
                test: 'node-client',
                timestamp: new Date().toISOString(),
                version: process.version
            }
        }, '3. Testing complex message')

        // Test 4: Array message
        await testRequest({
            items: ['first', 'second', 'third'],
            type: 'array-test'
        }, '4. Testing array message')

        console.log('✅ All echo tests completed successfully!')
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message)
        process.exit(1)
    }
}

runTests()