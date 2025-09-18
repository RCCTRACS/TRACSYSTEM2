"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  level?: string;
  role: "Admin" | "Teacher";
  status: "Active" | "Inactive";
  password?: string;
}

interface UserFormDialogProps {
  user: User | null;
  onSave: (user: Partial<User>) => void;
  onClose: () => void;
  isProfile?: boolean; // profile mode disables some fields
}

const API_URL =
  "http://192.168.0.143/capstone/mainsystem/backend/users_api.php";

export function UserFormDialog({
  user,
  onSave,
  onClose,
  isProfile
}: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    level: "",
    role: "Teacher" as "Admin" | "Teacher",
    status: "Active" as "Active" | "Inactive",
    password: ""
  });

  const [departments, setDepartments] = useState<string[]>(["ITS", "Teacher"]);

  // ✅ Pre-fill form if editing
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        department: user.department ?? "",
        level: user.level ?? "",
        role: user.role,
        status: user.status,
        password: ""
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        level: "",
        role: "Teacher",
        status: "Active",
        password: ""
      });
    }
  }, [user]);

  // ✅ Load departments from API
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}?resource=departments`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.departments)) {
          const values = data.departments
            .map((d: any) => d.department)
            .filter(Boolean);
          const unique = Array.from(new Set([...values, ...departments]));
          setDepartments(unique);
        }
      } catch {
        // fallback silently
      }
    };
    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outlineClass =
    "border-[2.5px] border-[#3E1F0F] rounded-xl focus:border-[#3E1F0F] focus:ring-2 focus:ring-[#C9A27E] h-12 px-4 shadow-sm transition-all duration-200";

  // ✅ Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = { ...formData };

    // If editing and password left blank → don’t send
    if (user && !formData.password) delete payload.password;

    // ✅ Always ensure we have a user ID for PUT
    const userId = user?.id || localStorage.getItem("authId");

    try {
      const response = await fetch(API_URL, {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user ? { id: userId, ...payload } : payload)
      });

      const result = await response.json();

      if (result.success) {
        const savedUser: Partial<User> =
          result.user ??
          (user
            ? { id: userId ?? "", ...payload }
            : { ...payload, id: String(result.id ?? "") });

        onSave(savedUser);
        onClose();
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user.");
    }
  };

  return (
    <DialogContent
      className="sm:max-w-[750px] bg-white 
      p-10 rounded-3xl shadow-2xl border border-[#D9B99B] max-h-[90vh] overflow-y-auto my-6"
    >
      <DialogHeader className="px-0 pb-6 border-b border-[#E5D3C6]">
        <DialogTitle className="text-2xl font-extrabold text-[#3E1F0F] tracking-wide">
          {user ? "Edit User" : "Add User"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 py-6">
        {/* First Name */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            First Name
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
            className={outlineClass}
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Last Name
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
            className={outlineClass}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className={outlineClass}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Department
          </Label>
          <Select
            value={formData.department}
            onValueChange={(value) =>
              setFormData({ ...formData, department: value, level: "" })
            }
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level (only for Teacher dept) */}
        {formData.department === "Teacher" && (
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-[#3E1F0F] tracking-wide">
              Level
            </Label>
            <Select
              value={formData.level}
              onValueChange={(value) =>
                setFormData({ ...formData, level: value })
              }
              required
            >
              <SelectTrigger className={outlineClass}>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Senior High">Senior High</SelectItem>
                <SelectItem value="College">College</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Role */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Role
          </Label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData({ ...formData, role: value as "Admin" | "Teacher" })
            }
            disabled={isProfile} // disable in profile edit
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as "Active" | "Inactive"
              })
            }
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 col-span-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder={
              user ? "Leave blank to keep current password" : "Enter password"
            }
            required={!user}
            className={outlineClass}
          />
        </div>

        {/* Buttons */}
        <DialogFooter className="col-span-2 mt-8 flex justify-end gap-4 border-t border-[#E5D3C6] pt-6">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white 
            hover:bg-[#5C3A21] hover:text-white rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] 
            rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-md"
          >
            {user ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
