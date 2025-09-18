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
  User as UserIcon
} from "lucide-react";

import { SubjectFormDialog } from "./SubjectFormDialog";
import { DeleteSubjectDialog } from "./DeleteSubjectDialog";
import { FilterSubjectDialog } from "./FilterSubjectDialog";
import { ExportSubjectDialog } from "./ExportSubjectDialog";
import { BulkUploadSubject } from "./BulkUploadSubject";
import { UserFormDialog } from "./UserFormDialog";
import type { User } from "./UserFormDialog"; // Make sure this import matches your UserFormDialog

type DisplaySubject = {
  subject_code: string;
  subject_name: string;
  subject_time: string;
  department: string;
  grade?: string;
  strand?: string;
  section?: string;
  instructor: string;
  created_at?: string;
};

type FormSubject = {
  subject_code: string;
  subject_name: string;
  subject_time: string;
  department: string;
  grade?: string;
  strand?: string;
  section?: string;
  instructor: string;
};

const API_URL =
  "http://192.168.0.143/capstone/mainsystem/backend/subject_api.php";

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<DisplaySubject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<DisplaySubject[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [editingSubject, setEditingSubject] = useState<FormSubject | null>(
    null
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedForDelete, setSelectedForDelete] =
    useState<DisplaySubject | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const outlineBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";
  const outlineBox = "border-2 border-[#5C4033] rounded-lg shadow-sm bg-white";

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    setFilteredSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    const userId = localStorage.getItem("authUserId");
    if (userId) {
      fetch("http://192.168.0.143/capstone/mainsystem/backend/users_api.php")
        .then((res) => res.json())
        .then((data) => {
          const list = data?.users ?? (Array.isArray(data) ? data : []);
          const user = list.find((u: any) => u.id === userId);
          setCurrentUser(user ?? null);
        });
    }
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const t = term.toLowerCase();
    const filtered = subjects.filter(
      (s) =>
        s.subject_name.toLowerCase().includes(t) ||
        s.subject_code.toLowerCase().includes(t) ||
        (s.grade ?? "").toLowerCase().includes(t) ||
        (s.instructor ?? "").toLowerCase().includes(t)
    );
    setFilteredSubjects(filtered);
  };

  const handleSave = async (data: FormSubject) => {
    try {
      if (editingSubject) {
        // Update
        await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else {
        // Create
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }
      await fetchSubjects();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsAddOpen(false);
      setIsEditOpen(false);
      setEditingSubject(null);
    }
  };

  const handleEdit = (s: DisplaySubject) => {
    setEditingSubject({
      subject_code: s.subject_code,
      subject_name: s.subject_name,
      subject_time: s.subject_time,
      department: s.department,
      grade: s.grade,
      strand: s.strand,
      section: s.section,
      instructor: s.instructor
    });
    setIsEditOpen(true);
  };

  const handleDelete = (s: DisplaySubject) => {
    setSelectedForDelete(s);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    try {
      await fetch(
        `${API_URL}?subject_code=${encodeURIComponent(
          selectedForDelete.subject_code
        )}`,
        { method: "DELETE" }
      );
      await fetchSubjects();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteOpen(false);
      setSelectedForDelete(null);
    }
  };

  const handleDownloadTemplate = () => {
    let csvContent =
      "Subject Code,Subject Name,Subject Time,Department,Grade/Year,Strand,Section,Instructor\n";
    csvContent += "";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "subject_template.csv");
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
          <h2 className="text-3xl font-bold text-black">Subject Management</h2>
        </div>

        {/* Profile dropdown (EXACT COPY from UserManagement) */}
        <div className="relative">
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

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border-2 border-[#5C4033] rounded-md shadow-md w-40 z-10">
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
            </div>
          )}

          {/* Edit Profile Modal */}
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <UserFormDialog
              user={currentUser}
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
                onClick={() => setEditingSubject(null)}
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
                    body: JSON.stringify(s)
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
              onFilter={(department, grade, strand, section) => {
                let filtered = subjects;

                // Normalize for flexible match
                const norm = (val?: string | null) =>
                  val ? val.trim().toLowerCase() : "";

                if (department) {
                  filtered = filtered.filter(
                    (s) => norm(s.department) === norm(department)
                  );
                }
                if (grade) {
                  filtered = filtered.filter(
                    (s) => norm(s.grade) === norm(grade)
                  );
                }
                if (strand) {
                  filtered = filtered.filter(
                    (s) => norm(s.strand) === norm(strand)
                  );
                }
                if (section) {
                  filtered = filtered.filter(
                    (s) => norm(s.section) === norm(section)
                  );
                }

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
            <div>Subject Code</div>
            <div>Subject Name</div>
            <div>Grade/Year</div>
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
                  key={s.subject_code}
                  className="grid grid-cols-6 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{s.subject_code}</div>
                  <div>{s.subject_name}</div>
                  <div>{s.grade ?? "-"}</div>
                  <div>{s.department ?? "-"}</div>
                  <div>{s.instructor ?? "-"}</div>
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
        {editingSubject && (
          <SubjectFormDialog
            key={editingSubject.subject_code} // 🔑 forces remount when switching subjects
            subject={editingSubject}
            onSave={handleSave}
            onClose={() => {
              setIsEditOpen(false);
              setEditingSubject(null);
            }}
          />
        )}
      </Dialog>

      {/* Delete Dialog */}
      <DeleteSubjectDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        subjectName={selectedForDelete?.subject_name || ""}
      />
    </div>
  );
}
