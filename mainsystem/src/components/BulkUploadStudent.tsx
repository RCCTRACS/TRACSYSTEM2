import { useState } from "react";
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
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const headers = results.meta.fields || [];
          const expectedHeaders: (keyof Student)[] = [
            "barcode_id",
            "student_name",
            "year_level",
            "department",
            "parent_email"
          ];

          const isValid = expectedHeaders.every((h) => headers.includes(h));
          if (!isValid) {
            setError(`CSV headers must be: ${expectedHeaders.join(", ")}`);
            setLoading(false);
            return;
          }

          const students: Student[] = results.data.map((row: any) => ({
            barcode_id: row.barcode_id?.trim() || "",
            student_name: row.student_name?.trim() || "",
            year_level: row.year_level?.trim() || "",
            department: row.department?.trim() || "",
            parent_email: row.parent_email?.trim() || ""
          }));

          // Save to backend one by one
          let failed: string[] = [];
          for (const student of students) {
            try {
              const res = await fetch(
                "http://192.168.0.137/capstone/mainsystem/backend/student_api.php",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(student)
                }
              );
              const data = await res.json();
              if (!data.success) {
                failed.push(student.barcode_id);
              }
            } catch {
              failed.push(student.barcode_id);
            }
          }

          if (failed.length > 0) {
            setError(`Failed to upload some records: ${failed.join(", ")}`);
          } else {
            onUpload(students); // update local state
            setFile(null);
            onClose();
          }
          setLoading(false);
        },
        error: (err) => {
          setError("Error parsing file: " + err.message);
          setLoading(false);
        }
      });
    };
    reader.readAsText(file);
  };

  const outlineClass =
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Select a CSV file
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        <div className="space-y-2">
          <Label className="font-bold text-black">Choose File</Label>
          <Input
            type="file"
            accept=".csv"
            className={outlineClass}
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">
            {file ? file.name : "No file chosen"}
          </p>
          {error && (
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200 rounded-lg"
            onClick={() => {
              setFile(null);
              setError("");
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
