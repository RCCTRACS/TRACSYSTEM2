import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Student } from "./StudentManagement";

interface ExportStudentDialogProps {
  students: Student[];
  onClose: () => void;
}

export function ExportStudentDialog({ students, onClose }: ExportStudentDialogProps) {
  const handleExport = () => {
    const headers = ["Student ID", "Barcode ID", "Name", "Year Level", "Department", "Parent Email"];
    const rows = students.map((student) => [
      student.id,
      student.barcodeId,
      student.name,
      student.yearLevel,
      student.department,
      student.parentEmail,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4 border-b border-[#5C3A21]/30">
        <DialogTitle className="text-xl font-bold text-black">Export Students</DialogTitle>
      </DialogHeader>

      <div className="mt-6 flex flex-col space-y-8">
        {/* Confirmation Message */}
        <p className="text-sm text-black font-medium text-center">
          Are you sure you want to export the student list?
        </p>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 w-full mt-2">
          <Button
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200 rounded-lg"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
