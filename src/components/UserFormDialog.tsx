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
  DialogTitle
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
  onSave: (user: Partial<User>) => void; // keep Partial to match your parent signature
  onClose: () => void;
}

const API_URL =
  "http://192.168.0.136/capstone/mainsystem/backend/users_api.php"; // align with UserManagement

export function UserFormDialog({ user, onSave, onClose }: UserFormDialogProps) {
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

  // Department options (dynamic + fallback)
  const [departments, setDepartments] = useState<string[]>(["ITS", "Teacher"]);

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

  // Try to hydrate department list from DB; keep fallback if it fails
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
        // ignore; fallback already present
      }
    };
    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outlineClass =
    "border-[2px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = { ...formData };
    if (user && !formData.password) delete payload.password; // don't overwrite if blank

    try {
      const response = await fetch(API_URL, {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user ? { id: user.id, ...payload } : payload)
      });

      const result = await response.json();

      if (result.success) {
        // Use the returned user if available; otherwise fall back to what we sent
        const savedUser: Partial<User> =
          result.user ??
          (user
            ? { id: user.id, ...payload }
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
    <DialogContent className="sm:max-w-[600px] bg-popover p-6">
      <DialogHeader className="px-0">
        <DialogTitle className="text-xl font-bold text-black">
          {user ? "Edit User" : "Add User"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="first_name" className="font-bold text-black">
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
        <div className="space-y-2">
          <Label htmlFor="last_name" className="font-bold text-black">
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
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-black">
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
        <div className="space-y-2">
          <Label htmlFor="department" className="font-bold text-black">
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
          <div className="space-y-2">
            <Label htmlFor="level" className="font-bold text-black">
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

        {/* Role (Admin/Teacher only) */}
        <div className="space-y-2">
          <Label htmlFor="role" className="font-bold text-black">
            Role
          </Label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData({ ...formData, role: value as "Admin" | "Teacher" })
            }
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
        <div className="space-y-2">
          <Label htmlFor="status" className="font-bold text-black">
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
        <div className="space-y-2">
          <Label htmlFor="password" className="font-bold text-black">
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
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200"
          >
            {user ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
