"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download, Filter, Trash2 } from "lucide-react";
import { FilterAttendanceDialog } from "./FilterAttendanceDialog";

interface Student {
  id?: number;
  barcode_id: string;
  student_name: string;
  year_level: string;
  department: string;
  parent_email?: string;
  status: "Present" | "Late" | "Absent";
}

interface CourseDetailProps {
  courseCode: string;
  courseTitle: string;
  department: string;
  courseTime: string;
  grade?: string;
}

const STUDENT_API =
  "http://192.168.1.13/capstone/mainsystem/backend/student_api.php";
const COURSE_DETAIL_API =
  "http://192.168.1.13/capstone/mainsystem/backend/course_detail_api.php";

const CourseDetail = ({
  courseCode,
  courseTitle,
  department,
  courseTime
}: CourseDetailProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ status: "" });
  const [barcode, setBarcode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);

  // ✅ Fetch students enrolled in this subject
  useEffect(() => {
    const fetchCourseStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${COURSE_DETAIL_API}?subject_code=${courseCode}`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setStudents(
            data.data.map((s: any) => ({
              ...s,
              status: s.status || "Absent"
            }))
          );
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("⚠️ Error fetching course students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseStudents();
  }, [courseCode]);

  // 🔍 Auto-search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmed = searchTerm.trim();
      if (!trimmed) {
        setSearchResults([]);
        return;
      }

      const fetchSearch = async () => {
        try {
          const res = await fetch(
            `${STUDENT_API}?search=${encodeURIComponent(trimmed)}`
          );
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setSearchResults(data.data);
          } else {
            setSearchResults([]);
          }
        } catch (err) {
          console.error("⚠️ Search failed:", err);
        }
      };

      fetchSearch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ➕ Add student to this course
  const handleAddStudent = async (student: Student) => {
    try {
      const res = await fetch(COURSE_DETAIL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_code: courseCode,
          barcode_id: student.barcode_id,
          student_name: student.student_name,
          department: student.department,
          year_level: student.year_level,
          status: "Absent"
        })
      });

      const result = await res.json();
      if (result.success) {
        setStudents((prev) => [
          ...prev,
          { ...student, status: "Absent", id: result.id }
        ]);
        alert(`${student.student_name} added to ${courseCode}`);
        setSearchTerm("");
        setSearchResults([]);
      } else {
        alert("⚠️ Failed to add student: " + result.error);
      }
    } catch (err) {
      console.error("⚠️ Error adding student:", err);
    }
  };

  // ✏️ Change status locally + persist in DB
  const handleStatusChange = async (
    barcode_id: string,
    newStatus: "Present" | "Late" | "Absent"
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.barcode_id === barcode_id ? { ...s, status: newStatus } : s
      )
    );

    try {
      await fetch(COURSE_DETAIL_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode_id,
          subject_code: courseCode,
          status: newStatus
        })
      });
    } catch (err) {
      console.error("⚠️ Failed to update status:", err);
    }
  };

  // 🗑️ Delete student from course
  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Remove ${student.student_name} from this class?`)) return;

    try {
      await fetch(COURSE_DETAIL_API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: student.id })
      });

      setStudents((prev) =>
        prev.filter((s) => s.barcode_id !== student.barcode_id)
      );
    } catch (err) {
      console.error("⚠️ Failed to delete student:", err);
    }
  };

  // 📷 Barcode scanner entry
  const handleBarcodeSubmit = async () => {
    if (!barcode.trim()) return;

    const student = students.find((s) => s.barcode_id === barcode.trim());
    if (!student) {
      alert("⚠️ Student not found in this class!");
      setBarcode("");
      return;
    }

    handleStatusChange(student.barcode_id, "Present");
    setBarcode("");
  };

  // ⬇️ Export CSV
  const handleExport = () => {
    const csvHeader = "Barcode ID,Name,Year Level,Department,Status\n";
    const csvRows = students
      .map(
        (s) =>
          `${s.barcode_id},${s.student_name},${s.year_level},${s.department},${s.status}`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${courseCode}_students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔎 filter students by status
  const filteredStudents = students.filter(
    (s) => !filters.status || s.status === filters.status
  );

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-black">{courseCode}</h2>
        <p className="text-lg text-black">{courseTitle}</p>
        <p className="text-sm text-gray-600">{courseTime}</p>
      </div>

      {/* 🔍 Search + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <Input
          placeholder="Search student by name or barcode"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trimStart())}
          className="sm:w-1/2"
        />

        <div className="flex items-center gap-2">
          <Button className={outlineDarkBrownBtn} onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            {isFilterOpen && (
              <FilterAttendanceDialog
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onFilter={(status) => {
                  setFilters({ status: status === "All" ? "" : status });
                  setIsFilterOpen(false);
                }}
              />
            )}
          </Dialog>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4 border rounded p-3">
          <h3 className="font-semibold mb-2">Search Results</h3>
          {searchResults.map((s) => (
            <div
              key={s.barcode_id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>
                {s.student_name} ({s.barcode_id}) – {s.department}{" "}
                {s.year_level}
              </span>
              <Button
                className={outlineDarkBrownBtn}
                onClick={() => handleAddStudent(s)}
              >
                Add to Subject
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Student List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Class List</CardTitle>
          <p className="text-sm text-gray-500 mt-1">{courseTime}</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-6">
              Loading students...
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No students found.</p>
          ) : (
            <div className="mt-2">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-x-4 text-center font-semibold border-b border-gray-400 px-4 py-2">
                <div>Barcode ID</div>
                <div>Name</div>
                <div>Year Level</div>
                <div>Department</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Student Rows */}
              <div className="space-y-3 mt-1">
                {filteredStudents.map((student) => (
                  <div
                    key={student.barcode_id}
                    className="grid grid-cols-6 gap-x-4 items-center text-center bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl"
                  >
                    <div>{student.barcode_id}</div>
                    <div>{student.student_name}</div>
                    <div>{student.year_level}</div>
                    <div>{student.department}</div>

                    {/* ✅ Center Status */}
                    <div className="flex justify-center">
                      <Select
                        value={student.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            student.barcode_id,
                            value as "Present" | "Late" | "Absent"
                          )
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder={student.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ✅ Center Actions */}
                    <div className="flex justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteStudent(student)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;
