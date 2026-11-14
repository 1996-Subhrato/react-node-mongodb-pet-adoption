const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const idx = trimmed.indexOf('=');
                    if (idx !== -1) {
                        const key = trimmed.substring(0, idx).trim();
                        const val = trimmed.substring(idx + 1).trim();
                        process.env[key] = val.replace(/^["']|["']$/g, '');
                    }
                }
            });
        }
    } catch (err) {
        console.warn('Notice: Could not load .env file:', err.message);
    }
}

loadEnv();

module.exports = process.env;

