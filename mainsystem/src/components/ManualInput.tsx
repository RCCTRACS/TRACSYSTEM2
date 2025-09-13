"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ManualAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  // Parent will handle the POST request
  onAdd: (barcode: string, time: string) => Promise<void> | void;
}

export function ManualAttendanceDialog({
  open,
  onClose,
  onAdd,
}: ManualAttendanceDialogProps) {
  const [barcode, setBarcode] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset fields whenever dialog closes
  useEffect(() => {
    if (!open) {
      setBarcode("");
      setTime("");
    }
  }, [open]);

  // Validate time in hh:mm AM/PM format
  const isValidTime = (t: string) =>
    /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?([AaPp][Mm])$/.test(t.trim());

  // Convert hh:mm AM/PM → HH:MM:SS (24-hour)
  const to24Hour = (t: string) => {
    const match = t.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
    if (!match) return t;

    let [_, hh, mm, period] = match;
    let hours = parseInt(hh, 10);
    const minutes = mm;

    if (period.toLowerCase() === "pm" && hours < 12) {
      hours += 12;
    }
    if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
  };

  const handleAdd = async () => {
    if (!barcode || !time) {
      alert("Please enter both barcode and time.");
      return;
    }

    if (!isValidTime(time)) {
      alert("Please enter time in hh:mm AM/PM format.");
      return;
    }

    setLoading(true);

    try {
      const convertedTime = to24Hour(time); // ✅ convert before sending
      await onAdd(barcode.trim(), convertedTime);
      onClose();
    } catch (error: any) {
      alert(error?.message || "Failed to add attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Manual Attendance Input
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* Barcode Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Barcode ID
            </label>
            <Input
              placeholder="Enter Barcode ID"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Time In (hh:mm AM/PM)
            </label>
            <Input
              placeholder="e.g., 08:30 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-400 text-black rounded-lg"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white border-2 border-[#8B4513] text-[#8B4513] font-semibold rounded-lg px-6 hover:bg-[#f9f4f1]"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-[#8B4513] text-white font-semibold rounded-lg px-6 hover:bg-[#5c2e1e]"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
