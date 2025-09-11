import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteStudentDialogProps {
  isOpen: boolean; // changed from `open` to `isOpen` to match StudentManagement.tsx
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <b>{studentName}</b>? This action
          cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
