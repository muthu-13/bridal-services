import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user"); // default
  const [token, setToken] = useState(null); // JWT token

  // 🔹 Login helper
  const login = (userData, userRole = "user", jwtToken = null) => {
    setUser(userData);
    setRole(userRole);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
    if (jwtToken) localStorage.setItem("token", jwtToken);
  };

  // 🔹 Logout helper
  const logout = async () => {
    setUser(null);
    setRole("user");
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // 🔹 Detect login state on page load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");
    const savedToken = localStorage.getItem("token");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole || "user");
      setToken(savedToken);
    } else {
      // Check session from backend (for Google OAuth)
      axios
        .get("http://localhost:5000/api/auth/me", { withCredentials: true })
        .then((res) => {
          if (res.data.user) {
            login(res.data.user, res.data.role || "user");
          }
        })
        .catch(() => {});
    }

    // Check URL for Google token
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("googleToken");
    if (googleToken) {
      // Decode payload to get user info
      const payload = JSON.parse(atob(googleToken.split(".")[1]));
      login({ id: payload.id, email: payload.email, name: payload.name || "" }, "user", googleToken);
      window.history.replaceState({}, document.title, "/"); // remove token from URL
    }
  }, []);

  const value = useMemo(() => ({ user, role, token, login, logout }), [user, role, token]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 🔹 Custom hook
export const useUser = () => useContext(UserContext);
