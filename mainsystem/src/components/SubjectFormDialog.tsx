import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface Subject {
  id?: number;
  code: string;
  name: string;
  department_id: number;
  grade_id?: number;
  teacher_id?: number;
  time?: string;
}

interface Department {
  id: number;
  department_name: string;
}

interface Grade {
  id: number;
  grade_name: string;
}

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
}

interface SubjectFormDialogProps {
  subject: Subject | null;
  onSave: (subject: Partial<Subject>) => void;
  onClose: () => void;
}

export function SubjectFormDialog({
  subject,
  onSave,
  onClose
}: SubjectFormDialogProps) {
  const initialForm: Subject = {
    code: "",
    name: "",
    department_id: 0,
    grade_id: undefined,
    teacher_id: undefined,
    time: ""
  };

  const [formData, setFormData] = useState<Subject>(initialForm);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Load subject for editing
  useEffect(() => {
    if (subject) {
      setFormData({ ...initialForm, ...subject });
    } else {
      setFormData(initialForm);
    }
  }, [subject]);

  // Fetch dropdown data
  useEffect(() => {
    fetch("http://localhost/your-backend/department_api.php")
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments || []))
      .catch((err) => console.error("Failed to load departments:", err));

    fetch("http://localhost/your-backend/grade_api.php")
      .then((res) => res.json())
      .then((data) => setGrades(data.grades || []))
      .catch((err) => console.error("Failed to load grades:", err));

    fetch("http://localhost/your-backend/user_api.php?role=teacher")
      .then((res) => res.json())
      .then((data) => setTeachers(data.users || []))
      .catch((err) => console.error("Failed to load teachers:", err));
  }, []);

  const inputClass =
    "border-[3px] border-[#3E1F0F] rounded-lg h-12 px-3 focus:outline-none focus:ring-1 focus:ring-[#3E1F0F] focus:border-[#3E1F0F] w-full";
  const selectClass =
    "h-12 flex items-center px-3 border-[3px] border-[#3E1F0F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3E1F0F] focus:border-[#3E1F0F] w-full";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[780px] bg-popover p-6 overflow-y-auto">
      <DialogHeader className="px-0 flex flex-col gap-3">
        <DialogTitle className="text-xl font-bold text-black">
          {subject ? "Edit Subject" : "Add Subject"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-5 mt-4">
        {/* Subject Code */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="code" className="font-bold text-black">
            Subject Code
          </Label>
          <input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., CS101"
            required
            className={inputClass}
          />
        </div>

        {/* Subject Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="font-bold text-black">
            Subject Name
          </Label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Intro to Computer Science"
            required
            className={inputClass}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2">
          <Label className="font-bold text-black">Department</Label>
          <Select
            value={formData.department_id?.toString() || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, department_id: parseInt(value) })
            }
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id.toString()}>
                  {d.department_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grade */}
        <div className="flex flex-col gap-2">
          <Label className="font-bold text-black">Grade / Year</Label>
          <Select
            value={formData.grade_id?.toString() || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, grade_id: parseInt(value) })
            }
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.grade_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Instructor */}
        <div className="flex flex-col gap-2">
          <Label className="font-bold text-black">Instructor</Label>
          <Select
            value={formData.teacher_id?.toString() || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, teacher_id: parseInt(value) })
            }
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select Instructor" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.first_name} {t.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="time" className="font-bold text-black">
            Time
          </Label>
          <input
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="e.g., 8:00 AM - 10:00 AM"
            className={inputClass}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
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
            {subject ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
