"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  attendanceName?: string; // Optional, for display
}

export function DeleteAttendanceDialog({
  isOpen,
  onClose,
  onConfirm,
  attendanceName,
}: DeleteAttendanceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-xl border-2 border-[#5C4033]">
        <DialogHeader>
          <DialogTitle className="text-[#5C4033] text-lg font-bold">
            Delete Attendance
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 text-center text-base text-[#5C4033]">
          Are you sure you want to delete
          {attendanceName ? (
            <>
              {" "}
              <span className="font-semibold">{attendanceName}</span>
            </>
          ) : (
            " this attendance record"
          )}
          ?
        </div>
        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            className="border-[#5C4033] text-[#5C4033] hover:bg-[#f9eacb] hover:text-[#5C4033]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5C4033] text-white hover:bg-[#7a5230]"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
