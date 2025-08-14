interface TracSidebarProps {
  onDashboardClick?: () => void;
}

const Sidebar = ({ onDashboardClick }: TracSidebarProps) => {
  const menuItems = [
    { src: "/Dashboard.png", label: "Dashboard", onClick: onDashboardClick },
    { src: "/user.png", label: "User Management" },
    { src: "/attendance.png", label: "Attendance Management" },
    { src: "/students.png", label: "Student Management" },
    { src: "/department.png", label: "Department Management" },
    { src: "/grade.png", label: "Grade Management" },
    { src: "/section.png", label: "Section Management" },
    { src: "/strand.png", label: "Strand Management" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-4">
      <div className="relative w-16 bg-sidebar min-h-screen flex flex-col items-center py-4 rounded-xl shadow-md ml-4">
        
        {/* Logo */}
        <div className="mb-6">
          <img src="/logo.png" alt="TRACS Logo" className="w-12 h-12 object-contain" />
        </div>

        {/* Menu Icons */}
        <nav className="flex flex-col space-y-6 relative">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group flex items-center">
              <button
                onClick={item.onClick}
                className="w-12 h-12 bg-white rounded-lg flex items-center justify-center transition-colors hover:bg-gray-200"
                title={item.label}
              >
                <img src={item.src} alt={item.label} className="w-8 h-8 object-contain" />
              </button>
              <div className="absolute left-14 bg-white px-3 py-1 rounded-md shadow-md border-2 border-sidebar text-sidebar text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
