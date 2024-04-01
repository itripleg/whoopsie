// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpK8c0NtjXqNeMwmIRrBIjdBkYFbWu6is",
  authDomain: "fakebook-1b26a.firebaseapp.com",
  projectId: "fakebook-1b26a",
  storageBucket: "fakebook-1b26a.appspot.com",
  messagingSenderId: "624899786808",
  appId: "1:624899786808:web:dfc2910568c8dfc3babecd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
