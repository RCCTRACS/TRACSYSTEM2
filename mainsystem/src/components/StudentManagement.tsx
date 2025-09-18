import { useEffect, useState, useRef } from "react";
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
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { StudentFormDialog } from "./StudentFormDialog";
import { DeleteStudentDialog } from "./DeleteStudentDialog";
import { ExportStudentDialog } from "./ExportStudentDialog";
import { BulkUploadStudent } from "./BulkUploadStudent";
import { FilterStudentDialog } from "./FilterStudentDialog";
import { UserFormDialog } from "./UserFormDialog";

export interface Student {
  barcode_id: string;
  student_name: string;
  year_level: string;
  department: string;
  strand?: string;
  section?: string;
  parent_email: string;
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<{ first_name: string } | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  const API_URL =
    "http://192.168.1.13/capstone/mainsystem/backend/student_api.php";

  // --- Fetch Students ---
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const result = await res.json();
      const list: Student[] = result?.data ?? [];
      setStudents(list);
      setFilteredStudents(list);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- Fetch Logged in user ---
  useEffect(() => {
    const userId = localStorage.getItem("authUserId");
    if (userId) {
      fetch("http://192.168.1.13/capstone/mainsystem/backend/users_api.php")
        .then((res) => res.json())
        .then((data) => {
          const list = data?.users ?? (Array.isArray(data) ? data : []);
          const user = list.find((u: any) => String(u.id) === String(userId));
          setCurrentUser(user ?? null);
        })
        .catch(() => setCurrentUser(null));
    }
  }, []);

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Search filter ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lowerTerm = term.toLowerCase();
    setFilteredStudents(
      students.filter(
        (s) =>
          s.barcode_id.toLowerCase().includes(lowerTerm) ||
          s.student_name.toLowerCase().includes(lowerTerm) ||
          s.year_level.toLowerCase().includes(lowerTerm) ||
          s.department.toLowerCase().includes(lowerTerm) ||
          (s.strand ?? "").toLowerCase().includes(lowerTerm) ||
          (s.section ?? "").toLowerCase().includes(lowerTerm) ||
          s.parent_email.toLowerCase().includes(lowerTerm)
      )
    );
  };

  // --- Add/Edit Student ---
  const handleSaveStudent = async (studentData: Partial<Student>) => {
    try {
      const formData = new URLSearchParams();
      Object.entries(studentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (selectedStudent) {
        formData.append("original_barcode_id", selectedStudent.barcode_id);

        await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString()
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString()
        });
      }

      await fetchStudents();
    } catch (err) {
      console.error("Failed to save student", err);
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

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    try {
      const formData = new URLSearchParams();
      formData.append("barcode_id", selectedStudent.barcode_id);

      await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });
      await fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
    setIsDeleteStudentOpen(false);
    setSelectedStudent(null);
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvContent =
      "barcode_id,student_name,year_level,department,strand,section,parent_email\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "student_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Apply Filter ---
  const handleFilter = (
    department: string | null,
    yearLevel: string | null
  ) => {
    let filtered = [...students];
    if (department) {
      filtered = filtered.filter(
        (s) => s.department.toLowerCase() === department.toLowerCase()
      );
    }
    if (yearLevel) {
      filtered = filtered.filter(
        (s) => s.year_level.toLowerCase() === yearLevel.toLowerCase()
      );
    }
    setFilteredStudents(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Student Management</h2>
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center bg-[#f3f3f3] px-3 py-2 rounded-full border-2 border-[#5C4033] cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <img src="/user.png" alt="Profile" className="w-7 h-7 mr-2" />
            <span className="text-black text-sm font-medium">
              {currentUser ? `${currentUser.first_name}` : "User"}
            </span>
            <span className="ml-2 text-xs">▼</span>
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 bg-white border-2 border-[#5C4033] rounded-md shadow-md w-40 z-10"
              >
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]"
                  onClick={() => {
                    setIsProfileOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  Edit Profile
                </div>
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]"
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.removeItem("sidebarHasAnimated");
                    setDropdownOpen(false);
                    window.location.href = "/";
                  }}
                >
                  Logout
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <UserFormDialog
              user={currentUser as any}
              onSave={() => setIsProfileOpen(false)}
              onClose={() => setIsProfileOpen(false)}
              isProfile
            />
          </Dialog>
        </div>
      </div>

      {/* Search + Actions */}
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
                Bulk Upload
              </Button>
            </DialogTrigger>
            {isBulkUploadOpen && (
              <BulkUploadStudent
                onUpload={async (newStudents) => {
                  try {
                    const promises = newStudents.map((student) => {
                      const formData = new URLSearchParams();
                      Object.entries(student).forEach(([key, value]) => {
                        formData.append(key, String(value));
                      });
                      return fetch(API_URL, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: formData.toString()
                      });
                    });
                    await Promise.all(promises);
                    fetchStudents();
                  } catch (err) {
                    console.error("Failed bulk upload", err);
                  }
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
                onFilter={handleFilter}
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
          <div className="grid grid-cols-8 gap-x-4 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Barcode ID</div>
            <div>Student Name</div>
            <div>Year Level</div>
            <div>Department</div>
            <div>Strand</div>
            <div>Section</div>
            <div>Parent Email</div>
            <div></div>
          </div>

          <div className="mt-2 space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No students found
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.barcode_id}
                  className="grid grid-cols-8 gap-x-4 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{student.barcode_id}</div>
                  <div>{student.student_name}</div>
                  <div>{student.year_level}</div>
                  <div>{student.department}</div>
                  <div>{student.strand || "-"}</div>
                  <div>{student.section || "-"}</div>
                  <div>{student.parent_email}</div>
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

      {/* Delete Confirmation */}
      <DeleteStudentDialog
        isOpen={isDeleteStudentOpen}
        onClose={() => {
          setIsDeleteStudentOpen(false);
          setSelectedStudent(null);
        }}
        onConfirm={handleConfirmDelete}
        studentName={selectedStudent?.student_name || ""}
      />
    </div>
  );
}
