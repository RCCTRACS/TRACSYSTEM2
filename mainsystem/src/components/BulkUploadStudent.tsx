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
import Papa from "papaparse";
import { Student } from "./StudentManagement";

interface BulkUploadStudentProps {
  onClose: () => void;
  onUpload: (students: Student[]) => void;
}

export function BulkUploadStudent({
  onClose,
  onUpload
}: BulkUploadStudentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    setError("");
    setPreview([]);

    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;

      Papa.parse<Student>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const expectedHeaders: (keyof Student)[] = [
            "barcode_id",
            "student_name",
            "year_level",
            "department",
            "strand",
            "section",
            "parent_email"
          ];
          const headers = results.meta.fields || [];
          const isValid = expectedHeaders.every((h) => headers.includes(h));
          if (!isValid) {
            setError(`CSV headers must be: ${expectedHeaders.join(", ")}`);
            return;
          }

          const parsed: Student[] = results.data.map(
            (row: any, idx: number) => ({
              barcode_id: row.barcode_id?.trim() || "",
              student_name: row.student_name?.trim() || "",
              year_level: row.year_level?.trim() || "",
              department: row.department?.trim() || "",
              parent_email: row.parent_email?.trim() || ""
            })
          );

          setPreview(parsed);
        },
        error: (err) => {
          setError("Error parsing file: " + err.message);
        }
      });
    };
    reader.readAsText(uploadedFile);
  };

  const handleUpload = async () => {
    if (!file || preview.length === 0) {
      setError("No valid data to upload.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let failed: string[] = [];

      for (const student of preview) {
        try {
          const res = await fetch(
            "http://192.168.1.13/capstone/mainsystem/backend/student_api.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(student)
            }
          );
          const data = await res.json();
          if (!data.success) failed.push(student.barcode_id);
        } catch {
          failed.push(student.barcode_id);
        }
      }

      if (failed.length > 0) {
        setError(`Failed to upload some records: ${failed.join(", ")}`);
      } else {
        onUpload(preview);
        setFile(null);
        setPreview([]);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const outlineClass =
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Bulk Upload Students
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* File Input */}
        <div className="space-y-2">
          <Label className="font-bold text-black">Choose File</Label>
          <Input
            type="file"
            accept=".csv"
            className={outlineClass}
            onChange={handleFileChange}
            ref={fileInputRef}
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
            <div className="grid grid-cols-5 font-bold border-b pb-1 mb-1 text-[#3E1F0F]">
              <span>Barcode ID</span>
              <span>Student Name</span>
              <span>Year Level</span>
              <span>Department</span>
              <span>Parent Email</span>
            </div>
            {preview.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-2 py-1 border-b last:border-0"
              >
                <span>{s.barcode_id}</span>
                <span>{s.student_name}</span>
                <span>{s.year_level}</span>
                <span>{s.department}</span>
                <span>{s.parent_email}</span>
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
