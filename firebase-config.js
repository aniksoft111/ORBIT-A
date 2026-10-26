/*
  Copy the values from Firebase Console → Project settings → Your apps → Web app.
  Firebase web configuration is an app identifier, not a secret; security comes
  from the Firestore rules supplied with this project.
*/
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

export const firebaseConfigured = Object.values(firebaseConfig).every(
  value => typeof value === 'string' && value.length > 0 && !value.includes('YOUR_')
);
