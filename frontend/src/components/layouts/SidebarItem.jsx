import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  isOpenSidebar,
  subItems = [],
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const hasSubItems = subItems.length > 0;

  return (
    <div className="mb-2 px-3 relative group/main">
      {/* Main Parent Item */}
      <button
        onClick={() => (hasSubItems ? setIsExpanded(!isExpanded) : onClick?.())}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-500 relative z-30
          ${
            active
              ? "bg-slate-900 text-white shadow-xl dark:bg-blue-600"
              : "text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon
              size={20}
              className={`transition-transform duration-500 ${hoveredIndex !== null ? "scale-110 rotate-[10deg]" : ""}`}
            />
            {/* Pulsing light behind icon when sub-item is hovered */}
            <div
              className={`absolute inset-0 bg-blue-500/20 blur-xl rounded-full transition-opacity duration-500 ${hoveredIndex !== null ? "opacity-100" : "opacity-0"}`}
            />
          </div>
          {isOpenSidebar && (
            <span className="text-sm font-bold tracking-tight">{label}</span>
          )}
        </div>
        {hasSubItems && isOpenSidebar && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-500 ${isExpanded ? "rotate-180 text-blue-500" : ""}`}
          />
        )}
      </button>

      {/* Sub-Items Container */}
      {hasSubItems && isExpanded && isOpenSidebar && (
        <div className="relative ml-6 mt-1 flex flex-col pb-2">
          {/* THE VERTICAL RAIL */}
          <div className="absolute left-0 top-0 bottom-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* THE MAGNETIC PULSE INDICATOR */}
          <div
            className="absolute left-[-1.5px] w-[4px] bg-blue-600 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full z-20 shadow-[0_0_12px_rgba(37,99,235,0.8)]"
            style={{
              height: hoveredIndex !== null ? "24px" : "0px",
              transform: `translateY(${hoveredIndex * 40 + 8}px)`,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {subItems.map((sub, index) => (
            <Link
              key={sub.id || index}
              to={sub.path}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex items-center h-10 pl-6 group/item"
            >
              {/* THE HORIZONTAL BRIDGE (Appears on Hover) */}
              <div
                className={`absolute left-0 top-1/2 h-[1px] bg-blue-600 transition-all duration-500 origin-left
                ${hoveredIndex === index ? "w-4 opacity-100" : "w-0 opacity-0"}`}
              />

              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
                ${
                  hoveredIndex === index
                    ? "text-blue-600 translate-x-3"
                    : "text-slate-400 group-hover/item:text-slate-600 dark:group-hover/item:text-slate-300"
                }`}
              >
                {sub.label}
              </span>

              {/* Background Highlight effect */}
              <div
                className={`absolute inset-0 left-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 transition-opacity duration-300 -z-10
                ${hoveredIndex === index ? "opacity-100" : "opacity-0"}`}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
