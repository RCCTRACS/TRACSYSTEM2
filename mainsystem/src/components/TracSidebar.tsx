"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  src: string;
  label: string;
  url: string;
}

// Sidebar slide-in
const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -120 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      when: "beforeChildren",
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

// Menu item animation
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
  },
};

const TracSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const menuItems: MenuItem[] = [
    { src: "/Dashboard.png", label: "Teacher Dashboard", url: "/teacher-dashboard" },
    // { src: "/attendance.png", label: "Attendance Management", url: "/teacher-attendance" },
    // { src: "/student.png", label: "Student Management", url: "/teacher-students" },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const [shouldAnimate] = useState<boolean>(() => {
    try {
      return !Boolean(sessionStorage.getItem("tracSidebarHasAnimated"));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (shouldAnimate) {
      try {
        sessionStorage.setItem("tracSidebarHasAnimated", "1");
      } catch {
        /* ignore */
      }
    }
  }, [shouldAnimate]);

  return (
    <div className="flex">
      {/* Sidebar container */}
      <motion.div
        className="fixed left-0 top-0 w-24 bg-sidebar flex flex-col items-center py-6 rounded-r-2xl shadow-lg min-h-screen z-50"
        variants={sidebarVariants}
        initial={shouldAnimate ? "hidden" : false}
        animate="show"
      >
        {/* Logo Animation */}
        <AnimatePresence>
          {shouldAnimate ? (
            <motion.div
              initial={{
                position: "fixed",
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                scale: 1.2,
                opacity: 1,
              }}
              animate={{
                position: "relative",
                top: 0,
                left: 0,
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
              className="mb-8"
            >
              <img
                src="/logo.png"
                alt="TRACS Logo"
                className="w-16 h-16 object-contain drop-shadow-md"
              />
            </motion.div>
          ) : (
            <div className="mb-8">
              <img
                src="/logo.png"
                alt="TRACS Logo"
                className="w-16 h-16 object-contain drop-shadow-md"
              />
            </div>
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-4 w-full flex-1 justify-start">
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
                    opacity-0 group-hover:opacity-100 z-[60]"
                >
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </nav>
      </motion.div>

      {/* Push content right */}
      <main className="ml-24 flex-1">{children}</main>
    </div>
  );
};

export default TracSidebar;
