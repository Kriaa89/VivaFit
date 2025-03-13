import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// First attempt to load from environment variables
let credential;

// Try to use environment variables if available
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  console.log('Initializing Firebase Admin with environment variables');
  
  // Make sure to replace escaped newlines in the private key
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  
  credential = admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  });
} else {
  // Fallback to service account file
  try {
    // Read the service account file if it exists
    const serviceAccountPath = path.join(dirname(__dirname), 'firebase-service-account.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      console.log('Initializing Firebase Admin with service account file');
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } else {
      console.error('Firebase service account file not found and environment variables not set!');
      console.error('Please set up your credentials correctly. See the README for instructions.');
    }
  } catch (error) {
    console.error('Error loading Firebase credentials:', error);
    throw new Error('Failed to initialize Firebase: No valid credentials available');
  }
}

// Initialize Firebase Admin with the credentials
admin.initializeApp({
  credential: credential
});

export default admin;
