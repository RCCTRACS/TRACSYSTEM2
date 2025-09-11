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
  User as UserIcon,
} from "lucide-react";

import { SubjectFormDialog } from "./SubjectFormDialog";
import { DeleteSubjectDialog } from "./DeleteSubjectDialog";
import { FilterSubjectDialog } from "./FilterSubjectDialog";
import { ExportSubjectDialog } from "./ExportSubjectDialog";
import { BulkUploadSubject } from "./BulkUploadSubject";

/**
 * DisplaySubject = shape returned by the API (readable names + optional id fields)
 * FormSubject = shape expected by SubjectFormDialog (ids used for saving)
 */
type DisplaySubject = {
  subject_code: string;
  subject_name: string;
  subject_time?: string;
  department?: string; // readable name
  grade?: string; // readable name
  strand?: string;
  section?: string;
  instructor?: string; // readable name
  department_id?: number; // optional ids if API returns them
  grade_id?: number;
  strand_id?: number;
  section_id?: number;
  teacher_id?: number;
  created_at?: string;
};

type FormSubject = {
  code: string;
  name: string;
  department_id: number;
  grade_id?: number;
  strand_id?: number;
  section_id?: number;
  teacher_id?: number;
  time?: string;
};

const API_URL =
  "http://192.168.1.13/capstone/mainsystem/backend/subject_api.php"; // adjust if needed

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<DisplaySubject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<DisplaySubject[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  // For editing (form shape)
  const [editingSubject, setEditingSubject] = useState<FormSubject | null>(
    null
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // For deleting/showing details (display shape)
  const [selectedForDelete, setSelectedForDelete] =
    useState<DisplaySubject | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const outlineBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";
  const outlineBox = "border-2 border-[#5C4033] rounded-lg shadow-sm bg-white";

  // Fetch subjects on mount
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
      if (data.success && Array.isArray(data.subjects)) {
        // Normalize API response into DisplaySubject
        const mapped: DisplaySubject[] = data.subjects.map((s: any) => ({
          subject_code: s.subject_code,
          subject_name: s.subject_name,
          subject_time: s.subject_time ?? s.time ?? "",
          department: s.department ?? "",
          grade: s.grade ?? "",
          strand: s.strand ?? "",
          section: s.section ?? "",
          instructor: s.instructor ?? "",
          // if API returned id fields (recommended), use them; otherwise undefined
          department_id:
            s.department_id !== undefined
              ? Number(s.department_id)
              : s.department && !isNaN(Number(s.department))
              ? Number(s.department)
              : undefined,
          grade_id:
            s.grade_id !== undefined
              ? Number(s.grade_id)
              : s.grade && !isNaN(Number(s.grade))
              ? Number(s.grade)
              : undefined,
          strand_id:
            s.strand_id !== undefined
              ? Number(s.strand_id)
              : s.strand && !isNaN(Number(s.strand))
              ? Number(s.strand)
              : undefined,
          section_id:
            s.section_id !== undefined
              ? Number(s.section_id)
              : s.section && !isNaN(Number(s.section))
              ? Number(s.section)
              : undefined,
          teacher_id:
            s.instructor_id !== undefined
              ? Number(s.instructor_id)
              : s.teacher_id !== undefined
              ? Number(s.teacher_id)
              : undefined,
          created_at: s.created_at,
        }));
        setSubjects(mapped);
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
        (s.subject_name ?? "").toLowerCase().includes(t) ||
        (s.subject_code ?? "").toLowerCase().includes(t) ||
        (s.grade ?? "").toLowerCase().includes(t) ||
        (s.instructor ?? "").toLowerCase().includes(t)
    );
    setFilteredSubjects(filtered);
  };

  // Save (create or update). `data` comes from SubjectFormDialog (FormSubject)
  const handleSave = async (data: FormSubject) => {
    try {
      if (editingSubject) {
        // Update: use the original code (editingSubject.code) as identifier
        await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_code: editingSubject.code, // identifier (original)
            subject_name: data.name,
            subject_time: data.time ?? "",
            department: data.department_id ?? "",
            grade: data.grade_id ?? "",
            strand: data.strand_id ?? "",
            section: data.section_id ?? "",
            instructor: data.teacher_id ?? "",
          }),
        });
      } else {
        // Create
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_code: data.code,
            subject_name: data.name,
            subject_time: data.time ?? "",
            department: data.department_id ?? "",
            grade: data.grade_id ?? "",
            strand: data.strand_id ?? "",
            section: data.section_id ?? "",
            instructor: data.teacher_id ?? "",
          }),
        });
      }
      await fetchSubjects();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      // close either add or edit dialogues
      setIsAddOpen(false);
      setIsEditOpen(false);
      setEditingSubject(null);
    }
  };

  // When user clicks edit in table: convert DisplaySubject -> FormSubject for the form
  const handleEdit = (s: DisplaySubject) => {
    const formVal: FormSubject = {
      code: s.subject_code,
      name: s.subject_name,
      department_id: s.department_id ?? 0,
      grade_id: s.grade_id,
      strand_id: s.strand_id,
      section_id: s.section_id,
      teacher_id: s.teacher_id,
      time: s.subject_time,
    };
    setEditingSubject(formVal);
    setIsEditOpen(true);
  };

  // Prepare delete
  const handleDelete = (s: DisplaySubject) => {
    setSelectedForDelete(s);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    try {
      await fetch(`${API_URL}?subject_code=${encodeURIComponent(selectedForDelete.subject_code)}`, {
        method: "DELETE",
      });
      await fetchSubjects();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteOpen(false);
      setSelectedForDelete(null);
    }
  };

  const closeAll = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setIsFilterOpen(false);
    setIsExportOpen(false);
    setIsBulkOpen(false);
    setEditingSubject(null);
    setSelectedForDelete(null);
  };

  const handleDownloadTemplate = () => {
    let csvContent =
      "Subject Code,Subject Name,Subject Time,Department ID,Grade ID,Strand ID,Section ID,Instructor ID\n";
    csvContent += "CS101,Intro to Computer Science,08:00-10:00,1,10, , ,5\n";

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
          <p className="text-sm text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Subject Management</h2>
        </div>
        <Button
          className={`${outlineBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <UserIcon className="h-6 w-6 text-black" />
          Admin
        </Button>
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
                onClick={() => {
                  setEditingSubject(null);
                }}
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
                  // newSubs expected to be already in the create payload shape
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
              subjects={subjects.map((s) => s.subject_name)}
              onFilter={(year, subject) => {
                let filtered = subjects;
                if (year) filtered = filtered.filter((s) => s.grade === year);
                if (subject)
                  filtered = filtered.filter((s) => s.subject_name === subject);
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
              <div className="text-center text-gray-500 py-6">No subjects found</div>
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
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(s)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog (reuse same dialog component for edit) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SubjectFormDialog
          subject={editingSubject}
          onSave={handleSave}
          onClose={() => {
            setIsEditOpen(false);
            setEditingSubject(null);
          }}
        />
      </Dialog>

      {/* Delete Dialog */}
      <DeleteSubjectDialog
        isOpen={isDeleteOpen}
        onClose={closeAll}
        onConfirm={handleConfirmDelete}
        subjectName={selectedForDelete?.subject_name || ""}
      />
    </div>
  );
}
