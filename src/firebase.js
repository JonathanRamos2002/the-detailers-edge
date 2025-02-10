// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPPHAHTMNAqKXi6tkbbPCl5tnbBn8EZq8",
  authDomain: "the-detailers-edge.firebaseapp.com",
  databaseURL: "https://the-detailers-edge-default-rtdb.firebaseio.com",
  projectId: "the-detailers-edge",
  storageBucket: "the-detailers-edge.firebasestorage.app",
  messagingSenderId: "964635821212",
  appId: "1:964635821212:web:f535c7a1d910c0d1a51959",
  measurementId: "G-0BZHMF4RP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);