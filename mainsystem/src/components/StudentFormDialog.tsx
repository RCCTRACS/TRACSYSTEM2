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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  barcode_id: string;
  student_name: string;
  year_level: string;
  department: string;
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
  const [formState, setFormState] = useState<Student>({
    barcode_id: "",
    student_name: "",
    year_level: "",
    department: "",
    parent_email: "",
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    if (student) {
      setFormState(student); // preload existing data (edit mode)
    } else {
      setFormState({
        barcode_id: "",
        student_name: "",
        year_level: "",
        department: "",
        parent_email: "",
      });
    }
  }, [student]);

  // fetch dropdown data
  useEffect(() => {
    fetch("http://192.168.100.26/capstone/mainsystem/backend/department_api.php")
      .then((res) => res.json())
      .then((data) =>
        setDepartments(
          (data.departments || data || []).filter(
            (d: any) => d.department !== "ITS" && d.department !== "Teacher"
          )
        )
      )
      .catch(() => setDepartments([]));

    fetch("http://192.168.100.26/capstone/mainsystem/backend/grade_api.php")
      .then((res) => res.json())
      .then((data) => setGrades(data.grades || data || []))
      .catch(() => setGrades([]));
  }, []);

  // filter grades based on department
  const filteredGrades = (() => {
    if (!formState.department) return grades;

    const collegePrograms = [
      "ABEL",
      "BEED",
      "BSA",
      "BSBA",
      "BSCE",
      "BSED",
      "BSHM",
      "BSIT",
      "BSTM",
    ];

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
      // Correct ordering for JHS
      const order = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
      return order
        .map((grade) =>
          grades.find(
            (g: any) =>
              (g.grade || g.grade_name || g.grade_level) === grade
          )
        )
        .filter(Boolean);
    }

    return grades;
  })();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const outlineClass =
    "border-[2.5px] border-[#3E1F0F] rounded-xl focus:border-[#3E1F0F] focus:ring-2 focus:ring-[#C9A27E] h-12 px-4 shadow-sm transition-all duration-200";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

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
        {/* Barcode ID (Read-only when editing) */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Barcode ID
          </Label>
          <Input
            id="barcode_id"
            name="barcode_id"
            value={formState.barcode_id}
            onChange={handleChange}
            required
            disabled={!!student}
            className={`${outlineClass} ${
              student ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Full Name
          </Label>
          <Input
            id="student_name"
            name="student_name"
            value={formState.student_name}
            onChange={handleChange}
            required
            className={outlineClass}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Department
          </Label>
          <Select
            value={formState.department}
            onValueChange={(value) => {
              // Only reset year_level if department actually changes
              setFormState((prev) => ({
                ...prev,
                department: value,
                year_level:
                  prev.department === value ? prev.year_level : "",
              }));
            }}
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
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Year Level
          </Label>
          <Select
            value={formState.year_level}
            onValueChange={(value) =>
              setFormState({ ...formState, year_level: value })
            }
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

        {/* Parent Email - Full Width */}
        <div className="flex flex-col gap-2 col-span-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Parent Email
          </Label>
          <Input
            id="parent_email"
            name="parent_email"
            type="email"
            value={formState.parent_email}
            onChange={handleChange}
            required
            className={outlineClass}
          />
        </div>

        {/* Buttons - Full Width */}
        <DialogFooter className="col-span-2 mt-8 flex justify-end gap-4 border-t border-[#E5D3C6] pt-6">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white 
            hover:bg-[#5C3A21] hover:text-white rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-sm"
            onClick={() => {
              setFormState({
                barcode_id: "",
                student_name: "",
                year_level: "",
                department: "",
                parent_email: "",
              });
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] 
            rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-md"
          >
            {student ? "Save Changes" : "Add Student"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
