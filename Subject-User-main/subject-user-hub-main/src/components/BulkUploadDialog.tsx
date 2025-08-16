import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
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

  const handleUpload = () => {
    if (!file) return;

    setError(""); // reset previous errors
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      Papa.parse<User>(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Validate headers
          const expectedHeaders = ["name", "email", "department", "level", "access"];
          const headers = results.meta.fields || [];
          const isValid = expectedHeaders.every(h => headers.includes(h));
          if (!isValid) {
            setError(`CSV headers must be: ${expectedHeaders.join(", ")}`);
            return;
          }

          // Map parsed rows to User[]
          const newUsers: User[] = results.data.map((row) => ({
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            name: row.name || "",
            email: row.email || "",
            department: row.department || "",
            level: row.level || "",
            access: row.access || "",
          }));

          onUpload(newUsers);
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
    <DialogContent className="sm:max-w-[500px] bg-popover">
      <DialogHeader>
        <DialogTitle>Select a CSV file</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* File Input */}
        <div className="space-y-2">
          <Label>Choose File</Label>
          <Input
            type="file"
            accept=".csv"
            className="w-full"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-muted-foreground">
            {file ? file.name : "No file chosen"}
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setFile(null); setError(""); onClose(); }}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
