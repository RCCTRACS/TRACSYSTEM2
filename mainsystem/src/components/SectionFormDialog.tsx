import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Section {
  id: string;
  section: string;
  type: string;
}

interface SectionFormDialogProps {
  section: Section | null;
  onSave: (section: Partial<Section>) => void;
  onClose: () => void;
}

export function SectionFormDialog({ section, onSave, onClose }: SectionFormDialogProps) {
  const [formData, setFormData] = useState({
    section: "",
    type: "",
  });

  useEffect(() => {
    if (section) {
      setFormData({
        section: section.section,
        type: section.type,
      });
    } else {
      setFormData({
        section: "",
        type: "",
      });
    }
  }, [section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const outlineClass =
    "border-[3px] border-[#3E1F0F] rounded-lg focus:border-[#3E1F0F] focus:ring-1 focus:ring-[#3E1F0F] h-12 px-3";

  return (
    <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-[#fdfaf6] to-[#fff7f0] p-6 rounded-3xl shadow-2xl border border-[#D9B99B]">
      <DialogHeader className="px-0">
        <DialogTitle className="text-xl font-bold text-black">
          {section ? "Edit Section" : "Add Section"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section Name */}
        <div className="space-y-2">
          <Label htmlFor="section" className="font-bold text-black">Section</Label>
          <Input
            id="section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            required
            className={outlineClass}
          />
        </div>

        {/* Type as Textbox */}
        <div className="space-y-2">
          <Label htmlFor="type" className="font-bold text-black">Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
            {section ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
