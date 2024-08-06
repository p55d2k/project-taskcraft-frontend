// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZj4KArYSeIpKKRDntWPlGwjrUwvCi6UI",
  authDomain: "taskcraft-backend-1.firebaseapp.com",
  databaseURL:
    "https://taskcraft-backend-1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "taskcraft-backend-1",
  storageBucket: "taskcraft-backend-1.appspot.com",
  messagingSenderId: "944888564574",
  appId: "1:944888564574:web:36f3f74aa6a1c9e7429dcf",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const storage = getStorage(app, "gs://taskcraft-backend-1.appspot.com");
const db = getDatabase(app);

export default app;
export { db, storage };
