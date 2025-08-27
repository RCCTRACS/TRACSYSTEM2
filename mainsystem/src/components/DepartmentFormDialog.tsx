import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    type: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        department: department.department,
        type: department.type,
      });
    } else {
      setFormData({
        department: "",
        type: "",
      });
    }
  }, [department]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const outlineClass =
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  return (
    <DialogContent className="sm:max-w-[600px] bg-popover p-6">
      <DialogHeader className="px-0">
        <DialogTitle className="text-xl font-bold text-black">
          {department ? "Edit Department" : "Add Department"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Department Name */}
        <div className="space-y-2">
          <Label htmlFor="department" className="font-bold text-black">
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
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="font-bold text-black">
            Type
          </Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            required
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
            {department ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
