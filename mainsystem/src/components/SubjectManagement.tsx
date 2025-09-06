import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Filter, Download, Upload, Edit, Trash2, User as UserIcon } from "lucide-react";

import { SubjectFormDialog } from "./SubjectFormDialog";
import { DeleteSubjectDialog } from "./DeleteSubjectDialog";
import { FilterSubjectDialog } from "./FilterSubjectDialog";
import { ExportSubjectDialog } from "./ExportSubjectDialog";
import { BulkUploadSubject } from "./BulkUploadSubject";

export interface Subject {
  id: string;
  name: string;
  yearLevel: string;
  instructor: string;
  time?: string;
}

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

  const outlineBtn = "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";
  const outlineBox = "border-2 border-[#5C4033] rounded-lg shadow-sm bg-white";

  useEffect(() => {
    setFilteredSubjects(subjects);
  }, [subjects]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(term.toLowerCase()) ||
        s.id.toLowerCase().includes(term.toLowerCase()) ||
        s.yearLevel.toLowerCase().includes(term.toLowerCase()) ||
        s.instructor.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  const handleSave = (data: any) => {
    const yearLevel = data.gradeOrYear || data.yearLevel || "";
    const time = data.time || "";
    if (selectedSubject) {
      const updated = subjects.map((s) =>
        s.id === selectedSubject.id
          ? { ...s, id: data.id || s.id, name: data.name, instructor: data.instructor, yearLevel, time }
          : s
      );
      setSubjects(updated);
    } else {
      const newSub: Subject = {
        id: data.id || Date.now().toString(),
        name: data.name || "",
        yearLevel,
        instructor: data.instructor || "",
        time,
      };
      setSubjects([...subjects, newSub]);
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

  const handleConfirmDelete = () => {
    if (selectedSubject) {
      setSubjects(subjects.filter((s) => s.id !== selectedSubject.id));
      closeDialogs();
    }
  };

  const closeDialogs = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedSubject(null);
  };

  const handleDownloadTemplate = () => {
    let csvContent = "Subject ID,Subject Name,Year Level,Instructor\n";
    csvContent += "CS101,Intro to Computer Science,Grade 11,John Doe\n";

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
        <Button className={`${outlineBtn} flex items-center gap-2 rounded-full px-4 py-2`}>
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
              <Button className={outlineBtn} onClick={() => setSelectedSubject(null)}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </DialogTrigger>
            <SubjectFormDialog subject={null} onSave={handleSave} onClose={() => setIsAddOpen(false)} />
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
              onUpload={(newSubs) => setSubjects([...subjects, ...newSubs])}
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
                if (year) filtered = filtered.filter((s) => s.yearLevel === year);
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
          <div className="grid grid-cols-5 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Subject ID</div>
            <div>Subject Name</div>
            <div>Year Level</div>
            <div>Instructor</div>
            <div></div>
          </div>

          <div className="mt-2 space-y-3">
            {filteredSubjects.length === 0 ? (
              <div className="text-center text-gray-500 py-6">No subjects found</div>
            ) : (
              filteredSubjects.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-5 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{s.id}</div>
                  <div>{s.name}</div>
                  <div>{s.yearLevel}</div>
                  <div>{s.instructor}</div>
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SubjectFormDialog subject={selectedSubject} onSave={handleSave} onClose={closeDialogs} />
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
