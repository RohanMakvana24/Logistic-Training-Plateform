import React from "react";
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { LogoutAsyncThunk } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Navbar = ({
  isDarkMode,
  setIsDarkMode,
  isSidebarOpen,
  setIsSidebarOpen,
  isProfileOpen,
  setIsProfileOpen,
}) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(LogoutAsyncThunk());
    if (LogoutAsyncThunk.fulfilled.match(result)) {
      toast.success("Logged out successfully");
      navigate("/auth/login");
    }
  };

  return (
    <nav className="h-16 flex items-center bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 transition-all">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex relative max-w-xs w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search data..."
              className="w-full bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <img
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                src={user?.profile}
                alt="avatar"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm font-bold dark:text-white truncate">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 gap-2 rounded-lg"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
