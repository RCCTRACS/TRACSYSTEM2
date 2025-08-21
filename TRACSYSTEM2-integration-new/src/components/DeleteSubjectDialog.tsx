import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteSubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subjectName: string;
}

export function DeleteSubjectDialog({ isOpen, onClose, onConfirm, subjectName }: DeleteSubjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-popover">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Subject
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete the subject <strong>{subjectName}</strong>? 
            This action is irreversible.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}