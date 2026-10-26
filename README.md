# Orbit — ready to use

## Use it now

1. Open index.html.
2. Select **Open local preview instead** on the sign-in screen.
3. Complete the short profile setup.

Everything works in Local Preview. Data stays private in this browser and can be exported from Settings.

## Turn on required Google sign-in and cloud sync

1. Create a Firebase project and Web app.
2. Enable Google under Authentication → Sign-in method.
3. Create a Firestore database.
4. Paste the Firebase Web config into firebase-config.js.
5. From this folder, sign in to the Firebase CLI and run:

   firebase deploy --config firebase.json

6. Add the deployed domain under Authentication → Settings → Authorized domains.

After this, Local Preview is hidden and Google sign-in becomes mandatory. Each user's private workspace syncs to Firestore automatically.

See FIREBASE_SETUP.md for the data path and security-rule explanation.
