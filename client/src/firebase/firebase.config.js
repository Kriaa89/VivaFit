import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAyuKCpdy13YgozILukU0Q0XQQ1SSue_jU",
    authDomain: "vivafit-c32e5.firebaseapp.com",
    projectId: "vivafit-c32e5",
    storageBucket: "vivafit-c32e5.appspot.com",
    messagingSenderId: "95159269853",
    appId: "1:95159269853:web:cc16d89e4f95b9f7899e34",
    measurementId: "G-WLQYD0T5J1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Simple configuration for Google sign-in
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, googleProvider };
export default app;
