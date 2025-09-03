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

  const handleApplyFilter = () => {
    onFilter(selectedType);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader className="flex flex-col items-center text-center space-y-2">
        <Filter className="h-10 w-10 text-[#5C4033]" />
        <DialogTitle>Filter Strands</DialogTitle>
        <DialogDescription>
          Select a strand type to filter the list. <br />
          Default is <span className="font-semibold">All</span>.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        {strandTypes.map((type) => (
          <div
            key={type}
            onClick={() => setSelectedType(type)}
            className={`cursor-pointer px-4 py-2 rounded-md border ${
              selectedType === type
                ? "bg-[#5C4033] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {type}
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
