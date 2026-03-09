import React, { useContext, useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "./login.css";

export default function Login() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        role === "user"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/admin/login";

      const payload =
        role === "user"
          ? { email, password }
          : { username: email, password };

      const res = await axios.post(url, payload);
      const userData = res.data.user || res.data.admin;
      const jwtToken = res.data.token || null;

      login(userData, role, jwtToken);
      alert(res.data.message);
      setError("");

      if (role === "user") navigate("/");
      else navigate("/admin-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className={`login-container ${role === "user" ? "user-bg" : ""}`}>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Login as:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label>Email/Username:</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-box-button">Login</button>

          {/* Forgot Password link */}
          {role === "user" && (
            <p style={{ marginTop: "10px", textAlign: "right" }}>
              <Link to="/forgot-password" style={{ color: "#007bff", textDecoration: "underline" }}>
                Forgot Password?
              </Link>
            </p>
          )}
        </form>

        {/* Google login button only for users */}
        {role === "user" && (
          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              className="login-box-button"
              onClick={() => window.open("http://localhost:5000/api/auth/google", "_self")}
            >
              Sign in with Google
            </button>
          </div>
        )}

        {role === "user" && (
          <p>
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
}
