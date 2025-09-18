import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Grade {
  id: string;
  grade: string;
  type: string;
}

interface ExportGradeDialogProps {
  grades: Grade[];
  onClose: () => void;
}

export function ExportGradeDialog({ grades, onClose }: ExportGradeDialogProps) {
  const handleExport = () => {
    const headers = ["Grade", "Type"];
    const rows = grades.map((g) => [g.grade, g.type]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "grades.csv";
    link.click();

    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-xl font-bold text-black">
          Export Grades
        </DialogTitle>
      </DialogHeader>

      <div className="mt-6 flex flex-col space-y-8">
        {/* Confirmation Message */}
        <p className="text-sm text-black font-medium text-center">
          Are you sure you want to export{" "}
          <span className="font-semibold">{grades.length}</span> grades?
        </p>

        {/* Preview Section */}
        {grades.length > 0 && (
          <div className="max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50 text-sm shadow-inner mt-2">
            <p className="font-semibold text-black mb-2">Preview:</p>
            <div className="grid grid-cols-2 font-bold border-b pb-1 mb-1 text-[#3E1F0F]">
              <span>Grade</span>
              <span>Type</span>
            </div>
            {grades.slice(0, 10).map((g, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 py-1 border-b last:border-0"
              >
                <span>{g.grade}</span>
                <span>{g.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* JSON Preview */}
        <pre className="text-xs text-gray-400">{JSON.stringify(grades, null, 2)}</pre>

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
