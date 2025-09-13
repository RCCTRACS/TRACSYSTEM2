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

    fetch("http://192.168.1.13/capstone/mainsystem/backend/users_api.php")
      .then((res) => res.json())
      .then((data) => {
        const users = normalize(data, "users");
        setInstructors(users.filter((u: any) => u.role === "Teacher"));
      })
      .catch(() => setInstructors([]));

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

  const fieldStyle =
    "border-2 border-[#5C4033] rounded-md focus:ring-0 focus:border-[#5C4033]";

  return (
    <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-md">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          {subject ? "Edit Subject" : "Add Subject"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Subject Code */}
        <div>
          <Label className="mb-1 block">Subject Code</Label>
          <Input
            className={fieldStyle}
            placeholder="e.g., CS101"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            disabled={!!subject}
          />
        </div>

        {/* Subject Name */}
        <div>
          <Label className="mb-1 block">Subject Name</Label>
          <Input
            className={fieldStyle}
            placeholder="e.g., Intro to Computer Science"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Department */}
        <div>
          <Label className="mb-1 block">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(val) => handleChange("department", val)}
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
        <div>
          <Label className="mb-1 block">Grade / Year</Label>
          <Select
            value={formData.grade}
            onValueChange={(val) => handleChange("grade", val)}
          >
            <SelectTrigger className={fieldStyle}>
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
          <div>
            <Label className="mb-1 block">Strand</Label>
            <Select
              value={formData.strand}
              onValueChange={(val) => handleChange("strand", val)}
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
        {formData.department === "JHS" && (
          <div>
            <Label className="mb-1 block">Section</Label>
            <Select
              value={formData.section}
              onValueChange={(val) => handleChange("section", val)}
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

        {/* Instructor */}
        <div>
          <Label className="mb-1 block">Instructor</Label>
          <Select
            value={formData.instructor}
            onValueChange={(val) => handleChange("instructor", val)}
          >
            <SelectTrigger className={fieldStyle}>
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
        <div>
          <Label className="mb-1 block">Time</Label>
          <Input
            className={fieldStyle}
            placeholder="e.g., 8:00 AM - 10:00 AM"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{subject ? "Update" : "Add"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
