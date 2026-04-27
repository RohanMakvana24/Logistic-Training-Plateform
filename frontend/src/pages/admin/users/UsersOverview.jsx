import React, { useEffect, useState, useCallback } from "react";
import {
  Home,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
  Shield,
  UserCheck,
  Loader,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  User2Icon,
} from "lucide-react";
import { FaPeopleArrows, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FetchUsersThunk } from "../../../features/admin/users/userSlice";

const UsersOverview = () => {
  const navigate = useNavigate();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  /**
   * Fetching Users
   */
  const { users, isLoading } = useSelector((state) => state.user);
  console.log(users);
  useEffect(() => {
    const fetchUsers = async () => {
      const queryParams = {
        search: debouncedSearch,
        status: statusFilter,
        role: roleFilter,
        page: currentPage,
        per_page: itemsPerPage,
      };
      await dispatch(FetchUsersThunk(queryParams));
    };
    fetchUsers();
  }, [
    debouncedSearch,
    statusFilter,
    roleFilter,
    currentPage,
    itemsPerPage,
    refresh,
  ]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination calculations
  const totalUsers = users?.total;
  const totalPages = Math.ceil(totalUsers / users?.per_page);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle user status toggle
  const handleToggleStatus = async (user) => {
    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, is_active: !u.is_active } : u,
        ),
      );
      setSuccessMessage(
        `User ${!user.is_active ? "activated" : "deactivated"} successfully`,
      );
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== selectedUser.id),
      );
      setShowDeleteModal(false);
      setSelectedUser(null);
      setSuccessMessage("User deleted successfully");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Adjust pagination if needed
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  // Get role badge component
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            <Shield size={12} />
            Administrator
          </span>
        );
      case "user":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <UserCheck size={12} />
            Fresher User
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            {role}
          </span>
        );
    }
  };

  // Get status badge component
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <CheckCircle size={12} />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <XCircle size={12} />
        Disabled
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get stats
  const stats = {
    total: users?.totalUsers,
    active: users?.totalActiveUsers,
    admins: users?.totalAdmins,
    freshers: users?.totalFreshers,
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== "all" || roleFilter !== "all";

  const TableSkeleton = () => {
    return (
      <>
        {[...Array(10)].map((_, index) => (
          <tr key={index} className="border-b border-gray-50 last:border-0">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative overflow-hidden w-10 h-10 bg-gray-200 rounded-full animate-pulse">
                  {/* Shimmer Effect overlay */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-100 rounded-md animate-pulse"></div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-6 w-24 bg-purple-50 rounded-full animate-pulse"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-6 w-20 bg-green-50 rounded-full animate-pulse"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-end gap-2">
                <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            </td>
          </tr>
        ))}
      </>
    );
  };
  const EmptyState = ({ hasActiveFilters, clearFilters, navigate }) => (
    <td colSpan="7" className="px-6 py-24 text-center">
      <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-3xl opacity-40 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-50 animate-bounce-slow">
            <UsersIcon size={54} className="text-blue-500/80" />
            <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2 rounded-xl shadow-lg animate-bounce-slow transition-all delay-150">
              <Search size={18} />
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500 max-w-xs mx-auto mb-8 text-sm leading-relaxed">
          We couldn't find any users matching your current filters. Try
          adjusting your search or clearing the filters.
        </p>
        {hasActiveFilters ? (
          <button
            onClick={clearFilters}
            className="group flex items-center gap-3 px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-xl hover:shadow-blue-200 active:scale-95"
          >
            <RefreshCw
              size={18}
              className="group-hover:rotate-180 transition-transform duration-700"
            />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Clear All Filters
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/admin/users/add")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
          >
            <UserPlus size={18} /> Add New User
          </button>
        )}
      </div>
    </td>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg">
            <CheckCircle size={20} />
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete User</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedUser?.full_name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen p-6 lg:p-8 font-sans">
        <div className="max-w-8xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Home size={16} className="text-gray-400" />
                <ChevronRight size={14} />
                <span className="text-blue-600 font-semibold">Users</span>
              </nav>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Users Overview
              </h1>
              <p className="text-gray-500 mt-2">
                Manage all user accounts, roles, and permissions
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/users/add")}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus size={18} /> Add New User
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pt-4">
            {/* Total Users */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)]">
              {/* Floating Icon Box */}
              <div className="absolute -top-4 right-6 p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 group-hover:-translate-y-2 transition-transform duration-300">
                <UsersIcon size={24} className="text-white" />
              </div>

              <div className="mt-2">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                  Users
                </span>
                <h3 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
                  {stats.total}
                </h3>
                <p className="text-sm font-medium text-gray-400 mt-1">
                  Global registered users
                </p>
              </div>
            </div>

            {/* Active Users */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
              <div className="absolute -top-4 right-6 p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200 group-hover:-translate-y-2 transition-transform duration-300">
                <CheckCircle size={24} className="text-white" />
              </div>

              <div className="mt-2">
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                  Live Now
                </span>
                <h3 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
                  {stats.active}
                </h3>
                <p className="text-sm font-medium text-gray-400 mt-1">
                  Users currently Actives
                </p>
              </div>
            </div>

            {/* Administrators */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]">
              <div className="absolute -top-4 right-6 p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-200 group-hover:-translate-y-2 transition-transform duration-300">
                <Shield size={24} className="text-white" />
              </div>

              <div className="mt-2">
                <span className="text-xs font-bold text-violet-500 bg-violet-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                  Privileged
                </span>
                <h3 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
                  {stats.admins}
                </h3>
                <p className="text-sm font-medium text-gray-400 mt-1">
                  System administrators
                </p>
              </div>
            </div>

            {/* WhatsApp Enabled */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(20,184,166,0.1)]">
              <div className="absolute -top-4 right-6 p-3 bg-teal-500 rounded-2xl shadow-lg shadow-teal-200 group-hover:-translate-y-2 transition-transform duration-300">
                <FaPeopleArrows size={24} className="text-white" />
              </div>

              <div className="mt-2">
                <span className="text-xs font-bold text-teal-500 bg-teal-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                  Freshers
                </span>
                <h3 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
                  {stats.freshers}
                </h3>
                <p className="text-sm font-medium text-gray-400 mt-1">
                  Freshers Users
                </p>
              </div>
            </div>
          </div>
          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="p-4 flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                    showFilters && hasActiveFilters
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm shadow-blue-100"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Filter size={16} strokeWidth={2.5} />
                  Filters
                  {hasActiveFilters && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-100 transition-all group"
                  >
                    <X
                      size={16}
                      className="group-hover:rotate-90 transition-transform"
                    />
                    Clear
                  </button>
                )}

                <button
                  onClick={() => {
                    setRefresh((prev) => !prev);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                >
                  <RefreshCw
                    size={16}
                    className={`${isLoading ? "animate-spin" : ""} text-gray-400`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="border-t border-gray-100 bg-gray-50/30">
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all cursor-pointer"
                    >
                      <option value="">All Status</option>
                      <option value="1">Active</option>
                      <option value="0">Disabled</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Role
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all cursor-pointer"
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Administrator</option>
                      <option value="user">Fresher User</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Show Entries
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all cursor-pointer"
                    >
                      <option value="10">10 Per Page</option>
                      <option value="20">20 Per Page</option>
                      <option value="50">50 Per Page</option>
                    </select>
                  </div>
                </div>

                {(statusFilter || roleFilter || itemsPerPage) && (
                  <div className="px-4 pb-4 flex flex-wrap items-center gap-2">
                    <div className="h-4 w-[2px] bg-gray-200 mr-2 rounded-full"></div>

                    {statusFilter && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        STATUS: {statusFilter === "1" ? "ACTIVE" : "DISABLED"}
                        <button
                          onClick={() => setStatusFilter("")}
                          className="ml-1 hover:bg-blue-200/50 rounded-md p-0.5 transition-colors"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    )}

                    {roleFilter && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-lg border border-purple-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        ROLE: {roleFilter.toUpperCase()}
                        <button
                          onClick={() => setRoleFilter("")}
                          className="ml-1 hover:bg-purple-200/50 rounded-md p-0.5 transition-colors"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    )}

                    {itemsPerPage && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        VIEW: {itemsPerPage} ITEMS
                        <button
                          onClick={() => setItemsPerPage(10)}
                          className="ml-1 hover:bg-emerald-200/50 rounded-md p-0.5 transition-colors"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    )}

                    <button
                      onClick={clearFilters}
                      className="text-[11px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-tighter ml-2 transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y divide-gray-100 transition-opacity duration-300 ${
                    isLoading ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {isLoading ? (
                    <TableSkeleton />
                  ) : users?.data?.length === 0 ? (
                    <EmptyState
                      hasActiveFilters={hasActiveFilters}
                      clearFilters={clearFilters}
                      navigate={navigate}
                    />
                  ) : (
                    users?.data?.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              {user.profile ? (
                                <img
                                  src={user.profile}
                                  alt={user.full_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                  {user.full_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {user.full_name}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail size={12} className="text-gray-400" />
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone size={12} className="text-gray-400" />
                              {user.mobile}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                        <td className="px-6 py-4">
                          {getStatusBadge(user.is_active)}
                        </td>
                        <td className="px-6 py-4">
                          {user.iswhatsapp ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <FaWhatsapp size={16} />
                              <span className="text-xs font-medium">
                                Available
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400">
                              <FaWhatsapp size={16} />
                              <span className="text-xs">Not available</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/users/view`, {
                                  state: {
                                    userId: user.id,
                                  },
                                })
                              }
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View User"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/users/edit/${user.id}`)
                              }
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit User"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={actionLoading}
                              className={`p-2 rounded-lg transition-all ${
                                user.is_active
                                  ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                                  : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                user.is_active ? "Disable User" : "Enable User"
                              }
                            >
                              {user.is_active ? (
                                <XCircle size={16} />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              disabled={actionLoading}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing {users?.from} to {users?.to} of {totalUsers} users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-up {
          animation: scaleUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UsersOverview;
