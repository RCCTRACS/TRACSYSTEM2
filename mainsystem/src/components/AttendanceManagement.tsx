"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Download, Filter, Trash2 } from "lucide-react";
import { ManualAttendanceDialog } from "./ManualInput";
import { FilterAttendanceDialog } from "./FilterAttendanceDialog";
import { AttendanceFormDialog } from "./AttendanceFormDialog";
import { UserFormDialog } from "./UserFormDialog";

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
const USERS_API =
  "http://192.168.1.13/capstone/mainsystem/backend/users_api.php";

export function AttendanceManagement() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    yearLevel: "",
    department: "",
    timeIn: "",
    timeOut: "",
    status: ""
  });

  const [currentUser, setCurrentUser] = useState<{ first_name: string } | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  // --- Styling for outline button ---
  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // --- Update current date & time every second ---
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "medium"
      });
      setCurrentDateTime(formatted);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Fetch current user ---
  useEffect(() => {
    const userId = localStorage.getItem("authUserId");
    if (userId) {
      fetch(USERS_API)
        .then((res) => res.json())
        .then((data) => {
          const list = data?.users ?? (Array.isArray(data) ? data : []);
          const user = list.find((u: any) => u.id === userId);
          setCurrentUser(user ?? null);
        })
        .catch(() => setCurrentUser(null));
    }
  }, []);

  // --- Fetch attendances ---
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
        status: a.status
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

  // --- Add attendance ---
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
        body: formData.toString()
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

  // --- Delete attendance ---
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE"
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

  // --- Export CSV ---
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
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filter attendances ---
  const filteredAttendances = attendances.filter((a) => {
    return (
      (!filters.name ||
        a.studentName.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.yearLevel ||
        a.yearLevel.toLowerCase().includes(filters.yearLevel.toLowerCase())) &&
      (!filters.department ||
        a.department
          .toLowerCase()
          .includes(filters.department.toLowerCase())) &&
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

        {/* Profile dropdown */}
        <div className="relative">
          <div
            className="flex items-center bg-[#f3f3f3] px-3 py-2 rounded-full border-2 border-[#5C4033] cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <img src="/user.png" alt="Profile" className="w-7 h-7 mr-2" />
            <span className="text-black text-sm font-medium">
              {currentUser ? `${currentUser.first_name}` : "User"}
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

      {/* Actions */}
      <div className="flex justify-end items-center gap-2">
        {/* Manual Input */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className={outlineDarkBrownBtn}>
              <Pencil className="h-4 w-4 mr-2" />
              Manual Input
            </Button>
          </DialogTrigger>
          {isAddOpen && (
            <ManualAttendanceDialog
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              onAdd={handleAddAttendance}
            />
          )}
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
          {isFilterOpen && (
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
          )}
        </Dialog>
      </div>

      {/* Attendance List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-black">
              Attendance Records
            </h3>
            <p className="text-lg font-bold text-black">{currentDateTime}</p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Header Row */}
          <div className="grid grid-cols-9 gap-x-4 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>ID</div>
            <div>Barcode ID</div>
            <div>Name</div>
            <div>Year Level</div>
            <div>Department</div>
            <div>Time In</div>
            <div>Time Out</div>
            <div>Status</div>
            <div></div>
          </div>

          {/* Attendance Rows */}
          <div className="mt-2 space-y-3">
            {filteredAttendances.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No attendance records
              </div>
            ) : (
              filteredAttendances.map((a) => (
                <div
                  key={a.id}
                  className="grid grid-cols-9 gap-x-4 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div>{a.id}</div>
                  <div>{a.barcodeId}</div>
                  <div>{a.studentName}</div>
                  <div>{a.yearLevel}</div>
                  <div>{a.department}</div>
                  <div>{formatTime(a.timeIn)}</div>
                  <div>{formatTime(a.timeOut)}</div>
                  <div>{a.status}</div>
                  <div className="flex justify-center gap-2">
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Attendance Dialog */}
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
