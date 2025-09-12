"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
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
  onClose
}: StudentFormDialogProps) {
  const [formState, setFormState] = useState<Student>({
    barcode_id: "",
    student_name: "",
    year_level: "",
    department: "",
    parent_email: ""
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    if (student) {
      setFormState(student);
    } else {
      setFormState({
        barcode_id: "",
        student_name: "",
        year_level: "",
        department: "",
        parent_email: ""
      });
    }
  }, [student]);

  // fetch dropdown data
  useEffect(() => {
    fetch("http://192.168.0.137/capstone/mainsystem/backend/department_api.php")
      .then((res) => res.json())
      .then((data) =>
        setDepartments(
          (data.departments || data || []).filter(
            (d: any) => d.department !== "ITS" && d.department !== "Teacher"
          )
        )
      )
      .catch(() => setDepartments([]));

    fetch("http://192.168.0.137/capstone/mainsystem/backend/grade_api.php")
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
      "BSTM"
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
      return grades.filter((g: any) =>
        ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
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
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-popover p-6">
      <DialogHeader className="px-0">
        <DialogTitle className="text-xl font-bold text-black">
          {student ? "Edit Student" : "Add Student"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Barcode ID (Read-only when editing) */}
        <div className="space-y-2">
          <Label htmlFor="barcode_id" className="font-bold text-black">
            Barcode ID
          </Label>
          <Input
            id="barcode_id"
            name="barcode_id"
            value={formState.barcode_id}
            onChange={handleChange}
            required
            disabled={!!student} // <-- disable when editing
            className={`${outlineClass} ${
              student ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="student_name" className="font-bold text-black">
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
        <div className="space-y-2">
          <Label htmlFor="department" className="font-bold text-black">
            Department
          </Label>
          <Select
            value={formState.department}
            onValueChange={(value) =>
              setFormState({ ...formState, department: value, year_level: "" })
            }
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
        <div className="space-y-2">
          <Label htmlFor="year_level" className="font-bold text-black">
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

        {/* Parent Email */}
        <div className="space-y-2">
          <Label htmlFor="parent_email" className="font-bold text-black">
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

        {/* Buttons */}
        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200"
          >
            {student ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
