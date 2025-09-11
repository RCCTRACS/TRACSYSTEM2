import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Subject {
  subject_code: string;
  subject_name: string;
  subject_time?: string;
  department?: string;
  grade?: string;
  strand?: string;
  section?: string;
  instructor?: string;
}

interface FilterSubjectDialogProps {
  subjects: Subject[];
  onFilter: (department: string | null, grade: string | null, strand: string | null, section: string | null, subject: string | null) => void;
  onClose: () => void;
}

export function FilterSubjectDialog({ subjects, onFilter, onClose }: FilterSubjectDialogProps) {
  const [departments, setDepartments] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [strands, setStrands] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Dynamically populate departments
  useEffect(() => {
    const depts = Array.from(new Set(subjects.map(s => s.department).filter(Boolean)));
    setDepartments(depts as string[]);
  }, [subjects]);

  // Dynamically populate grades based on department
  useEffect(() => {
    if (!selectedDept) {
      setGrades([]);
      return;
    }
    const filteredGrades = Array.from(
      new Set(subjects.filter(s => s.department === selectedDept).map(s => s.grade).filter(Boolean))
    );
    setGrades(filteredGrades as string[]);
  }, [selectedDept, subjects]);

  // Dynamically populate strands based on grade
  useEffect(() => {
    if (!selectedDept || !selectedGrade) {
      setStrands([]);
      return;
    }
    const filteredStrands = Array.from(
      new Set(
        subjects.filter(s => s.department === selectedDept && s.grade === selectedGrade)
                .map(s => s.strand)
                .filter(Boolean)
      )
    );
    setStrands(filteredStrands as string[]);
  }, [selectedDept, selectedGrade, subjects]);

  // Dynamically populate sections based on grade & strand
  useEffect(() => {
    if (!selectedDept || !selectedGrade) {
      setSections([]);
      return;
    }
    const filteredSections = Array.from(
      new Set(
        subjects.filter(
          s =>
            s.department === selectedDept &&
            s.grade === selectedGrade &&
            (selectedStrand ? s.strand === selectedStrand : true)
        )
        .map(s => s.section)
        .filter(Boolean)
      )
    );
    setSections(filteredSections as string[]);
  }, [selectedDept, selectedGrade, selectedStrand, subjects]);

  const handleApplyFilter = () => {
    onFilter(selectedDept, selectedGrade, selectedStrand, selectedSection, null);
    onClose();
  };

  const resetFilter = () => {
    setSelectedDept(null);
    setSelectedGrade(null);
    setSelectedStrand(null);
    setSelectedSection(null);
    onFilter(null, null, null, null, null);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter Subjects
        </DialogTitle>
      </DialogHeader>

      {/* Department */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-black mb-2">Department</h3>
        <div className="flex flex-wrap gap-3">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={selectedDept === dept ? "default" : "outline"}
              className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-6 py-2 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transition-all duration-300"
              onClick={() => {
                setSelectedDept(dept);
                setSelectedGrade(null);
                setSelectedStrand(null);
                setSelectedSection(null);
              }}
            >
              {dept}
            </Button>
          ))}
        </div>
      </div>

      {/* Grade */}
      {grades.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-black mb-2">Grade / Year</h3>
          <div className="flex flex-wrap gap-3">
            {grades.map((g) => (
              <Button
                key={g}
                variant={selectedGrade === g ? "default" : "outline"}
                className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-6 py-2 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transition-all duration-300"
                onClick={() => {
                  setSelectedGrade(g);
                  setSelectedStrand(null);
                  setSelectedSection(null);
                }}
              >
                {g}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Strand */}
      {strands.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-black mb-2">Strand</h3>
          <div className="flex flex-wrap gap-3">
            {strands.map((s) => (
              <Button
                key={s}
                variant={selectedStrand === s ? "default" : "outline"}
                className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-6 py-2 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transition-all duration-300"
                onClick={() => {
                  setSelectedStrand(s);
                  setSelectedSection(null);
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Section */}
      {sections.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-black mb-2">Section</h3>
          <div className="flex flex-wrap gap-3">
            {sections.map((sec) => (
              <Button
                key={sec}
                variant={selectedSection === sec ? "default" : "outline"}
                className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] rounded-2xl px-6 py-2 font-semibold shadow-md hover:bg-[#5C3A21] hover:text-white transition-all duration-300"
                onClick={() => setSelectedSection(sec)}
              >
                {sec}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex gap-3 justify-end">
        <Button
          variant="outline"
          className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200 rounded-lg"
          onClick={resetFilter}
        >
          Show All
        </Button>
        <Button
          className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200 rounded-lg"
          onClick={handleApplyFilter}
        >
          Apply Filter
        </Button>
      </div>
    </DialogContent>
  );
}
