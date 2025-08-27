import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Filter, Download, Upload, Edit, Trash2, Building2 } from "lucide-react";

import { DepartmentFormDialog } from "./DepartmentFormDialog";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import { FilterDepartmentDialog } from "./FilterDepartmentDialog"; // updated import
import { ExportDialog } from "./ExportDepartmentDialog";
import { BulkUploadDepartment } from "./BulkUploadDepartment";

export interface Department {
  id: string;
  department: string;
  type: string;
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [isDeleteDepartmentOpen, setIsDeleteDepartmentOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // --- Search filter ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const searchFiltered = departments.filter(
      (d) =>
        d.department.toLowerCase().includes(term.toLowerCase()) ||
        d.type.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDepartments(searchFiltered);
  };

  // --- Filter by type (Employee / Student / All) ---
  const handleFilter = (type: string) => {
    if (type === "All") {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((dep) => dep.type === type);
      setFilteredDepartments(filtered);
    }
  };

  // --- Add/Edit Department ---
  const handleSaveDepartment = (depData: Partial<Department>) => {
    if (selectedDepartment) {
      const updatedDepartments = departments.map((d) =>
        d.id === selectedDepartment.id ? { ...d, ...depData } : d
      );
      setDepartments(updatedDepartments);
      setFilteredDepartments(updatedDepartments);
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        department: depData.department || "",
        type: depData.type || "",
      };
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      setFilteredDepartments(updatedDepartments);
    }
    setIsAddDepartmentOpen(false);
    setIsEditDepartmentOpen(false);
    setSelectedDepartment(null);
  };

  const handleEditDepartment = (dep: Department) => {
    setSelectedDepartment(dep);
    setIsEditDepartmentOpen(true);
  };

  const handleDeleteDepartment = (dep: Department) => {
    setSelectedDepartment(dep);
    setIsDeleteDepartmentOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDepartment) {
      const remaining = departments.filter((d) => d.id !== selectedDepartment.id);
      setDepartments(remaining);
      setFilteredDepartments(remaining);
      setIsDeleteDepartmentOpen(false);
      setSelectedDepartment(null);
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvContent = "id,department,type\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "department_template.csv");
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
          <h2 className="text-3xl font-bold text-black">Department Management</h2>
        </div>
        <Button
          className={`${outlineDarkBrownBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <Building2 className="h-6 w-6 text-black" />
          Admin
        </Button>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Department */}
          <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
            <DialogTrigger asChild>
              <Button
                className={outlineDarkBrownBtn}
                onClick={() => setSelectedDepartment(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DepartmentFormDialog
              key={Date.now()}
              department={null}
              onSave={handleSaveDepartment}
              onClose={() => setIsAddDepartmentOpen(false)}
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
                Bulk Upload Departments
              </Button>
            </DialogTrigger>
            <BulkUploadDepartment
              onUpload={(newDeps) => {
                const updated = [...departments, ...newDeps];
                setDepartments(updated);
                setFilteredDepartments(updated);
              }}
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
              departments={filteredDepartments}
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
            <FilterDepartmentDialog
              onFilter={handleFilter}
              onClose={() => setIsFilterOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Departments Table */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Department</div>
            <div>Type</div>
            <div>Actions</div>
          </div>

          <div className="mt-2 space-y-3">
            {filteredDepartments.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No departments found
              </div>
            ) : (
              filteredDepartments.map((dep) => (
                <div
                  key={dep.id}
                  className="grid grid-cols-3 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{dep.department}</div>
                  <div>{dep.type}</div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDepartment(dep)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDepartment(dep)}
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
      <Dialog open={isEditDepartmentOpen} onOpenChange={setIsEditDepartmentOpen}>
        <DepartmentFormDialog
          department={selectedDepartment}
          onSave={handleSaveDepartment}
          onClose={() => {
            setIsEditDepartmentOpen(false);
            setSelectedDepartment(null);
          }}
        />
      </Dialog>

      {/* Delete Dialog */}
      <DeleteDepartmentDialog
        isOpen={isDeleteDepartmentOpen}
        onClose={() => {
          setIsDeleteDepartmentOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleConfirmDelete}
        departmentName={selectedDepartment?.department || ""}
      />
    </div>
  );
}
