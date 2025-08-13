import { BrowserRouter, Routes, Route } from "react-router-dom";

// TRAC System Pages
import LoginPage from "./LoginPage";
import AuthenticationPage from "./AuthenticationPage";
import RegisterPage from "./RegisterPage";

// ✅ Replace DashboardPage with AttendanceChart
import AttendanceChart from "./components/attendance-chart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==== TRAC SYSTEM ROUTES ==== */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Dashboard now shows AttendanceChart */}
        <Route path="/dashboard" element={<AttendanceChart />} />

        {/* ==== FALLBACK ==== */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
