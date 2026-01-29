import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(30);

  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const getStrength = () => {
    if (newPassword.length < 8) return "Weak";
    if (!/[A-Z]/.test(newPassword)) return "Medium";
    if (!/[0-9]/.test(newPassword)) return "Medium";
    if (!/[@$!%*#?&]/.test(newPassword)) return "Medium";
    return "Strong";
  };

  const resendOtp = async () => {
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent successfully!");
      setTimer(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Please try later");
    }
  };

  const reset = async () => {
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to reset password. Check OTP."
      );
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*#?&";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewPassword(pwd);
    toast.info("Secure password generated");
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="card">
          <h2>Reset Password</h2>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {newPassword && (
            <p className={`strength ${getStrength().toLowerCase()}`}>
              Strength: {getStrength()}
            </p>
          )}

          <button className="auth-btn" onClick={reset}>
            Reset Password
          </button>

          <button className="auth-btn secondary" onClick={generatePassword}>
            Generate Secure Password
          </button>

          <button
            className="auth-btn secondary"
            disabled={timer > 0}
            onClick={resendOtp}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
