import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let databaseId = '(default)';

if (!admin.apps.length) {
  // Read the project ID from the frontend config
  try {
    const configPath = path.join(__dirname, '..', 'firebase-applet-config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    if (config.firestoreDatabaseId) {
      databaseId = config.firestoreDatabaseId;
    }

    admin.initializeApp({
      projectId: config.projectId,
    });
  } catch (err) {
    console.error("Failed to load firebase-applet-config.json, falling back to default initialization:", err);
    admin.initializeApp();
  }
}

export const db = getFirestore(admin.app(), databaseId);
export const auth = admin.auth();
