// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_PWTFOALpje36iZmpsD4iRynglUkKiyM",
  authDomain: "devbits-finance-tracker.firebaseapp.com",
  projectId: "devbits-finance-tracker",
  storageBucket: "devbits-finance-tracker.firebasestorage.app",
  messagingSenderId: "694322590951",
  appId: "1:694322590951:web:b08e92220f0afffce6de42",
  measurementId: "G-R62843SD6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};
