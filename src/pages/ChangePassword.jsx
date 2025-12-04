import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { changePassword, showToast } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("New password do not match");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password should be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await changePassword(currentPassword, newPassword);

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password changed successfully");
      navigate("/dashboard", { replace: true });
    } else {
      showToast(result.error || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div
      className="d-grid p-5"
      style={{ minHeight: "100svh", placeItems: "center" }}
    >
      <div className="w-100 mx-auto p-3 max-400">
        <p className="f-14 text-center fw-bold">Change Password</p>

        <form onSubmit={handleSubmit} className="p-3">
          <label className="fw-bold text-secondary">Current Password</label>
          <input
            type="password"
            className="d-block w-100 mt-2 max 350"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
            disabled={loading}
          />

          <label className="fw-bold mt-4 text-secondary">New Password</label>
          <input
            type="password"
            className="d-block w-100 mt-2 max 350"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            disabled={loading}
          />

          <label className="fw-bold mt-4 text-secondary">
            Confirm New Password
          </label>
          <input
            type="password"
            className="d-block w-100 mt-2 max 350"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            disabled={loading}
          />

          <p className="mt-4 f-10 text-secondary fw-bold">Don't remember your password? Use <span onClick={()=>navigate('/reset')} className="text-snow">Forgot password</span></p>

          <button
            disabled={loading || currentPassword === "" || newPassword === "" || confirmPassword === ""}
            type="submit"
            className="btn-snow d-block w-75 mx-auto mt-5 mb-3 max-350"
          >
            {loading ? "Please Wait" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
