import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName") || "Guest";

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="top-left">
          <div className="avatar">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <span className="username">{fullName}</span>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-center">
        <h1>Welcome, {fullName} 👋</h1>
        <p>Your account is protected with OTP-based authentication.</p>
      </div>
    </div>
  );
}
