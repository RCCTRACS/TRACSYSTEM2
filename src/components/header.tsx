import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, LogOut, Pencil } from "lucide-react";
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
    <header className="header">
      <div>
        <h1>TRAC System</h1>
        <p>Welcome Gerwin Cando!</p>
      </div>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="profile">
            <Avatar className="avatar">
              <AvatarImage src="/user.png" alt="User Icon" />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <span>Gerwin</span>
            <ChevronDown size={16} />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil size={14} className="mr-2" /> Edit User
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut size={14} className="mr-2" /> Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Department" />
            <input type="text" placeholder="Access" />
            <input type="password" placeholder="Password" />
            <button type="submit">Save Changes</button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default TracHeader;
