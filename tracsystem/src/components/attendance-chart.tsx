import React, { useState, useEffect } from "react";
import "./attendance-chart.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";

interface ChartData {
  grade: string;
  percentage: number;
}

// Counter with faster animation
const Counter: React.FC<{ target: number; className: string }> = ({ target, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // faster animation (ms)
    const stepTime = Math.max(Math.floor(duration / target), 10); // smoother but fast

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

  // State to trigger bar animation
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
        </div>

        {/* Sidebar Icons with Labels */}
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/dashboard.png" alt="Dashboard" /></div>
          <span className="sidebar-label">Dashboard</span>
        </div>
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/user.png" alt="User Management" /></div>
          <span className="sidebar-label">User Management</span>
        </div>
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/attendance.png" alt="Attendance" /></div>
          <span className="sidebar-label">Attendance Management</span>
        </div>
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/students.png" alt="Students" /></div>
          <span className="sidebar-label">Student Management</span>
        </div>
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/department.png" alt="Department" /></div>
          <span className="sidebar-label">Department Management</span>
        </div>
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/grade.png" alt="Grade" /></div>
          <span className="sidebar-label">Grade Management</span>
        </div>
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/section.png" alt="Section" /></div>
          <span className="sidebar-label">Section Management</span>
        </div>
        <div className="sidebar-icon">
          <div className="icon-box"><img src="/strand.png" alt="Strand" /></div>
          <span className="sidebar-label">Strand Management</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Header */}
        <div className="trac-header">
          <div className="header-left">
            <span className="system-title">TRAC System</span>
            <div className="welcome">Welcome Gerwin Cando!</div>
          </div>
          <div className="profile-chip">
            <img src="/user.png" alt="Profile" className="profile-chip-icon" />
            <span className="profile-chip-name">Gerwin</span>
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
            <h3>Total Attendance: June 16, 2025</h3>
            {data.map((item) => (
              <div key={item.grade} className="bar-row">
                <span className="bar-label">{item.grade}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: animate ? `${item.percentage}%` : "0%",
                      transition: "width 0.8s ease-in-out"
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
