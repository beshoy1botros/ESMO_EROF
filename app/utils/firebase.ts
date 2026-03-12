// Firebase Configuration
// To set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project
// 3. Add a web app to get the config
// 4. Enable Firestore in the project
// 5. Copy your config below

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (only if config is set)
let db: ReturnType<typeof getFirestore> | null = null;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (error) {
  console.log("Firebase not initialized:", error);
}

export { db };
