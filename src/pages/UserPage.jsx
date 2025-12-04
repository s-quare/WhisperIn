import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import TextAreaAutosize from 'react-textarea-autosize';
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isValidUser, setIsValidUser] = useState(false); // setFalse
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // set true
  const [targetProfile, setTargetProfile] = useState(null);

  const {showToast} = useAuth()

  useEffect(() => {
    const checkUserExists = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("whisperId", "==", username.toUpperCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setIsValidUser(false);
      } else {
        const userData = snapshot.docs[0].data();
        setTargetProfile({
            username: userData.username || '',
            bio: userData.bio || '',
        });
        setIsValidUser(true);
        console.log("ok");
      }
      setPageLoading(false);
    };

    checkUserExists();
  }, [username]);

  
  const handleSendMessage= async ()=> {
    if(message.trim() === '') {
        showToast('Message cannot be empty')
        return;
    }
    if(message.trim().length < 4) {
        showToast('Message is too short')
        return;
    }
    setLoading(true);
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('whisperId', '==', username.toUpperCase()));
        const snapshot = await getDocs(q)

        const targetUser = snapshot.docs[0];
        await addDoc(collection(db, 'messages'), {
            targetUserId: targetUser.id,
            whisperId: username.toUpperCase(),
            text: message,
            timestamp: serverTimestamp(),
            anonymous: true,
        });
        showToast('Message sent');
        setMessage('')
    } catch {
        showToast('An error occurred')
    }
    setLoading(false); 
  }

  return (
    <div className="p-4" style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      {pageLoading && (
        <img src="/images/loading.png" className="fa-spin" style={{height: 25}} alt="" />
      )}
      {!pageLoading && !isValidUser && (
        <div className="italics fw-bold text-center f-14">Invalid whisper channel <p className="text-snow" onClick={()=>navigate('/')}>Homepage</p></div>
      )}
      {!pageLoading && isValidUser && (
        <div className="border-dark w-100 max-400 py-4 px-3 rounded-4" style={{background: 'linear-gradient(to bottom right, rgba(128, 0, 128, 0.2), transparent, transparent)'}}>
            <p className="f-10 text-secondary text-end fw-bold capitalize monospace">{targetProfile.username ? `@${targetProfile.username}` : `#${username}`}</p> 
            <p onClick={()=>navigate('/')} className="fw-bold cursor">Whisper<span className="text-snow">In</span></p>
            <p className="fw-bolder">Send me an anonymous message. I'd love to hear your honest thoughts</p>  
            <TextAreaAutosize placeholder={targetProfile.bio ? targetProfile.bio : "Enter anonymous message..."} value={message}  minRows={7} onChange={(e)=>setMessage(e.target.value)} maxRows={12} className="w-100 mt-3 py-3 rounded-0 bg-dark" style={{resize: 'none', scrollbarWidth: 'none'}} />
            <button onClick={handleSendMessage} disabled={!message.trim() || loading} className="btn-snow d-block w-75 px-5 my-4 mx-auto">Send Anonymously</button> 
        </div>
      )}
    </div>
  );
};

export default UserPage;
