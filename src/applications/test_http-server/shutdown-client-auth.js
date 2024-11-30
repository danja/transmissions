async function shutdownServer(baseUrl, username, password) {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    
    try {
        const response = await fetch(`${baseUrl}/admin/shutdown`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Shutdown failed: ${response.statusText}`);
        }
        
        return await response.text();
    } catch (error) {
        console.error('Shutdown error:', error);
        throw error;
    }
}

// Usage example:
try {
    const baseUrl = 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/admin/credentials`);
    const { username, password } = await response.json();
    await shutdownServer(baseUrl, username, password);
} catch (error) {
    console.error('Error:', error);
}
