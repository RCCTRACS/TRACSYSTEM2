import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Attendance {
  id: number;
  name: string;
  date: string;
  status: string;
}

interface AttendanceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (attendance: Attendance) => void;
  initialData?: Attendance | null;
}

export function AttendanceFormDialog({
  open,
  onClose,
  onSave,
  initialData,
}: AttendanceFormDialogProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDate(initialData.date);
      setStatus(initialData.status);
    } else {
      setName("");
      setDate("");
      setStatus("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    const newRecord: Attendance = {
      id: initialData ? initialData.id : Date.now(),
      name,
      date,
      status,
    };
    onSave(newRecord);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Attendance" : "Add Attendance"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Present / Absent / Late"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
