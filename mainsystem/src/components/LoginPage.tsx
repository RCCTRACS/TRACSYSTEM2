import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://192.168.1.13/capstone/mainsystem/backend/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      // Backend returns: success, userId, role, email, first_name, last_name, full_name
      const data = await res.json();

      if (data.success) {
        // ✅ Store all useful info in localStorage
        localStorage.setItem("authUserId", data.userId?.toString() || "");
        localStorage.setItem("authEmail", data.email || "");
        localStorage.setItem("authName", data.full_name || "");
        localStorage.setItem("authRole", data.role || "");

        // ✅ Redirect after login
        navigate("/auth");
      } else {
        // 🔑 Clear old session if login fails
        localStorage.removeItem("authUserId");
        localStorage.removeItem("authEmail");
        localStorage.removeItem("authName");
        localStorage.removeItem("authRole");
        setErrorMsg(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Wrong email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="RCC TRACS Logo" className="logo" />
        </div>
      </div>

      <div className="right-side">
        <div className="form-card">
          <h2>Log in</h2>
          <p>Welcome to TRAC System</p>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
