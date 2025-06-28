// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-7ALLDNAa1KPOM8psNObMazB9zSVHCd8",
  authDomain: "billspliter-a98b0.firebaseapp.com",
  projectId: "billspliter-a98b0",
  storageBucket: "billspliter-a98b0.appspot.com",
  messagingSenderId: "317295209956",
  appId: "1:317295209956:web:aab189d5171d0dd4416bf1",
  measurementId: "G-C2GM1PLH41"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);