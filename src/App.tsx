// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainAttendanceScreen } from "@/components/attendance/MainAttendanceScreen";
import { AttendanceConfirmation } from "@/components/attendance/AttendanceConfirmation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainAttendanceScreen />} />
        <Route path="/confirmed" element={<AttendanceConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
