import { Brain } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { src: "/user.png", title: "User Management", url: "/" },
  { src: "/subject.png", title: "Subject Management", url: "/subjects" },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="bg-sidebar border-r border-border flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-6">
        <Brain className="h-8 w-8 text-primary" />
      </div>

      {/* Menu Icons */}
      <SidebarContent className="flex flex-col space-y-6">
        {navigationItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.url}
            end
            className={({ isActive }) =>
              `relative group flex items-center justify-center w-12 h-12 rounded-sm transition-colors 
              ${isActive ? "bg-primary text-primary-foreground" : "bg-white hover:bg-gray-200"}`
            }
          >
            <img src={item.src} alt={item.title} className="w-8 h-8 object-contain" />

            {/* Tooltip */}
            {!collapsed && (
              <div className="absolute left-14 bg-white px-3 py-1 rounded-sm shadow-md border-2 border-sidebar text-sidebar text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.title}
              </div>
            )}
          </NavLink>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
