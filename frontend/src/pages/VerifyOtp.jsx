import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const verify = async () => {
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.fullName);
      toast.success("OTP verified successfully!");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent!");
      setTimer(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Try later");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="card">
          <h2>OTP Verification</h2>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />

          <button className="auth-btn" onClick={verify}>
            Verify OTP
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
