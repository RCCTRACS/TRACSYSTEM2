import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Department } from "./DepartmentManagement";

interface FilterDialogProps {
  onClose: () => void;
  onApply: (filteredDeps: Department[]) => void;
  departments: Department[]; // all departments to filter from
}

export function FilterDialog({ onClose, onApply, departments }: FilterDialogProps) {
  const [selectedType, setSelectedType] = useState<string>("");

  // Get unique types for the dropdown
  const types = Array.from(new Set(departments.map(dep => dep.type)));

  const handleApply = () => {
    const filtered = selectedType
      ? departments.filter(dep => dep.type === selectedType)
      : departments; // if no type selected, show all
    onApply(filtered);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Filter Departments</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <label className="font-medium">Type</label>
        <select
          className="border rounded p-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All</option>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </DialogContent>
  );
}
