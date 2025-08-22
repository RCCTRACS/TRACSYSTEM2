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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export function FilterAttendanceDialog({
  open,
  onClose,
  onApply,
}: FilterAttendanceDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Filter Attendance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Name
            </label>
            <Input
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>

          {/* Year Level */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Year Level
            </label>
            <Input
              placeholder="Enter year level"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Department
            </label>
            <Input
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>

          {/* Time In */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Time In
            </label>
            <Input
              type="time"
              value={timeIn}
              onChange={(e) => setTimeIn(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>

          {/* Time Out */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Time Out
            </label>
            <Input
              type="time"
              value={timeOut}
              onChange={(e) => setTimeOut(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border border-gray-400 text-black rounded-lg">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white border-2 border-[#8B4513] text-[#8B4513] font-semibold rounded-lg px-6 hover:bg-[#f9f4f1]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="bg-[#8B4513] text-white font-semibold rounded-lg px-6 hover:bg-[#5c2e1e]"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
