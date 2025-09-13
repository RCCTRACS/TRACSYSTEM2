"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AttendanceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete?: () => void; // no need for id since you just want delete
}

export function AttendanceFormDialog({
  open,
  onClose,
  onDelete,
}: AttendanceFormDialogProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-red-600">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-700 mt-2">
          Are you sure you want to delete this attendance record? This action
          cannot be undone.
        </p>

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            className="bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg px-6 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 text-white font-semibold rounded-lg px-6 hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
