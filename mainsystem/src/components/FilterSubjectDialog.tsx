"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

interface FilterSubjectDialogProps {
  onFilter: (
    department: string | null,
    grade: string | null,
    strand: string | null,
    section: string | null
  ) => void;
  onClose: () => void;
}

export function FilterSubjectDialog({
  onFilter,
  onClose
}: FilterSubjectDialogProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [strands, setStrands] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const normalize = (data: any, key: string) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  };

  // Fetch dropdown data
  useEffect(() => {
    fetch("http://192.168.0.137/capstone/mainsystem/backend/department_api.php")
      .then((res) => res.json())
      .then((data) =>
        setDepartments(
          normalize(data, "departments").filter(
            (d: any) => d.department !== "ITS" && d.department !== "Teacher"
          )
        )
      )
      .catch(() => setDepartments([]));

    fetch("http://192.168.0.137/capstone/mainsystem/backend/grade_api.php")
      .then((res) => res.json())
      .then((data) => setGrades(normalize(data, "grades")))
      .catch(() => setGrades([]));

    fetch("http://192.168.0.137/capstone/mainsystem/backend/strand_api.php")
      .then((res) => res.json())
      .then((data) => setStrands(normalize(data, "strands")))
      .catch(() => setStrands([]));

    fetch("http://192.168.0.137/capstone/mainsystem/backend/section_api.php")
      .then((res) => res.json())
      .then((data) => setSections(normalize(data, "sections")))
      .catch(() => setSections([]));
  }, []);

  // --- Filtering logic (copied from SubjectFormDialog) ---
  const filteredGrades = (() => {
    if (!selectedDept) return grades;

    const collegePrograms = [
      "ABEL",
      "BEED",
      "BSA",
      "BSBA",
      "BSCE",
      "BSED",
      "BSHM",
      "BSIT",
      "BSTM"
    ];

    if (collegePrograms.includes(selectedDept)) {
      return grades.filter((g) =>
        ["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (selectedDept === "SHS") {
      return grades.filter((g) =>
        ["Grade 11", "Grade 12"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (selectedDept === "JHS") {
      return grades.filter((g) =>
        ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    return grades;
  })();

  const filteredStrands = selectedDept === "SHS" ? strands : [];
  const filteredSections = selectedDept === "JHS" ? sections : [];

  // --- Apply / Reset ---
  const handleApplyFilter = () => {
    const normalizeVal = (val: string | null) =>
      val ? val.trim().toLowerCase() : null;

    onFilter(
      normalizeVal(selectedDept),
      normalizeVal(selectedGrade),
      normalizeVal(selectedStrand),
      normalizeVal(selectedSection)
    );
    onClose();
  };

  const resetFilter = () => {
    setSelectedDept(null);
    setSelectedGrade(null);
    setSelectedStrand(null);
    setSelectedSection(null);
    onFilter(null, null, null, null);
    onClose();
  };

  const fieldStyle =
    "border-2 border-[#5C4033] rounded-md focus:ring-0 focus:border-[#5C4033]";

  return (
    <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-md bg-white p-6">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          Filter Subjects
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Department */}
        <div>
          <p className="mb-1 text-sm font-medium">Department</p>
          <Select
            value={selectedDept ?? ""}
            onValueChange={(val) => {
              setSelectedDept(val || null);
              setSelectedGrade(null);
              setSelectedStrand(null);
              setSelectedSection(null);
            }}
          >
            <SelectTrigger className={fieldStyle}>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.department}>
                  {d.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grade */}
        {filteredGrades.length > 0 && (
          <div>
            <p className="mb-1 text-sm font-medium">Grade / Year</p>
            <Select
              value={selectedGrade ?? ""}
              onValueChange={(val) => {
                setSelectedGrade(val || null);
                setSelectedStrand(null);
                setSelectedSection(null);
              }}
            >
              <SelectTrigger className={fieldStyle}>
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {filteredGrades.map((g) => {
                  const val = g.grade || g.grade_name || g.grade_level || "";
                  return (
                    <SelectItem key={g.id} value={val}>
                      {val}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Strand (SHS only) */}
        {selectedDept === "SHS" && (
          <div>
            <p className="mb-1 text-sm font-medium">Strand</p>
            <Select
              value={selectedStrand ?? ""}
              onValueChange={(val) => setSelectedStrand(val || null)}
            >
              <SelectTrigger className={fieldStyle}>
                <SelectValue placeholder="Select Strand" />
              </SelectTrigger>
              <SelectContent>
                {filteredStrands.map((s) => (
                  <SelectItem key={s.id} value={s.strand}>
                    {s.strand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Section (JHS only) */}
        {selectedDept === "JHS" && (
          <div>
            <p className="mb-1 text-sm font-medium">Section</p>
            <Select
              value={selectedSection ?? ""}
              onValueChange={(val) => setSelectedSection(val || null)}
            >
              <SelectTrigger className={fieldStyle}>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {filteredSections.map((s) => (
                  <SelectItem key={s.id} value={s.section}>
                    {s.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={resetFilter}>
          Show All
        </Button>
        <Button className="bg-[#5C3A21] text-white" onClick={handleApplyFilter}>
          Apply Filter
        </Button>
      </div>
    </DialogContent>
  );
}
