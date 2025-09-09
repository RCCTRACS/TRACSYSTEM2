"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Strand } from "./StrandManagement";

interface BulkUploadStrandProps {
  onUpload: (newStrands: Strand[]) => void;
  onClose: () => void;
}

export function BulkUploadStrand({ onUpload, onClose }: BulkUploadStrandProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Strand[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Parse CSV file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split(/\r?\n/).map((row) => row.trim());
        const [header, ...dataRows] = rows;

        // ✅ Strict check for correct headers
        if (header?.toLowerCase().replace(/\s/g, "") !== "strand,type") {
          alert("Invalid CSV format. Expected headers: strand,type");
          return;
        }

        // ✅ Map rows into Strand objects
        const parsed: Strand[] = dataRows
          .map((row, idx) => {
            if (!row) return null;
            const cols = row.split(",").map((c) => c.trim());
            if (cols.length < 2) return null;

            const [strand, type] = cols;
            if (!strand || !type) return null;

            return {
              id: Date.now().toString() + idx, // temporary unique ID
              strand,
              type,
            };
          })
          .filter((row): row is Strand => row !== null);

        setPreview(parsed);
      };
      reader.readAsText(uploadedFile);
    }
  };

  // ✅ Send data to backend
  const handleUpload = async () => {
    if (loading) return; // 🚫 prevent double trigger
    if (preview.length === 0) {
      alert("No valid data to upload.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://192.168.1.13/capstone/mainsystem/backend/strand_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bulk: preview }), // ✅ backend expects {bulk: []}
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(result.message || "Upload successful!");
        onUpload(preview);

        // ✅ Reset state
        setFile(null);
        setPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
      } else {
        alert(result.error || "Failed to upload strands.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Network error. Could not upload strands.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader className="flex flex-col items-center text-center space-y-2">
        <Upload className="h-10 w-10 text-[#5C4033]" />
        <DialogTitle>Bulk Upload Strands</DialogTitle>
        <DialogDescription>
          Upload a CSV file containing multiple strands. <br />
          Expected format: <code>strand,type</code>
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="w-full border rounded p-2"
        />

        {preview.length > 0 && (
          <div className="max-h-40 overflow-y-auto border p-2 rounded bg-gray-50 text-sm">
            <p className="font-semibold mb-2">Preview:</p>
            {preview.map((s, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2 py-1">
                <span>{s.strand}</span>
                <span>{s.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          className="bg-[#5C4033] text-white hover:bg-[#4a3228]"
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
