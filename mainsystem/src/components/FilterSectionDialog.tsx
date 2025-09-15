"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";

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

  const handleReset = () => {
    setSelectedGrade("All");
    onFilter("All");
    onClose();
  };

  const selectStyle =
    "w-full border-2 border-[#5C4033] rounded-lg px-3 py-2 text-black bg-white focus:ring-0 focus:border-[#5C4033] transition-colors";

  return (
    <DialogContent className="sm:max-w-[480px] bg-white p-8 rounded-3xl shadow-xl border border-[#D9B99B]">
      {/* Header */}
      <DialogHeader className="pb-6">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter Sections
        </DialogTitle>
      </DialogHeader>

      {/* Grade Dropdown */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold text-black tracking-wide">
            Grade
          </p>
          <Select
            value={selectedGrade}
            onValueChange={(val) => setSelectedGrade(val)}
          >
            <SelectTrigger className={selectStyle}>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 flex justify-end gap-3">
        <Button
          variant="outline"
          className="px-5 py-2 rounded-lg border-2 border-[#5C4033] text-[#5C4033] font-medium hover:bg-[#f5ebe2]"
          onClick={handleReset}
        >
          Show All
        </Button>
        <Button
          className="px-5 py-2 rounded-lg bg-[#5C3A21] text-white font-medium hover:bg-[#4a3228]"
          onClick={handleApplyFilter}
        >
          Apply Filter
        </Button>
      </div>
    </DialogContent>
  );
}
