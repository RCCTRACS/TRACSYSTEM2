"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Download, Filter, ArrowLeft } from "lucide-react";
import { FilterAttendanceDialog } from "./FilterAttendanceDialog";

interface Student {
  barcode_id: string;
  student_name: string;
  year_level: string;
  department: string;
  parent_email: string;
  grade?: string;
  strand?: string;
  section?: string;
  status: "Present" | "Late" | "Absent";
}

interface CourseDetailProps {
  courseCode: string;
  courseTitle: string;
  department: string;
  courseTime: string;
  grade?: string;
}

const CourseDetail = ({ courseCode, courseTitle, department, courseTime, grade }: CourseDetailProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ status: "" });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://192.168.100.26/capstone/mainsystem/backend/student_api.php",
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const filtered = data.data.filter(
            (s: any) =>
              s.department === department && (!grade || s.year_level === grade)
          );
          setStudents(
            filtered.map((s: any) => ({ ...s, status: "Absent" as "Present" | "Late" | "Absent" }))
          );
        }
      } catch (err) {
        console.error("⚠️ Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [department, grade]);

  const handleStatusChange = (barcode_id: string, newStatus: "Present" | "Late" | "Absent") => {
    setStudents((prev) =>
      prev.map((s) => (s.barcode_id === barcode_id ? { ...s, status: newStatus } : s))
    );
  };

  const handleExport = () => {
    const csvHeader = "Barcode ID,Name,Year Level,Department,Status\n";
    const csvRows = students
      .map(
        (s) =>
          `${s.barcode_id},${s.student_name},${s.year_level},${s.department},${s.status}`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "course_students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter((s) =>
    !filters.status || s.status === filters.status
  );

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // Function to get status color
  const getStatusColor = (status: "Present" | "Late" | "Absent") => {
    switch (status) {
      case "Present":
        return "bg-green-500 text-white";
      case "Late":
        return "bg-yellow-400 text-black";
      case "Absent":
        return "bg-red-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-black">{courseCode}</h2>
        <p className="text-lg text-black">{courseTitle}</p>
        <p className="text-sm text-gray-600">{courseTime}</p>

        {/* Back Button */}
        <Button
          className={outlineDarkBrownBtn + " flex items-center gap-2 mt-4"}
          onClick={() => (window.location.href = "/teacher-dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-2">
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

      {/* Student List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Class List</CardTitle>
          <p className="text-sm text-gray-500 mt-1">{courseTime}</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No students found for this subject.
            </p>
          ) : (
            <div className="mt-2">
              {/* Header Row */}
              <div className="grid grid-cols-5 gap-x-4 text-center font-semibold border-b border-gray-400 px-4 py-2">
                <div>Barcode ID</div>
                <div>Name</div>
                <div>Year Level</div>
                <div>Department</div>
                <div>Status</div>
              </div>

              {/* Student Rows */}
              <div className="space-y-3 mt-1">
                {filteredStudents.map((student) => (
                  <div
                    key={student.barcode_id}
                    className="grid grid-cols-5 gap-x-4 items-center text-center bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl"
                  >
                    <div>{student.barcode_id}</div>
                    <div>{student.student_name}</div>
                    <div>{student.year_level}</div>
                    <div>{student.department}</div>
                    <div>
                      <Select
                        value={student.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            student.barcode_id,
                            value as "Present" | "Late" | "Absent"
                          )
                        }
                      >
                        <SelectTrigger className={`w-24 ${getStatusColor(student.status)}`}>
                          <SelectValue placeholder={student.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
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
