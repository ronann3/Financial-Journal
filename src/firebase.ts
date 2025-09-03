// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_TPi5IwD9ApdiDl3iDpXbOmI4hDVEgwk",
  authDomain: "financial-journal-36a96.firebaseapp.com",
  projectId: "financial-journal-36a96",
  storageBucket: "financial-journal-36a96.firebasestorage.app",
  messagingSenderId: "142345105299",
  appId: "1:142345105299:web:9c0e9cf82982910f588266",
  measurementId: "G-QDC9BH1M74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }