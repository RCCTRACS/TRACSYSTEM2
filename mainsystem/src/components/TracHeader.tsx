"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { UserFormDialog, User } from "./UserFormDialog"; // Adjust path
import { useNavigate } from "react-router-dom";

interface Teacher {
  id?: string;
  name: string;
  email: string;
  department?: string;
  level?: string;
  role?: "Admin" | "Teacher";
  status?: "Active" | "Inactive";
}

const API_URL_USERS =
  "http://192.168.1.13/capstone/mainsystem/backend/users_api.php";

const TracHeader = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch current user from backend
  useEffect(() => {
    const userId =
      localStorage.getItem("authUserId") ||
      sessionStorage.getItem("authUserId");
    if (!userId) return;

    fetch(API_URL_USERS)
      .then((res) => res.json())
      .then((data) => {
        const usersList = Array.isArray(data.users) ? data.users : [];
        const currentUser = usersList.find((u: any) => u.id === userId);
        if (currentUser) {
          setTeacher({
            id: currentUser.id,
            name: `${currentUser.first_name} ${currentUser.last_name}`.trim(),
            email: currentUser.email,
            department: currentUser.department,
            level: currentUser.level,
            role: currentUser.role,
            status: currentUser.status
          });
        }
      })
      .catch((err) => console.error("Failed to fetch current user:", err));
  }, []);

  // ✅ Convert Teacher → User for form prefill
  const mapTeacherToUser = (t: Teacher | null): User | null => {
    if (!t) return null;
    const [first_name, ...rest] = (t.name || "").split(" ");
    return {
      id: t.id || "0",
      first_name: first_name ?? "",
      last_name: rest.join(" ") || "",
      email: t.email,
      department: t.department ?? "",
      level: t.level ?? "",
      role: t.role ?? "Teacher",
      status: t.status ?? "Active"
    };
  };

  // ✅ Handle profile save
  const handleProfileSave = (updated: Partial<User>) => {
    const fullName = `${updated.first_name ?? ""} ${
      updated.last_name ?? ""
    }`.trim();
    setTeacher((prev) => ({
      ...prev,
      id: updated.id ?? prev?.id ?? "0",
      name: fullName,
      email: updated.email ?? prev?.email ?? "",
      department: updated.department ?? prev?.department,
      level: updated.level ?? prev?.level,
      role: updated.role ?? prev?.role,
      status: updated.status ?? prev?.status
    }));
    setIsProfileOpen(false);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem("sidebarHasAnimated");
    navigate("/"); // redirect to login/home
  };

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-black">TRAC System</h1>
        {teacher && (
          <p className="text-2xl font-bold text-black">
            Welcome, {teacher.name}!
          </p>
        )}
      </div>

      <div className="relative">
        {/* Profile dropdown */}
        <div
          className="flex items-center bg-[#f3f3f3] px-3 py-2 rounded-full border-2 border-[#5C4033] cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <img src="/user.png" alt="Profile" className="w-7 h-7 mr-2" />
          <span className="text-black text-sm font-medium">
            {teacher ? teacher.name : "User"}
          </span>
          <span className="ml-2 text-xs">▼</span>
        </div>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border-2 border-[#5C4033] rounded-md shadow-md w-40 z-10">
            <div
              className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]"
              onClick={() => {
                setIsProfileOpen(true);
                setDropdownOpen(false);
              }}
            >
              Edit Profile
            </div>
            <div
              className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <UserFormDialog
            user={mapTeacherToUser(teacher)}
            onSave={handleProfileSave}
            onClose={() => setIsProfileOpen(false)}
            isProfile
          />
        </Dialog>
      </div>
    </header>
  );
};

export default TracHeader;
