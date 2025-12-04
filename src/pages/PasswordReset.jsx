import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loadingRes, setLoadingRes] = useState(false);
  const [doneSent, setDoneSent] = useState(false);
  const { showToast } = useAuth();

  const handlePasswordReset = async () => {
    setLoadingRes(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent!");
        setDoneSent(true);
        setEmail("");
    } catch (error) {
      showToast(error);
    }
    setLoadingRes(false);
  };

  return (
    <div
      className="d-grid p-5"
      style={{ minHeight: "100svh", placeItems: "center" }}
    >
      <div className="w-100 max-400 mx-auto">
        <p className="fw-bolder fs-5 mb-5 text-center">Password Reset</p>
        <label className="d-block pt-1 max-350 mx-auto fw-bold ">Email</label>
        <input
          type="email"
          placeholder="Email Address"
          className="d-block w-100 mx-auto my-3 mb-5 max-350"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loadingRes || email === ""}
          className="px-5 d-block mx-auto btn-snow mt-3 mb-4"
          onClick={handlePasswordReset}
        >
          Send Reset Link
        </button>

        { doneSent &&
          <p className="f-10 fw-bold text-secondary max-350 mx-auto pt-4">
            Password reset link has been sent to your email. Make sure to check your spam folder if you don't see the email in
            your inbox.
          </p>
        }
      </div>
    </div>
  );
};

export default PasswordReset;
