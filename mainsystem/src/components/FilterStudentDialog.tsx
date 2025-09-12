import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

interface FilterStudentDialogProps {
  onFilter: (department: string | null, yearLevel: string | null) => void;
  onClose: () => void;
}

export function FilterStudentDialog({
  onFilter,
  onClose
}: FilterStudentDialogProps) {
  const [departments, setDepartments] = useState<string[]>([]);
  const [yearLevels, setYearLevels] = useState<string[]>([]);

  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Normalize API response
  const normalize = (data: any, key: string) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data[key])) return data[key];
    return [];
  };

  // Fetch departments from backend
  useEffect(() => {
    fetch("http://192.168.0.137/capstone/mainsystem/backend/department_api.php")
      .then((res) => res.json())
      .then((data) => {
        const depts = normalize(data, "departments")
          .map((d: any) => d.department)
          .filter((d: string) => d !== "ITS" && d !== "Teacher");
        setDepartments(depts);
      })
      .catch(() => setDepartments([]));
  }, []);

  // Update year levels based on selected department
  useEffect(() => {
    if (!selectedDept) {
      setYearLevels([
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Grade 11",
        "Grade 12",
        "Grade 7",
        "Grade 8",
        "Grade 9",
        "Grade 10"
      ]);
      return;
    }

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
      setYearLevels(["1st Year", "2nd Year", "3rd Year", "4th Year"]);
    } else if (selectedDept === "SHS") {
      setYearLevels(["Grade 11", "Grade 12"]);
    } else if (selectedDept === "JHS") {
      setYearLevels(["Grade 7", "Grade 8", "Grade 9", "Grade 10"]);
    } else {
      setYearLevels([]);
    }

    setSelectedYear(null); // reset year level on department change
  }, [selectedDept]);

  const handleApply = () => {
    onFilter(selectedDept, selectedYear);
    onClose();
  };

  const handleReset = () => {
    setSelectedDept(null);
    setSelectedYear(null);
    onFilter(null, null);
    onClose();
  };

  const selectStyle =
    "border-2 border-[#5C4033] rounded-md focus:ring-0 focus:border-[#5C4033]";

  return (
    <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="pb-4">
        <DialogTitle className="text-2xl font-extrabold text-black text-left">
          Filter Students
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 mt-8">
        {/* Department Select */}
        <div>
          <p className="mb-1 font-medium text-black">Department</p>
          <Select
            value={selectedDept ?? ""}
            onValueChange={(val) => setSelectedDept(val || null)}
          >
            <SelectTrigger className={selectStyle}>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Level Select */}
        {yearLevels.length > 0 && (
          <div>
            <p className="mb-1 font-medium text-black">Year Level</p>
            <Select
              value={selectedYear ?? ""}
              onValueChange={(val) => setSelectedYear(val || null)}
            >
              <SelectTrigger className={selectStyle}>
                <SelectValue placeholder="Select Year Level" />
              </SelectTrigger>
              <SelectContent>
                {yearLevels.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset}>
          Show All
        </Button>
        <Button className="bg-[#5C3A21] text-white" onClick={handleApply}>
          Apply Filter
        </Button>
      </div>
    </DialogContent>
  );
}
