// firebase-config.js - Modern Firebase v9+ Modular SDK
// Replace with your actual configuration from Firebase Console (Project Settings > General > Your apps)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVUi-vAyvE-g_iK4W9zbTTa5Ps8MwZEtg",
  authDomain: "ca-final-537aa.firebaseapp.com",
  projectId: "ca-final-537aa",
  storageBucket: "ca-final-537aa.firebasestorage.app",
  messagingSenderId: "156489737512",
  appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Enable Firestore offline persistence (client-side only, not for production multi-tab without caution)
// Use with modular syntax
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('Browser does not support required storage capabilities.');
    } else {
      console.log('Firestore persistence error:', err);
    }
  });
