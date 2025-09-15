"use client";

import { useState, useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Papa from "papaparse";

interface Department {
  id: string;
  department: string;
  type: string;
}

interface BulkUploadDepartmentProps {
  onClose: () => void;
  onSuccess?: () => void; // optional callback to refresh table
}

export function BulkUploadDepartment({
  onClose,
  onSuccess,
}: BulkUploadDepartmentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Department[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    setError("");
    setMessage("");
    setPreview([]);

    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;

      Papa.parse<Department>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const expectedHeaders = ["department", "type"];
          const headers = results.meta.fields || [];
          const isValid = expectedHeaders.every((h) =>
            headers.includes(h)
          );

          if (!isValid) {
            setError(`CSV headers must be: ${expectedHeaders.join(", ")}`);
            setPreview([]);
            return;
          }

          const parsed: Department[] = results.data.map((row, idx) => ({
            id: Date.now().toString() + idx.toString(),
            department: row.department || "",
            type: row.type || "",
          }));

          setPreview(parsed);
        },
        error: (err) => {
          setError("Error parsing file: " + err.message);
          setPreview([]);
        },
      });
    };
    reader.readAsText(uploadedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "http://localhost/capstone/mainsystem/backend/department_api.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        setMessage(
          `✅ Upload complete: Inserted ${result.inserted}, Updated ${result.updated}, Skipped ${result.skipped}`
        );
        setFile(null);
        setPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess(); // refresh table
        onClose();
      } else {
        setError(result.error || "Upload failed. Please check your file.");
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Bulk Upload Departments
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* File Input */}
        <div className="space-y-2">
          <Label className="font-bold text-black">Choose File</Label>
          <Input
            type="file"
            accept=".csv"
            className="w-full rounded-lg border-[3px] border-[#3E1F0F] focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F]"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            {file ? file.name : "Expected headers: department,type"}
          </p>
          {error && (
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          )}
          {message && (
            <p className="text-xs text-green-600 font-semibold">{message}</p>
          )}
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50 text-sm shadow-inner">
            <p className="font-semibold text-black mb-2">Preview:</p>
            <div className="grid grid-cols-2 font-bold border-b pb-1 mb-1 text-[#3E1F0F]">
              <span>Department</span>
              <span>Type</span>
            </div>
            {preview.map((d, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 py-1 border-b last:border-0"
              >
                <span>{d.department}</span>
                <span>{d.type}</span>
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
              setMessage("");
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
