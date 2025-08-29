import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FilterStudentDialogProps {
  onFilter: (barcode: string, yearLevel: string, department: string) => void;
  onClose: () => void;
}

export function FilterStudentDialog({ onFilter, onClose }: FilterStudentDialogProps) {
  return (
    <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter By
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 mt-8">
        {/* Barcode ID Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => { onFilter("Barcode", "", ""); onClose(); }}
        >
          Barcode ID
        </Button>

        {/* Year Level Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => { onFilter("", "Year Level", ""); onClose(); }}
        >
          Year Level
        </Button>

        {/* Department Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => { onFilter("", "", "Department"); onClose(); }}
        >
          Department
        </Button>

        {/* Show All Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => { onFilter("All", "All", "All"); onClose(); }}
        >
          Show All
        </Button>
      </div>
    </DialogContent>
  );
}
