import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class ShutdownService {
    constructor() {
        this.secret = crypto.randomBytes(32).toString('hex');
        this.token = this.generateToken();
    }

    generateToken() {
        return jwt.sign({ action: 'shutdown' }, this.secret, { expiresIn: '1h' });
    }

    setupMiddleware(app) {
        app.use('/admin', (req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(401).send('No token provided');
                return;
            }
            try {
                jwt.verify(token, this.secret);
                next();
            } catch (err) {
                res.status(403).send('Invalid token');
            }
        });
    }

    setupEndpoints(app, shutdownCallback) {
        app.get('/admin/token', (req, res) => {
            res.json({ token: this.generateToken() });
        });

        app.post('/admin/shutdown', (req, res) => {
            res.send('Shutdown initiated');
            shutdownCallback();
        });
    }
}

export default ShutdownService;