import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your service account file
const serviceAccountPath = join(__dirname, '../firebase-service-account.json');

// Initialize Firebase Admin with service account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
});

export default admin;
