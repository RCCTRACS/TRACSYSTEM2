"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react"; // ✅ icon for dropdown

import type { Department } from "./DepartmentManagement";

interface DepartmentFormDialogProps {
  department: Department | null;
  onSave: (dep: Partial<Department>) => void;
  onClose: () => void;
}

export function DepartmentFormDialog({
  department,
  onSave,
  onClose,
}: DepartmentFormDialogProps) {
  const [formData, setFormData] = useState({
    department: "",
    type: "Student", // default type is Student
  });

  useEffect(() => {
    if (department) {
      // Editing mode
      setFormData({
        department: department.department,
        type: department.type,
      });
    } else {
      // Add mode
      setFormData({
        department: "",
        type: "Student",
      });
    }
  }, [department]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Preserve ID when editing
    const payload = department
      ? { id: department.id, ...formData }
      : formData;

    onSave(payload);
  };

  const outlineClass =
    "border-[2.5px] border-[#3E1F0F] rounded-xl focus:border-[#3E1F0F] focus:ring-2 focus:ring-[#C9A27E] h-12 px-4 shadow-sm transition-all duration-200";

  return (
    <DialogContent
      className="sm:max-w-[600px] bg-white 
      p-8 rounded-3xl shadow-2xl border border-[#D9B99B] max-h-[85vh] overflow-y-auto my-6"
    >
      <DialogHeader className="px-0 pb-6 border-b border-[#E5D3C6]">
        <DialogTitle className="text-2xl font-extrabold text-[#3E1F0F] tracking-wide">
          {department ? "Edit Department" : "Add Department"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
        {/* Side by side fields */}
        <div className="grid grid-cols-2 gap-6">
          {/* Department Name */}
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-[#3E1F0F] tracking-wide">
              Department
            </Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
              className={outlineClass}
              placeholder="Enter department name"
            />
          </div>

          {/* Type Dropdown */}
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-[#3E1F0F] tracking-wide">
              Type
            </Label>
            <div className="relative">
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
                className={`${outlineClass} bg-white appearance-none pr-10 cursor-pointer w-full`}
              >
                <option value="Student">Student</option>
                <option value="Employee">Employee</option>
              </select>
              {/* Dropdown icon inside the box */}
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E1F0F] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <DialogFooter className="mt-6 flex justify-end gap-4 border-t border-[#E5D3C6] pt-6">
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
            {department ? "Save Changes" : "Add Department"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
