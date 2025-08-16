import {
  Users,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  User,
} from "lucide-react";
import "./attendance-chart.css";

interface ChartData {
  grade: string;
  percentage: number;
}

const AttendanceChart = () => {
  const data: ChartData[] = [
    { grade: "G7", percentage: 100 },
    { grade: "G8", percentage: 84 },
    { grade: "G9", percentage: 93 },
    { grade: "G10", percentage: 76 },
    { grade: "G11", percentage: 35 },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <LayoutDashboard />
        <CalendarDays />
        <BarChart3 />
        <Users />
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Header */}
        <div className="trac-header">
          <div className="header-left">
            <div className="logo-title">
              <img src="/logo.png" alt="Logo" className="header-logo" />
              <span className="system-title">TRAC System</span>
            </div>
            <div className="welcome">Welcome Gerwin Cando!</div>
          </div>
          <div className="profile-chip">
            <User className="profile-chip-icon" />
            <span className="profile-chip-name">Gerwin</span>
          </div>
        </div>

        <div className="content">
          {/* Stats */}
          <div className="stats">
            <div className="card">
              <p className="label">Total Present</p>
              <p className="value green">146</p>
            </div>
            <div className="card">
              <p className="label">Total Late</p>
              <p className="value yellow">50</p>
            </div>
            <div className="card">
              <p className="label">Total Absent</p>
              <p className="value red">160</p>
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
                    style={{ width: `${item.percentage}%` }}
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
