"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FilterAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    name: string;
    yearLevel: string;
    department: string;
    timeIn: string;
    timeOut: string;
    status: string;
  }) => void;
}

export function FilterAttendanceDialog({ open, onClose, onApply }: FilterAttendanceDialogProps) {
  const [name, setName] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    onApply({ name, yearLevel, department, timeIn, timeOut, status });
    onClose();
  };

  const handleReset = () => {
    setName(""); setYearLevel(""); setDepartment(""); setTimeIn(""); setTimeOut(""); setStatus("");
    onApply({ name: "", yearLevel: "", department: "", timeIn: "", timeOut: "", status: "" });
    onClose();
  };

  // Example button options (can be customized)
  const nameOptions = ["All", "Alice", "Bob", "Charlie"];
  const yearLevelOptions = ["All", "1st Year", "2nd Year", "3rd Year"];
  const departmentOptions = ["All", "Science", "Arts", "Commerce"];
  const timeOptions = ["All", "Morning", "Afternoon"];
  const statusOptions = ["All", "Present", "Absent", "Late"];

  const FilterButtons = ({
    options,
    selected,
    onSelect,
  }: {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
  }) => (
    <div className="flex flex-wrap gap-3 mt-2">
      {options.map((opt) => (
        <Button
          key={opt}
          className={`px-6 py-2 rounded-2xl font-semibold border-2 ${
            selected === opt
              ? "bg-[#5C3A21] text-white border-[#5C3A21]"
              : "bg-white text-[#5C3A21] border-[#5C3A21]"
          } hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-md transition-all duration-300`}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-8 rounded-3xl shadow-2xl border border-[#D9B99B]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-black">Filter Attendance</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <p className="font-semibold text-black mb-2">Name</p>
            <FilterButtons options={nameOptions} selected={name} onSelect={setName} />
          </div>

          <div>
            <p className="font-semibold text-black mb-2">Year Level</p>
            <FilterButtons options={yearLevelOptions} selected={yearLevel} onSelect={setYearLevel} />
          </div>

          <div>
            <p className="font-semibold text-black mb-2">Department</p>
            <FilterButtons options={departmentOptions} selected={department} onSelect={setDepartment} />
          </div>

          <div>
            <p className="font-semibold text-black mb-2">Time In</p>
            <FilterButtons options={timeOptions} selected={timeIn} onSelect={setTimeIn} />
          </div>

          <div>
            <p className="font-semibold text-black mb-2">Time Out</p>
            <FilterButtons options={timeOptions} selected={timeOut} onSelect={setTimeOut} />
          </div>

          <div>
            <p className="font-semibold text-black mb-2">Status</p>
            <FilterButtons options={statusOptions} selected={status} onSelect={setStatus} />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-4 mt-6">
          <Button
            onClick={handleReset}
            className="bg-white text-[#5C3A21] border-2 border-[#5C3A21] font-semibold rounded-2xl px-6 py-2 hover:bg-[#5C3A21] hover:text-white transform hover:scale-105 hover:shadow-md transition-all duration-300"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="bg-[#5C3A21] text-white font-semibold rounded-2xl px-6 py-2 hover:bg-[#3e2716] transform hover:scale-105 hover:shadow-md transition-all duration-300"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
