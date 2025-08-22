import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Department } from "./DepartmentManagement";

interface DepartmentFormDialogProps {
  department: Department | null;
  onSave: (data: Partial<Department>) => void;
  onClose: () => void;
}

export function DepartmentFormDialog({ department, onSave, onClose }: DepartmentFormDialogProps) {
  const [deptName, setDeptName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (department) {
      setDeptName(department.department);
      setType(department.type);
    } else {
      setDeptName("");
      setType("");
    }
  }, [department]);

  const handleSubmit = () => {
    if (!deptName || !type) return;
    onSave({ department: deptName, type });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{department ? "Edit Department" : "Add Department"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {/* Department Name */}
        <div className="grid gap-2">
          <label className="font-medium text-sm">Department</label>
          <Input
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            placeholder="Enter department name"
          />
        </div>

        {/* Department Type (Text Input instead of dropdown) */}
        <div className="grid gap-2">
          <label className="font-medium text-sm">Type</label>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter department type"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {department ? "Save Changes" : "Add Department"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
