import { useState, useEffect } from "react";
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
} from "lucide-react";

import { SubjectFormDialog } from "./SubjectFormDialog";
import { DeleteSubjectDialog } from "./DeleteSubjectDialog";
import { FilterSubjectDialog } from "./FilterSubjectDialog";
import { ExportSubjectDialog } from "./ExportSubjectDialog";
import { BulkUploadSubject } from "./BulkUploadSubject";

export interface Subject {
  id: number;
  code: string;
  name: string;
  grade: string; // from joined grades table
  department: string; // from joined departments table
  instructor: string; // full name
  instructor_email: string;
  time?: string;
  // hidden but useful for edits
  grade_id?: number;
  department_id?: number;
  teacher_id?: number;
}

const API_URL = "http://localhost/your-backend/subject_api.php"; // adjust path

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const outlineBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";
  const outlineBox = "border-2 border-[#5C4033] rounded-lg shadow-sm bg-white";

  // Fetch subjects
  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    setFilteredSubjects(subjects);
  }, [subjects]);

  const fetchSubjects = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setSubjects(data.subjects);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(term.toLowerCase()) ||
        s.code.toLowerCase().includes(term.toLowerCase()) ||
        s.grade.toLowerCase().includes(term.toLowerCase()) ||
        s.instructor.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedSubject) {
        // Update
        await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedSubject.id,
            code: data.code,
            name: data.name,
            department_id: data.department_id,
            grade_id: data.grade_id,
            teacher_id: data.teacher_id,
            time: data.time || "",
          }),
        });
      } else {
        // Create
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: data.code,
            name: data.name,
            department_id: data.department_id,
            grade_id: data.grade_id,
            teacher_id: data.teacher_id,
            time: data.time || "",
          }),
        });
      }
      fetchSubjects();
    } catch (err) {
      console.error("Save failed:", err);
    }
    closeDialogs();
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditOpen(true);
  };

  const handleDelete = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSubject) {
      try {
        await fetch(API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedSubject.id }),
        });
        fetchSubjects();
      } catch (err) {
        console.error("Delete failed:", err);
      }
      closeDialogs();
    }
  };

  const closeDialogs = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setIsFilterOpen(false);
    setIsExportOpen(false);
    setIsBulkOpen(false);
    setSelectedSubject(null);
  };

  const handleDownloadTemplate = () => {
    let csvContent = "Code,Name,Department ID,Grade ID,Teacher ID,Time\n";
    csvContent += "CS101,Intro to Computer Science,1,2,5,08:00-10:00\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "subject_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem("sidebarHasAnimated");
    setDropdownOpen(false);
    window.location.href = "/";
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Subject Management</h2>
        </div>

        {/* Profile chip with dropdown */}
        <div className="relative">
          <div
            className="flex items-center bg-[#f3f3f3] px-3 py-2 rounded-full border-2 border-[#5C4033] cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src="/user.png" alt="Profile" className="w-7 h-7 mr-2" />
            <span className="text-black text-sm font-medium">Gerwin</span>
            <span className="ml-2 text-xs">▼</span>
          </div>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border-2 border-[#5C4033] rounded-md shadow-md w-40 z-10">
              <div className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]">
                Edit Profile
              </div>
              <div
                className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                className={outlineBtn}
                onClick={() => setSelectedSubject(null)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </DialogTrigger>
            <SubjectFormDialog
              subject={null}
              onSave={handleSave}
              onClose={() => setIsAddOpen(false)}
            />
          </Dialog>

          {/* Download Template */}
          <Button className={outlineBtn} onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" /> Download Template
          </Button>

          {/* Bulk Upload */}
          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <Button className={outlineBtn}>
                <Upload className="h-4 w-4 mr-2" /> Bulk Upload
              </Button>
            </DialogTrigger>
            <BulkUploadSubject
              onUpload={async (newSubs) => {
                for (const s of newSubs) {
                  await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(s),
                  });
                }
                fetchSubjects();
              }}
              onClose={() => setIsBulkOpen(false)}
            />
          </Dialog>

          {/* Export */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button className={outlineBtn}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </DialogTrigger>
            <ExportSubjectDialog
              subjects={filteredSubjects}
              onClose={() => setIsExportOpen(false)}
            />
          </Dialog>

          {/* Filter */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button className={outlineBtn}>
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </DialogTrigger>
            <FilterSubjectDialog
              subjects={subjects.map((s) => s.name)}
              onFilter={(year, subject) => {
                let filtered = subjects;
                if (year) filtered = filtered.filter((s) => s.grade === year);
                if (subject) filtered = filtered.filter((s) => s.name === subject);
                setFilteredSubjects(filtered);
              }}
              onClose={() => setIsFilterOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Subjects List */}
      <Card className={outlineBox}>
        <CardHeader />
        <CardContent>
          <div className="grid grid-cols-6 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Code</div>
            <div>Name</div>
            <div>Grade</div>
            <div>Department</div>
            <div>Instructor</div>
            <div></div>
          </div>

          <div className="mt-2 space-y-3">
            {filteredSubjects.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No subjects found
              </div>
            ) : (
              filteredSubjects.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-6 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{s.code}</div>
                  <div>{s.name}</div>
                  <div>{s.grade}</div>
                  <div>{s.department}</div>
                  <div>{s.instructor}</div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(s)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SubjectFormDialog
          subject={selectedSubject}
          onSave={handleSave}
          onClose={closeDialogs}
        />
      </Dialog>

      {/* Delete Dialog */}
      <DeleteSubjectDialog
        isOpen={isDeleteOpen}
        onClose={closeDialogs}
        onConfirm={handleConfirmDelete}
        subjectName={selectedSubject?.name || ""}
      />
    </div>
  );
}
