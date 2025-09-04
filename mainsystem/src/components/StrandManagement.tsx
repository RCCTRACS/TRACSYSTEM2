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
import { BulkUploadStrand } from "./BulkUploadStrand";
import { FilterStrandDialog } from "./FilterStrandDialog";
import { ExportStrandDialog } from "./ExportStrandDialog";

// ✅ Toast import
import { useToast } from "@/components/ui/use-toast";

export interface Strand {
  id: string;
  strand: string;
  type: string; // always "Academic"
}

const API_URL = "http://192.168.0.122/capstone/mainsystem/backend/strand_api.php";

export function StrandManagement() {
  const [strands, setStrands] = useState<Strand[]>([]);
  const [filteredStrands, setFilteredStrands] = useState<Strand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStrand, setSelectedStrand] = useState<Strand | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { toast } = useToast();

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // Load strands from API
  const loadStrands = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStrands(data);
      setFilteredStrands(data);
    } catch (err) {
      console.error("Error loading strands:", err);
      toast({
        title: "Error",
        description: "Failed to load strands.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadStrands();
  }, []);

  // --- Search ---
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(term)}`);
      const data = await res.json();
      setFilteredStrands(data);
    } catch (err) {
      console.error("Search error:", err);
      toast({
        title: "Error",
        description: "Search failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  // --- Add/Edit ---
  const handleSaveStrand = async (strandData: Partial<Strand>) => {
    try {
      if (selectedStrand) {
        // Update
        await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedStrand.id,
            strand: strandData.strand,
            type: "Academic",
          }),
        });
        toast({ title: "Updated", description: "Strand updated successfully!" });
      } else {
        // Add
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...strandData, type: "Academic" }),
        });
        toast({ title: "Added", description: "Strand added successfully!" });
      }

      await loadStrands();
      setIsAddOpen(false);
      setIsEditOpen(false);
      setSelectedStrand(null);
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Error",
        description: "Failed to save strand.",
        variant: "destructive",
      });
    }
  };

  const handleEditStrand = (strand: Strand) => {
    setSelectedStrand(strand);
    setIsEditOpen(true);
  };

  // --- Delete ---
  const handleDeleteStrand = (strand: Strand) => {
    setSelectedStrand(strand);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStrand) return;

    try {
      await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedStrand.id }),
      });
      await loadStrands();
      setIsDeleteOpen(false);
      setSelectedStrand(null);
      toast({ title: "Deleted", description: "Strand deleted successfully!" });
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description: "Failed to delete strand.",
        variant: "destructive",
      });
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvContent = "strand,type\nSample Strand,Academic\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "strand_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Downloaded", description: "Template downloaded successfully." });
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
          <Button
            className={outlineDarkBrownBtn}
            onClick={handleDownloadTemplate}
          >
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
              onUpload={async (newStrands) => {
                const cleaned = newStrands.map((s) => ({
                  ...s,
                  type: "Academic",
                }));

                try {
                  const res = await fetch(`${API_URL}?bulk=1`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cleaned),
                  });

                  const result = await res.json();

                  if (result.success) {
                    toast({
                      title: "Bulk Upload Complete",
                      description: `Uploaded ${result.inserted} strands (${result.skipped} skipped)`,
                    });
                    await loadStrands();
                  } else {
                    toast({
                      title: "Bulk Upload Failed",
                      description: result.error || "Some records could not be uploaded.",
                      variant: "destructive",
                    });
                  }
                } catch (err) {
                  console.error("Bulk upload error:", err);
                  toast({
                    title: "Error",
                    description: "Network error while uploading.",
                    variant: "destructive",
                  });
                }
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
              onFilter={async (strand) => {
                const url =
                  strand === "All"
                    ? API_URL
                    : `${API_URL}?filterStrand=${encodeURIComponent(strand)}`;
                const res = await fetch(url);
                const data = await res.json();
                setFilteredStrands(data);
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
          <div className="grid grid-cols-3 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Strand</div>
            <div>Type</div>
            <div></div>
          </div>

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
                  <div>Academic</div>
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
