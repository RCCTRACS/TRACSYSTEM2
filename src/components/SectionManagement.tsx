"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";

import { SectionFormDialog } from "./SectionFormDialog";
import { DeleteSectionDialog } from "./DeleteSectionDialog";
import { ExportSectionDialog } from "./ExportSectionDialog";
import { FilterSectionDialog } from "./FilterSectionDialog";
import { BulkUploadSection } from "./BulkUploadSection";

export interface Section {
  id: string;
  section: string;
  type: string;
}

export function SectionManagement() {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  useEffect(() => {
    setFilteredSections(sections);
  }, [sections]);

  // --- Search ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredSections(sections);
      return;
    }
    const searchFiltered = sections.filter(
      (s) =>
        s.section.toLowerCase().includes(term.toLowerCase()) ||
        s.type.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSections(searchFiltered);
  };

  // --- Add/Edit ---
  const handleSaveSection = (sectionData: Partial<Section>) => {
    if (selectedSection) {
      const updatedSections = sections.map((s) =>
        s.id === selectedSection.id ? { ...s, ...sectionData } : s
      );
      setSections(updatedSections);
    } else {
      const newSection: Section = {
        id: Date.now().toString(),
        section: sectionData.section || "",
        type: sectionData.type || "",
      };
      setSections((prev) => [...prev, newSection]);
    }

    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelectedSection(null);
  };

  const handleEditSection = (section: Section) => {
    setSelectedSection(section);
    setIsEditOpen(true);
  };

  const handleDeleteSection = (section: Section) => {
    setSelectedSection(section);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSection) {
      const remaining = sections.filter((s) => s.id !== selectedSection.id);
      setSections(remaining);
      setIsDeleteOpen(false);
      setSelectedSection(null);
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvHeader = "Section,Type\n"; // only headers
    const blob = new Blob([csvHeader], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "section_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Bulk Upload ---
  const handleBulkUpload = (newSections: Section[]) => {
    setSections((prev) => [...prev, ...newSections]); // append to existing
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Section Management</h2>
        </div>
        <Button
          className={`${outlineDarkBrownBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <FileText className="h-6 w-6 text-black" />
          Records
        </Button>
      </div>

      {/* Search + Buttons */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Section */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                className={outlineDarkBrownBtn}
                onClick={() => setSelectedSection(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <SectionFormDialog
              section={null}
              onSave={handleSaveSection}
              onClose={() => setIsAddOpen(false)}
            />
          </Dialog>

          {/* Download Template */}
          <Button className={outlineDarkBrownBtn} onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>

          {/* Bulk Upload */}
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <BulkUploadSection
              onUpload={handleBulkUpload}
              onClose={() => setIsBulkUploadOpen(false)}
            />
          </Dialog>

          {/* Export */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <ExportSectionDialog
              sections={filteredSections}
              onClose={() => setIsExportOpen(false)}
            />
          </Dialog>

          {/* Filter */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button className={outlineDarkBrownBtn}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <FilterSectionDialog
              sectionTypes={["All", "Regular", "Special", "Elective"]}
              onFilter={(type) => {
                if (type === "All") {
                  setFilteredSections(sections);
                } else {
                  const filtered = sections.filter((s) => s.type === type);
                  setFilteredSections(filtered);
                }
              }}
              onClose={() => setIsFilterOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Sections List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader />
        <CardContent>
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Section</div>
            <div>Type</div>
            <div></div>
          </div>

          {/* Section Rows */}
          <div className="mt-2 space-y-3">
            {filteredSections.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No records found
              </div>
            ) : (
              filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="grid grid-cols-3 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{section.section}</div>
                  <div>{section.type}</div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Section Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SectionFormDialog
          section={selectedSection}
          onSave={handleSaveSection}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedSection(null);
          }}
        />
      </Dialog>

      {/* Delete Section Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DeleteSectionDialog
          sectionName={selectedSection?.section || ""}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedSection(null);
          }}
          onDelete={handleConfirmDelete}
        />
      </Dialog>
    </div>
  );
}
