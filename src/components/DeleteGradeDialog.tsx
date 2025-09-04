import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteGradeDialogProps {
  gradeName: string; // e.g. "Grade 10 - Section A"
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteGradeDialog({
  gradeName,
  onClose,
  onDelete,
}: DeleteGradeDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Grade</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-gray-600">
        Are you sure you want to delete <b>{gradeName}</b>? This action cannot
        be undone.
      </p>
      <DialogFooter className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
