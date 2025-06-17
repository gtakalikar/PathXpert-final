const admin = require('firebase-admin');
require('dotenv').config(); // Load environment variables

let serviceAccount;

try {
  // 🥇 METHOD 1: Load from ENV variables (good for production)
  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

  if (FIREBASE_PROJECT_ID && FIREBASE_PRIVATE_KEY && FIREBASE_CLIENT_EMAIL) {
    serviceAccount = {
      type: 'service_account',
      project_id: FIREBASE_PROJECT_ID,
      private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: FIREBASE_CLIENT_EMAIL,
    };
  } else {
    // 🥈 METHOD 2: Load from local JSON file (good for development)
    serviceAccount = require('serviceAccountKey.json'); // 🔥 Make sure the file exists!
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error.message);
}

module.exports = admin;

