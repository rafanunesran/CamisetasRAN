import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAWZEZskuEMIby9dr5iWfH2G3nsXj14gr4",
  authDomain: "camisetasran.firebaseapp.com",
  projectId: "camisetasran",
  storageBucket: "camisetasran.firebasestorage.app",
  messagingSenderId: "983902425471",
  appId: "1:983902425471:web:c072c921574fd2415d8a4a",
  measurementId: "G-6FJGXVCYV6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, analytics };