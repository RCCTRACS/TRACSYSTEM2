import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Subject {
  id: string;
  name: string;
  yearLevel: string;
  instructor: string;
  time?: string; // Added Subject Time
}

interface SubjectFormDialogProps {
  subject: Subject | null;
  onSave: (subject: Partial<Subject>) => void;
  onClose: () => void;
}

export function SubjectFormDialog({ subject, onSave, onClose }: SubjectFormDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    time: "",           // New field
    name: "",
    yearLevel: "",
    instructor: "",
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        id: subject.id,
        time: subject.time || "",
        name: subject.name,
        yearLevel: subject.yearLevel,
        instructor: subject.instructor,
      });
    } else {
      setFormData({ id: "", time: "", name: "", yearLevel: "", instructor: "" });
    }
  }, [subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-popover">
      <DialogHeader>
        <DialogTitle>{subject ? "Edit Subject" : "Add Subject"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject ID */}
        <div className="space-y-2">
          <Label htmlFor="id">Subject ID</Label>
          <Input
            id="id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="e.g., CS101"
            required
          />
        </div>

        {/* Subject Time */}
        <div className="space-y-2">
          <Label htmlFor="time">Subject Time</Label>
          <Input
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="e.g., 8:00 AM - 10:00 AM"
            required
          />
        </div>

        {/* Subject Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Intro to Computer Science"
            required
          />
        </div>

        {/* Year Level */}
        <div className="space-y-2">
          <Label htmlFor="yearLevel">Year Level</Label>
          <Select
            value={formData.yearLevel}
            onValueChange={(value) => setFormData({ ...formData, yearLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Year">1st Year</SelectItem>
              <SelectItem value="2nd Year">2nd Year</SelectItem>
              <SelectItem value="3rd Year">3rd Year</SelectItem>
              <SelectItem value="4th Year">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assigned Teacher */}
        <div className="space-y-2">
          <Label htmlFor="instructor">Assigned Teacher</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="e.g., John Doe"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{subject ? "Update" : "Add"}</Button>
        </div>
      </form>
    </DialogContent>
  );
}
