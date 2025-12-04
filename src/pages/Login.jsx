import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import Island from "../components/Island";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showing, setShowing] = useState("Log In");

  const { login, signup, showToast } = useAuth();

  const cleanErrMsg = (msg) => {
    return msg
      .replace("Firebase: ", "")
      .replace("auth", "")
      .replace("/", "")
      .replace("(", "")
      .replace(")", "")
      .replace("-", " ");
  };

  const handleLogin = async () => {
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      showToast("Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, [1000]);
    } else {
      showToast(`${cleanErrMsg(result.error)}`);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    const result = await signup(email, password);
    if (result.success) {
      showToast("Signup successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, [1000]);
    } else {
      showToast(`${cleanErrMsg(result.error)}`);
    }

    setLoading(false);
  };

  const toggleShowing =(stuff) => {
    if (showing === stuff) return;
    setShowing(stuff)
    setEmail('')
    setPassword('')
  }



  return (
    <div
      className="p-3 d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="border-dark p-4 rounded-4"
        style={{
          width: "90%",
          maxWidth: 500,
          background:
            "linear-gradient(to bottom right, rgba(128, 0, 128, 0.2), transparent, transparent)",
        }}
      >
        <Island />

        <p className="f-10 fw-bold mt-5 mb-4 cursor text-secondary" onClick={()=>navigate('/')}>
          Whisper<span className="text-snow">In</span>
        </p>
        <p className="fw-bold fs-4">Welcome !</p>
        <p className="mb-4">
          Create a new inbox or Log in to see your anonymous messages.
        </p>

        <div
          className="mx-auto mb-5 gap-3"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
        >
          <button
            disabled={loading}
            onClick={() => toggleShowing("Log In")}
            className={`${showing === "Log In" ? "btn-snow" : "btn-darky"}`}
          >
            Log In
          </button>
          <button
            disabled={loading}
            onClick={() => toggleShowing("Sign Up")}
            className={`${showing === "Sign Up" ? "btn-snow" : "btn-darky"}`}
          >
            Sign Up
          </button>
        </div>

        {showing === "Sign Up" && (
          <div>
            <label className="text-secondary fw-bold">Email</label>
            <input
              className="d-block w-100 max-400 my-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="text-secondary fw-bold">Password</label>
            <input
              className="d-block w-100 max-400 my-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="fw-bold f-10 text-secondary">
              Use a strong password - 6 characters or more!
            </p>

            <button
              className="w-100 max-400 d-block mx-auto bg-snow mt-5 mb-4"
              onClick={handleSignup}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        )}

        {showing === "Log In" && (
          <div>
            <label className="text-secondary fw-bold">Email</label>
            <input
              className="d-block w-100 max-400 my-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="text-secondary fw-bold">Password</label>
            <input
              className="d-block w-100 max-400 my-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="fw-bold f-10 text-secondary">
              Passwords are case sensitive
            </p>

            <button
              className="w-100 max-400 d-block mx-auto bg-snow mt-5 mb-4"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
