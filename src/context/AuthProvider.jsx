import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { AuthContext } from "./AuthContext";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { format } from "timeago.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const generator = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const signup = async (email, password) => {
    try {
      if (!email || !password) {
        showToast("Email & password required");
        return { success: false, error: "Email and password are required" };
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      let whisperId = "";
      let isUnique = false;

      while (!isUnique) {
        whisperId = generator();
        const snapshot = await getDocs(
          query(collection(db, "users"), where("whisperId", "==", whisperId))
        );
        isUnique = snapshot.empty;
      }

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        whisperId: whisperId,
        createdAt: new Date(),
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      if (isMounted) setUserData(null);
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
      setUserData(doc.data());
    });
    return () => {
      isMounted = false;
      unsubscribeUser();
    };
  }, [user]);

  const showToast = (message) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      close: false,
      position: "center",
      style: {
        background: "white",
        color: "dimgray",
        fontWeight: "bold",
      },
    }).showToast();
  };

  const fallbackCopy = (text) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      if(success) {
        showToast('Copied to clipboard');
      } else {
        showToast('Failed')
      }
    } catch {
      showToast("Copy failed");
    }
  };

  const value = {
    user,
    userData,
    signup,
    login,
    logout,
    loading,
    showToast,
    format,
    fallbackCopy,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
