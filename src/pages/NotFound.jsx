import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { user, } = useAuth();
  const navigate = useNavigate();
  return (
    <div
      className="d-flex flex-column p-4 text-center"
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <div className="d-flex cursor mb-4">
        <div className="border-dark d-inline-block text-center px-3 py-1 f-12 rounded-5 mx-auto">
          <span
            className="bg-snow pb-2 rounded-pill me-2 d-inline-block"
            style={{ height: 10, width: 10 }}
          ></span>
          Private, anonymous messaging
        </div>
      </div>

      <p style={{ fontSize: "60px" }} className="fw-bolder monospace">
        4
        <span className="d-inline-block" style={{ transform: "rotate(20deg)" }}>
          0
        </span>
        4
      </p>
      <p className="capitalize fs-5 fw-bold">
        This whisper doesn't seem to exist
      </p>
      <p>
        The link you followed my be broken, expired, or never existed. <br />{" "}
        Your messages stays private and safe
      </p>

      <div
        style={{ gridTemplateColumns: "1fr 1fr" }}
        className="d-grid gap-3 my-4"
      >
        <button
          onClick={() => navigate("/", { replace: true })}
          className="btn-snow f-12"
        >
          Go back home
        </button>
        {user && (
          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="btn-darky f-12"
          >
            Dashboard
          </button>
        )}
        {!user && (
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="btn-darky f-12"
          >
            Join Whisper
          </button>
        )}
      </div>

      {user && (
        <p className="text-secondary fw-bold mt-5 f-10">
          <i className="fa-solid fa-circle text-snow f-8 me-2"></i>
          Tip: Share only the exact link from your dashboard or settings to
          receive anonymous messages.
        </p>
      )}
      {!user && (
        <p className="text-secondary fw-bold mt-5 f-10">
            <i className="fa-solid fa-circle text-snow f-8 me-2"></i>
          Tip: Enter the Whisper link in your browser, or use 'I have a link' on
          the homepage to send a message.
        </p>
      )}
    </div>
  );
};

export default NotFound;
