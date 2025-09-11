"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Filter } from "lucide-react";

interface FilterSectionDialogProps {
  sections: string[]; // e.g., ["7 - Apple", "8 - Mabini", ...]
  onFilter: (grade: string) => void;
  onClose: () => void;
}

export function FilterSectionDialog({
  sections,
  onFilter,
  onClose,
}: FilterSectionDialogProps) {
  const [selectedGrade, setSelectedGrade] = useState("All");

  // Fixed filter options (only grades 7–10)
  const gradeOptions = ["All", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];

  const handleApplyFilter = () => {
    onFilter(selectedGrade);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader className="flex flex-col items-center text-center space-y-2">
        <Filter className="h-10 w-10 text-[#5C4033]" />
        <DialogTitle>Filter Sections</DialogTitle>
        <DialogDescription>
          Select a grade to filter the list. <br />
          Default is <span className="font-semibold">All</span>.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        {gradeOptions.map((grade) => (
          <div
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`cursor-pointer px-4 py-2 rounded-md border transition-colors ${
              selectedGrade === grade
                ? "bg-[#5C4033] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {grade}
          </div>
        ))}
      </div>

      <DialogFooter className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleApplyFilter}
          className="bg-[#5C4033] text-white hover:bg-[#4a3228]"
        >
          Apply
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
