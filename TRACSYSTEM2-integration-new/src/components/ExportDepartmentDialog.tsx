import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Department } from "./DepartmentManagement";

interface ExportDepartmentProps {
  departments: Department[];
  onClose: () => void;
}

export function ExportDialog({ departments, onClose }: ExportDepartmentProps) {
  const handleExport = () => {
    if (departments.length === 0) return;

    const headers = ["ID", "Department", "Type"];
    const csvRows = [headers.join(",")];

    departments.forEach((dep) => {
      const row = [dep.id, dep.department, dep.type];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "departments_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Export Departments</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <p>
          Click the button below to export the currently listed departments as a CSV file.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
    </DialogContent>
  );
}
