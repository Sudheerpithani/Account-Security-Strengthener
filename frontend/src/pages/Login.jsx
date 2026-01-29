import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";
import { toast } from "react-toastify";
import Bgcover from "../assets/bg-cover.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all details.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/login", { email, password });
      localStorage.setItem("email", email);

      toast.success("OTP sent to your registered email.");
      navigate("/verify-otp");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div className="top-left">
          <div className="avatar">G</div>
          <span className="username">Guest</span>
        </div>
      </div>

      <div className="auth-bg">
        <div className="auth-container">
          <div className="card auth-card">
            <div className="covercard">
              <img src={Bgcover} alt="cover" />
            </div>

            <div className="auth-form">
              <h2>Login</h2>

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#667eea",
                    userSelect: "none",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              <button
                className="auth-btn"
                onClick={login}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Login"}
              </button>

              <div className="link">
                New User?{" "}
                <span onClick={() => navigate("/register")}>Register</span> |{" "}
                <span onClick={() => navigate("/forgot-password")}>
                  Forgot Password
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
