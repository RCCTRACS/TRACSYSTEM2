"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface BulkUploadGradeProps {
  onUpload: (file: File) => Promise<void> | void;
  onClose: () => void;
}

export function BulkUploadGrade({ onUpload, onClose }: BulkUploadGradeProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file before uploading.");
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">
          Bulk Upload Grades
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        <div className="space-y-2">
          <Label className="font-bold text-black">Choose File</Label>
          <Input
            type="file"
            accept=".csv,.xlsx"
            className="w-full rounded-lg border-[3px] border-[#3E1F0F] focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F]"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            {selectedFile ? selectedFile.name : "No file chosen"}
          </p>
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200 rounded-lg"
            onClick={() => {
              setSelectedFile(null);
              setError("");
              onClose();
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200 rounded-lg flex items-center"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
