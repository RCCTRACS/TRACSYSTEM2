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
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Building2,
} from "lucide-react";

import { DepartmentFormDialog } from "./DepartmentFormDialog";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import { FilterDialog } from "./FilterDialog";
import { ExportDialog } from "./ExportDialog";
import { BulkUploadDialog } from "./BulkUploadDialog";

export interface Department {
  id: string;
  department: string; // 🔄 changed
  type: string;       // 🔄 changed
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [isDeleteDepartmentOpen, setIsDeleteDepartmentOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  const filteredDepartments = departments.filter(
    (dep) =>
      dep.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditDepartment = (dep: Department) => {
    setSelectedDepartment(dep);
    setIsEditDepartmentOpen(true);
  };

  const handleDeleteDepartment = (dep: Department) => {
    setSelectedDepartment(dep);
    setIsDeleteDepartmentOpen(true);
  };

  const handleSaveDepartment = (depData: Partial<Department>) => {
    if (selectedDepartment) {
      setDepartments(
        departments.map((d) =>
          d.id === selectedDepartment.id ? { ...d, ...depData } : d
        )
      );
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        department: depData.department || "",
        type: depData.type || "",
      };
      setDepartments([...departments, newDepartment]);
    }
    setIsAddDepartmentOpen(false);
    setIsEditDepartmentOpen(false);
    setSelectedDepartment(null);
  };

  const handleConfirmDelete = () => {
    if (selectedDepartment) {
      setDepartments(departments.filter((d) => d.id !== selectedDepartment.id));
      setIsDeleteDepartmentOpen(false);
      setSelectedDepartment(null);
    }
  };

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
          <h2 className="text-3xl font-bold text-black">
            Department Management
          </h2>
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
                Bulk Upload Departments
              </Button>
            </DialogTrigger>
            <BulkUploadDialog
              onUpload={(newDeps) => setDepartments([...departments, ...newDeps])}
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
            <FilterDialog />
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-table-header">
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dep) => (
                <TableRow
                  key={dep.id}
                  className="bg-admin-table-row hover:bg-admin-table-row-hover"
                >
                  <TableCell className="font-medium">{dep.department}</TableCell>
                  <TableCell>{dep.type}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
