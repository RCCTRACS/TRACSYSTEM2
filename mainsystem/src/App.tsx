import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import AuthenticationPage from "./components/AuthenticationPage";

import DashboardPage from "./pages/DashboardPage"; // ✅ Admin Dashboard
import SubjectManagementPage from "./pages/SubjectManagementPage";
import DepartmentManagementPage from "./pages/DepartmentManagementPage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import GradeManagementPage from "./pages/GradeManagementPage";
import SectionManagementPage from "./pages/SectionManagementPage";
import StrandManagementPage from "./pages/StrandManagementPage";
import TracDashboard from "./pages/TracDashboard"; // ✅ Teacher Dashboard
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherStudents from "./pages/TeacherStudents";
import NotFound from "./pages/NotFound";

// ✅ Layout for teacher sidebar
import TeacherLayout from "./components/TeacherLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ================= Auth Routes ================= */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth" element={<AuthenticationPage />} />

          {/* ================= Admin Routes ================= */}
          <Route path="/dashboard" element={<DashboardPage />} /> {/* Admin Dashboard */}
          <Route path="/usermanagement" element={<UserManagementPage />} />
          <Route path="/subjects" element={<SubjectManagementPage />} />
          <Route path="/departments" element={<DepartmentManagementPage />} />
          <Route path="/attendances" element={<AttendanceManagementPage />} />
          <Route path="/students" element={<StudentManagementPage />} />
          <Route path="/grades" element={<GradeManagementPage />} />
          <Route path="/sections" element={<SectionManagementPage />} />
          <Route path="/strands" element={<StrandManagementPage />} />

          {/* ================= Teacher Routes (with persistent sidebar) ================= */}
          <Route element={<TeacherLayout />}>
            <Route path="/teacher-dashboard" element={<TracDashboard />} />
            <Route path="/teacher-attendance" element={<TeacherAttendance />} />
            <Route path="/teacher-students" element={<TeacherStudents />} />
          </Route>

          {/* ================= Catch-all ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
