import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import Socials from "../components/Socials";
import {
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const Dashboard = () => {
  const { user, userData, showToast, loading, format, fallbackCopy } =
    useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currFilter, setCurrFilter] = useState("all");
  const [pageLoading, setPageLoading] = useState(true);
  const [modalShowing, setModalShowing] = useState(false);
  const [eye, showEye] = useState(false);

  useEffect(() => {
    if (modalShowing) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }
    return () => {
      document.body.style.overflowY = "";
    };
  }, [modalShowing]);

  const filteredMessages = useMemo(() => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let result = messages;

    if (currFilter === "read")
      result = messages.filter((msg) => msg.read === true);
    if (currFilter === "unread")
      result = messages.filter((msg) => msg.read !== true);
    if (currFilter === "recent")
      result = messages.filter(
        (msg) => new Date(msg.timestamp.toDate()) > yesterday
      );
    return result.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
  }, [messages, currFilter]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, navigate, loading]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "messages"),
      where("targetUserId", "==", user.uid)
      //orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      setPageLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const markRead = async (messageId) => {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch {
      showToast("Unknown error");
    }
  };

  const handleView = async (msgId) => {
    const targetMessage = messages.find((msg) => msg.id === msgId);
    if (!targetMessage.read) {
      await markRead(msgId);
    }
    setModalShowing(targetMessage);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
    } catch {
      fallbackCopy(text);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      showToast("Whisper deleted");
      setModalShowing(false);
    } catch {
      showToast("Error");
    }
  };

  const captureMessage = async () => {
    try {
      const element = document.querySelector(".TargetCapture");
      const canvas = await html2canvas(element, {
        scale: 3,
        logging: false,
        backgroundColor: "rgb(18, 17, 33)",
      });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `WhisperIn-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Captured");
    } catch (error) {
      showToast("Capture error: ", error);
      console.log(error);
    }
  };

  const userLink = () => {
    const baseURL = window.location.origin;
    const whisperID = userData?.whisperId;
    return `${baseURL}/u/${whisperID}`;
  };

  if (loading)
    return (
      <div
        className="d-grid "
        style={{ height: "100svh", placeItems: "center" }}
      >
        <img
          className="fa-spin"
          src="/images/loading.png"
          style={{ height: 40 }}
        />
      </div>
    );

  if (!loading && !user) return <></>;

  if (!loading && user)
    return (
      <div className="p-4">
        <div className="d-flex pb-4 mt-2 fs-2 justify-content-between">
          <p className="f-14 fw-bolder">
            Whisper<span className="text-snow">In</span>
          </p>
          <span className="d-flex gap-3">
            <i
              onClick={() => navigate("/")}
              className="fa-solid fa-home text-secondary cursor"
            ></i>
            <i
              onClick={() => navigate("/setting")}
              className="fa-solid fa-gear text-secondary cursor"
            ></i>
          </span>
        </div>

        <p className="fw-bold mb-1 f-14">
          Welcome back,{" "}
          {userData?.username
            ? `@${userData?.username}`
            : `#${userData?.whisperId}`}
          .
        </p>

        <div className="py-4">
          <div className="text-secondary fw-bolder">
            Share your whisper link{" "}
            <span className="d-block mt-2">
              {userLink()}{" "}
              <span className="cursor" onClick={() => handleCopy(userLink())}>
                <i className="fa-solid fa-copy ms-2"></i>
                copy
              </span>
            </span>
          </div>

          <div className="d-flex gap-1 pt-2 pb-3">
            <Socials />
          </div>

          <p className="text-secondary mt-3 mb-1 f-10 fw-bolder">
            {userData?.email.toLowerCase()}
          </p>
          {userData.username && (
            <p className="text-secondary f-10 fw-bolder">
              Display name - {userData?.username.toLowerCase()}
            </p>
          )}

          <button
            onClick={() => navigate("/setting")}
            className="d-block btn-darky my-3 f-12"
          >
            Edit profile
          </button>
        </div>

        <div className="d-flex flex-scroll mt-4 p-2 gap-2">
          {[
            ["Total messages", messages.length],
            ["Unread", messages.filter((msg) => msg.read !== true).length],
            [
              "Recent",
              messages.filter(
                (msg) =>
                  new Date(msg.timestamp.toDate()) >
                  new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
              ).length,
            ],
          ].map((item, index) => (
            <div
              style={{ maxWidth: 150 }}
              className="border-dark shadow-snow px-3 py-2 rounded-3"
              key={index}
            >
              <div className="f-8 text-secondary fw-bold">{item[0]}</div>
              <div className="f-16 text-snow fw-bolder">{item[1]}</div>
            </div>
          ))}
        </div>

        <div className="d-flex gap-2 mt-4">
          <button
            onClick={() => setCurrFilter("all")}
            className={`btn-darky border-2 ${
              currFilter !== "all" && "border"
            } f-10 rounded-4`}
          >
            All
          </button>
          <button
            onClick={() => setCurrFilter("unread")}
            className={`btn-darky border-2 ${
              currFilter !== "unread" && "border"
            } f-10 rounded-4`}
          >
            Unread
          </button>
          <button
            onClick={() => setCurrFilter("read")}
            className={`btn-darky border-2 ${
              currFilter !== "read" && "border"
            } f-10 rounded-4`}
          >
            Read
          </button>
          <button
            onClick={() => setCurrFilter("recent")}
            className={`btn-darky border-2 ${
              currFilter !== "recent" && "border"
            } f-10 rounded-4`}
          >
            Last 24hrs
          </button>
        </div>

        <div className="MessagesParent my-4 max-600">
          <p className="fw-bold pt-4 text-snow">Whispers</p>

          {pageLoading && (
            <div
              style={{
                padding: "10px 0",
                placeItems: "center",
                display: "grid",
              }}
            >
              <img
                src="/images/loading.png"
                className="fa-spin"
                alt=""
                style={{ height: 30 }}
              />
            </div>
          )}

          {!pageLoading &&
            filteredMessages.length > 0 &&
            filteredMessages.map((msg) => (
              <div
                className={`MessageParentChild cursor px-3 py-2 border-dark border-2 rounded-3`}
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                key={msg.id}
                onClick={() => handleView(msg.id, msg.text)}
              >
                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <span className="text-secondary fw-bold f-10">
                    {msg.read ? (
                      "Read"
                    ) : (
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-circle f-8 me-1 text-snow"></i>
                        Unread
                      </span>
                    )}
                  </span>
                  <span className="text-secondary fw-bolder italics">
                    {format(msg.timestamp?.toDate())}
                  </span>
                </div>
                <p>
                  {msg.text.slice(0, 100)}
                  {msg.text.length >= 100 && "..."}
                </p>
                <p className="mb-1 f-10 fw-bold text-secondary">
                  {msg.timestamp?.toDate().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          {!pageLoading && filteredMessages.length === 0 && (
            <div
              className="d-grid fw-bolder fs-5 text-secondary italics"
              style={{ minHeight: 100, placeItems: "center" }}
            >
              No messages
            </div>
          )}
        </div>

        {modalShowing && (
          <div
            className="FixedGuy py-5 bg-blueish"
            style={{
              height: "100svh",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              maxWidth: 800,
              margin: "0 auto",
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              style={{ minHeight: "80%", placeItems: "center" }}
              className="TargetCapture w-100 d-grid max-600 p-5 "
            >
              <div
                className="p-4 rounded-4 max-500"
                style={{
                  minHeight: "20%",
                  width: "100%",
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                <span
                  onClick={() => setModalShowing(false)}
                  className="d-block mb-4 ps-2 f-10 text-secondary fw-bold cursor italics"
                >
                  <i className="fa-solid fa-angle-left"></i> return
                </span>
                <p className="fw-bolder mt-3 mb-0">
                  Whisper<span className="text-snow">In</span>
                </p>
                <p className="mt-2 mb-0 f-8 text-secondary fw-bold">
                  <i
                    className="fa-solid fa-eye me-2 cursor"
                    onClick={() => showEye((prev) => !prev)}
                  ></i>
                  {eye ? (
                    "░░░░░░░░░░░░░░░░░░░░"
                  ) : (
                    <span>
                      Received{" "}
                      {modalShowing.timestamp.toDate().toLocaleString()}
                    </span>
                  )}
                </p>
                <p className="my-5" style={{ whiteSpace: "pre-wrap" }}>
                  {modalShowing.text}
                </p>
                <div className="d-flex gap-3 f-12 fw-bolder text-secondary">
                  <span
                    className="cursor text-snow"
                    onClick={() => handleCopy(modalShowing.text)}
                  >
                    <i className="fa-solid fa-copy"></i>
                  </span>
                  <span
                    className="cursor text-white"
                    onClick={() => captureMessage()}
                  >
                    <i className="fa-solid fa-camera"></i>
                  </span>
                  <span
                    className="text-danger cursor"
                    onClick={() =>
                      confirm("Deleting message can't be reversed") &&
                      handleDeleteMessage(modalShowing.id)
                    }
                  >
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Dashboard;
