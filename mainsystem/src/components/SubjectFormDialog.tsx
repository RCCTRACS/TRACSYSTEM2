"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

interface SubjectFormDialogProps {
  subject: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export function SubjectFormDialog({
  subject,
  onSave,
  onClose
}: SubjectFormDialogProps) {
  const emptyForm = {
    code: "",
    name: "",
    time: "",
    department: "",
    grade: "",
    strand: "",
    section: "",
    instructor: ""
  };

  const [formData, setFormData] = useState<any>(emptyForm);
  const [departments, setDepartments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [strands, setStrands] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [initialized, setInitialized] = useState(false);

  const normalize = (data: any, key: string) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  };

  // Fetch dropdown data
  useEffect(() => {
    fetch("http://192.168.0.143/capstone/mainsystem/backend/department_api.php")
      .then((res) => res.json())
      .then((data) =>
        setDepartments(
          normalize(data, "departments").filter(
            (d: any) => d.department !== "ITS" && d.department !== "Teacher"
          )
        )
      )
      .catch(() => setDepartments([]));

    fetch("http://192.168.0.143/capstone/mainsystem/backend/grade_api.php")
      .then((res) => res.json())
      .then((data) => setGrades(normalize(data, "grades")))
      .catch(() => setGrades([]));

    fetch("http://192.168.0.143/capstone/mainsystem/backend/users_api.php")
      .then((res) => res.json())
      .then((data) => {
        const users = normalize(data, "users");
        setInstructors(users.filter((u: any) => u.role === "Teacher"));
      })
      .catch(() => setInstructors([]));

    fetch("http://192.168.0.143/capstone/mainsystem/backend/strand_api.php")
      .then((res) => res.json())
      .then((data) => setStrands(normalize(data, "strands")))
      .catch(() => setStrands([]));

    fetch("http://192.168.0.143/capstone/mainsystem/backend/section_api.php")
      .then((res) => res.json())
      .then((data) => setSections(normalize(data, "sections")))
      .catch(() => setSections([]));
  }, []);

  // Prefill form when editing
  useEffect(() => {
    if (!subject || initialized) return;

    setFormData({
      code: subject.subject_code || "",
      name: subject.subject_name || "",
      time: subject.subject_time || "",
      department: subject.department || "",
      grade: subject.grade || "",
      strand: subject.strand || "",
      section: subject.section || "",
      instructor: subject.instructor || ""
    });

    setInitialized(true);
  }, [subject, initialized]);

  // Filter Grades based on Department
  const filteredGrades = (() => {
    if (!formData.department) return grades;

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

    if (collegePrograms.includes(formData.department)) {
      return grades.filter((g) =>
        ["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (formData.department === "SHS") {
      return grades.filter((g) =>
        ["Grade 11", "Grade 12"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (formData.department === "JHS") {
      return grades.filter((g) =>
        ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    return grades;
  })();

  const filteredStrands = strands.filter((s) => {
    if (!formData.grade) return true;
    return s.strand.includes(formData.grade.split(" ")[1]);
  });

  const filteredSections = sections.filter((s) => {
    if (!formData.grade) return true;
    return s.section.includes(formData.grade.split(" ")[1]);
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));

    if (key === "department") {
      setFormData((prev: any) => ({
        ...prev,
        grade: "",
        strand: "",
        section: ""
      }));
    }
    if (key === "grade") {
      setFormData((prev: any) => ({ ...prev, strand: "", section: "" }));
    }
  };

  const handleSubmit = () => {
    const mappedData = {
      subject_code: formData.code.trim(),
      subject_name: formData.name.trim(),
      subject_time: formData.time.trim(),
      department: formData.department || "",
      grade: formData.grade || "",
      strand: formData.strand || "",
      section: formData.section || "",
      instructor: formData.instructor || ""
    };

    onSave(mappedData);

    if (!subject) {
      setFormData(emptyForm);
      setInitialized(false);
    }
  };

  const outlineClass =
    "border-[2.5px] border-[#3E1F0F] rounded-xl focus:border-[#3E1F0F] focus:ring-2 focus:ring-[#C9A27E] h-12 px-4 shadow-sm transition-all duration-200";

  return (
    <DialogContent
      className="sm:max-w-[1000px] bg-white 
        p-8 rounded-3xl shadow-2xl border border-[#D9B99B] my-6"
    >
      <DialogHeader className="px-0 pb-6 border-b border-[#E5D3C6]">
        <DialogTitle className="text-2xl font-extrabold text-[#3E1F0F] tracking-wide">
          {subject ? "Edit Subject" : "Add Subject"}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-6 py-6">
        {/* Subject Code */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Subject Code
          </Label>
          <Input
            placeholder="e.g., CS101"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            disabled={!!subject}
            className={outlineClass}
          />
        </div>

        {/* Subject Name */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Subject Name
          </Label>
          <Input
            placeholder="e.g., Intro to Computer Science"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={outlineClass}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Department
          </Label>
          <Select
            value={formData.department}
            onValueChange={(val) => handleChange("department", val)}
          >
            <SelectTrigger className={outlineClass}>
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
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Grade / Year
          </Label>
          <Select
            value={formData.grade}
            onValueChange={(val) => handleChange("grade", val)}
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {filteredGrades.map((g) => (
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

        {/* Strand (SHS only) */}
        {formData.department === "SHS" && (
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-[#3E1F0F] tracking-wide">
              Strand
            </Label>
            <Select
              value={formData.strand}
              onValueChange={(val) => handleChange("strand", val)}
            >
              <SelectTrigger className={outlineClass}>
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
        {formData.department === "JHS" && (
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-[#3E1F0F] tracking-wide">
              Section
            </Label>
            <Select
              value={formData.section}
              onValueChange={(val) => handleChange("section", val)}
            >
              <SelectTrigger className={outlineClass}>
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

        {/* Instructor */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Instructor
          </Label>
          <Select
            value={formData.instructor}
            onValueChange={(val) => handleChange("instructor", val)}
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select Instructor" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((t) => (
                <SelectItem key={t.id} value={`${t.first_name} ${t.last_name}`}>
                  {t.first_name} {t.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[#3E1F0F] tracking-wide">
            Time
          </Label>
          <Input
            placeholder="e.g., 8:00 AM - 10:00 AM"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            className={outlineClass}
          />
        </div>
      </div>

      {/* Buttons */}
      <DialogFooter className="mt-6 flex justify-end gap-4 border-t border-[#E5D3C6] pt-6">
        <Button
          type="button"
          variant="outline"
          className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white 
            hover:bg-[#5C3A21] hover:text-white rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-sm"
          onClick={() => {
            setFormData(emptyForm);
            setInitialized(false);
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] 
            rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-md"
          onClick={handleSubmit}
        >
          {subject ? "Save Changes" : "Add Subject"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
