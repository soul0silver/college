// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyANiSYHRwgwoidPprEAzHMmsXRnJs6xJAM",
  authDomain: "my-pj-24c59.firebaseapp.com",
  projectId: "my-pj-24c59",
  storageBucket: "my-pj-24c59.appspot.com",
  messagingSenderId: "883024141653",
  appId: "1:883024141653:web:4828e7ef779435f181e3dc",
  measurementId: "G-QP6FYB1EW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app;
