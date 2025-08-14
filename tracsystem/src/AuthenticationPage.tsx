import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const AuthenticationPage: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('authEmail') || '';
  const userId = localStorage.getItem('authUserId') || '';
 const sendOtp = async () => {
      try {
        const res = await fetch('http://localhost/tracsystem/backend/send_otp.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Number(userId), email })
        });

       const data = await res.json();
        
        if (!data.success) {
          setErrorMsg(data.message || 'Failed to send OTP.');
      }
      } catch (err) {
        setErrorMsg('Send OTP Error');

      }
    };
  // 🔹 Send OTP automatically when page load
  
  useEffect(() => {
    
    sendOtp();
  }, []);

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
  
    try {
      const res = await fetch('http://localhost/tracsystem/backend/verify_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), otp })
      });

      const data = await res.json();
      if (data.success) {
        console.log("data success");
        alert('OTP verified successfully!');
        navigate('/dashboard');
      } else {
        console.log("data fail");
        alert("Invalid backend response");
        setErrorMsg(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      console.log("last catch");
      setErrorMsg('Verify OTP Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <h2>OTP Verification</h2>
        <p>We sent a code to: <strong>{email}</strong></p>

        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default AuthenticationPage;
