"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SubjectFormDialogProps {
  subject: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export function SubjectFormDialog({
  subject,
  onSave,
  onClose,
}: SubjectFormDialogProps) {
  const emptyForm = {
    code: "",
    name: "",
    time: "",
    department_id: "",
    grade_id: "",
    strand_id: "",
    section_id: "",
    teacher_id: "",
  };

  const [formData, setFormData] = useState<any>(emptyForm);
  const [departments, setDepartments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [strands, setStrands] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [initialized, setInitialized] = useState(false); // track if edit prefill ran

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
  }, []);

  // Prefill form **once** when editing
  useEffect(() => {
    if (!subject || initialized) return;

    const deptId =
      departments.find((d) => d.department === subject.department)?.id || "";
    const gradeId =
      grades.find(
        (g) =>
          g.grade === subject.grade ||
          g.grade_name === subject.grade ||
          g.grade_level === subject.grade
      )?.id || "";
    const strandId = strands.find((s) => s.strand === subject.strand)?.id || "";
    const sectionId =
      sections.find((s) => s.section === subject.section)?.id || "";
    const teacherId =
      instructors.find(
        (t) =>
          `${t.first_name} ${t.last_name}`.trim() ===
          (subject.instructor || "").trim()
      )?.id || "";

    setFormData({
      code: subject.subject_code || "",
      name: subject.subject_name || "",
      time: subject.subject_time || "",
      department_id: deptId,
      grade_id: gradeId,
      strand_id: strandId,
      section_id: sectionId,
      teacher_id: teacherId,
    });

    setInitialized(true); // prevent overwriting user changes
  }, [subject, departments, grades, strands, sections, instructors, initialized]);

  // Load strand/section when department changes
  useEffect(() => {
    if (!formData.department_id) return;

    const dept = departments.find((d) => d.id == formData.department_id);

    // SHS
    if (dept?.department === "SHS") {
      fetch("http://192.168.1.13/capstone/mainsystem/backend/strand_api.php")
        .then((res) => res.json())
        .then((data) => setStrands(normalize(data, "strands")))
        .catch(() => setStrands([]));
      setSections([]);
    }

    // JHS
    if (dept?.department === "JHS") {
      fetch("http://192.168.1.13/capstone/mainsystem/backend/section_api.php")
        .then((res) => res.json())
        .then((data) => setSections(normalize(data, "sections")))
        .catch(() => setSections([]));
      setStrands([]);
    }

    // College
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
    if (collegePrograms.includes(dept?.department)) {
      setStrands([]);
      setSections([]);
    }
  }, [formData.department_id, departments]);

  // Filter Grades based on Department
  const filteredGrades = (() => {
    const dept = departments.find((d) => d.id == formData.department_id);
    if (!dept) return grades;

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

    if (collegePrograms.includes(dept.department)) {
      return grades.filter((g) =>
        ["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (dept.department === "SHS") {
      return grades.filter((g) =>
        ["Grade 11", "Grade 12"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    if (dept.department === "JHS") {
      return grades.filter((g) =>
        ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
          g.grade || g.grade_name || g.grade_level
        )
      );
    }

    return grades;
  })();

  const filteredStrands = strands.filter((s) => {
    const grade = grades.find((g) => g.id == formData.grade_id);
    if (!grade) return true;
    const gradeName = grade.grade || grade.grade_name || grade.grade_level;
    return s.strand.includes(gradeName.split(" ")[1]);
  });

  const filteredSections = sections.filter((s) => {
    const grade = grades.find((g) => g.id == formData.grade_id);
    if (!grade) return true;
    const gradeName = grade.grade || grade.grade_name || grade.grade_level;
    return s.section.includes(gradeName.split(" ")[1]);
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));

    if (key === "grade_id") {
      setFormData((prev: any) => ({ ...prev, strand_id: "", section_id: "" }));
    }
    if (key === "department_id") {
      setFormData((prev: any) => ({
        ...prev,
        grade_id: "",
        strand_id: "",
        section_id: "",
      }));
    }
  };

  const handleSubmit = () => {
    const deptName =
      departments.find((d) => d.id == formData.department_id)?.department || "";
    const gradeName =
      grades.find((g) => g.id == formData.grade_id)?.grade ||
      grades.find((g) => g.id == formData.grade_id)?.grade_name ||
      grades.find((g) => g.id == formData.grade_id)?.grade_level ||
      "";
    const strandName =
      strands.find((s) => s.id == formData.strand_id)?.strand || "";
    const sectionName =
      sections.find((s) => s.id == formData.section_id)?.section || "";
    const instructorObj = instructors.find((t) => t.id == formData.teacher_id);
    const teacherName = instructorObj
      ? `${instructorObj.first_name} ${instructorObj.last_name}`
      : "";

    const mappedData = {
      subject_code: formData.code,
      subject_name: formData.name,
      subject_time: formData.time,
      department: deptName,
      grade: gradeName,
      strand: strandName,
      section: sectionName,
      instructor: teacherName,
    };

    onSave(mappedData);

    if (!subject) {
      setFormData(emptyForm); // clear fields after adding
      setInitialized(false);
    }
  };

  const fieldStyle =
    "border-2 border-[#5C4033] rounded-md focus:ring-0 focus:border-[#5C4033]";
  const selectedDept = departments.find((d) => d.id == formData.department_id);

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
            disabled={!!subject} // keep code uneditable on edit
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
            value={formData.department_id?.toString()}
            onValueChange={(val) => handleChange("department_id", Number(val))}
          >
            <SelectTrigger className={fieldStyle}>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id.toString()}>
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
            value={formData.grade_id?.toString()}
            onValueChange={(val) => handleChange("grade_id", Number(val))}
          >
            <SelectTrigger className={fieldStyle}>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {filteredGrades.map((g) => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.grade || g.grade_name || g.grade_level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Strand (SHS only) */}
        {selectedDept?.department === "SHS" && (
          <div>
            <Label className="mb-1 block">Strand</Label>
            <Select
              value={formData.strand_id?.toString()}
              onValueChange={(val) => handleChange("strand_id", Number(val))}
            >
              <SelectTrigger className={fieldStyle}>
                <SelectValue placeholder="Select Strand" />
              </SelectTrigger>
              <SelectContent>
                {filteredStrands.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.strand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Section (JHS only) */}
        {selectedDept?.department === "JHS" && (
          <div>
            <Label className="mb-1 block">Section</Label>
            <Select
              value={formData.section_id?.toString()}
              onValueChange={(val) => handleChange("section_id", Number(val))}
            >
              <SelectTrigger className={fieldStyle}>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {filteredSections.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
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
            value={formData.teacher_id?.toString()}
            onValueChange={(val) => handleChange("teacher_id", Number(val))}
          >
            <SelectTrigger className={fieldStyle}>
              <SelectValue placeholder="Select Instructor" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
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
