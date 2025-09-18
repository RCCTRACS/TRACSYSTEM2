"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteStudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
}

export function DeleteStudentDialog({
  isOpen,
  onClose,
  onConfirm,
  studentName,
}: DeleteStudentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white p-6 rounded-3xl shadow-xl border border-[#D9B99B]">
        <DialogHeader className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-[#D9B99B]/50">
          <DialogTitle className="text-xl font-bold text-black">
            Delete Student
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">{studentName}</span>? <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            className="px-5 py-2 rounded-lg border-2 border-[#5C4033] text-[#5C4033] font-medium hover:bg-[#f5ebe2]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
