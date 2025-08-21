import { useState } from "react";
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
  User as UserIcon,
} from "lucide-react";

import { UserFormDialog } from "./UserFormDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ExportDialog } from "./ExportUserDialog";
import { BulkUploadDialog } from "./BulkUploadUser";
import { FilterUserDialog } from "./FilterUserDialog";

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  level?: string;
  access: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // --- Search filter ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const searchFiltered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase()) ||
        u.department.toLowerCase().includes(term.toLowerCase()) ||
        (u.level || "").toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(searchFiltered);
  };

  // --- Add/Edit User ---
  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, ...userData } : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        department: userData.department || "",
        level: userData.level,
        access: userData.access || "",
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers); // immediate display
    }

    setIsAddUserOpen(false);
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      const remaining = users.filter((u) => u.id !== selectedUser.id);
      setUsers(remaining);
      setFilteredUsers(remaining);
      setIsDeleteUserOpen(false);
      setSelectedUser(null);
    }
  };

  // --- Download Template ---
  const handleDownloadTemplate = () => {
    const csvContent = "id,name,email,department,level,access\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "user_template.csv");
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
          <h2 className="text-3xl font-bold text-black">User Management</h2>
        </div>
        <Button
          className={`${outlineDarkBrownBtn} flex items-center gap-2 rounded-full px-4 py-2`}
        >
          <UserIcon className="h-6 w-6 text-black" />
          Admin
        </Button>
      </div>

      {/* Search + Buttons */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 w-64 ${outlineDarkBrownBtn}`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Add User */}
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button
                className={outlineDarkBrownBtn}
                onClick={() => setSelectedUser(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <UserFormDialog
              key={Date.now()}
              user={null}
              onSave={handleSaveUser}
              onClose={() => setIsAddUserOpen(false)}
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
                Bulk Upload Users
              </Button>
            </DialogTrigger>
            <BulkUploadDialog
              onUpload={(newUsers) => {
                const updatedUsers = [...users, ...newUsers];
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
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
            <ExportDialog
              users={filteredUsers}
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

            <FilterUserDialog
              onFilter={(department) => {
                if (department === "All") {
                  setFilteredUsers(users);
                } else {
                  const filtered = users.filter((u) => u.department === department);
                  setFilteredUsers(filtered);
                }
              }}
              onClose={() => setIsFilterOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Users List */}
      <Card className="border-2 border-[#5C4033] rounded-lg shadow-sm">
        <CardHeader />
        <CardContent>
          {/* Header Row */}
          <div className="grid grid-cols-5 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Name</div>
            <div>Email</div>
            <div>Department / Level</div>
            <div>Access</div>
            <div></div>
          </div>

          {/* User Rows */}
          <div className="mt-2 space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-5 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">{user.name}</div>
                  <div>{user.email}</div>
                  <div>
                    {user.department === "Teacher" && user.level
                      ? user.level
                      : user.department}
                  </div>
                  <div>{user.access}</div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
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

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <UserFormDialog
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setIsEditUserOpen(false);
            setSelectedUser(null);
          }}
        />
      </Dialog>

      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteUserOpen}
        onClose={() => {
          setIsDeleteUserOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name || ""}
      />
    </div>
  );
}
