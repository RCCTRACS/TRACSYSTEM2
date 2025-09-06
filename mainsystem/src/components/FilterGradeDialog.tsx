import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FilterGradeDialogProps {
  gradeLevels?: string[]; // optional, default to Grade 7-12
  onFilter: (gradeLevel: string) => void;
  onClose: () => void;
}

export function FilterGradeDialog({ gradeLevels, onFilter, onClose }: FilterGradeDialogProps) {
  const grades = gradeLevels || ["All", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

  return (
    <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter By Grade Level
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-wrap justify-between mt-8 gap-4">
        {grades.map((grade, index) => (
          <Button
            key={index}
            className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-8 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300 flex-1 text-center"
            onClick={() => { onFilter(grade); onClose(); }}
          >
            {grade}
          </Button>
        ))}
      </div>
    </DialogContent>
  );
}
