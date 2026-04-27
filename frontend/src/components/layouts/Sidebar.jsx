import React from "react";
import {
  Settings,
  LifeBuoy,
  Code2,
  LayoutDashboard,
  User2Icon,
  User,
  ArchiveRestore,
  WorkflowIcon,
  LoaderPinwheel,
  ArrowRightIcon,
  Flame,
  BellDot,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, setIsOpen, activeItem, onItemClick }) => {
  const user = useSelector((state) => state.auth.user);

  const AdminMenu = [
    {
      id: "users-group",
      label: "Users",
      icon: User,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/users" },
        { id: "add", label: "Add New", path: "/admin/users/add" },
      ],
    },
    {
      id: "languages-group",
      label: "Languages",
      icon: Code2,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/users" },
        { id: "add", label: "Add New", path: "/admin/users/add" },
      ],
    },
    {
      id: "levels-group",
      label: "Levels",
      icon: ArchiveRestore,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/users" },
        { id: "add", label: "Add New", path: "/admin/users/add" },
      ],
    },
    {
      id: "tasks-group",
      label: "Tasks",
      icon: WorkflowIcon,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/users" },
        { id: "add", label: "Add New", path: "/admin/users/add" },
      ],
    },
    {
      id: "progress-group",
      label: "Users Progress",
      icon: LoaderPinwheel,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/users" },
        { id: "add", label: "Add New", path: "/admin/users/add" },
      ],
    },
    {
      id: "submissions-group",
      label: "Submissions",
      icon: Flame,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/users" },
        { id: "add", label: "Add New", path: "/admin/users/add" },
      ],
    },
    {
      id: "notifications-group",
      label: "Notifications",
      icon: BellDot,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/users" },
        { id: "add", label: "Add New", path: "/admin/users/add" },
      ],
    },
  ];

  const UserMenu = [
    {
      id: "language",
      label: "Languages",
      icon: Code2,
      subItems: [
        { id: "overview", label: "Overview", path: "/admin/languages" },
        { id: "add", label: "Add New", path: "/admin/languages/add" },
      ],
    },
  ];

  return (
    <aside
      className={`
      bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
      transition-all duration-300 ease-in-out flex-shrink-0 z-50
      ${isOpen ? "w-64" : "w-0 lg:w-20"} 
      fixed lg:relative h-screen overflow-hidden
    `}
    >
      <div className="flex flex-col h-full px-3 py-6 min-w-[256px] lg:min-w-0">
        <div
          className={`flex items-center gap-3 px-3 mb-10 group cursor-pointer ${!isOpen && "lg:justify-center lg:px-0"}`}
        >
          <div className="relative mb-2 group-hover:translate-y-[-2px] transition-transform">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-8 h-8 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute mb-1 -bottom-1 -right-1 w-3 h-3 bg-green-800 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
          </div>

          {isOpen && (
            <div className="flex flex-col italic">
              <h2 className="text-xl font-black italic tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-green-800 dark:from-white dark:to-blue-400">
                Logistic
              </h2>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest not-italic -mt-1 border-t border-slate-200 dark:border-slate-800 pt-0.5">
                Training Camp
              </span>
            </div>
          )}
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {user.role == "admin" ? (
            <>
              {AdminMenu.map((item) => (
                <SidebarItem
                  key={item.id}
                  {...item}
                  active={activeItem === item.id}
                  isOpenSidebar={isOpen}
                  onClick={() => onItemClick(item.id)}
                />
              ))}
            </>
          ) : (
            <>
              {UserMenu.map((item) => (
                <SidebarItem
                  key={item.id}
                  {...item}
                  active={activeItem === item.id}
                  isOpenSidebar={isOpen}
                  onClick={() => onItemClick(item.id)}
                />
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <SidebarItem
            icon={Settings}
            label="Settings"
            isOpenSidebar={isOpen}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
