import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import Papa from "papaparse";

export interface Subject {
  subject_code: string;
  subject_name: string;
  subject_time?: string;
  department?: string;
  grade?: string;
  strand?: string;
  section?: string;
  instructor?: string;
}

interface BulkUploadSubjectProps {
  onUpload: (newSubjects: Subject[]) => void;
  onClose: () => void;
}

export function BulkUploadSubject({ onUpload, onClose }: BulkUploadSubjectProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  // Normalize CSV headers for flexible matching
  const normalizeHeader = (header: string): string => {
    return header
      .trim()
      .toLowerCase()
      .replace(/[_/]+/g, " ") // handles "Grade/Year"
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleUpload = () => {
    if (!file) return;
    setError("");

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.meta.fields || results.meta.fields.length === 0) {
            setError("No valid headers found in CSV file.");
            return;
          }

          const expectedHeaders = [
            "Subject Code",
            "Subject Name",
            "Subject Time",
            "Department",
            "Grade",
            "Grade/Year",
            "Strand",
            "Section",
            "Instructor",
          ];

          const normalizedExpected = expectedHeaders.map(normalizeHeader);
          const normalizedActual = results.meta.fields.map(normalizeHeader);

          const missingHeaders = normalizedExpected.filter(
            (h) => !normalizedActual.includes(h)
          );

          if (missingHeaders.length > 0) {
            console.warn("⚠️ Missing headers (will be ignored):", missingHeaders.join(", "));
          }

          const getValue = (row: Record<string, string>, key: string, altKey?: string) => {
            const normalizedKey = normalizeHeader(key);
            const normalizedAltKey = altKey ? normalizeHeader(altKey) : "";

            const actualKey =
              results.meta.fields?.find(
                (h) =>
                  normalizeHeader(h) === normalizedKey ||
                  (altKey && normalizeHeader(h) === normalizedAltKey)
              ) || "";

            return row[actualKey]?.trim() || "";
          };

          const newSubjects: Subject[] = results.data.map((row) => ({
            subject_code: getValue(row, "Subject Code"),
            subject_name: getValue(row, "Subject Name"),
            subject_time: getValue(row, "Subject Time"),
            department: getValue(row, "Department"),
            grade: getValue(row, "Grade", "Grade/Year"), // ✅ fixed: supports both
            strand: getValue(row, "Strand"),
            section: getValue(row, "Section"),
            instructor: getValue(row, "Instructor"),
          }));

          // Remove any completely empty rows
          const filteredSubjects = newSubjects.filter(
            (s) => s.subject_code || s.subject_name
          );

          onUpload(filteredSubjects);
          setFile(null);
          onClose();
        },
        error: (err) => {
          setError("Error parsing file: " + err.message);
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Select a CSV file
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
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-muted-foreground">
            {file ? file.name : "No file chosen"}
          </p>
          {error && (
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200 rounded-lg"
            onClick={() => {
              setFile(null);
              setError("");
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200 rounded-lg flex items-center"
            onClick={handleUpload}
            disabled={!file}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
