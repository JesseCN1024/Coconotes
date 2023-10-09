// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG4o02bvKFfI4p60IeJR8uU5hZJ22m7yQ",
  authDomain: "new-note-2.firebaseapp.com",
  projectId: "new-note-2",
  storageBucket: "new-note-2.appspot.com",
  messagingSenderId: "449663497403",
  appId: "1:449663497403:web:4969a08f156e294be1a59e",
  measurementId: "G-S1FC1SQV6V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
