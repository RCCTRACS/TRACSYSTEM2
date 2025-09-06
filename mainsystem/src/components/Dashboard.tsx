import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // make sure filename matches case
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";

interface ChartData {
  grade: string;
  percentage: number;
}

const Counter: React.FC<{ target: number; className: string }> = ({
  target,
  className,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = Math.max(Math.floor(duration / target), 10);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === target) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <p className={`value ${className}`}>{count}</p>;
};

export const Dashboard: React.FC = () => {
  const data: ChartData[] = [
    { grade: "G7", percentage: 100 },
    { grade: "G8", percentage: 84 },
    { grade: "G9", percentage: 93 },
    { grade: "G10", percentage: 76 },
    { grade: "G11", percentage: 35 },
  ];

  const [animate, setAnimate] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateTime, setDateTime] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Live date and time updater (with AM/PM)
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const dateStr = now.toLocaleDateString("en-US", options);
      const timeStr = now.toLocaleTimeString("en-US", { hour12: true }); // ✅ AM/PM

      setDateTime(`${dateStr} | ${timeStr}`);
    };

    updateDateTime(); // run immediately
    const interval = setInterval(updateDateTime, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem("sidebarHasAnimated");
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="main">
        {/* Header */}
        <div className="trac-header">
          <div className="header-left">
            <span className="system-title">TRAC System</span>
            <div className="welcome">Welcome, Gerwin Cando!</div>
          </div>

          {/* Profile chip with dropdown */}
          <div className="profile-chip-container">
            <div className="profile-chip" onClick={toggleDropdown}>
              <img src="/user.png" alt="Profile" className="profile-chip-icon" />
              <span className="profile-chip-name">Gerwin</span>
              <span className="dropdown-arrow">▼</span>
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item">✏️ Edit Profile</div>
                <div className="dropdown-item" onClick={handleLogout}>
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* Stats */}
          <div className="stats">
            <div className="card">
              <p className="label">PRESENT</p>
              <Counter target={146} className="green" />
            </div>
            <div className="card">
              <p className="label">LATE</p>
              <Counter target={50} className="yellow" />
            </div>
            <div className="card">
              <p className="label">ABSENT</p>
              <Counter target={160} className="red" />
            </div>
          </div>

          {/* Chart */}
          <div className="chart">
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              Total Attendance: {dateTime}
            </h3>
            {data.map((item) => (
              <div key={item.grade} className="bar-row">
                <span className="bar-label">{item.grade}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: animate ? `${item.percentage}%` : "0%",
                      transition: "width 0.8s ease-in-out",
                    }}
                  />
                </div>
                <span className="bar-value">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
  