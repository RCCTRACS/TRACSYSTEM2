"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Student {
  barcode_id: string;
  student_name: string;
  year_level: string;
  department: string;
  grade?: string | null;
  strand?: string | null;
  section?: string | null;
  parent_email: string;
}

interface StudentFormDialogProps {
  student: Student | null;
  onSave: (student: Student) => void;
  onClose: () => void;
}

export function StudentFormDialog({
  student,
  onSave,
  onClose,
}: StudentFormDialogProps) {
  const emptyForm: Student = {
    barcode_id: "",
    student_name: "",
    year_level: "",
    department: "",
    grade: null,
    strand: null,
    section: null,
    parent_email: "",
  };

  const [formState, setFormState] = useState<Student>(emptyForm);
  const [departments, setDepartments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [strands, setStrands] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  // Normalize API response
  const normalize = (data: any, key: string) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  };

  // Fetch dropdown data
  useEffect(() => {
    fetch("http://192.168.1.13/capstone/mainsystem/backend/department_api.php")
      .then((res) => res.json())
      .then((data) =>
        setDepartments(
          normalize(data, "departments").filter(
            (d: any) => d.department !== "ITS" && d.department !== "Teacher"
          )
        )
      )
      .catch(() => setDepartments([]));

    fetch("http://192.168.1.13/capstone/mainsystem/backend/grade_api.php")
      .then((res) => res.json())
      .then((data) => setGrades(normalize(data, "grades")))
      .catch(() => setGrades([]));

    fetch("http://192.168.1.13/capstone/mainsystem/backend/strand_api.php")
      .then((res) => res.json())
      .then((data) => setStrands(normalize(data, "strands")))
      .catch(() => setStrands([]));

    fetch("http://192.168.1.13/capstone/mainsystem/backend/section_api.php")
      .then((res) => res.json())
      .then((data) => setSections(normalize(data, "sections")))
      .catch(() => setSections([]));
  }, []);

  // Prefill form when editing
  useEffect(() => {
    if (student) {
      setFormState({
        ...student,
        grade: student.grade || null,
        strand: student.strand || null,
        section: student.section || null,
      });
    } else {
      setFormState(emptyForm);
    }
  }, [student]);

  // College programs list
  const collegePrograms = [
    "ABEL", "BEED", "BSA", "BSBA", "BSCE", "BSED", "BSHM", "BSIT", "BSTM",
  ];

  // Filter grades based on department
  const filteredGrades = (() => {
    if (!formState.department) return grades;

    if (collegePrograms.includes(formState.department)) {
      return grades.filter((g: any) =>
        ["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (formState.department === "SHS") {
      return grades.filter((g: any) =>
        ["Grade 11", "Grade 12"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (formState.department === "JHS") {
      const order = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
      return order
        .map((grade) =>
          grades.find(
            (g: any) => (g.grade || g.grade_name || g.grade_level) === grade
          )
        )
        .filter(Boolean);
    }

    return grades;
  })();

  // Extract level key
  const getLevelKey = (year: string) => {
    if (!year) return "";
    if (year.startsWith("Grade")) {
      return year.split(" ")[1]; // Grade 7 → 7
    }
    if (year.includes("Year")) {
      return year.split(" ")[0]; // 1st Year → 1st
    }
    return year;
  };

  // Filter strands (for SHS only)
  const filteredStrands = (() => {
    if (formState.department !== "SHS" || !formState.year_level) return [];
    const key = getLevelKey(formState.year_level);
    return strands.filter((s: any) => s.strand.startsWith(key));
  })();

  // Filter sections (for JHS only)
  const filteredSections = (() => {
    if (formState.department !== "JHS" || !formState.year_level) return [];
    const key = getLevelKey(formState.year_level);
    return sections.filter((s: any) => s.section.startsWith(key));
  })();

  // Handle input/select changes
  const handleChange = (key: string, value: any) => {
    setFormState((prev) => {
      let updated = { ...prev, [key]: value };

      if (key === "department") {
        updated = { ...updated, year_level: "", grade: null, strand: null, section: null };
      }
      if (key === "year_level") {
        updated = { ...updated, strand: null, section: null };
      }
      return updated;
    });
  };

  // Convert empty values to null before saving
  const prepareData = (data: Student): Student => {
    return {
      ...data,
      grade: data.year_level || null,
      strand: data.strand || null,
      section: data.section || null,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prepareData(formState));
    if (!student) setFormState(emptyForm);
  };

  const outlineClass =
    "border-[2.5px] border-[#3E1F0F] rounded-xl focus:border-[#3E1F0F] focus:ring-2 focus:ring-[#C9A27E] h-12 px-4 shadow-sm transition-all duration-200";

  return (
    <DialogContent
      className="sm:max-w-[750px] bg-white 
      p-10 rounded-3xl shadow-2xl border border-[#D9B99B] max-h-[90vh] overflow-y-auto my-6"
    >
      <DialogHeader className="px-0 pb-6 border-b border-[#E5D3C6]">
        <DialogTitle className="text-2xl font-extrabold text-[#3E1F0F] tracking-wide">
          {student ? "Edit Student" : "Add Student"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 py-6">
        {/* Barcode ID */}
        <div className="flex flex-col gap-2">
          <Label>Barcode ID</Label>
          <Input
            id="barcode_id"
            name="barcode_id"
            value={formState.barcode_id}
            onChange={(e) => handleChange("barcode_id", e.target.value)}
            required
            disabled={!!student}
            className={`${outlineClass} ${
              student ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Student Name */}
        <div className="flex flex-col gap-2">
          <Label>Full Name</Label>
          <Input
            id="student_name"
            name="student_name"
            value={formState.student_name}
            onChange={(e) => handleChange("student_name", e.target.value)}
            required
            className={outlineClass}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2">
          <Label>Department</Label>
          <Select
            value={formState.department}
            onValueChange={(val) => handleChange("department", val)}
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d: any) => (
                <SelectItem key={d.id} value={d.department}>
                  {d.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Level */}
        <div className="flex flex-col gap-2">
          <Label>Year Level</Label>
          <Select
            value={formState.year_level}
            onValueChange={(val) => handleChange("year_level", val)}
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select year level" />
            </SelectTrigger>
            <SelectContent>
              {filteredGrades.map((g: any) => (
                <SelectItem
                  key={g.id}
                  value={g.grade || g.grade_name || g.grade_level}
                >
                  {g.grade || g.grade_name || g.grade_level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Strand - only for SHS */}
        {formState.department === "SHS" &&
          ["Grade 11", "Grade 12"].includes(formState.year_level) && (
            <div className="flex flex-col gap-2">
              <Label>Strand</Label>
              <Select
                value={formState.strand || ""}
                onValueChange={(val) => handleChange("strand", val)}
              >
                <SelectTrigger className={outlineClass}>
                  <SelectValue placeholder="Select strand" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStrands.map((s: any) => (
                    <SelectItem key={s.id} value={s.strand}>
                      {s.strand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

        {/* Section - only for JHS */}
        {formState.department === "JHS" && (
          <div className="flex flex-col gap-2">
            <Label>Section</Label>
            <Select
              value={formState.section || ""}
              onValueChange={(val) => handleChange("section", val)}
            >
              <SelectTrigger className={outlineClass}>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {filteredSections.map((s: any) => (
                  <SelectItem key={s.id} value={s.section}>
                    {s.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Parent Email */}
        <div className="flex flex-col gap-2 col-span-2">
          <Label>Parent Email</Label>
          <Input
            id="parent_email"
            name="parent_email"
            type="email"
            value={formState.parent_email}
            onChange={(e) => handleChange("parent_email", e.target.value)}
            required
            className={outlineClass}
          />
        </div>

        {/* Buttons */}
        <DialogFooter className="col-span-2 mt-8 flex justify-end gap-4 border-t border-[#E5D3C6] pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormState(emptyForm);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">
            {student ? "Save Changes" : "Add Student"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
