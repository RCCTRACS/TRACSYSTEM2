"use client";

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
  Building2
} from "lucide-react";

import { DepartmentFormDialog } from "./DepartmentFormDialog";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import { FilterDepartmentDialog } from "./FilterDepartmentDialog";
import { ExportDepartmentDialog } from "./ExportDepartmentDialog";
import { BulkUploadDepartment } from "./BulkUploadDepartment";
import { UserFormDialog } from "./UserFormDialog";

import { toast } from "sonner";

export interface Department {
  id: string;
  department: string;
  type: string; // "Student" | "Employee"
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [isDeleteDepartmentOpen, setIsDeleteDepartmentOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ first_name: string } | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const API_URL =
    "http://192.168.1.13/capstone/mainsystem/backend/department_api.php";

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // ✅ Fetch from PHP API
  const loadDepartments = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setFilteredDepartments(data);
      })
      .catch(() => toast.error("Failed to load departments"));
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("authUserId");
    if (userId) {
      fetch("http://192.168.1.13/capstone/mainsystem/backend/users_api.php")
        .then((res) => res.json())
        .then((data) => {
          const list = data?.users ?? (Array.isArray(data) ? data : []);
          const user = list.find((u: any) => u.id === userId);
          setCurrentUser(user ?? null);
        });
    }
  }, []);

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

  // --- Filter by type ---
  const handleFilter = (type: string) => {
    if (type === "All") {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((dep) => dep.type === type);
      setFilteredDepartments(filtered);
    }
    toast.info(
      type === "All" ? "Showing all departments" : `Filtered by ${type}`
    );
  };

  // --- Add/Edit Department ---
  const handleSaveDepartment = (depData: Partial<Department>) => {
    if (selectedDepartment) {
      // ✅ Update existing (PUT)
      fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(depData)
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            loadDepartments();
            toast.success(
              `Department "${result.data.department}" updated successfully`
            );
          } else {
            toast.error(result.error || "Failed to update department");
          }
        })
        .catch(() => toast.error("Failed to update department"));
    } else {
      // ✅ Add new (POST)
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(depData)
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            loadDepartments();
            toast.success(
              `Department "${result.data.department}" added successfully`
            );
          } else {
            toast.error(result.error || "Failed to add department");
          }
        })
        .catch(() => toast.error("Failed to add department"));
    }
    setIsAddDepartmentOpen(false);
    setIsEditDepartmentOpen(false);
    setSelectedDepartment(null);
  };

  // --- Edit handler ---
  const handleEditDepartment = (dep: Department) => {
    setSelectedDepartment(dep);
    setIsEditDepartmentOpen(true);
  };

  // --- Delete handler ---
  const handleDeleteDepartment = (dep: Department) => {
    setSelectedDepartment(dep);
    setIsDeleteDepartmentOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDepartment) {
      fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedDepartment.id })
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            loadDepartments();
            toast.success(
              `Department "${selectedDepartment.department}" deleted`
            );
          } else {
            toast.error(result.error || "Failed to delete department");
          }
        })
        .catch(() => toast.error("Failed to delete department"));
      setIsDeleteDepartmentOpen(false);
      setSelectedDepartment(null);
    }
  };

  // --- Download Template (headers only) ---
  const handleDownloadTemplate = () => {
    const csvContent = "department,type\n"; // ✅ headers only, no sample data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "department_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Template downloaded successfully");
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

        {/* Profile dropdown */}
        <div className="relative">
          <div
            className="flex items-center bg-[#f3f3f3] px-3 py-2 rounded-full border-2 border-[#5C4033] cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <img src="/user.png" alt="Profile" className="w-7 h-7 mr-2" />
            <span className="text-black text-sm font-medium">
              {currentUser && "first_name" in currentUser
                ? currentUser.first_name
                : "User"}
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
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Department */}
          <Dialog
            open={isAddDepartmentOpen}
            onOpenChange={setIsAddDepartmentOpen}
          >
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
            <BulkUploadDepartment
              onClose={() => setIsBulkUploadOpen(false)}
              onSuccess={loadDepartments}
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
            <ExportDepartmentDialog
              departments={filteredDepartments}
              onClose={() => {
                setIsExportOpen(false);
                // toast.success("Departments exported successfully");
              }}
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
      <Dialog
        open={isEditDepartmentOpen}
        onOpenChange={setIsEditDepartmentOpen}
      >
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
