import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the service account file directly
const serviceAccountPath = path.join(dirname(__dirname), 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// No extra development logs; only initialize Firebase Admin with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
