import { useState } from "react";
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
  const [error, setError] = useState<string>("");

  const API_URL =
    "http://192.168.0.136/capstone/mainsystem/backend/users_api.php";

  const handleUpload = () => {
    if (!file) return;

    setError("");
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      Papa.parse<User>(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
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

          const newUsers: User[] = results.data.map((row) => ({
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            first_name: row.first_name || "",
            last_name: row.last_name || "",
            email: row.email || "",
            password: row.password || "",
            department: row.department || "",
            role: (row.role as "Admin" | "Teacher") || "Teacher",
            status: (row.status as "Active" | "Inactive") || "Inactive"
          }));

          try {
            const res = await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newUsers) // 👈 send as array
            });

            const data = await res.json();
            console.log("Bulk upload response:", data);

            if (data.success) {
              // use backend's saved users if returned
              onUpload(data.users || newUsers);
              setFile(null);
              onClose();
            } else {
              setError(data.message || "Failed to upload users.");
            }
          } catch (err) {
            setError("Network error: " + (err as Error).message);
          }
        },
        error: (err) => {
          setError("Error parsing file: " + err.message);
        }
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
