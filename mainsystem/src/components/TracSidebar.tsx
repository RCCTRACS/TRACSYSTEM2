interface TracSidebarProps {
  onDashboardClick?: () => void;
}

const TracSidebar = ({ onDashboardClick }: TracSidebarProps) => {
  const menuItems = [
    { src: "/Dashboard.png", label: "Teacher Dashboard", onClick: onDashboardClick },
    { src: "/attendance.png", label: "Attendance Management" },
    { src: "/students.png", label: "Student Management" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-4">
      <div className="relative w-16 bg-trac-sidebar min-h-screen flex flex-col items-center py-4 rounded-xl shadow-md ml-4">
        
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
                className="w-12 h-12 bg-white text-trac-sidebar hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                title={item.label}
              >
                <img src={item.src} alt={item.label} className="w-8 h-8 object-contain" />
              </button>
              <div className="absolute left-14 bg-white px-3 py-1 rounded-md shadow-md border-2 border-trac-sidebar text-trac-sidebar text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TracSidebar;
