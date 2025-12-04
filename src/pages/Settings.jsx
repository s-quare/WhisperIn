import TextAreaAutosize from "react-textarea-autosize";
import { useAuth } from "../context/useAuth";
import Socials from "../components/Socials";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { deleteUser } from "firebase/auth";

const Settings = () => {
  const navigate = useNavigate();
  const { user, userData, loading, showToast, logout, fallbackCopy } =
    useAuth();
  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const editUsername = () => {
    setEditingUsername(true);
    setUsername(userData?.username || "");
  };

  const editBio = () => {
    setEditingBio(true);
    setBio(userData?.bio || "");
  };

  const saveUsername = async () => {
    try {
      if (!user || !userData) {
        showToast("Invalid action");
        return false;
      }
      await updateDoc(doc(db, "users", user.uid), {
        username: username,
      });
      setEditingUsername(false);
      showToast("Username updated");
      return true;
    } catch {
      showToast("Error updating username");
      return false;
    }
  };

  const saveBio = async () => {
    try {
      if (!user || !userData) {
        showToast("Invalid action");
        return false;
      }
      await updateDoc(doc(db, "users", user.uid), {
        bio: bio,
      });
      showToast("Bio updated");
      setEditingBio(false);
      return true;
    } catch {
      showToast("Error updating bio");
      return false;
    }
  };

  const userLink = () => {
    const baseURL = window.location.origin;
    const whisperID = userData?.whisperId;
    return `${baseURL}/u/${whisperID}`;
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
    } catch {
      fallbackCopy(text);
    }
  };

  const clearAllMessages = async () => {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, where("targetUserId", "==", user.uid));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      showToast("All messages deleted");
    } catch {
      showToast("Error completing action");
    }
  };

  const deleteReadMessages = async () => {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("targetUserId", "==", user.uid),
        where("read", "==", true)
      );

      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      showToast("Read messages deleted");
    } catch {
      showToast("Error completing action");
    }
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        showToast("You must be logged in");
        return;
      }

      const messagesRef = collection(db, "messages");
      const messageQuery = query(
        messagesRef,
        where("targetUserId", "==", user.uid)
      );
      const messageSnapshot = await getDocs(messageQuery);
      const messageDeletes = messageSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      await Promise.all(messageDeletes);

      await deleteDoc(doc(db, "users", currentUser.uid));

      await deleteUser(currentUser);

      await logout();
      
      showToast("Account deleted");
      navigate("/");
    } catch {
      showToast("Error completing action");
    }
  };

  if (!user) return <></>;

  if (!loading && user && userData)
    return (
      <div className="p-4 bg-blueish" style={{ height: "100svh" }}>
        <div
          className="p-4 pb-3 h-100 rounded-4"
          style={{
            background: "rgba(0,0,0,0.2)",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          <p
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-secondary fw-bold italics cursor"
          >
            <i className="fa-solid fa-angle-left"></i> dashboard
          </p>

          <p className="fs-4 fw-bold">Settings</p>
          <p className="fw-bold text-secondary">
            Control how people see your WhisperIn message box.
          </p>
          <p className="mt-4 f-14 fw-bold">Profile</p>
          <label className="fw-bold">Username</label>
          {!editingUsername && (
            <p className="text-secondary fw-bold">
              <i onClick={editUsername} className="fa-solid fa-edit cursor"></i>{" "}
              {userData?.username || "Not set"}{" "}
            </p>
          )}

          {editingUsername && (
            <div
              className="d-grid max-400 gap-3"
              style={{ gridTemplateColumns: "1fr auto" }}
            >
              <input
                type="text"
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                className="btn-snow f-12"
                onClick={saveUsername}
                disabled={loading}
              >
                Save
              </button>
              <div>
                <button
                  onClick={() => setEditingUsername(false)}
                  className="f-8 bg-secondary mb-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <label className="mt-3 fw-bold">Bio</label>
          {!editingBio && (
            <p className="text-secondary fw-bold">
              <i onClick={editBio} className="fa-solid fa-edit cursor"></i>{" "}
              {userData?.bio || "Not set"}{" "}
            </p>
          )}
          {editingBio && (
            <div>
              <TextAreaAutosize
                placeholder="Enter bio"
                minRows={3}
                maxRows={6}
                className="w-100 my-2 max-400 d-block"
                style={{ resize: "none", scrollbarWidth: "none" }}
                disabled={loading}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                className="btn-darky f-10 mb-1"
                onClick={saveBio}
                disabled={loading}
              >
                Save Bio
              </button>
              <button
                className="f-10 ms-2 bg-secondary"
                onClick={() => setEditingBio(false)}
              >
                Cancel
              </button>
              <p className="text-secondary f-10 fw-bolder">
                Short description that appears above your message form
              </p>
            </div>
          )}

          <p className="mb-2 f-14 mt-4 pt-3 text-secondary">Your unique link</p>
          <div
            className="d-grid max-400 gap-3"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <input
              type="text"
              className="bg-dark opacity-50"
              value={userLink()}
              disabled
            />
            <button className="btn-snow" onClick={() => handleCopy(userLink())}>
              Copy
            </button>
          </div>
          <p className="mb-1 mt-4 fw-bold">Share on socials</p>
          <div className="d-flex gap-1 my-2">
            <Socials />
          </div>

          <p className="mb-1 mt-4 pt-3 f-14 text-secondary fw-bold">
            Data management
          </p>
          <div className="max-400 gap-3">
            <p className="mb-1 mt-3 fw-bold">Clear all messages</p>
            <button
              onClick={() =>
                confirm("This action erases all existing messages") &&
                clearAllMessages()
              }
              className="bg-primary f-12 px-5"
            >
              Clear Inbox
            </button>

            <p className="mb-1 mt-3 fw-bold">Delete read messages</p>
            <button
              onClick={() =>
                confirm("This action deletes all viewed messages") &&
                deleteReadMessages()
              }
              className="btn-snow f-12 px-5"
            >
              Delete read messages
            </button>

            <p className="mb-1 mt-4 pt-3 fw-bold">Account action</p>
            <br />

            <button className="bg-secondary d-block mb-4" onClick={()=>navigate('/change-password')}>Change password</button>


            <button
              onClick={() =>
                confirm(
                  "PERMANENTLY delete your account and ALL data? This action cannot be undone."
                ) && deleteAccount()
              }
              className="bg-danger f-12 px-5"
            >
              Delete Account
            </button>
          </div>

          <p className="mt-5 mb-0 pt-4 fw-bold text-center">
            Whisper<span className="text-snow">In</span>
          </p>
        </div>
      </div>
    );
};

export default Settings;
