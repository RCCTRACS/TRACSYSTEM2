// AttendanceManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Download, Filter, Trash2, User } from "lucide-react";
import { ManualAttendanceDialog } from "./ManualInput";
import { FilterAttendanceDialog } from "./FilterAttendanceDialog";
import { AttendanceFormDialog } from "./AttendanceFormDialog"; // ✅ delete-only dialog

export interface Attendance {
  id: string;
  barcodeId: string;
  studentName: string;
  yearLevel: string;
  department: string;
  timeIn: string;
  timeOut: string | null;
  status: string;
}

const API_URL =
  "http://192.168.1.13/capstone/mainsystem/backend/attendance_api.php";

export function AttendanceManagement() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    yearLevel: "",
    department: "",
    timeIn: "",
    timeOut: "",
    status: "",
  });

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // ✅ Fetch attendances
  const fetchAttendances = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON from API:", text);
        data = [];
      }

      const formatted: Attendance[] = data.map((a: any) => ({
        id: a.id,
        barcodeId: a.barcode_id,
        studentName: a.student_name,
        yearLevel: a.year_level,
        department: a.department,
        timeIn: a.time_in,
        timeOut: a.time_out,
        status: a.status,
      }));
      setAttendances(formatted);
    } catch (err) {
      console.error(err);
      setAttendances([]);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  // ✅ Add attendance (Manual Input)
  const handleAddAttendance = async (barcodeId: string, timeIn: string) => {
    try {
      let formattedTime = timeIn;
      if (/^\d{2}:\d{2}$/.test(timeIn)) {
        formattedTime = timeIn + ":00";
      }

      const formData = new URLSearchParams();
      formData.append("barcode_id", barcodeId);
      formData.append("time_in", formattedTime);
      formData.append("time_out", "");
      formData.append("status", "Present");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON from API:", text);
        data = null;
      }

      if (data?.success) {
        fetchAttendances();
      } else {
        const msg = data?.error || data?.message || "Unknown error";
        alert("Failed to add attendance: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  // ✅ Delete attendance
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON from API:", text);
        data = null;
      }

      if (data?.success) {
        fetchAttendances();
      } else {
        alert(
          "Failed to delete attendance: " + (data?.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  // ✅ Export CSV
  const handleExport = () => {
    const csvHeader =
      "ID,Barcode ID,Name,Year Level,Department,Time In,Time Out,Status\n";
    const csvRows = attendances
      .map(
        (a) =>
          `${a.id},${a.barcodeId},${a.studentName},${a.yearLevel},${a.department},${a.timeIn},${a.timeOut ?? "-"},${a.status}`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Filter attendances
  const filteredAttendances = attendances.filter((a) => {
    return (
      (!filters.name ||
        a.studentName.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.yearLevel ||
        a.yearLevel.toLowerCase().includes(filters.yearLevel.toLowerCase())) &&
      (!filters.department ||
        a.department.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.timeIn || a.timeIn >= filters.timeIn) &&
      (!filters.timeOut || (a.timeOut ?? "") <= filters.timeOut) &&
      (!filters.status || a.status === filters.status)
    );
  });

  const formatTime = (t: string | null) => {
    return t ? t : "-";
  };

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
        <Button
          className={`${outlineDarkBrownBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <User className="h-6 w-6 text-black" />
          Admin
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-2">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className={outlineDarkBrownBtn}>
              <Pencil className="h-4 w-4 mr-2" />
              Manual Input
            </Button>
          </DialogTrigger>
          <ManualAttendanceDialog
            open={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onAdd={handleAddAttendance}
          />
        </Dialog>

        <Button className={outlineDarkBrownBtn} onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button className={outlineDarkBrownBtn}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DialogTrigger>
          <FilterAttendanceDialog
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilter={(status) => {
              if (status === "All") {
                setFilters({ ...filters, status: "" });
              } else {
                setFilters({ ...filters, status });
              }
              setIsFilterOpen(false);
            }}
          />
        </Dialog>
      </div>

      {/* Attendance Table */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-white font-bold text-center">
                <TableHead>ID</TableHead>
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
                    colSpan={9}
                    className="text-center text-gray-500 py-6"
                  >
                    No attendance records
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendances.map((a) => (
                  <TableRow key={a.id} className="text-center">
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.barcodeId}</TableCell>
                    <TableCell>{a.studentName}</TableCell>
                    <TableCell>{a.yearLevel}</TableCell>
                    <TableCell>{a.department}</TableCell>
                    <TableCell>{formatTime(a.timeIn)}</TableCell>
                    <TableCell>{formatTime(a.timeOut)}</TableCell>
                    <TableCell>{a.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteId(a.id);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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

      {/* ✅ Delete Dialog */}
      <AttendanceFormDialog
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        onDelete={() => {
          if (deleteId) handleDelete(deleteId);
        }}
      />
    </div>
  );
}
