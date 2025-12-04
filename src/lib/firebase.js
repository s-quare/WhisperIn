import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWGPdzGPJA-Io4GmMIw5BhWMNklAfi7Tg",
  authDomain: "whisperin.gt.tc",
  projectId: "whisperin-40ea4",
  storageBucket: "whisperin-40ea4.firebasestorage.app",
  messagingSenderId: "654270153084",
  appId: "1:654270153084:web:667f8ef8ec93a3c50024f9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;