// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALBAot8B7yFo-sCObaleoaA1sbpAstYCY",
  authDomain: "casamento-90fc8.firebaseapp.com",
  projectId: "casamento-90fc8",
  storageBucket: "casamento-90fc8.firebasestorage.app",
  messagingSenderId: "551558262370",
  appId: "1:551558262370:web:9b67adf2f6ecea03d72b3b",
  measurementId: "G-HHKXWJPJBR"
};

export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);