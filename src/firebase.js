import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
export default app;