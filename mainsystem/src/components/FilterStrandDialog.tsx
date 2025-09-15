"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

interface FilterStrandDialogProps {
  onFilter: (strand: string) => void;
  onClose: () => void;
}

export function FilterStrandDialog({
  onFilter,
  onClose,
}: FilterStrandDialogProps) {
  // ✅ Fixed allowed strands
  const availableStrands = ["All", "STEM", "ABM", "HUMSS", "GAS"];
  const [selectedStrand, setSelectedStrand] = useState<string>("All");

  const handleApplyFilter = () => {
    onFilter(selectedStrand);
    onClose();
  };

  const handleReset = () => {
    setSelectedStrand("All");
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
          Filter Strands
        </DialogTitle>
      </DialogHeader>

      {/* Strand Dropdown */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold text-black tracking-wide">
            Strand
          </p>
          <Select
            value={selectedStrand}
            onValueChange={(val) => setSelectedStrand(val)}
          >
            <SelectTrigger className={selectStyle}>
              <SelectValue placeholder="Select Strand" />
            </SelectTrigger>
            <SelectContent>
              {availableStrands.map((strand) => (
                <SelectItem key={strand} value={strand}>
                  {strand}
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
