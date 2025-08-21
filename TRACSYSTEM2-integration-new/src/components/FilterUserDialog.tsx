import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FilterUserDialogProps {
  onFilter: (department: string) => void;
  onClose: () => void;
}

export function FilterUserDialog({ onFilter, onClose }: FilterUserDialogProps) {
  return (
    <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter By
        </DialogTitle>
      </DialogHeader>

      <div className="flex justify-between mt-8">
        {/* ITS Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => { onFilter("ITS"); onClose(); }}
        >
          ITS
        </Button>

        {/* Teacher Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => { onFilter("Teacher"); onClose(); }}
        >
          Teacher
        </Button>

        {/* Show All Button */}
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => { onFilter("All"); onClose(); }}
        >
          Show All
        </Button>
      </div>
    </DialogContent>
  );
}
