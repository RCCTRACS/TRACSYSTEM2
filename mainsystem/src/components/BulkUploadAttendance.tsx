"use client";

import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download } from "lucide-react";
import Papa from "papaparse";

interface BulkUploadAttendanceProps {
  onUpload: (records: { barcode_id: string; time_in: string }[]) => Promise<void> | void;
  onClose: () => void;
}

// ✅ Validate time format (hh:mm AM/PM)
const isValidTime = (t: string) =>
  /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?([AaPp][Mm])$/.test(t.trim());

// ✅ Convert hh:mm AM/PM → HH:mm:ss (24-hour)
const to24Hour = (t: string) => {
  const match = t.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (!match) return t;
  let [_, hh, mm, period] = match;
  let hours = parseInt(hh, 10);
  if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (period.toLowerCase() === "am" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${mm}:00`;
};

// ✅ Download CSV Template
const handleDownloadTemplate = () => {
  const template = "Barcode ID,Time In\n";
  const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "attendance_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function BulkUploadAttendance({ onUpload, onClose }: BulkUploadAttendanceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);

  // ✅ Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setSelectedFile(file);
    setError("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: false, // we'll manually clean
      complete: (results) => {
        const parsed = results.data as any[];

        // ✅ Clean and validate rows
        const rows = parsed
          .map((row) => {
            const cleanBarcode = (row["Barcode ID"] || "").trim();
            const rawTime = (row["Time In"] || "").trim();

            if (!cleanBarcode || !rawTime) return null; // ignore blanks

            return {
              barcode_id: cleanBarcode,
              time_in: isValidTime(rawTime) ? to24Hour(rawTime) : rawTime,
            };
          })
          .filter(Boolean); // remove nulls

        if (rows.length === 0) {
          setError("No valid rows found. Please check your CSV file.");
          setAllData([]);
          setPreview([]);
          return;
        }

        setAllData(rows);
        setPreview(rows.slice(0, 10));
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setError("Failed to read the CSV file. Please try again.");
        setPreview([]);
        setAllData([]);
      },
    });
  };

  // ✅ Handle Upload
  const handleUpload = async () => {
    if (!selectedFile) return setError("Please select a file first.");
    if (allData.length === 0) return setError("No valid data to upload.");

    try {
      setIsUploading(true);
      setError("");

      // Validate before sending
      for (let i = 0; i < allData.length; i++) {
        const { barcode_id, time_in } = allData[i];
        if (!barcode_id || !time_in)
          throw new Error(`Missing data in row ${i + 1}.`);
        if (!isValidTime(time_in) && !/^\d{2}:\d{2}:\d{2}$/.test(time_in))
          throw new Error(`Invalid time format in row ${i + 1}: "${time_in}".`);
      }

      await onUpload(allData);

      // Reset states
      setSelectedFile(null);
      setPreview([]);
      setAllData([]);
      onClose();
    } catch (err: any) {
      setError(err.message || "Upload failed. Please check your file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Bulk Upload Attendance
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* ✅ File Input */}
        <div className="space-y-2">
          <Label className="font-bold text-black">Choose File</Label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            {selectedFile ? selectedFile.name : "No file chosen"}
          </p>
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
        </div>

        {/* ✅ Template Download */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            CSV must have <b>Barcode ID</b> and <b>Time In</b> columns
            (format: <b>hh:mm AM/PM</b>).
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Template
          </Button>
        </div>

        {/* ✅ Preview */}
        {preview.length > 0 && (
          <div className="max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50 text-sm shadow-inner">
            <p className="font-semibold text-black mb-2">
              Preview (showing first 10 of {allData.length} rows):
            </p>
            <div className="grid grid-cols-2 font-bold border-b pb-1 mb-1 text-[#3E1F0F]">
              <span>Barcode ID</span>
              <span>Time In</span>
            </div>
            {preview.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 py-1 border-b last:border-0"
              >
                <span>{row.barcode_id}</span>
                <span>{row.time_in}</span>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Actions */}
        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              setError("");
              setPreview([]);
              setAllData([]);
              onClose();
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F]"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload All"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
