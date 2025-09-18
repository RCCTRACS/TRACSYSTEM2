"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Strand } from "./StrandManagement";

interface ExportStrandDialogProps {
  strands: Strand[];
  onClose: () => void;
}

export function ExportStrandDialog({
  strands,
  onClose,
}: ExportStrandDialogProps) {
  // Escape CSV values
  const escapeCSV = (value: string | number) => {
    if (value == null) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExport = () => {
    if (!strands || strands.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Strand", "Type"]; // Keep it clean like users export
    const rows = strands.map((s) => [
      escapeCSV(s.strand),
      escapeCSV(s.type),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Timestamped filename
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");
    const filename = `strands_export_${timestamp}.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-xl font-bold text-black">
          Export Strands
        </DialogTitle>
      </DialogHeader>

      <div className="mt-6 flex flex-col space-y-8">
        {/* Confirmation Message */}
        <p className="text-sm text-black font-medium text-center">
          Are you sure you want to export{" "}
          <span className="font-semibold">{strands.length}</span> strands?
        </p>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 w-full mt-2">
          <Button
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200 rounded-lg"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
