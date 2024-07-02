// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI7QJjr4P7-rmCHrx4GeQ0b_uAnYLlL5U",
  authDomain: "cweb2-dev.firebaseapp.com",
  databaseURL: "https://cweb2-dev-default-rtdb.firebaseio.com",
  projectId: "cweb2-dev",
  storageBucket: "cweb2-dev.appspot.com",
  messagingSenderId: "236372839443",
  appId: "1:236372839443:web:fbd34b280a692cba68c3e6",
  measurementId: "G-TMHJQTH4G5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);