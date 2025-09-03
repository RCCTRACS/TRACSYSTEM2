import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import AuthenticationPage from "./components/AuthenticationPage";

import DashboardPage from "./pages/DashboardPage";
import SubjectManagementPage from "./pages/SubjectManagementPage";
import DepartmentManagementPage from "./pages/DepartmentManagementPage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import GradeManagementPage from "./pages/GradeManagementPage";      
import SectionManagementPage from "./pages/SectionManagementPage";   
import StrandManagementPage from "./pages/StrandManagementPage";   


import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ First page: Login */}
          <Route path="/" element={<LoginPage />} />

          {/* ✅ After login, go to Authentication (OTP) */}
          <Route path="/auth" element={<AuthenticationPage />} />

          {/* ✅ After OTP, go to Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Management Pages */}
          <Route path="/usermanagement" element={<UserManagementPage />} />
          <Route path="/subjects" element={<SubjectManagementPage />} />
          <Route path="/departments" element={<DepartmentManagementPage />} />
          <Route path="/attendances" element={<AttendanceManagementPage />} />
          <Route path="/students" element={<StudentManagementPage />} />
          <Route path="/grades" element={<GradeManagementPage />} />       
          <Route path="/sections" element={<SectionManagementPage />} />
          <Route path="/strands" element={<StrandManagementPage />} />

          {/* Catch-all for invalid routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
