"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { User } from "./UserManagement";
import Papa from "papaparse";

interface BulkUploadDialogProps {
  onUpload: (newUsers: User[]) => void;
  onClose: () => void;
}

export function BulkUploadDialog({ onUpload, onClose }: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const API_URL =
    "http://192.168.1.13/capstone/mainsystem/backend/users_api.php";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
    setError("");
    setPreview([]);

    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;

      Papa.parse<User>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const expectedHeaders = [
            "first_name",
            "last_name",
            "email",
            "password",
            "department",
            "role",
            "status"
          ];

          const headers = results.meta.fields || [];
          const isValid = expectedHeaders.every((h) => headers.includes(h));
          if (!isValid) {
            setError(`CSV headers must be: ${expectedHeaders.join(", ")}`);
            return;
          }

          const parsed: User[] = results.data.map((row, idx) => ({
            id: Date.now().toString() + idx.toString(),
            first_name: row.first_name || "",
            last_name: row.last_name || "",
            email: row.email || "",
            password: row.password || "",
            department: row.department || "",
            role: (row.role as "Admin" | "Teacher") || "Teacher",
            status: (row.status as "Active" | "Inactive") || "Inactive"
          }));

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
    if (loading) return;
    if (preview.length === 0) {
      setError("No valid data to upload.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preview)
      });

      const data = await res.json();
      if (data.success) {
        onUpload(data.users || preview);
        setFile(null);
        setPreview([]);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
      } else {
        setError(data.message || "Failed to upload users.");
      }
    } catch (err) {
      setError("Network error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Bulk Upload Users
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
            <div className="grid grid-cols-4 font-bold border-b pb-1 mb-1 text-[#3E1F0F]">
              <span>First Name</span>
              <span>Last Name</span>
              <span>Email</span>
              <span>Department</span>
            </div>
            {preview.map((u, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-2 py-1 border-b last:border-0"
              >
                <span>{u.first_name}</span>
                <span>{u.last_name}</span>
                <span>{u.email}</span>
                <span>{u.department}</span>
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
