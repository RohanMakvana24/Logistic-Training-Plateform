import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MasterLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("overview");

  // Sync Dark Mode with the HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* SIDEBAR: Controls the navigation and houses the Logo */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />

      {/* CONTENT AREA: Wraps the Navbar and the Outlet */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />

        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MasterLayout;
