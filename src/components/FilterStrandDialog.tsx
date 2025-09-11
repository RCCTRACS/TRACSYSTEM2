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
  const [selectedStrand, setSelectedStrand] = useState("All");

  const handleApplyFilter = () => {
    onFilter(selectedStrand);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader className="flex flex-col items-center text-center space-y-2">
        <Filter className="h-10 w-10 text-[#5C4033]" />
        <DialogTitle>Filter Strands</DialogTitle>
        <DialogDescription>
          Select a strand to filter the list. <br />
          Default is <span className="font-semibold">All</span>.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        {availableStrands.map((strand) => (
          <div
            key={strand}
            onClick={() => setSelectedStrand(strand)}
            className={`cursor-pointer px-4 py-2 rounded-md border transition-colors ${
              selectedStrand === strand
                ? "bg-[#5C4033] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {strand}
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
