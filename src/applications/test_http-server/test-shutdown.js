import fetch from 'node-fetch';

async function testShutdown() {
    try {
        const response = await fetch('http://localhost:4000/shutdown', {
            method: 'POST'
        });
        console.log('Server response:', await response.text());
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testShutdown();
