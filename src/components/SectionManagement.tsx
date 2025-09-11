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
} from "lucide-react";

import { SectionFormDialog } from "./SectionFormDialog";
import { DeleteSectionDialog } from "./DeleteSectionDialog";
import { ExportSectionDialog } from "./ExportSectionDialog";
import { FilterSectionDialog } from "./FilterSectionDialog";
import { BulkUploadSection } from "./BulkUploadSection";
import { useNotifier } from "@/components/ToastNotifier";

export interface Section {
  id: string;
  section: string; // e.g., "7 - Apple"
  type: string;
}

const API_URL =
  "http://192.168.0.136/capstone/mainsystem/backend/section_api.php";

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

  // Profile dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    console.log("User logged out");
    // ✅ Add your logout logic here
  };

  const notifier = useNotifier("Section");

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // --- Fetch Sections ---
  const fetchSections = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSections(data);
      setFilteredSections(data);
    } catch (err) {
      notifier.error("Failed to fetch sections");
      console.error("Failed to fetch sections:", err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

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

  // --- Save (Add/Edit) ---
  const handleSaveSection = async (sectionData: Partial<Section>) => {
    try {
      if (selectedSection) {
        await fetch(`${API_URL}?id=${selectedSection.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionData),
        });
        notifier.updated();
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionData),
        });
        notifier.added();
      }
      await fetchSections();
    } catch (err) {
      notifier.error("Failed to save section");
      console.error("Failed to save section:", err);
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

  const handleConfirmDelete = async () => {
    if (selectedSection) {
      try {
        await fetch(`${API_URL}?id=${selectedSection.id}`, {
          method: "DELETE",
        });
        notifier.deleted();
        await fetchSections();
      } catch (err) {
        notifier.error("Failed to delete section");
        console.error("Failed to delete section:", err);
      }
      setIsDeleteOpen(false);
      setSelectedSection(null);
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvHeader = "Section,Type\n";
    const blob = new Blob([csvHeader], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "section_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifier.exported();
  };

  // --- Bulk Upload ---
  const handleBulkUpload = async (newSections: Section[]) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulk: newSections }),
      });
      notifier.bulkUploaded();
      await fetchSections();
    } catch (err) {
      notifier.error("Bulk upload failed");
      console.error("Bulk upload failed:", err);
    }
  };

  // --- Filter ---
  const handleFilter = (grade: string) => {
    if (grade === "All") {
      setFilteredSections(sections);
    } else {
      const gradeNumber = grade.replace("Grade ", "");
      const filtered = sections.filter((s) =>
        s.section.startsWith(gradeNumber + " ")
      );
      setFilteredSections(filtered);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Section Management</h2>
        </div>

        {/* Profile chip with dropdown */}
        <div className="relative">
          <div
            className="flex items-center bg-[#f3f3f3] px-3 py-2 rounded-full border-2 border-[#5C4033] cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src="/user.png" alt="Profile" className="w-7 h-7 mr-2" />
            <span className="text-black text-sm font-medium">Gerwin</span>
            <span className="ml-2 text-xs">▼</span>
          </div>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border-2 border-[#5C4033] rounded-md shadow-md w-40 z-10">
              <div className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]">
                Edit Profile
              </div>
              <div
                className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search + Actions */}
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
              sections={sections.map((s) => s.section)}
              onFilter={handleFilter}
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

          {/* Rows */}
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
