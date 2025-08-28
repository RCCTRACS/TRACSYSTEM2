import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  GraduationCap,
} from "lucide-react";

import { StudentFormDialog } from "./StudentFormDialog";
import { DeleteStudentDialog } from "./DeleteStudentDialog";
import { ExportStudentDialog } from "./ExportStudentDialog";
import { BulkUploadStudent } from "./BulkUploadStudent";
import { FilterStudentDialog } from "./FilterStudentDialog";

export interface Student {
  id: string;
  barcodeId: string;
  name: string;
  yearLevel: string;
  department: string;
  parentEmail: string;
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isDeleteStudentOpen, setIsDeleteStudentOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // Keep filtered in sync with students
  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  // --- Search filter ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredStudents(students);
      return;
    }
    const searchFiltered = students.filter(
      (s) =>
        s.barcodeId.toLowerCase().includes(term.toLowerCase()) ||
        s.name.toLowerCase().includes(term.toLowerCase()) ||
        s.yearLevel.toLowerCase().includes(term.toLowerCase()) ||
        s.department.toLowerCase().includes(term.toLowerCase()) ||
        s.parentEmail.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStudents(searchFiltered);
  };

  // --- Add/Edit Student ---
  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (selectedStudent) {
      // Edit
      const updated = students.map((s) =>
        s.id === selectedStudent.id ? { ...s, ...studentData } : s
      );
      setStudents(updated);
    } else {
      // Add
      const newStudent: Student = {
        id: Date.now().toString(),
        barcodeId: studentData.barcodeId || "",
        name: studentData.name || "",
        yearLevel: studentData.yearLevel || "",
        department: studentData.department || "",
        parentEmail: studentData.parentEmail || "",
      };
      setStudents((prev) => [...prev, newStudent]);
    }

    setIsAddStudentOpen(false);
    setIsEditStudentOpen(false);
    setSelectedStudent(null);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditStudentOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteStudentOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      const remaining = students.filter((s) => s.id !== selectedStudent.id);
      setStudents(remaining);
      setIsDeleteStudentOpen(false);
      setSelectedStudent(null);
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvContent =
      "id,barcodeId,name,yearLevel,department,parentEmail\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "student_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Student Management</h2>
        </div>
        <Button
          className={`${outlineDarkBrownBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <GraduationCap className="h-6 w-6 text-black" />
          Registrar
        </Button>
      </div>

      {/* Search + Buttons */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Student */}
          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button
                className={outlineDarkBrownBtn}
                onClick={() => setSelectedStudent(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            {isAddStudentOpen && (
              <StudentFormDialog
                student={null}
                onSave={handleSaveStudent}
                onClose={() => setIsAddStudentOpen(false)}
              />
            )}
          </Dialog>

          {/* Download Template */}
          <Button
            className={outlineDarkBrownBtn}
            onClick={handleDownloadTemplate}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>

          {/* Bulk Upload */}
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload Students
              </Button>
            </DialogTrigger>
            {isBulkUploadOpen && (
              <BulkUploadStudent
                onUpload={(newStudents) => {
                  const updated = [...students, ...newStudents];
                  setStudents(updated);
                }}
                onClose={() => setIsBulkUploadOpen(false)}
              />
            )}
          </Dialog>

          {/* Export */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            {isExportOpen && (
              <ExportStudentDialog
                students={filteredStudents}
                onClose={() => setIsExportOpen(false)}
              />
            )}
          </Dialog>

          {/* Filter */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            {isFilterOpen && (
              <FilterStudentDialog
                onFilter={(department) => {
                  if (department === "All") {
                    setFilteredStudents(students);
                  } else {
                    const filtered = students.filter(
                      (s) => s.department === department
                    );
                    setFilteredStudents(filtered);
                  }
                }}
                onClose={() => setIsFilterOpen(false)}
              />
            )}
          </Dialog>
        </div>
      </div>

      {/* Students List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader />
        <CardContent>
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-x-4 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Barcode ID</div>
            <div>Student Name</div>
            <div>Year Level</div>
            <div>Department</div>
            <div>Parent Email</div>
            <div></div>
          </div>

          {/* Student Rows */}
          <div className="mt-2 space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No students found
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="grid grid-cols-6 gap-x-4 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{student.barcodeId}</div>
                  <div>{student.name}</div>
                  <div>{student.yearLevel}</div>
                  <div>{student.department}</div>
                  <div>{student.parentEmail}</div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStudent(student)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        {isEditStudentOpen && (
          <StudentFormDialog
            student={selectedStudent}
            onSave={handleSaveStudent}
            onClose={() => {
              setIsEditStudentOpen(false);
              setSelectedStudent(null);
            }}
          />
        )}
      </Dialog>

      {/* Delete Student Dialog */}
      <DeleteStudentDialog
        isOpen={isDeleteStudentOpen}
        onClose={() => {
          setIsDeleteStudentOpen(false);
          setSelectedStudent(null);
        }}
        onConfirm={handleConfirmDelete}
        studentName={selectedStudent?.name || ""}
      />
    </div>
  );
}
