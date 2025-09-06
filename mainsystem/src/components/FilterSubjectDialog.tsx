import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FilterSubjectDialogProps {
  subjects: string[]; // Subjects dynamically passed from SubjectManagement
  onFilter: (year: string | null, subject: string | null) => void;
  onClose: () => void;
}

export function FilterSubjectDialog({
  subjects,
  onFilter,
  onClose,
}: FilterSubjectDialogProps) {
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  return (
    <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter Subjects
        </DialogTitle>
      </DialogHeader>

      {/* Filter by Year Level */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-black mb-2">Year Level</h3>
        <div className="flex flex-col gap-3">
          {years.map((year) => (
            <Button
              key={year}
              className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
              onClick={() => {
                onFilter(year, null);
                onClose();
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>

      {/* Filter by Subject */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-black mb-2">Subject</h3>
        <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
          {subjects.length > 0 ? (
            subjects.map((sub) => (
              <Button
                key={sub}
                className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  onFilter(null, sub);
                  onClose();
                }}
              >
                {sub}
              </Button>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No subjects available</p>
          )}
        </div>
      </div>

      {/* Show All */}
      <div className="mt-6">
        <Button
          className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-12 py-4 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-300 w-full"
          onClick={() => {
            onFilter(null, null);
            onClose();
          }}
        >
          Show All
        </Button>
      </div>
    </DialogContent>
  );
}
