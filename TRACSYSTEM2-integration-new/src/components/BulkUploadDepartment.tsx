import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Department } from "./DepartmentManagement";

interface BulkUploadDepartmentProps {
  onUpload: (departments: Department[]) => void;
  onClose: () => void;
}

export function BulkUploadDepartment({ onUpload, onClose }: BulkUploadDepartmentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const uploadedDepartments: Department[] = [];

      lines.slice(1).forEach((line) => {
        const [id, department, type] = line.split(",");
        if (department && type) {
          uploadedDepartments.push({
            id: id || Date.now().toString() + Math.random().toString(36).slice(2),
            department: department.trim(),
            type: type.trim(),
          });
        }
      });

      if (uploadedDepartments.length === 0) {
        setError("No valid departments found in the CSV.");
        return;
      }

      onUpload(uploadedDepartments);
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Bulk Upload Departments</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload}>Upload</Button>
        </div>
      </div>
    </DialogContent>
  );
}
