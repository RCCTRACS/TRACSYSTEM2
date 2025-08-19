import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Filter, Download, Upload, Edit, Trash2, User } from "lucide-react";

import { SubjectFormDialog } from "./SubjectFormDialog";
import { DeleteSubjectDialog } from "./DeleteSubjectDialog";
import { FilterDialog } from "./FilterDialog";
import { ExportDialog } from "./ExportDialog";
import { BulkUploadDialog } from "./BulkUploadDialog";

export interface Subject {
  id: string;          // Subject ID
  name: string;        // Subject Name
  yearLevel: string;   // Year Level
  instructor: string;  // Assigned Teacher
}

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [isDeleteSubjectOpen, setIsDeleteSubjectOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  const outlineDarkBrownBox =
    "border-2 border-[#5C4033] rounded-xl shadow-sm bg-white";

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.yearLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditSubjectOpen(true);
  };

  const handleDeleteSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteSubjectOpen(true);
  };

  const handleSaveSubject = (subjectData: Partial<Subject>) => {
    if (selectedSubject) {
      // Update existing subject
      setSubjects(
        subjects.map((s) =>
          s.id === selectedSubject.id ? { ...s, ...subjectData } : s
        )
      );
    } else {
      // Add new subject
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: subjectData.name || "",
        yearLevel: subjectData.yearLevel || "",
        instructor: subjectData.instructor || "",
      };
      setSubjects([...subjects, newSubject]);
    }
    setIsAddSubjectOpen(false);
    setIsEditSubjectOpen(false);
    setSelectedSubject(null);
  };

  const handleConfirmDelete = () => {
    if (selectedSubject) {
      setSubjects(subjects.filter((s) => s.id !== selectedSubject.id));
      setIsDeleteSubjectOpen(false);
      setSelectedSubject(null);
    }
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const csvContent = "Subject ID,Subject Name,Year Level,Assigned Teacher\n";
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
        <Button
          className={`${outlineDarkBrownBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <User className="h-6 w-6 text-black" />
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Subject */}
          <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <SubjectFormDialog
              subject={null}
              onSave={handleSaveSubject}
              onClose={() => setIsAddSubjectOpen(false)}
            />
          </Dialog>

          {/* Download Template */}
          <Button className={outlineDarkBrownBtn} onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>

          {/* Bulk Upload */}
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload Subjects
              </Button>
            </DialogTrigger>
            <BulkUploadDialog
              onUpload={(newSubjects) => setSubjects([...subjects, ...newSubjects])}
              onClose={() => setIsBulkUploadOpen(false)}
            />
          </Dialog>

          {/* Export */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <ExportDialog
              subjects={filteredSubjects}
              onClose={() => setIsExportOpen(false)}
            />
          </Dialog>

          {/* Filter */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <FilterDialog />
          </Dialog>
        </div>
      </div>

      {/* Subjects Table */}
      <Card className={outlineDarkBrownBox}>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-table-header">
                <TableHead>Subject ID</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Year Level</TableHead>
                <TableHead>Assigned Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow
                  key={subject.id}
                  className="bg-admin-table-row hover:bg-admin-table-row-hover"
                >
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.yearLevel}</TableCell>
                  <TableCell>{subject.instructor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSubject(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditSubjectOpen} onOpenChange={setIsEditSubjectOpen}>
        <SubjectFormDialog
          subject={selectedSubject}
          onSave={handleSaveSubject}
          onClose={() => {
            setIsEditSubjectOpen(false);
            setSelectedSubject(null);
          }}
        />
      </Dialog>

      {/* Delete Subject Dialog */}
      <DeleteSubjectDialog
        isOpen={isDeleteSubjectOpen}
        onClose={() => {
          setIsDeleteSubjectOpen(false);
          setSelectedSubject(null);
        }}
        onConfirm={handleConfirmDelete}
        subjectName={selectedSubject?.name || ""}
      />
    </div>
  );
}
