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

  const outlineClass =
    "border-[2.5px] border-[#3E1F0F] rounded-xl focus:border-[#3E1F0F] focus:ring-2 focus:ring-[#C9A27E] h-12 px-4 shadow-sm transition-all duration-200";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-[#D9B99B] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="px-0 pb-4 border-b border-[#E5D3C6]">
          <DialogTitle className="text-2xl font-extrabold text-[#3E1F0F] tracking-wide">
            Manual Attendance Input
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-6">
          {/* Barcode Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#3E1F0F] tracking-wide">
              Barcode ID
            </label>
            <Input
              placeholder="Enter Barcode ID"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className={outlineClass}
            />
          </div>

          {/* Time Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#3E1F0F] tracking-wide">
              Time In (hh:mm AM/PM)
            </label>
            <Input
              placeholder="e.g., 08:30 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={outlineClass}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-4 mt-8 border-t border-[#E5D3C6] pt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-sm"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] rounded-xl px-6 py-2 font-semibold transition-all duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
