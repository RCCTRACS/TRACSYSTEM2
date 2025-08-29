// src/pages/AttendanceManagementPage.tsx
import { AdminLayout } from "@/components/AdminLayout";
import { AttendanceManagement } from "@/components/AttendanceManagement";

const AttendanceManagementPage = () => {
  return (
    <AdminLayout>
      <AttendanceManagement />
    </AdminLayout>
  );
};

export default AttendanceManagementPage;
