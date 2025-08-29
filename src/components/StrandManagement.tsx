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

import { StrandFormDialog } from "./StrandFormDialog";
import { DeleteStrandDialog } from "./DeleteStrandDialog";
import { ExportStrandDialog } from "./ExportStrandDialog";
import { BulkUploadStrand } from "./BulkUploadStrand";
import { FilterStrandDialog } from "./FilterStrandDialog";

export interface Strand {
  id: string;
  strand: string;
  type: string;
}

export function StrandManagement() {
  const [strands, setStrands] = useState<Strand[]>([]);
  const [filteredStrands, setFilteredStrands] = useState<Strand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStrand, setSelectedStrand] = useState<Strand | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // keep filteredStrands in sync with strands
  useEffect(() => {
    setFilteredStrands(strands);
  }, [strands]);

  // --- Search ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredStrands(strands);
      return;
    }
    const searchFiltered = strands.filter(
      (s) =>
        s.strand.toLowerCase().includes(term.toLowerCase()) ||
        s.type.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStrands(searchFiltered);
  };

  // --- Add/Edit ---
  const handleSaveStrand = (strandData: Partial<Strand>) => {
    if (selectedStrand) {
      // update
      const updatedStrands = strands.map((s) =>
        s.id === selectedStrand.id ? { ...s, ...strandData } : s
      );
      setStrands(updatedStrands);
    } else {
      // add
      const newStrand: Strand = {
        id: Date.now().toString(),
        strand: strandData.strand || "",
        type: strandData.type || "",
      };
      setStrands((prev) => [...prev, newStrand]);
    }

    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelectedStrand(null);
  };

  const handleEditStrand = (strand: Strand) => {
    setSelectedStrand(strand);
    setIsEditOpen(true);
  };

  const handleDeleteStrand = (strand: Strand) => {
    setSelectedStrand(strand);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStrand) {
      const remaining = strands.filter((s) => s.id !== selectedStrand.id);
      setStrands(remaining);
      setIsDeleteOpen(false);
      setSelectedStrand(null);
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvContent = "id,strand,type\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "strand_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">Strand Management</h2>
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
            placeholder="Search strands..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add Strand */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                className={outlineDarkBrownBtn}
                onClick={() => setSelectedStrand(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <StrandFormDialog
              strand={null}
              onSave={handleSaveStrand}
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
            <BulkUploadStrand
              onUpload={(newStrands) => {
                setStrands((prev) => [...prev, ...newStrands]);
              }}
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
            <ExportStrandDialog
              strands={filteredStrands}
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
            <FilterStrandDialog
              strandTypes={["All", "Academic", "Technical-Vocational", "Sports", "Arts & Design"]}
              onFilter={(type) => {
                if (type === "All") {
                  setFilteredStrands(strands);
                } else {
                  const filtered = strands.filter((s) => s.type === type);
                  setFilteredStrands(filtered);
                }
              }}
              onClose={() => setIsFilterOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Strands List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader />
        <CardContent>
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Strand</div>
            <div>Type</div>
            <div></div>
          </div>

          {/* Strand Rows */}
          <div className="mt-2 space-y-3">
            {filteredStrands.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No records found
              </div>
            ) : (
              filteredStrands.map((strand) => (
                <div
                  key={strand.id}
                  className="grid grid-cols-3 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{strand.strand}</div>
                  <div>{strand.type}</div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStrand(strand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStrand(strand)}
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

      {/* Edit Strand Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <StrandFormDialog
          strand={selectedStrand}
          onSave={handleSaveStrand}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedStrand(null);
          }}
        />
      </Dialog>

      {/* Delete Strand Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DeleteStrandDialog
          strandName={selectedStrand?.strand || ""}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedStrand(null);
          }}
          onDelete={handleConfirmDelete}
        />
      </Dialog>
    </div>
  );
}
