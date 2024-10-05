import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYlheELZdcFK5P5vtK_yA_9wHN0y7FiiQ",
  authDomain: "tripzit-8e7af.firebaseapp.com",
  projectId: "tripzit-8e7af",
  storageBucket: "tripzit-8e7af.appspot.com",
  messagingSenderId: "650366038574",
  appId: "1:650366038574:web:1b44ddaf7f1b1284fea5bf",
  measurementId: "G-7ZPQ564M4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
