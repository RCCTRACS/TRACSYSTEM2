import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, User, LogOut, Pencil } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Teacher {
  name: string;
  email: string;
}

interface TracHeaderProps {
  teacher: Teacher | null;
}

const TracHeader = ({ teacher }: TracHeaderProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
    department: "",
    access: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle form submission, e.g., call API to update user
    console.log("Updated user data:", formData);
    setOpenEdit(false);
  };

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-black">TRAC System</h1>
        {teacher && (
          <p className="text-2xl font-bold text-black">Welcome, {teacher.name}!</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Dropdown Menu for Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 bg-white border-4 border-primary px-4 py-2 rounded-full cursor-pointer hover:bg-gray-50 transition">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-400 text-white text-sm">
                  {teacher?.name ? teacher.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{teacher?.name || "User"}</span>
              <ChevronDown size={16} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 mt-2">
            {/* Profile Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex items-center w-full">
                  <User className="w-4 h-4 mr-2" />
                  <span className="flex-grow">Profile</span>
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit User
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Logout */}
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Modal for Edit User */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Access */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Access</label>
                <input
                  type="text"
                  name="access"
                  value={formData.access}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
              >
                Save Changes
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default TracHeader;
