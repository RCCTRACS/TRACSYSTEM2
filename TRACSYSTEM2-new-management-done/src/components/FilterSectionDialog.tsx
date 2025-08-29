"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FilterSectionDialogProps {
  sectionTypes: string[];
  onFilter: (type: string) => void;
  onClose: () => void;
}

export function FilterSectionDialog({
  sectionTypes,
  onFilter,
  onClose,
}: FilterSectionDialogProps) {
  return (
    <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter Sections
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-wrap gap-4 mt-8">
        {sectionTypes.map((type) => (
          <Button
            key={type}
            className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-8 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
            onClick={() => {
              onFilter(type);
              onClose();
            }}
          >
            {type}
          </Button>
        ))}

        {/* Optional Show All Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-8 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => {
            onFilter("All");
            onClose();
          }}
        >
          Show All
        </Button>
      </div>
    </DialogContent>
  );
}
