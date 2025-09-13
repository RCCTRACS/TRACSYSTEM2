import React from "react";
import { Outlet } from "react-router-dom";
import TracSidebar from "./TracSidebar";

const TeacherLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar stays fixed */}
      <TracSidebar />

      {/* Page content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout;
