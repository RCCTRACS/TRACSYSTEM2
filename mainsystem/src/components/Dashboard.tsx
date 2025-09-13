import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";

const API_URL =
  "http://192.168.0.137/capstone/mainsystem/backend/attendance_api.php";

interface Attendance {
  id: string;
  barcode_id: string;
  student_name: string;
  year_level: string;
  department: string;
  time_in: string;
  time_out: string | null;
  status: string; // Present | Absent | Late
}

interface ChartData {
  label: string;
  count: number;
}

// ✅ Animated Counter
const Counter: React.FC<{ target: number; className: string }> = ({
  target,
  className
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 800; // total animation time
    const stepTime = Math.max(Math.floor(duration / (target || 1)), 20);

    const timer = setInterval(() => {
      current += 1;
      setCount((prev) => {
        if (prev >= target) {
          clearInterval(timer);
          return target;
        }
        return prev + 1;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <p className={`value ${className}`}>{count}</p>;
};

export const Dashboard: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [animate, setAnimate] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateTime, setDateTime] = useState<string>("");

  const navigate = useNavigate();

  // ✅ Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        setAttendances(data);

        // --- Compute Stats ---
        const present = data.filter((a) => a.status === "Present").length;
        const late = data.filter((a) => a.status === "Late").length;
        const absent = data.filter((a) => a.status === "Absent").length;

        setStats({ present, late, absent });

        // --- Compute Department/Grade Breakdown ---
        const grouped: Record<string, number> = {};
        data.forEach((a) => {
          let dept = a.department.trim().toUpperCase();
          let key = dept;

          if (dept === "JHS") {
            key = a.year_level.trim(); // Grade 7–10
          } else if (dept === "SHS") {
            key = a.year_level.trim(); // Grade 11–12
          }

          grouped[key] = (grouped[key] || 0) + 1;
        });

        // --- Convert to chart data & sort highest → lowest ---
        const chartArr = Object.entries(grouped)
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count);

        setChartData(chartArr);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

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
        day: "numeric"
      };
      const dateStr = now.toLocaleDateString("en-US", options);
      const timeStr = now.toLocaleTimeString("en-US", { hour12: true });
      setDateTime(`${dateStr} | ${timeStr}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
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
              <img
                src="/user.png"
                alt="Profile"
                className="profile-chip-icon"
              />
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
              <Counter target={stats.present} className="green" />
            </div>
            <div className="card">
              <p className="label">LATE</p>
              <Counter target={stats.late} className="yellow" />
            </div>
            <div className="card">
              <p className="label">ABSENT</p>
              <Counter target={stats.absent} className="red" />
            </div>
          </div>

          {/* Chart */}
          <div className="chart">
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "700",
                marginBottom: "15px"
              }}
            >
              Total Attendance: {dateTime}
            </h3>
            {chartData.map((item) => (
              <div key={item.label} className="bar-row">
                <span className="bar-label">{item.label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: animate
                        ? `${(item.count / (attendances.length || 1)) * 100}%`
                        : "0%",
                      transition: "width 0.8s ease-in-out"
                    }}
                  />
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
