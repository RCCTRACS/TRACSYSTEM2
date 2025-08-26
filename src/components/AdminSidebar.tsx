"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  src: string;
  label: string;
  url: string;
}

const AdminSidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { src: "/Dashboard.png", label: "Dashboard", url: "/dashboards" },
    { src: "/user.png", label: "User Management", url: "/" },
    { src: "/subject.png", label: "Subject Management", url: "/subjects" },
    { src: "/department.png", label: "Department Management", url: "/departments" },
    { src: "/attendance.png", label: "Attendance Management", url: "/attendances" },
    { src: "/student.png", label: "Student Management", url: "/students" },
    { src: "/grade.png", label: "Grade Management", url: "/grades" },
    { src: "/section.png", label: "Section Management", url: "/sections" },
    { src: "/strand.png", label: "Strand Management", url: "/strands" },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const [shouldPlayIntro, setShouldPlayIntro] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem("sidebarHasAnimated");
    if (!seen) {
      setShouldPlayIntro(true);
      sessionStorage.setItem("sidebarHasAnimated", "1");
    }
  }, []);

  const handleNavigate = (url: string) => {
    navigate(url);
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="h-screen flex">
      {/* Sidebar wrapper */}
      <motion.div
        initial={shouldPlayIntro ? { x: -100, opacity: 0 } : false}
        animate={shouldPlayIntro ? { x: 0, opacity: 1 } : false}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-20 bg-sidebar h-screen flex flex-col items-center py-6 rounded-2xl shadow-lg ml-4 overflow-visible"
      >
        {/* Logo */}
        <motion.div
          initial={shouldPlayIntro ? { scale: 0, opacity: 0 } : undefined}
          animate={shouldPlayIntro ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mb-8"
        >
          <img
            src="/logo.png"
            alt="TRACS Logo"
            className="w-16 h-16 object-contain drop-shadow-md"
          />
        </motion.div>

        {/* Menu */}
        <nav className="flex flex-col space-y-6 relative">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.url;

            return (
              <motion.div
                key={item.url}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={shouldPlayIntro ? { opacity: 0, x: -30 } : undefined}
                animate={
                  shouldPlayIntro
                    ? {
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: 0.4 + index * 0.12,
                          type: "spring",
                          stiffness: 150,
                          damping: 18,
                        },
                      }
                    : undefined
                }
              >
                {/* Icon button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(item.url)}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                    isActive
                      ? "bg-white border-2 border-sidebar shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title={item.label}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-7 h-7 object-contain"
                  />
                </motion.button>

                {/* Label Tooltip */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute left-full ml-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-lg text-black font-medium whitespace-nowrap z-50"
                      style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                        maxHeight: "calc(100vh - 40px)",
                        overflowY: "auto",
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </nav>
      </motion.div>
    </div>
  );
};

export default AdminSidebar;
