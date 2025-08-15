"use client";

import { useState, useCallback } from "react";
import { Filter, X } from "lucide-react";
import SidebarFilter from "./SidebarFilter";

export default function MobileFilterToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
    document.body.style.overflow = !isOpen ? "hidden" : "";
  }, [isOpen]);

  // close sidebar on ESC key
  /*
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, toggleSidebar]);
  */

  return (
    <>
      {/* Mobile Filter Button - Only visible on mobile */}
      <div className="md:hidden mb-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-between w-full py-2 px-4 bg-[#0e3a8a] text-white rounded-md"
        >
          <span className="flex items-center">
            <Filter size={16} className="mr-2" />
            Filters
          </span>
        </button>
      </div>

      {/* Mobile sidebar overlay with Tailwind classes */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30" onClick={toggleSidebar} />

        {/* Sidebar Content */}
        <div className="absolute right-0 top-0 h-full w-full max-w-full bg-white overflow-y-auto pt-14 pb-16">
          {/* Header */}
          <div className="fixed top-0 left-0 w-full z-[51] bg-white border-b p-4 flex items-center justify-end">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="pt-2">
            <SidebarFilter />
          </div>
        </div>
      </div>
    </>
  );
}
