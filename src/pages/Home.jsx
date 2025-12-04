import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import Island from "../components/Island";
import { useState } from "react";

const Home = () => {
  const { user, loading, showToast, logout } = useAuth();
  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      showToast("Logged out");
    } else {
      showToast("Error logging out");
    }
  };

  const cleanInput = (searchInput) => {
    if (!searchInput) return "";

    let cleaned = searchInput.trim();

    const lastSlashIndex = cleaned.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      cleaned = cleaned.substring(lastSlashIndex + 1);
    }
    cleaned = cleaned.replace(/[?#/].*$/, "");
    cleaned = cleaned.replace(/[^A-Z0-9]/gi, "");
    cleaned = cleaned.toUpperCase().substring(0, 6);

    return cleaned;
  };

  const handleSearchSubmit = () => {
    const cleanID = cleanInput(searchInput);
    if (cleanID && cleanID.length === 6) {
      navigate(`/u/${cleanID}`);
    } else {
      showToast("Invalid");
      setSearchInput("");
    }
  };

  return (
    <div className="p-4">
      <p className="text-end pe-3 pb-5 fw-bold">
        {loading && <i className="fa-solid fa-user fa-fade"></i>}
        {!loading && user && (
          <span className="cursor" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out"></i> Log out
          </span>
        )}
        {!loading && !user && (
          <span
            onClick={() => navigate("/login")}
            className="cursor text-white"
          >
            <i className="fa-solid fa-sign-in me-1"></i>Login
          </span>
        )}
      </p>

      <Island />

      <p className="text-center my-5 fs-3 fw-bolder">
        Whisper<span className="text-snow">In</span>{" "}
      </p>
      <p className="text-center mb-5">Receive anonymous messages from anyone</p>

      <div
        className="px-3 py-5 max-400 mx-auto border-dark border-2 mb-5 rounded-4 purple-grad"
        style={{
          width: "90%",
          background:
            "linear-gradient(to bottom right, rgba(128, 0, 128, 0.3), transparent, transparent)",
        }}
      >
        <div className="d-flex mb-4 justify-content-center gap-3 f">
          <button
            onClick={() => (user ? navigate("/dashboard") : navigate("/login"))}
            className="btn-snow f-12"
          >
            {user ? "Go to" : "Create"} your inbox
          </button>
          <button
            onClick={() => setShowInput((prev) => !prev)}
            className="btn-darky f-12"
          >
            I have a link
          </button>
        </div>

        <div
          className={`gap-2 px-2 pb-2 max-350 mx-auto`}
          style={{
            display: showInput ? "grid" : "none",
            gridTemplateColumns: "1fr auto",
          }}
        >
          <input
            type="text"
            placeholder="Search URL or WhisperID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            onClick={handleSearchSubmit}
            className="btn-snow px-4"
            disabled={searchInput === ''}
          >
            Go
          </button>
        </div>

        <p className="f-10 text-secondary fw-bolder mt-4 mb-0">
          No sign-in required to send an anonymous message. Share your link with
          anyone.
        </p>
      </div>

      <div className="f-12">
        <p className="fw-bold mb-2">
          Whisper<span className="text-snow">In</span>
        </p>
        <p className="">
          The anonymous messaging platform
          <br />
          Create your personal inbox and share your unique link. Receive honest
          messages from friends, followers and colleagues - completely
          anonymously.
        </p>
        <p className="fw-bold mt-5 text-snow ps-4">How it works</p>

        <div className="flex-scroll max-600 mx-auto">
          <p className="shadow-snow rounded-4 p-3">
            <b className="f-14 d-block mb-3 text-center">
              {" "}
              <i className="fa-solid fa-user-plus me-2 f-12"></i> Create{" "}
            </b>
            Sign up in seconds and get your unique link
          </p>
          <p className="shadow-snow rounded-4 p-3">
            <b className="f-14 d-block mb-3 text-center">
              {" "}
              <i className="fa-solid fa-share-alt me-2 f-12"></i> Share
            </b>
            Add to Instagram, Twitter, Tiktok bios, or share directly
          </p>
          <p className="shadow-snow rounded-4 p-3">
            <b className="f-14 d-block mb-3 text-center">
              {" "}
              <i className="fa-solid fa-comment-dots me-2 f-12"></i> Receive
            </b>
            Check your private dashboard for recent anonymous messages
          </p>
        </div>
        <p className="mt-4 mb-2">This is perfect for: </p>
        <ul>
          <li>
            <b>Influencers: </b>Get genuine feedback from your audience
          </li>
          <li>
            <b>Friend groups: </b>Anonymous confessions and truth bombs
          </li>
          <li>
            <b>Professionals: </b>Anonymous workspace questions
          </li>
          <li>
            <b>Students: </b>Campus confessions and curiosity
          </li>
        </ul>
        <p className="mt-4 mb-2 fw-bold f-14">
          <span className="text-primary">Trust</span> & Safety
        </p>
        <ul>
          <li>
            <b>Moderation tools: </b>Automatically filter inappropriate contents
          </li>
          <li>
            <b>Complete privacy: </b>Senders identities are neither collected
            nor revealed
          </li>
          <li>
            <b>No tracking: </b>Complete anonymity guaranteed
          </li>
        </ul>
        <p className="my-5 text-secondary f-12 fw-bolder">
          Join thousands of users to uncover general or personal opinions, and
          discretely.
          {!user && (
            <span>
              {" "}
              <span
                className="text-snow cursor"
                onClick={() => navigate("/login")}
              >
                Create
              </span>{" "}
              an inbox and let friends Whisper In.
            </span>
          )}
          {user && (
            <span>
              {" "}
              Go to{" "}
              <span
                className="text-snow cursor"
                onClick={() => navigate("/dashboard")}
              >
                dashboard
              </span>{" "}
              to view Whispers.
            </span>
          )}
        </p>
        <p className="text-center mt-5 pt-4 text-secondary fw-bold italics">
          Whisper<span className="text-snow">In</span> by{" "}
          <span className="text-white">Prospa</span>.
        </p>
      </div>
    </div>
  );
};

export default Home;
