// config.js
export const config = {
    baseUrl: 'http://example.com',
    requiredFields: ['slug', 'title'],
    dateFormat: 'YYYY-MM-DDThh:mm:ssZ',
    
    setBaseUrl(url) {
        if (!url.startsWith('http')) {
            throw new Error('Base URL must start with http(s)');
        }
        this.baseUrl = url;
    }
};