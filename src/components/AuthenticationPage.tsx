import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthenticationPage.css';

// Import Sora font
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';

const AuthenticationPage: React.FC = () => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpAnimation, setOtpAnimation] = useState<'success' | 'error' | null>(null);
  const navigate = useNavigate();

  const email = localStorage.getItem('authEmail') || '';
  const userId = localStorage.getItem('authUserId') || '';

  const sendOtp = async () => {
    try {
      const res = await fetch('http://192.168.1.13/capstone/mainsystem/backend/send_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), email })
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message || 'Failed to send OTP.');
      } else {
        setErrorMsg(''); // clear any previous error
      }
    } catch (err) {
      setErrorMsg('Failed to send OTP.');
      console.error('Send OTP error:', err);
    }
  };

  useEffect(() => {
    sendOtp();
  }, []);

  useEffect(() => {
    if (verified) {
      // Wait 1 second to show green animation before navigating
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verified, navigate]);

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

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const otp = otpValues.join('');

    try {
      const res = await fetch('http://192.168.1.13/capstone/mainsystem/backend/verify_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), otp })
      });

      const data = await res.json();
      if (data.success) {
        setOtpAnimation('success');
        setVerified(true); // green stays until dashboard
      } else {
        setOtpAnimation('error');
        setErrorMsg(data.message || 'Invalid OTP.');
        setTimeout(() => {
          setOtpAnimation(null); // remove red after 2 seconds
          setErrorMsg('');
        }, 2000);
      }
    } catch {
      setOtpAnimation('error');
      setErrorMsg('Verify OTP Error');
      setTimeout(() => {
        setOtpAnimation(null);
        setErrorMsg('');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      e.key === "Backspace" &&
      otpValues[index] === "" &&
      index > 0
    ) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="login-container" style={{ fontFamily: 'Sora, sans-serif' }}>
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
                  className={`otp-box${otpAnimation ? ' ' + otpAnimation : ''}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  placeholder=" "
                  style={otpAnimation ? { animationDelay: `${index * 0.08}s` } : {}}
                />
              ))}
            </div>

            {verified && <p className="verified-text">OTP Verified!</p>}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            {!verified && (
              <button type="submit" className="continue-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
