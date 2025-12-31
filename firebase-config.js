// Firebase Configuration - Keep this secure
const firebaseConfig = {
    apiKey: "AIzaSyBj1bi-xEDf-D0uBG1lSKUaMRI4JS8u4A4",
    authDomain: "ca-final-537aa.firebaseapp.com",
    projectId: "ca-final-537aa",
    storageBucket: "ca-final-537aa.firebasestorage.app",
    messagingSenderId: "156489737512",
    appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Enable Firestore offline persistence
db.enablePersistence()
  .catch((err) => {
      console.log("Firestore persistence error:", err);
  });
