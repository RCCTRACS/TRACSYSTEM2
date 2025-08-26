import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubjectManagementPage from "./pages/SubjectManagementPage";
import DepartmentManagementPage from "./pages/DepartmentManagementPage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";
import DashboardPage from "./pages/DashboardPage";
import StudentManagementPage from "./pages/StudentManagementPage"; // ✅ Import Student page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subjects" element={<SubjectManagementPage />} />
          <Route path="/departments" element={<DepartmentManagementPage />} />
          <Route path="/attendances" element={<AttendanceManagementPage />} />
          <Route path="/dashboards" element={<DashboardPage />} />
          <Route path="/students" element={<StudentManagementPage />} /> {/* ✅ Student route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
