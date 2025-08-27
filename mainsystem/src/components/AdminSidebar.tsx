"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  src: string;
  label: string;
  url: string;
}

// Sidebar slide-in
const sidebarVariants = {
  hidden: { opacity: 0, x: -120 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      duration: 0.6,
      when: "beforeChildren", // ✅ children animate after sidebar
      staggerChildren: 0.15,  // ✅ cascade effect
      delayChildren: 0.2,     // ✅ delay before first child animates
    },
  },
};

// Icon + logo animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const AdminSidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { src: "/Dashboard.png", label: "Dashboard", url: "/dashboard" },
    { src: "/user.png", label: "User Management", url: "/usermanagement" },
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

  // animate only once per login
  const [shouldAnimate] = useState<boolean>(() => {
    try {
      return !Boolean(sessionStorage.getItem("sidebarHasAnimated"));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (shouldAnimate) {
      try {
        sessionStorage.setItem("sidebarHasAnimated", "1");
      } catch {
        /* ignore */
      }
    }
  }, [shouldAnimate]);

  return (
    <div className="h-screen flex">
      {/* Sidebar with slide-in + cascading children */}
      <motion.div
        className="relative w-24 bg-sidebar h-screen flex flex-col items-center py-6 rounded-r-2xl shadow-lg"
        variants={sidebarVariants}
        initial={shouldAnimate ? "hidden" : false} // ✅ fixed
        animate="show"
      >
        <div className="flex flex-col items-center w-full">
          {/* Logo */}
          <motion.div className="mb-8" variants={itemVariants}>
            <img
              src="/logo.png"
              alt="TRACS Logo"
              className="w-16 h-16 object-contain drop-shadow-md"
            />
          </motion.div>

          {/* Menu items */}
          <nav className="flex flex-col space-y-4 w-full">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <motion.div
                  key={item.url}
                  className="relative group flex justify-center"
                  variants={itemVariants}
                >
                  <button
                    onClick={() => navigate(item.url)}
                    className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-200
                      ${
                        isActive
                          ? "bg-white border-[#5B3A29] text-[#5B3A29] shadow-md"
                          : "bg-white border-[#5B3A29] text-[#5B3A29] hover:bg-[#f3f0ed]"
                      }`}
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      className={`w-7 h-7 object-contain ${
                        isActive ? "brightness-125" : ""
                      }`}
                    />
                  </button>

                  {/* Floating Label */}
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 
                      border border-[#5B3A29] text-black text-lg font-bold px-3 py-1 
                      rounded-md shadow-md whitespace-nowrap transition-opacity duration-200 bg-white 
                      opacity-0 group-hover:opacity-100 z-50"
                  >
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSidebar;
