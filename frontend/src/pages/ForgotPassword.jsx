import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      localStorage.setItem("email", email);

      toast.success("OTP sent to your registered email.");
      navigate("/reset-password");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="card">
          <h2>Forgot Password</h2>

          <input
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="auth-btn"
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="link">
            <span onClick={() => navigate("/")}>Back to Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}
