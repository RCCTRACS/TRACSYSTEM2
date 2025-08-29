"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FilterStrandDialogProps {
  strandTypes: string[];
  onFilter: (type: string) => void;
  onClose: () => void;
}

export function FilterStrandDialog({
  strandTypes,
  onFilter,
  onClose,
}: FilterStrandDialogProps) {
  const [selectedType, setSelectedType] = useState("All");

  const handleApplyFilter = (type: string) => {
    onFilter(type);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter By Strand Type
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {strandTypes.map((type) => (
          <Button
            key={type}
            className={`bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-10 py-4 font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedType === type
                ? "bg-[#5C3A21] text-white"
                : "hover:bg-[#5C3A21] hover:text-white"
            }`}
            onClick={() => handleApplyFilter(type)}
          >
            {type}
          </Button>
        ))}

        {/* Show All button */}
        <Button
          className={`bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-10 py-4 font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            selectedType === "All"
              ? "bg-[#5C3A21] text-white"
              : "hover:bg-[#5C3A21] hover:text-white"
          }`}
          onClick={() => handleApplyFilter("All")}
        >
          Show All
        </Button>
      </div>
    </DialogContent>
  );
}
