import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://192.168.1.13/tracsystem/backend/register.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data: { success: boolean; message?: string } = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "Registration successful!");
        setTimeout(() => navigate("/"), 1500); // Redirect to login
      } else {
        setErrorMsg(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
