import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TracHeader = () => {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center">
  <div>
  <h1 className="text-xl font-semibold text-black">TRAC System</h1>
  <p className="text-2xl font-bold text-black">Welcome Gerwin Sando!</p>
</div>

      <div className="flex items-center space-x-4">
        {/* Dropdown Menu for Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 bg-white border-4 border-primary px-4 py-2 rounded-full cursor-pointer hover:bg-gray-50 transition">
              <Avatar className="w-8 h-8">
  <AvatarImage src="/user.png" alt="User Icon" />
</Avatar>
              <span className="text-sm font-medium">Gerwin</span>
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
    <form className="space-y-4 mt-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      {/* Access */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Access</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="mt-1 block w-full rounded-md border-2 border-brown-500 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          defaultValue=""
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
