import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 px-6 py-6 bg-admin-content">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
