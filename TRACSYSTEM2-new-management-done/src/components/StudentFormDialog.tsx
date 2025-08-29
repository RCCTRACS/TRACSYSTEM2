import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  barcodeId: string;
  name: string;
  yearLevel: string;
  department: string;
  parentEmail: string;
}

interface StudentFormDialogProps {
  student: Student | null;
  onSave: (student: Student) => void;
  onClose: () => void;
}

export function StudentFormDialog({
  student,
  onSave,
  onClose,
}: StudentFormDialogProps) {
  const [formState, setFormState] = useState<Student>({
    id: "",
    barcodeId: "",
    name: "",
    yearLevel: "",
    department: "",
    parentEmail: "",
  });

  useEffect(() => {
    if (student) {
      setFormState(student);
    } else {
      setFormState({
        id: "",
        barcodeId: "",
        name: "",
        yearLevel: "",
        department: "",
        parentEmail: "",
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const outlineClass =
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-popover p-6">
      <DialogHeader className="px-0">
        <DialogTitle className="text-xl font-bold text-black">
          {student ? "Edit Student" : "Add Student"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Barcode ID */}
        <div className="space-y-2">
          <Label htmlFor="barcodeId" className="font-bold text-black">
            Barcode ID
          </Label>
          <Input
            id="barcodeId"
            name="barcodeId"
            value={formState.barcodeId}
            onChange={handleChange}
            required
            className={outlineClass}
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-bold text-black">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className={outlineClass}
          />
        </div>

        {/* Year Level */}
        <div className="space-y-2">
          <Label htmlFor="yearLevel" className="font-bold text-black">
            Year Level
          </Label>
          <Select
            value={formState.yearLevel}
            onValueChange={(value) => setFormState({ ...formState, yearLevel: value })}
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select year level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Year">1st Year</SelectItem>
              <SelectItem value="2nd Year">2nd Year</SelectItem>
              <SelectItem value="3rd Year">3rd Year</SelectItem>
              <SelectItem value="4th Year">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department" className="font-bold text-black">
            Department
          </Label>
          <Select
            value={formState.department}
            onValueChange={(value) => setFormState({ ...formState, department: value })}
          >
            <SelectTrigger className={outlineClass}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ITS">ITS</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parent Email */}
        <div className="space-y-2">
          <Label htmlFor="parentEmail" className="font-bold text-black">
            Parent Email
          </Label>
          <Input
            id="parentEmail"
            name="parentEmail"
            type="email"
            value={formState.parentEmail}
            onChange={handleChange}
            required
            className={outlineClass}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#5C3A21] text-[#5C3A21] bg-white hover:bg-[#5C3A21] hover:text-white transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-[#5C3A21] text-white hover:bg-[#3E1F0F] transition-all duration-200"
          >
            {student ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
