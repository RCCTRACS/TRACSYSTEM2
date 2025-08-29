"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";

import { GradeFormDialog } from "./GradeFormDialog";
import { DeleteGradeDialog } from "./DeleteGradeDialog";
import { BulkUploadGrade } from "./BulkUploadGrade";
import { FilterGradeDialog } from "./FilterGradeDialog";

export interface Grade {
  id: string;
  grade: string;
  type: string;
}

export function GradeManagement() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // Keep filteredGrades in sync with grades
  useEffect(() => {
    setFilteredGrades(grades);
  }, [grades]);

  // --- Search ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredGrades(grades);
      return;
    }
    const searchFiltered = grades.filter(
      (g) =>
        g.grade.toLowerCase().includes(term.toLowerCase()) ||
        g.type.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGrades(searchFiltered);
  };

  // --- Add/Edit ---
  const handleSaveGrade = (gradeData: Partial<Grade>) => {
    if (selectedGrade) {
      const updatedGrades = grades.map((g) =>
        g.id === selectedGrade.id ? { ...g, ...gradeData } : g
      );
      setGrades(updatedGrades);
    } else {
      const newGrade: Grade = {
        id: Date.now().toString(),
        grade: gradeData.grade || "",
        type: gradeData.type || "",
      };
      setGrades((prev) => [...prev, newGrade]);
    }

    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelectedGrade(null);
  };

  const handleEditGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsEditOpen(true);
  };

  const handleDeleteGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedGrade) {
      const remaining = grades.filter((g) => g.id !== selectedGrade.id);
      setGrades(remaining);
      setIsDeleteOpen(false);
      setSelectedGrade(null);
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const headers = ["grade", "type"];
    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "grade_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Bulk Upload ---
  const handleBulkUpload = async (file: File) => {
    const text = await file.text();
    const rows = text.split("\n").filter((row) => row.trim() !== "");
    const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());

    if (!(headers.includes("grade") && headers.includes("type"))) {
      alert("Invalid file format. Please use the template provided.");
      return;
    }

    const newGrades: Grade[] = rows.slice(1).map((row) => {
      const cols = row.split(",");
      const gradeIndex = headers.indexOf("grade");
      const typeIndex = headers.indexOf("type");
      return {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        grade: cols[gradeIndex]?.trim() || "",
        type: cols[typeIndex]?.trim() || "",
      };
    });

    setGrades((prev) => [...prev, ...newGrades]);
  };

  // --- Export CSV ---
  const handleExportCSV = () => {
    const headers = ["grade", "type"];
    const rows = filteredGrades.map((g) => [g.grade, g.type]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "grades_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Grade Management</h2>
        </div>
        <Button
          className={`${outlineDarkBrownBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <FileText className="h-6 w-6 text-black" />
          Records
        </Button>
      </div>

      {/* Search + Buttons */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search grades..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Grade */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                className={outlineDarkBrownBtn}
                onClick={() => setSelectedGrade(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <GradeFormDialog
              grade={null}
              onSave={handleSaveGrade}
              onClose={() => setIsAddOpen(false)}
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
                Bulk Upload Grades
              </Button>
            </DialogTrigger>
            <BulkUploadGrade
              onUpload={handleBulkUpload}
              onClose={() => setIsBulkUploadOpen(false)}
            />
          </Dialog>

          {/* Export Modal */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-popover p-6 rounded-xl shadow-md">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-bold text-black">
                  Export Grades
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 flex flex-col space-y-8">
                <p className="text-sm text-black font-medium text-center">
                  Are you sure you want to export grade data?
                </p>

                <div className="flex justify-end gap-3 w-full mt-2">
                  <Button
                    variant="outline"
                    className="border-2 border-[#5C4033] text-[#5C4033] bg-white hover:bg-[#5C4033] hover:text-white transition-all duration-200 rounded-lg"
                    onClick={() => setIsExportOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#5C4033] text-white hover:bg-[#3E1F0F] transition-all duration-200 rounded-lg"
                    onClick={handleExportCSV}
                  >
                    Export
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Filter by Grade Level */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <FilterGradeDialog
              gradeLevels={["All", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]}
              onFilter={(grade) => {
                if (grade === "All") {
                  setFilteredGrades(grades);
                } else {
                  setFilteredGrades(grades.filter((g) => g.grade === grade));
                }
              }}
              onClose={() => setIsFilterOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Grades List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader />
        <CardContent>
          <div className="grid grid-cols-3 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Grade</div>
            <div>Type</div>
            <div></div>
          </div>

          <div className="mt-2 space-y-3">
            {filteredGrades.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No records found
              </div>
            ) : (
              filteredGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="grid grid-cols-3 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{grade.grade}</div>
                  <div>{grade.type}</div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditGrade(grade)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGrade(grade)}
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

      {/* Edit Grade Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <GradeFormDialog
          grade={selectedGrade}
          onSave={handleSaveGrade}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedGrade(null);
          }}
        />
      </Dialog>

      {/* Delete Grade Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DeleteGradeDialog
          gradeName={selectedGrade?.grade || ""}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedGrade(null);
          }}
          onDelete={handleConfirmDelete}
        />
      </Dialog>
    </div>
  );
}
