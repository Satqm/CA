// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVUi-vAyvE-g_iK4W9zbTTa5Ps8MwZEtg",
    authDomain: "ca-final-537aa.firebaseapp.com",
    projectId: "ca-final-537aa",
    storageBucket: "ca-final-537aa.firebasestorage.app",
    messagingSenderId: "156489737512",
    appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence().catch((err) => {
    console.log("Firestore persistence error: ", err.code);
});

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, db };
}
