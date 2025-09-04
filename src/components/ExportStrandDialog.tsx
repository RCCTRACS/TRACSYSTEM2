"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Strand } from "./StrandManagement";

interface ExportStrandDialogProps {
  strands: Strand[];
  onClose: () => void;
}

export function ExportStrandDialog({ strands, onClose }: ExportStrandDialogProps) {
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

    const headers = ["strand", "type"]; // Removed ID
    const csvRows = [
      headers.join(","),
      ...strands.map((s) => [escapeCSV(s.strand), escapeCSV(s.type)].join(",")),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Timestamped filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `strands_export_${timestamp}.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader className="flex flex-col items-center text-center space-y-2">
        <FileDown className="h-10 w-10 text-[#5C4033]" />
        <DialogTitle>Export Strands</DialogTitle>
        <DialogDescription>
          You are about to export{" "}
          <span className="font-semibold text-black">{strands.length}</span>{" "}
          strands into a CSV file.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          className="bg-[#5C4033] text-white hover:bg-[#4a3228]"
        >
          Export
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
