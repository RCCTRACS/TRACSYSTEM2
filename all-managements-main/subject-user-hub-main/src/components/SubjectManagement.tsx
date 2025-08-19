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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Filter, Download, Upload, Edit, Trash2 } from "lucide-react";
import { SubjectFormDialog } from "./SubjectFormDialog";
import { DeleteSubjectDialog } from "./DeleteSubjectDialog";
import { FilterDialog } from "./FilterDialog";
import { ExportDialog } from "./ExportDialog";
import { BulkUploadDialog } from "./BulkUploadDialog";

interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  instructor: string;
}

const mockSubjects: Subject[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "ITS",
    credits: 3,
    instructor: "John Doe",
  },
  {
    id: "2",
    code: "MATH201",
    name: "Calculus I",
    department: "Mathematics",
    credits: 4,
    instructor: "Jane Smith",
  },
  {
    id: "3",
    code: "ENG101",
    name: "English Composition",
    department: "English",
    credits: 3,
    instructor: "Bob Johnson",
  },
  {
    id: "4",
    code: "PHYS101",
    name: "General Physics",
    department: "Physics",
    credits: 4,
    instructor: "Alice Brown",
  },
];

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [isDeleteSubjectOpen, setIsDeleteSubjectOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      // Edit existing subject
      setSubjects(subjects.map(subject => 
        subject.id === selectedSubject.id 
          ? { ...subject, ...subjectData }
          : subject
      ));
    } else {
      // Add new subject
      const newSubject: Subject = {
        id: Date.now().toString(),
        code: subjectData.code || "",
        name: subjectData.name || "",
        department: subjectData.department || "",
        credits: subjectData.credits || 0,
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
      setSubjects(subjects.filter(subject => subject.id !== selectedSubject.id));
      setIsDeleteSubjectOpen(false);
      setSelectedSubject(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Subject Management</h2>
        <div className="flex items-center gap-2">
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter By
              </Button>
            </DialogTrigger>
            <FilterDialog />
          </Dialog>

          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <ExportDialog />
          </Dialog>

          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload Subjects
              </Button>
            </DialogTrigger>
            <BulkUploadDialog />
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subjects</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <SubjectFormDialog
                  subject={null}
                  onSave={handleSaveSubject}
                  onClose={() => setIsAddSubjectOpen(false)}
                />
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-table-header">
                <TableHead>Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow 
                  key={subject.id}
                  className="bg-admin-table-row hover:bg-admin-table-row-hover"
                >
                  <TableCell className="font-medium">{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.department}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
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