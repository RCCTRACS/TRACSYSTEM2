import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import AuthenticationPage from "./AuthenticationPage";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<LoginPage />} />

        {/* OTP verification */}
        <Route path="/auth" element={<AuthenticationPage />} />

        {/* Registration */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard after OTP */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Catch-all */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
