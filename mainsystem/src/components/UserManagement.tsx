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
  Trash2
} from "lucide-react";

import { UserFormDialog } from "./UserFormDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ExportDialog } from "./ExportUserDialog";
import { BulkUploadDialog } from "./BulkUploadUser";
import { FilterUserDialog } from "./FilterUserDialog";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  role: "Admin" | "Teacher";
  status: "Active" | "Inactive";
  password?: string; // only for template & bulk upload
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const API_URL =
    "http://192.168.1.13/capstone/mainsystem/backend/users_api.php";

  const outlineDarkBrownBtn =
    "bg-white text-black border-2 border-[#5C4033] rounded-md hover:bg-[#5C4033] hover:text-white";

  // Fetch users
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const list: User[] = data?.users ?? (Array.isArray(data) ? data : []);
        setUsers(list);
        setFilteredUsers(list);
        const userId = localStorage.getItem("authUserId");
        if (userId) {
          const user = list.find((u) => u.id === userId);
          setCurrentUser(user ?? null);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const t = term.toLowerCase();
    const searchFiltered = users.filter(
      (u) =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t) ||
        (u.department ?? "").toLowerCase().includes(t) ||
        u.role.toLowerCase().includes(t) ||
        u.status.toLowerCase().includes(t)
    );
    setFilteredUsers(searchFiltered);
  };

  // Add/Edit
  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Update
      fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id, ...userData })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            const updated = users.map((u) =>
              u.id === selectedUser.id ? { ...u, ...res.user } : u
            );
            setUsers(updated);
            setFilteredUsers(updated);
          } else {
            alert(res.message || "Failed to update user.");
          }
        })
        .catch((err) => console.error("Error updating user:", err));
    } else {
      // Create
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.user) {
            const updated = [...users, res.user as User];
            setUsers(updated);
            setFilteredUsers(updated);
          } else {
            alert(res.message || "Failed to add user.");
          }
        })
        .catch((err) => console.error("Error adding user:", err));
    }

    setIsAddUserOpen(false);
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  // Edit
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  // Delete
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    fetch(`${API_URL}?id=${selectedUser.id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const remaining = users.filter((u) => u.id !== selectedUser.id);
          setUsers(remaining);
          setFilteredUsers(remaining);
          setIsDeleteUserOpen(false);
          setSelectedUser(null);
        } else {
          alert(res.message || "Failed to delete user.");
        }
      })
      .catch((err) => console.error("Error deleting user:", err));
  };

  // Download template
  const handleDownloadTemplate = () => {
    const csvContent =
      "first_name,last_name,email,password,department,role,status\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "user_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem("sidebarHasAnimated");
    setDropdownOpen(false);
    window.location.href = "/";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-black">RCC TRACS</p>
          <h2 className="text-3xl font-bold text-black">User Management</h2>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <div
            className="flex items-center bg-[#f3f3f3] px-3 py-2 rounded-full border-2 border-[#5C4033] cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <img src="/user.png" alt="Profile" className="w-7 h-7 mr-2" />
            <span className="text-black text-sm font-medium">
              {currentUser ? `${currentUser.first_name}` : "User"}
            </span>
            <span className="ml-2 text-xs">▼</span>
          </div>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border-2 border-[#5C4033] rounded-md shadow-md w-40 z-10">
              <div
                className="px-4 py-2 cursor-pointer hover:bg-[#f9eacb]"
                onClick={() => {
                  setIsProfileOpen(true);
                  setDropdownOpen(false);
                }}
              >
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

          {/* Edit Profile Modal */}
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <UserFormDialog
              user={currentUser}
              onSave={(data) => {
                setIsProfileOpen(false);
              }}
              onClose={() => setIsProfileOpen(false)}
              isProfile
            />
          </Dialog>
        </div>
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
                  const filtered = users.filter(
                    (u) => (u.department ?? "") === department
                  );
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
          <div className="grid grid-cols-6 gap-x-6 bg-white px-4 py-3 font-bold border-b rounded-t-lg text-center">
            <div>Name</div>
            <div>Email</div>
            <div>Department</div>
            <div>Role</div>
            <div>Status</div>
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
                  className="grid grid-cols-6 gap-x-6 items-center text-center bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-xl shadow-sm"
                >
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div>{user.email}</div>
                  <div>{user.department}</div>
                  <div>{user.role}</div>
                  <div>{user.status}</div>
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
        userName={
          selectedUser
            ? `${selectedUser.first_name} ${selectedUser.last_name}`
            : ""
        }
      />
    </div>
  );
}
