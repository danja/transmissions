import crypto from 'crypto';

class ShutdownService {
    constructor() {
        // Generate random credentials on startup
        this.username = crypto.randomBytes(16).toString('hex');
        this.password = crypto.randomBytes(32).toString('hex');
    }

    setupMiddleware(app) {
        app.use('/admin', (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!this.validateAuth(authHeader)) {
                res.setHeader('WWW-Authenticate', 'Basic');
                return res.status(401).send('Authentication required');
            }
            next();
        });
    }

    validateAuth(authHeader) {
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return false;
        }
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');

        return username === this.username && password === this.password;
    }

    setupEndpoints(app, shutdownCallback) {
        app.get('/admin/credentials', (req, res) => {
            res.json({ username: this.username, password: this.password });
        });

        app.post('/admin/shutdown', (req, res) => {
            res.send('Shutdown initiated');
            shutdownCallback();
        });
    }
}

export default ShutdownService;