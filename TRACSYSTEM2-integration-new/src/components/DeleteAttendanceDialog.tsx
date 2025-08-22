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
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteAttendanceDialog: React.FC<DeleteAttendanceDialogProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle>Delete Attendance</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this attendance record? This action is irreversible.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAttendanceDialog;
