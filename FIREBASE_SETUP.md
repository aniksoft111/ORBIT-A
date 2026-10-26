# Orbit Firebase setup

1. Create a Firebase project and add a Web app.
2. Enable **Authentication → Sign-in method → Google**.
3. Create a **Cloud Firestore** database.
4. Copy the Firebase Web app configuration into firebase-config.js.
5. Publish firestore.rules in the Firestore Rules editor.
6. Host the outputs folder on HTTPS (Firebase Hosting, Vercel, Netlify, or an equivalent host).
7. Add the deployed hostname under **Authentication → Settings → Authorized domains**.

The app stores each workspace at users/{authenticated-user-id}/workspace/main.

The Firestore rules only permit the signed-in user to read or write their own document. Do not remove those rules or replace them with public access.

Firebase recommends redirect authentication on mobile; Orbit uses redirect below 720px and a Google popup on larger screens.
