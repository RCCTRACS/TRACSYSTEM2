import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Subject {
  id: string;
  name: string;
  layer: string;
  department?: string;
  gradeOrYear?: string;
  strand?: string;
  section?: string;
  instructor: string;
  time?: string;
}

interface SubjectFormDialogProps {
  subject: Subject | null;
  onSave: (subject: Partial<Subject>) => void;
  onClose: () => void;
}

export function SubjectFormDialog({ subject, onSave, onClose }: SubjectFormDialogProps) {
  const initialForm: Subject = {
    id: "",
    name: "",
    layer: "",
    department: "",
    gradeOrYear: "",
    strand: "",
    section: "",
    instructor: "",
    time: "",
  };

  const [formData, setFormData] = useState<Subject>(initialForm);

  useEffect(() => {
    if (subject) setFormData({ ...initialForm, ...subject });
    else setFormData(initialForm);
  }, [subject]);

  const sampleSubjects = [
    "Intro to Computer Science",
    "Calculus 1",
    "Physics",
    "English 1",
    "Filipino 1",
  ];

  const layers = ["College", "SHS", "JHS"];
  const departments = ["BSIT", "BSED", "BSCE", "BEED", "BSBA", "BA", "BSA", "BSHM", "BSTM"];
  const shsStrands = ["STEM", "ABM", "GAS", "HUMSS"];
  const jhsGrades = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
  const shsGrades = ["Grade 11", "Grade 12"];
  const sections = {
    "Grade 7": ["7-Apple", "7-Rizal", "7-Diamond", "7-Emerald"],
    "Grade 8": ["8-Apple", "8-Rizal", "8-Diamond", "8-Emerald"],
    "Grade 9": ["9-Apple", "9-Rizal", "9-Diamond", "9-Emerald"],
    "Grade 10": ["10-Apple", "10-Rizal", "10-Diamond", "10-Emerald"],
    "Grade 11": ["11-Apple", "11-Rizal", "11-Diamond", "11-Emerald"],
    "Grade 12": ["12-Apple", "12-Rizal", "12-Diamond", "12-Emerald"],
  };
  const collegeYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const inputClass =
    "border-[3px] border-[#3E1F0F] rounded-lg h-12 px-3 focus:outline-none focus:ring-1 focus:ring-[#3E1F0F] focus:border-[#3E1F0F] w-full";
  const selectClass =
    "h-12 flex items-center px-3 border-[3px] border-[#3E1F0F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3E1F0F] focus:border-[#3E1F0F] w-full";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData, id: formData.id || Date.now().toString() };
    onSave(finalData);
    if (!subject) setFormData(initialForm);
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[780px] bg-popover p-6 overflow-y-auto">
      <DialogHeader className="px-0 flex flex-col gap-3">
        <DialogTitle className="text-xl font-bold text-black">
          {subject ? "Edit Subject" : "Add Subject"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-5 mt-4">
        {/* Subject ID */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="id" className="font-bold text-black">Subject ID</Label>
          <input
            id="id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="e.g., CS101"
            required
            className={inputClass}
          />
        </div>

        {/* Subject Time */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="time" className="font-bold text-black">Subject Time</Label>
          <input
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="e.g., 8:00 AM - 10:00 AM"
            required
            className={inputClass}
          />
        </div>

        {/* Subject Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="font-bold text-black">Subject Name</Label>
          <Select
            value={formData.name}
            onValueChange={(value) => setFormData({ ...formData, name: value })}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {sampleSubjects.map((sub) => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Layer */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="layer" className="font-bold text-black">Year Level</Label>
          <Select
            value={formData.layer}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                layer: value,
                department: "",
                gradeOrYear: "",
                strand: "",
                section: ""
              })
            }
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select Layer" />
            </SelectTrigger>
            <SelectContent>
              {layers.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Fields */}
        {formData.layer === "College" && (
          <>
            {/* Department */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-black">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Level */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-black">Year</Label>
              <Select
                value={formData.gradeOrYear}
                onValueChange={(value) => setFormData({ ...formData, gradeOrYear: value })}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {collegeYears.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {formData.layer === "SHS" && (
          <>
            {/* Strand */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-black">Strand</Label>
              <Select
                value={formData.strand}
                onValueChange={(value) => setFormData({ ...formData, strand: value })}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Strand" />
                </SelectTrigger>
                <SelectContent>
                  {shsStrands.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grade Level */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-black">Grade Level</Label>
              <Select
                value={formData.gradeOrYear}
                onValueChange={(value) => setFormData({ ...formData, gradeOrYear: value })}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Grade Level" />
                </SelectTrigger>
                <SelectContent>
                  {shsGrades.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            {formData.gradeOrYear && (
              <div className="flex flex-col gap-2">
                <Label className="font-bold text-black">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger className={selectClass}>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections[formData.gradeOrYear]?.map((sec) => (
                      <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {formData.layer === "JHS" && (
          <>
            {/* Grade Level */}
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-black">Grade Level</Label>
              <Select
                value={formData.gradeOrYear}
                onValueChange={(value) => setFormData({ ...formData, gradeOrYear: value })}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Grade Level" />
                </SelectTrigger>
                <SelectContent>
                  {jhsGrades.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            {formData.gradeOrYear && (
              <div className="flex flex-col gap-2">
                <Label className="font-bold text-black">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger className={selectClass}>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections[formData.gradeOrYear]?.map((sec) => (
                      <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {/* Assigned Teacher */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="instructor" className="font-bold text-black">Assigned Teacher</Label>
          <input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="e.g., John Doe"
            required
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
