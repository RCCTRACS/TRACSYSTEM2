"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteStrandDialogProps {
  strandName: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteStrandDialog({
  strandName,
  onClose,
  onDelete,
}: DeleteStrandDialogProps) {
  return (
    <DialogContent>
      <DialogHeader className="flex flex-col items-center text-center space-y-2">
        <Trash2 className="h-10 w-10 text-red-600 mb-2" />
        <DialogTitle>Delete Strand</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-black">{strandName}</span>? <br />
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex justify-end gap-2">
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
