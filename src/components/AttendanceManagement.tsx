"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Pencil, Download, Filter, Edit, Trash2 } from "lucide-react";
import { ManualAttendanceDialog } from "./ManualInput";
import { FilterAttendanceDialog } from "./FilterAttendanceDialog";

export interface Attendance {
  id: string; // Barcode ID
  studentName: string; // Name
  yearLevel: string; // Year Level
  department: string; // Department
  timeIn: string; // Time In
  timeOut: string; // Time Out
  status: string; // Present, Absent, Late
}

export function AttendanceManagement() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Profile dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleLogout = () => {
    console.log("Logged out");
    setDropdownOpen(false);
  };

  // Filter state
  const [filters, setFilters] = useState({
    name: "",
    yearLevel: "",
    department: "",
    timeIn: "",
    timeOut: "",
    status: ""
  });

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // Export CSV
  const handleExport = () => {
    const csvHeader =
      "Barcode ID,Name,Year Level,Department,Time In,Time Out,Status\n";
    const csvRows = attendances
      .map(
        (a) =>
          `${a.id},${a.studentName},${a.yearLevel},${a.department},${a.timeIn},${a.timeOut},${a.status}`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Add from Manual Dialog
  const handleAddAttendance = (barcodeId: string, timeIn: string) => {
    const newAttendance: Attendance = {
      id: barcodeId,
      studentName: "Unknown", // placeholder
      yearLevel: "N/A",
      department: "N/A",
      timeIn,
      timeOut: "-",
      status: "Present"
    };

    setAttendances((prev) => [...prev, newAttendance]);
  };

  // Handle Apply Filters
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Apply filters to attendances
  const filteredAttendances = attendances.filter((a) => {
    return (
      (filters.name === "" ||
        a.studentName.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.yearLevel === "" ||
        a.yearLevel.toLowerCase().includes(filters.yearLevel.toLowerCase())) &&
      (filters.department === "" ||
        a.department
          .toLowerCase()
          .includes(filters.department.toLowerCase())) &&
      (filters.timeIn === "" || a.timeIn >= filters.timeIn) &&
      (filters.timeOut === "" || a.timeOut <= filters.timeOut) &&
      (filters.status === "" || a.status === filters.status)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">
            Attendance Management
          </h2>
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

      {/* Actions - aligned to right */}
      <div className="flex justify-end items-center gap-2">
        {/* Manual Input */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className={outlineDarkBrownBtn}>
              <Pencil className="h-4 w-4 mr-2" />
              Manual Input
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0">
            <ManualAttendanceDialog
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              onAdd={handleAddAttendance}
            />
          </DialogContent>
        </Dialog>

        {/* Export */}
        <Button className={outlineDarkBrownBtn} onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        {/* Filter */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button className={outlineDarkBrownBtn}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0">
            <FilterAttendanceDialog
              open={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Attendance Table */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-white font-bold text-center">
                <TableHead>Barcode ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Year Level</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-500 py-6"
                  >
                    No attendance records
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendances.map((attendance) => (
                  <TableRow key={attendance.id} className="text-center">
                    <TableCell>{attendance.id}</TableCell>
                    <TableCell>{attendance.studentName}</TableCell>
                    <TableCell>{attendance.yearLevel}</TableCell>
                    <TableCell>{attendance.department}</TableCell>
                    <TableCell>{attendance.timeIn}</TableCell>
                    <TableCell>{attendance.timeOut}</TableCell>
                    <TableCell>{attendance.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAttendance(attendance);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAttendance(attendance);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
