// src/pages/DashboardPage.tsx
import { AdminLayout } from "@/components/AdminLayout";
import { Dashboard } from "@/components/Dashboard"; // ✅ make sure this matches actual file

const DashboardPage = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default DashboardPage;
