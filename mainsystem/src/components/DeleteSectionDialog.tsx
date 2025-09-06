"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteSectionDialogProps {
  sectionName: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteSectionDialog({
  sectionName,
  onClose,
  onDelete,
}: DeleteSectionDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Section</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-black">{sectionName}</span>? <br />
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
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
