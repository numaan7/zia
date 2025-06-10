// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  // Replace these with your actual Firebase config values
   apiKey: "AIzaSyCLjRtggYgQt7IKHLrlx8gnJnTi87rGVdA",
  authDomain: "sample-c07f9.firebaseapp.com",
  projectId: "sample-c07f9",
  storageBucket: "sample-c07f9.firebasestorage.app",
  messagingSenderId: "711415598109",
  appId: "1:711415598109:web:1042e597d4e9121e290af4",
  measurementId: "G-B0NKDPW3DF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
