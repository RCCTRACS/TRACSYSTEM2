"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Dialog } from "@/components/ui/dialog";
import { UserFormDialog } from "./UserFormDialog"; // make sure this path is correct

interface Teacher {
  name: string;
  email: string;
}

interface TracHeaderProps {
  teacher: Teacher | null;
}

const TracHeader = ({ teacher }: TracHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
    department: "",
    access: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated user data:", formData);
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-black">TRAC System</h1>
        {teacher && (
          <p className="text-2xl font-bold text-black">Welcome, {teacher.name}!</p>
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
              onClick={() => {
                localStorage.clear();
                sessionStorage.removeItem("sidebarHasAnimated");
                setDropdownOpen(false);
                window.location.href = "/";
              }}
            >
              Logout
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <UserFormDialog
            user={teacher as any}
            onSave={() => setIsProfileOpen(false)}
            onClose={() => setIsProfileOpen(false)}
            isProfile
          />
        </Dialog>
      </div>
    </header>
  );
};

export default TracHeader;
