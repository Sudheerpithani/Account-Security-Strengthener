import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../App.css";
import { toast } from "react-toastify";
import Bgcover from "../assets/bg-cover.png";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const passwordStrength = () => {
    if (password.length < 8) return "Weak";
    if (!/[A-Z]/.test(password)) return "Medium";
    if (!/\d/.test(password)) return "Medium";
    if (!/[@$!%*#?&]/.test(password)) return "Medium";
    return "Strong";
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*#?&";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pwd);
    toast.info("Secure password generated");
  };

  const submit = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all details.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include letters, numbers, and a special symbol."
      );
      return;
    }

    try {
      await api.post("/auth/register", { fullName, email, password });
      toast.success("Registered successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="card auth-card">
          <div className="covercard">
            <img src={Bgcover} alt="cover" />
          </div>

          <div className="auth-form">
            <h2>Register</h2>

            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {password && (
              <p className={`strength ${passwordStrength().toLowerCase()}`}>
                Strength: {passwordStrength()}
              </p>
            )}

            <p style={{ fontSize: "12px", color: "#666" }}>
              Password must include letters, numbers, and a special character.
            </p>

            <button className="auth-btn secondary" onClick={generatePassword}>
              Generate Secure Password
            </button>

            <button className="auth-btn" onClick={submit}>
              Register
            </button>

            <div className="link">
              Already have an account?{" "}
              <span onClick={() => navigate("/")}>Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
