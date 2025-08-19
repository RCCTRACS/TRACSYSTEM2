import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut } from "lucide-react"; // ✅ icons
import "./attendance-chart.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";

interface ChartData {
  grade: string;
  percentage: number;
}

const Counter: React.FC<{ target: number; className: string }> = ({ target, className }) => {
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

const AttendanceChart = () => {
  const data: ChartData[] = [
    { grade: "G7", percentage: 100 },
    { grade: "G8", percentage: 84 },
    { grade: "G9", percentage: 93 },
    { grade: "G10", percentage: 76 },
    { grade: "G11", percentage: 35 },
  ];

  const [animate, setAnimate] = useState(false);
  const [sidebarLoaded, setSidebarLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
      setSidebarLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/LoginPage");
  };

  // ✅ close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className={`sidebar-logo ${sidebarLoaded ? "slide-in" : ""}`}>
          <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
        </div>

        {[
          { img: "/Dashboard.png", label: "Dashboard" },
          { img: "/user.png", label: "User Management" },
          { img: "/attendance.png", label: "Attendance Management" },
          { img: "/students.png", label: "Student Management" },
          { img: "/department.png", label: "Department Management" },
          { img: "/grade.png", label: "Grade Management" },
          { img: "/section.png", label: "Section Management" },
          { img: "/strand.png", label: "Strand Management" },
        ].map((item, index) => (
          <div
            key={item.label}
            className={`sidebar-icon ${sidebarLoaded ? "slide-in" : ""}`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="icon-box">
              <img src={item.img} alt={item.label} />
            </div>
            <span className="sidebar-label">{item.label}</span>
          </div>
        ))}
      </aside>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <div className="trac-header">
          <div className="header-left">
            <span className="system-title">TRAC System</span>
            <div className="welcome">Welcome Gerwin Cando!</div>
          </div>

          {/* Profile chip with dropdown */}
          <div className="profile-chip-container" ref={dropdownRef}>
            <div className="profile-chip" onClick={toggleDropdown}>
              <img src="/user.png" alt="Profile" className="profile-chip-icon" />
              <span className="profile-chip-name">Gerwin</span>
              <span className="dropdown-arrow">▼</span>
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item">
                  <Edit className="dropdown-icon" size={18} />
                  <span className="dropdown-text">Edit Profile</span>
                </div>

                <div className="dropdown-separator"></div>

                <div className="dropdown-item" onClick={handleLogout}>
                  <LogOut className="dropdown-icon" size={18} />
                  <span className="dropdown-text">Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="content">
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

          <div className="chart">
            <h3>Total Attendance: {formattedDate}</h3>
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
                <span className="bar-value">{item.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
