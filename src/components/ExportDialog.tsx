import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { User } from "./UserManagement";

interface ExportDialogProps {
  users: User[];
  onClose: () => void;
}

export function ExportDialog({ users, onClose }: ExportDialogProps) {
  const [csv, setCsv] = useState(true);
  const [excel, setExcel] = useState(false);
  const [pdf, setPdf] = useState(false);

  const handleExport = () => {
    if (csv) {
      const headers = ["Name", "Email", "Department", "Level", "Access"];
      const rows = users.map(u => [u.name, u.email, u.department, u.level || "", u.access]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "users.csv";
      link.click();
    }

    // Excel/PDF export can be added later

    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[400px] bg-popover">
      <DialogHeader>
        <DialogTitle>Export</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to export data?
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="csv" checked={csv} onCheckedChange={val => setCsv(!!val)} />
            <Label htmlFor="csv">CSV Format</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="excel" checked={excel} onCheckedChange={val => setExcel(!!val)} />
            <Label htmlFor="excel">Excel Format</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pdf" checked={pdf} onCheckedChange={val => setPdf(!!val)} />
            <Label htmlFor="pdf">PDF Format</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
    </DialogContent>
  );
}
