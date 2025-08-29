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
import { Upload } from "lucide-react";
import { Strand } from "./StrandManagement";

interface BulkUploadStrandProps {
  onUpload: (newStrands: Strand[]) => void;
  onClose: () => void;
}

export function BulkUploadStrand({ onUpload, onClose }: BulkUploadStrandProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Strand[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split("\n").map((row) => row.trim());
        const [header, ...dataRows] = rows;

        if (!header || !header.includes("strand") || !header.includes("type")) {
          alert("Invalid CSV format. Expected headers: id,strand,type");
          return;
        }

        const parsed: Strand[] = dataRows
          .filter((row) => row.length > 0)
          .map((row) => {
            const [id, strand, type] = row.split(",");
            return {
              id: id || Date.now().toString(),
              strand: strand || "",
              type: type || "",
            };
          });

        setPreview(parsed);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleUpload = () => {
    if (preview.length > 0) {
      onUpload(preview);
      setFile(null);
      setPreview([]);
      onClose();
    } else {
      alert("No valid data to upload.");
    }
  };

  return (
    <DialogContent>
      <DialogHeader className="flex flex-col items-center text-center space-y-2">
        <Upload className="h-10 w-10 text-[#5C4033]" />
        <DialogTitle>Bulk Upload Strands</DialogTitle>
        <DialogDescription>
          Upload a CSV file containing multiple strands. <br />
          Expected format: <code>id,strand,type</code>
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border rounded p-2"
        />

        {preview.length > 0 && (
          <div className="max-h-40 overflow-y-auto border p-2 rounded bg-gray-50 text-sm">
            <p className="font-semibold mb-2">Preview:</p>
            {preview.map((s, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 py-1">
                <span>{s.strand}</span>
                <span>{s.type}</span>
                <span className="text-gray-400">{s.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          className="bg-[#5C4033] text-white hover:bg-[#4a3228]"
          disabled={!file}
        >
          Upload
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
