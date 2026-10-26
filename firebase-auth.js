import { firebaseConfig, firebaseConfigured } from './firebase-config.js';

const gate = document.getElementById('authGate');
const loginButton = document.getElementById('loginWithGoogle');
const status = document.getElementById('authStatus');
const localPreviewButton = document.getElementById('localPreviewBtn');
const setStatus = (message, isError = false) => {
  status.textContent = message;
  status.classList.toggle('error', isError);
};

if (!firebaseConfigured) {
  loginButton.disabled = true;
  loginButton.setAttribute('aria-disabled', 'true');
  localPreviewButton.classList.remove('hidden');
  window.orbitCloud = { isReady: false };
  setStatus('Google sign-in is not configured yet. Use Local Preview to open the app now.', false);
} else {
  localPreviewButton.classList.add('hidden');
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js');
  const {
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    signOut
  } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js');
  const {
    doc,
    getFirestore,
    onSnapshot,
    serverTimestamp,
    setDoc
  } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js');
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  let unsubscribeWorkspace = null;
  let saveTimer = null;
  let activeRef = null;

  const queueSave = workspace => {
    if (!activeRef) return;
    clearTimeout(saveTimer);
    const snapshot = JSON.parse(JSON.stringify(workspace));
    saveTimer = setTimeout(async () => {
      try {
        await setDoc(activeRef, {
          workspace: snapshot,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        setStatus('Sync paused: ' + error.message, true);
      }
    }, 450);
  };

  window.orbitCloud = {
    isReady: false,
    queueSave,
    signOut: async () => {
      await signOut(auth);
    }
  };

  loginButton.addEventListener('click', async () => {
    try {
      loginButton.disabled = true;
      setStatus('Opening Google sign-in…');
      if (matchMedia('(max-width: 720px)').matches) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      loginButton.disabled = false;
      setStatus(error.code === 'auth/popup-closed-by-user' ? 'Sign-in was cancelled.' : 'Unable to sign in: ' + error.message, true);
    }
  });

  onAuthStateChanged(auth, user => {
    if (unsubscribeWorkspace) {
      unsubscribeWorkspace();
      unsubscribeWorkspace = null;
    }
    activeRef = null;
    window.orbitCloud.isReady = false;

    if (!user) {
      document.body.classList.add('auth-locked');
      gate.classList.remove('hidden');
      loginButton.disabled = false;
      setStatus('Sign in with Google to access your private workspace.');
      return;
    }

    activeRef = doc(db, 'users', user.uid, 'workspace', 'main');
    window.orbitCloud.isReady = true;
    document.body.classList.remove('auth-locked');
    gate.classList.add('hidden');
    window.dispatchEvent(new CustomEvent('orbit:auth-user', {
      detail: { uid: user.uid, displayName: user.displayName || '', email: user.email || '', photoURL: user.photoURL || '' }
    }));

    let firstSnapshot = true;
    unsubscribeWorkspace = onSnapshot(activeRef, snapshot => {
      const remote = snapshot.data()?.workspace;
      if (remote) {
        window.dispatchEvent(new CustomEvent('orbit:cloud-data', { detail: remote }));
      } else if (firstSnapshot) {
        window.dispatchEvent(new Event('orbit:cloud-empty'));
      }
      firstSnapshot = false;
    }, error => {
      setStatus('Live sync failed: ' + error.message, true);
    });
  });
}
