import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent
} from "react";
import { useNavigate } from "react-router-dom";
import "./AuthenticationPage.css";

// Fonts
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";

const AuthenticationPage: React.FC = () => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpAnimation, setOtpAnimation] = useState<"success" | "error" | null>(
    null
  );
  const navigate = useNavigate();

  // Pull login info from localStorage
  const email = localStorage.getItem("authEmail") || "";
  const userId = localStorage.getItem("authUserId") || "";

  // 🔹 Send OTP on component mount
  const sendOtp = async () => {
    try {
      const res = await fetch(
        "http://192.168.0.137/capstone/mainsystem/backend/send_otp.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: Number(userId), email })
        }
      );

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message || "Failed to send OTP.");
      } else {
        setErrorMsg(""); // clear any old error
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setErrorMsg("Failed to send OTP.");
    }
  };

  useEffect(() => {
    sendOtp();
  }, []);

  // 🔹 Redirect after verification
  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => {
        const role = localStorage.getItem("userRole");

        if (role && role.toLowerCase() === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verified, navigate]);

  // 🔹 Handle OTP input change
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otpValues];
      newOtp[index] = value;
      setOtpValues(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // 🔹 Submit OTP
  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const otp = otpValues.join("");

    try {
      const res = await fetch(
        "http://192.168.0.137/capstone/mainsystem/backend/verify_otp.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: Number(userId), otp })
        }
      );

      const data = await res.json();
      if (data.success) {
        setOtpAnimation("success");
        setVerified(true);

        // Save user info (role, name, etc.) for later use
        if (data.user) {
          localStorage.setItem("userRole", data.user.role || "");
          localStorage.setItem("userFirstName", data.user.first_name || "");
          localStorage.setItem("userLastName", data.user.last_name || "");
          localStorage.setItem("userFullName", data.user.full_name || "");
        }
      } else {
        setOtpAnimation("error");
        setErrorMsg(data.message || "Invalid OTP.");
        setTimeout(() => {
          setOtpAnimation(null);
          setErrorMsg("");
        }, 2000);
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setOtpAnimation("error");
      setErrorMsg("Verify OTP Error");
      setTimeout(() => {
        setOtpAnimation(null);
        setErrorMsg("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Backspace handler
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="login-container" style={{ fontFamily: "Sora, sans-serif" }}>
      {/* LEFT SIDE */}
      <div className="left-side">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="RCC TRACS Logo" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-side">
        <div className="form-card">
          <h2>Authentication</h2>
          <p>We’ve sent a one-time password to your email</p>

          <form onSubmit={handleOtpSubmit}>
            <div className="otp-container">
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  className={`otp-box${otpAnimation ? " " + otpAnimation : ""}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  placeholder=" "
                  style={
                    otpAnimation ? { animationDelay: `${index * 0.08}s` } : {}
                  }
                />
              ))}
            </div>

            {verified && <p className="verified-text">OTP Verified!</p>}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            {!verified && (
              <button type="submit" className="continue-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
