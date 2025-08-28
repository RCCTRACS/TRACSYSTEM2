import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  level?: string;
  access: string;
  password?: string;
}

interface UserFormDialogProps {
  user: User | null;
  onSave: (user: Partial<User>) => void;
  onClose: () => void;
}

export function UserFormDialog({ user, onSave, onClose }: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    level: "",
    access: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department,
        level: user.level || "",
        access: user.access,
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        department: "",
        level: "",
        access: "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const outlineClass =
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  return (
    <DialogContent className="sm:max-w-[600px] bg-popover p-6">
      <DialogHeader className="px-0">
        <DialogTitle className="text-xl font-bold text-black">{user ? "Edit User" : "Add User"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-bold text-black">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className={outlineClass}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-black">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className={outlineClass}
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department" className="font-bold text-black">Department</Label>
          <Select value={formData.department} onValueChange={(value) =>
            setFormData({ ...formData, department: value, level: "" })
          }>
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ITS">ITS</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level (Teacher only) */}
        {formData.department === "Teacher" && (
          <div className="space-y-2">
            <Label htmlFor="level" className="font-bold text-black">Level</Label>
            <Select value={formData.level} onValueChange={(value) =>
              setFormData({ ...formData, level: value })
            } required>
              <SelectTrigger className={outlineClass}>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="College">College</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Access */}
        <div className="space-y-2">
          <Label htmlFor="access" className="font-bold text-black">Access</Label>
          <Select value={formData.access} onValueChange={(value) =>
            setFormData({ ...formData, access: value })
          }>
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="font-bold text-black">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={user ? "Leave blank to keep current password" : "Enter password"}
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
