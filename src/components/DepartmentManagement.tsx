import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Download, Filter, Search, Trash2, Edit } from "lucide-react";

interface Department {
  id: number;
  name: string;
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Computer Science" },
    { id: 2, name: "Business Administration" },
  ]);

  const [newDept, setNewDept] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Department
  const handleAdd = () => {
    if (!newDept.trim()) return;
    setDepartments([...departments, { id: Date.now(), name: newDept }]);
    setNewDept("");
  };

  // Edit Department
  const handleEdit = (id: number, newName: string) => {
    setDepartments(departments.map((d) => (d.id === id ? { ...d, name: newName } : d)));
    setEditingId(null);
  };

  // Delete Department
  const handleDelete = (id: number) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

  // Filtered list
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Department Management</h1>

      {/* Controls */}
      <div className="flex items-center space-x-3 mb-6">
        <Input
          placeholder="Search Department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-60"
        />
        <Button><Search className="w-4 h-4 mr-2" />Search</Button>
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
        <Button variant="outline"><Upload className="w-4 h-4 mr-2" />Bulk Upload</Button>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>

      {/* Add Department */}
      <div className="flex space-x-3 mb-6">
        <Input
          placeholder="Enter Department Name"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
        />
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />Add</Button>
      </div>

      {/* Department Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Department Name</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="p-3 border">{dept.id}</td>
                <td className="p-3 border">
                  {editingId === dept.id ? (
                    <Input
                      defaultValue={dept.name}
                      onBlur={(e) => handleEdit(dept.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    dept.name
                  )}
                </td>
                <td className="p-3 border space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(dept.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(dept.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDepartments.length === 0 && (
          <p className="text-center text-gray-500 p-4">No departments found.</p>
        )}
      </div>
    </div>
  );
}
