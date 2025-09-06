"use client";

import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Strand } from "./StrandManagement";

interface StrandFormDialogProps {
  strand: Strand | null;
  onSave: (data: Partial<Strand>) => void;
  onClose: () => void;
}

export function StrandFormDialog({ strand, onSave, onClose }: StrandFormDialogProps) {
  const [strandName, setStrandName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (strand) {
      setStrandName(strand.strand);
      setType(strand.type);
    } else {
      setStrandName("");
      setType("");
    }
  }, [strand]);

  const handleSubmit = () => {
    if (!strandName || !type) return;
    onSave({ strand: strandName, type });
  };

  const outlineClass =
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  return (
    <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-6 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="px-0 pb-4">
        <DialogTitle className="text-xl font-bold text-black">
          {strand ? "Edit Strand" : "Add Strand"}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-2">
        {/* Strand Name */}
        <div className="flex flex-col gap-2">
          <Label className="font-bold text-black">Strand</Label>
          <Input
            placeholder="Enter strand name"
            value={strandName}
            onChange={(e) => setStrandName(e.target.value)}
            className={outlineClass}
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <Label className="font-bold text-black">Type</Label>
          <Input
            placeholder="Enter type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={outlineClass}
          />
        </div>
      </div>

      {/* Buttons */}
      <DialogFooter className="mt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200"
          onClick={handleSubmit}
        >
          {strand ? "Save Changes" : "Add Strand"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
