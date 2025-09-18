"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Strand } from "./StrandManagement";

interface StrandFormDialogProps {
  strand: Strand | null;
  onSave: (data: Partial<Strand>) => void;
  onClose: () => void;
}

export function StrandFormDialog({
  strand,
  onSave,
  onClose,
}: StrandFormDialogProps) {
  const [strandName, setStrandName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (strand) {
      // Editing existing strand
      setStrandName(strand.strand);
      setType(strand.type);
    } else {
      // Adding new strand → reset fields
      setStrandName("");
      setType("");
    }
  }, [strand]);

  const handleSubmit = () => {
    if (!strandName || !type) return;
    onSave({ strand: strandName, type });

    // Reset only if adding new strand (not editing)
    if (!strand) {
      setStrandName("");
      setType("");
    }
  };

  const outlineClass =
    "border-[2.5px] border-[#3E1F0F] rounded-xl focus:border-[#3E1F0F] focus:ring-2 focus:ring-[#C9A27E] h-12 px-4 shadow-sm transition-all duration-200";

  return (
    <DialogContent
      className="sm:max-w-[600px] bg-white 
      p-8 rounded-3xl shadow-2xl border border-[#D9B99B] max-h-[85vh] overflow-y-auto my-6"
    >
      <DialogHeader className="px-0 pb-6 border-b border-[#E5D3C6]">
        <DialogTitle className="text-2xl font-extrabold text-[#3E1F0F] tracking-wide">
          {strand ? "Edit Strand" : "Add Strand"}
        </DialogTitle>
      </DialogHeader>

      {/* Use grid for side-by-side layout */}
      <div className="grid grid-cols-2 gap-8 py-6">
        {/* Strand Name */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Strand Name
          </Label>
          <Input
            placeholder="Enter strand name"
            value={strandName}
            onChange={(e) => setStrandName(e.target.value)}
            className={outlineClass}
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Type
          </Label>
          <Input
            placeholder="Enter type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={outlineClass}
          />
        </div>
      </div>

      {/* Buttons */}
      <DialogFooter className="mt-6 flex justify-end gap-4 border-t border-[#E5D3C6] pt-6">
        <Button
          type="button"
          variant="outline"
          className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white 
          hover:bg-[#5C3A21] hover:text-white rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-sm"
          onClick={() => {
            setStrandName("");
            setType("");
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] 
          rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-md"
          onClick={handleSubmit}
        >
          {strand ? "Save Changes" : "Add Strand"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
