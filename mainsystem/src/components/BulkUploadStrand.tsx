"use client";

import { useState, useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Strand } from "./StrandManagement";

interface BulkUploadStrandProps {
  onUpload: (newStrands: Strand[]) => void;
  onClose: () => void;
}

export function BulkUploadStrand({ onUpload, onClose }: BulkUploadStrandProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Strand[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Parse CSV file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    setError("");

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split(/\r?\n/).map((row) => row.trim());
        const [header, ...dataRows] = rows;

        // ✅ Strict check for correct headers
        if (header?.toLowerCase().replace(/\s/g, "") !== "strand,type") {
          setError("Invalid CSV format. Expected headers: strand,type");
          setPreview([]);
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
              type
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
      setError("No valid data to upload.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://192.168.0.143/capstone/mainsystem/backend/strand_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bulk: preview }) // ✅ backend expects {bulk: []}
        }
      );

      const result = await response.json();

      if (result.success) {
        onUpload(preview);

        // ✅ Reset state
        setFile(null);
        setPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
      } else {
        setError(result.error || "Failed to upload strands.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Network error. Could not upload strands.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Bulk Upload Strands
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* File Input */}
        <div className="space-y-2">
          <Label className="font-bold text-black">Choose File</Label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full rounded-lg border-[3px] border-[#3E1F0F] focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F]"
          />
          <p className="text-xs text-muted-foreground">
            {file ? file.name : "No file chosen"}
          </p>
          {error && (
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          )}
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50 text-sm shadow-inner">
            <p className="font-semibold text-black mb-2">Preview:</p>
            <div className="grid grid-cols-2 font-bold border-b pb-1 mb-1 text-[#3E1F0F]">
              <span>Strand</span>
              <span>Type</span>
            </div>
            {preview.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 py-1 border-b last:border-0"
              >
                <span>{s.strand}</span>
                <span>{s.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200 rounded-lg"
            onClick={() => {
              setFile(null);
              setPreview([]);
              setError("");
              if (fileInputRef.current) fileInputRef.current.value = "";
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200 rounded-lg flex items-center"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
