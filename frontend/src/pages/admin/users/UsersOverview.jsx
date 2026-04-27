import React, { useEffect, useState, useCallback, use } from "react";
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
  ChevronDown,
  MoreVertical,
  Download,
  FileSpreadsheet,
  FileText,
  Brush,
  ClosedCaption,
  Recycle,
} from "lucide-react";
import { FaPaypal, FaPeopleArrows, FaWhatsapp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteUserThunk,
  FetchUsersThunk,
  GeneratePdfThunk,
} from "../../../features/admin/users/userSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import UserUpdate from "./UserUpdate";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

const UsersOverview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);

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
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [showUpdateModal, setShowUpdateModel] = useState(false);
  const [userUpdateId, setUserUpdateId] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [tempusers, setTempUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const queryParams = {
        search: debouncedSearch,
        status: statusFilter,
        role: roleFilter,
        page: currentPage,
        per_page: itemsPerPage,
        showDeleted: showDeleted,
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
    dispatch,
    showDeleted,
  ]);

  useEffect(() => {
    if (users) {
      setTempUsers(users.data);
    }
  }, [users]);

  console.log(tempusers);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const totalUsers = users?.total;
  const totalPages = Math.ceil(totalUsers / users?.per_page);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDeleteClick = async (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const result = await dispatch(DeleteUserThunk(selectedUser.id));
      if (DeleteUserThunk.fulfilled.match(result)) {
        toast.success(result?.payload?.message || "User Deleted Successfully");
        await dispatch(FetchUsersThunk());
        setShowDeleteModal(false);
      } else if (DeleteUserThunk.rejected.match(result)) {
        toast.error(result?.payload?.message || "Somenthing Went Wrong");
      }
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users?.data?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.data?.map((user) => user.id) || []);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    setIsDeletingMultiple(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRefresh((prev) => !prev);
      setSelectedUsers([]);
      setShowActionsDropdown(false);
      setSuccessMessage(`${selectedUsers.length} user(s) deleted successfully`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Failed to delete users:", error);
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  const handleBulkStatusToggle = async (status) => {
    if (selectedUsers.length === 0) return;
    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRefresh((prev) => !prev);
      setSelectedUsers([]);
      setShowActionsDropdown(false);
      setSuccessMessage(
        `${selectedUsers.length} user(s) ${status ? "activated" : "deactivated"} successfully`,
      );
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Failed to update users:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      if (format === "excel") {
        setSuccessMessage("Excel file exported successfully");
      } else if (format === "pdf") {
        const toastId = toast.loading("Processing to generates a pdf...");
        const result = await dispatch(GeneratePdfThunk(tempusers));
        if (GeneratePdfThunk.fulfilled.match(result)) {
          const url = window.URL.createObjectURL(new Blob([result.payload]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "users.pdf");
          document.body.appendChild(link);
          link.click();
          link.remove();
          toast.update(toastId, {
            render: "Successfully Downloaded!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        }
      }
      setShowExportDropdown(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Failed to export:", error);
      setSuccessMessage("Export failed");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const convertToCSV = (data) => {
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Mobile",
      "Role",
      "Status",
      "WhatsApp",
      "Joined Date",
      "Last Login",
    ];
    const rows = data.map((user) => [
      user.id,
      user.full_name,
      user.email,
      user.mobile,
      user.role,
      user.is_active ? "Active" : "Disabled",
      user.iswhatsapp ? "Yes" : "No",
      formatDate(user.created_at),
      timeAgo(user.last_login_at),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    return csvContent;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        icon: Shield,
        label: "Administrator",
        className: "bg-purple-100 text-purple-700",
      },
      user: {
        icon: UserCheck,
        label: "Fresher User",
        className: "bg-blue-100 text-blue-700",
      },
    };

    const config = roleConfig[role] || {
      icon: null,
      label: role,
      className: "bg-gray-100 text-gray-600",
    };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}
      >
        {Icon && <Icon size={12} />}
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    const statusConfig = isActive
      ? {
          icon: CheckCircle,
          label: "Active",
          className: "bg-green-100 text-green-700",
        }
      : {
          icon: XCircle,
          label: "Disabled",
          className: "bg-red-100 text-red-700",
        };
    const Icon = statusConfig.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}
      >
        <Icon size={12} />
        {statusConfig.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "—";
    return dayjs(timestamp.replace(" ", "T")).fromNow();
  };

  const stats = {
    total: users?.totalUsers,
    active: users?.totalActiveUsers,
    admins: users?.totalAdmins,
    freshers: users?.totalFreshers,
  };

  const hasActiveFilters = searchTerm || statusFilter || roleFilter;

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    bgColor,
    iconBgColor,
  }) => (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div
        className={`absolute -top-4 right-6 p-3 rounded-2xl shadow-lg group-hover:-translate-y-2 transition-transform duration-300 ${iconBgColor}`}
      >
        <Icon size={24} className="text-white" />
      </div>
      <div className="mt-2">
        <span
          className={`text-xs font-bold uppercase tracking-tighter px-2 py-1 rounded-full ${bgColor}`}
        >
          {title}
        </span>
        <h3 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
          {value}
        </h3>
        <p className="text-sm font-medium text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <>
      {[...Array(itemsPerPage)].map((_, index) => (
        <tr key={index} className="border-b border-gray-50">
          <td className="px-6 py-4">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
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
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
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

  const EmptyState = () => (
    <tr>
      <td colSpan="9" className="px-6 py-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-3xl opacity-40"></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <UsersIcon size={54} className="text-blue-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-8 text-sm">
            We couldn't find any users matching your current filters.
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="flex items-center gap-3 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg"
            >
              <RefreshCw size={18} />
              <span className="font-semibold text-sm">Clear All Filters</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/users/add")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors"
            >
              <UserPlus size={18} /> Add New User
            </button>
          )}
        </div>
      </td>
    </tr>
  );
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg">
            <CheckCircle size={20} />
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 shadow-2xl">
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
                {actionLoading && <Loader size={16} className="animate-spin" />}
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[900px] max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 ">
              <div className="p-2 bg-blue-100 rounded-full">
                <Brush size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Update User</h3>
              <button
                onClick={() => {
                  setShowUpdateModel(false);
                }}
                className="ml-auto p-2 text-red-500 rounded-full hover:bg-red-100"
              >
                <X size={20} className="text-red-600" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto border-0 p-6">
              <UserUpdate
                setShowUpdateModel={setShowUpdateModel}
                userUpdateId={userUpdateId}
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen p-6 lg:p-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2  ">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Home size={14} />
                <ChevronRight size={12} />
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Users
                </span>
                {showDeleted && (
                  <>
                    <ChevronRight size={12} />
                    <span className="text-rose-500 font-medium">Archive</span>
                  </>
                )}
              </nav>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {showDeleted ? "Deleted Accounts" : "Users Overview"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {showDeleted
                  ? "Review and restore recently removed user profiles."
                  : "Manage all active user accounts and permissions."}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`
          flex items-center gap-3 pl-4 pr-2 py-2 rounded-2xl border transition-all duration-300
          ${
            showDeleted
              ? "bg-rose-50 border-rose-100 shadow-[0_2px_10px_-3px_rgba(225,29,72,0.1)]"
              : "bg-slate-50 border-slate-100"
          }
        `}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider leading-none ${showDeleted ? "text-rose-600" : "text-slate-400"}`}
                  >
                    Soft Delete
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {showDeleted ? "Viewing Trash" : "Hide Deleted"}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={showDeleted}
                    onChange={() => setShowDeleted(!showDeleted)}
                  />
                  <div
                    className={`
              w-14 h-7 rounded-full transition-all duration-300
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
              ${showDeleted ? "bg-rose-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]" : "bg-slate-200"}
            `}
                  ></div>

                  <div
                    className={`
              absolute left-1 top-1 w-5 h-5 rounded-full
              bg-gradient-to-br from-white to-slate-100
              shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300
              flex items-center justify-center
              ${showDeleted ? "translate-x-7" : "translate-x-0"}
            `}
                  >
                    {showDeleted ? (
                      <Trash2 size={10} className="text-rose-500" />
                    ) : (
                      <Eye size={10} className="text-slate-400" />
                    )}
                  </div>
                </label>
              </div>

              <Link
                to="/admin/users/add"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <UserPlus size={18} />
                <span>Add User</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pt-4">
            <StatCard
              title="USERS"
              value={stats.total || 0}
              subtitle="Global registered users"
              icon={UsersIcon}
              bgColor="bg-blue-50 text-blue-600"
              iconBgColor="bg-blue-600 shadow-blue-200"
            />
            <StatCard
              title="LIVE NOW"
              value={stats.active || 0}
              subtitle="Users currently active"
              icon={CheckCircle}
              bgColor="bg-emerald-50 text-emerald-600"
              iconBgColor="bg-emerald-500 shadow-emerald-200"
            />
            <StatCard
              title="PRIVILEGED"
              value={stats.admins || 0}
              subtitle="System administrators"
              icon={Shield}
              bgColor="bg-violet-50 text-violet-600"
              iconBgColor="bg-violet-600 shadow-violet-200"
            />
            <StatCard
              title="FRESHERS"
              value={stats.freshers || 0}
              subtitle="Fresher users"
              icon={FaPeopleArrows}
              bgColor="bg-teal-50 text-teal-600"
              iconBgColor="bg-teal-500 shadow-teal-200"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-visible">
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
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                    showFilters && hasActiveFilters
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Filter size={16} />
                  Filters
                  {hasActiveFilters && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 rounded-xl border border-gray-200 hover:bg-red-50 transition-all"
                  >
                    <X size={16} />
                    Clear
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowActionsDropdown(!showActionsDropdown);
                      setShowExportDropdown(false);
                    }}
                    disabled={selectedUsers.length === 0}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                      selectedUsers.length > 0
                        ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <MoreVertical size={16} />
                    Actions ({selectedUsers.length})
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${showActionsDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showActionsDropdown && selectedUsers.length > 0 && (
                    <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in">
                      <button
                        onClick={() => handleBulkStatusToggle(true)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Activate Selected
                      </button>
                      <button
                        onClick={() => handleBulkStatusToggle(false)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
                      >
                        <XCircle size={16} />
                        Deactivate Selected
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleBulkDelete}
                        disabled={isDeletingMultiple}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {isDeletingMultiple ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowExportDropdown(!showExportDropdown);
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    <Download size={16} />
                    Export
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${showExportDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showExportDropdown && (
                    <div className="absolute bottom-full right-0 mb-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in">
                      <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Export Formats
                      </div>
                      <button
                        onClick={() => handleExport("excel")}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileSpreadsheet
                          size={16}
                          className="text-emerald-600"
                        />
                        Excel Spreadsheet (CSV)
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileText size={16} className="text-rose-500" />
                        Print / PDF
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setRefresh((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <RefreshCw
                    size={16}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm cursor-pointer"
                    >
                      <option value="">All Status</option>
                      <option value="1">Active</option>
                      <option value="0">Disabled</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                      Role
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm cursor-pointer"
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Administrator</option>
                      <option value="user">Fresher User</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                      Show Entries
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm cursor-pointer"
                    >
                      <option value="10">10 Per Page</option>
                      <option value="20">20 Per Page</option>
                      <option value="50">50 Per Page</option>
                    </select>
                  </div>
                </div>

                {(statusFilter || roleFilter) && (
                  <div className="px-4 pb-4 flex flex-wrap items-center gap-2">
                    {statusFilter && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                        STATUS: {statusFilter === "1" ? "ACTIVE" : "DISABLED"}
                        <button
                          onClick={() => setStatusFilter("")}
                          className="ml-1 hover:bg-blue-100 rounded-md p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}

                    {roleFilter && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100">
                        <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
                        ROLE: {roleFilter.toUpperCase()}
                        <button
                          onClick={() => setRoleFilter("")}
                          className="ml-1 hover:bg-purple-100 rounded-md p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}

                    <button
                      onClick={clearFilters}
                      className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-tighter ml-2 transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center">
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            checked={
                              selectedUsers.length === users?.data?.length &&
                              users?.data?.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                          {/* Custom Checkmark Icon - appears only when input is checked */}
                          <span className="absolute text-white opacity-0 transition-opacity peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </label>
                      </div>
                    </th>
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y divide-gray-100 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
                >
                  {isLoading ? (
                    <TableSkeleton />
                  ) : users?.data?.length === 0 ? (
                    <EmptyState />
                  ) : (
                    users?.data?.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <label className="relative flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                              />

                              <span className="absolute text-white opacity-0 transition-opacity peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </label>
                          </div>
                        </td>
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
                                  {user.full_name?.charAt(0) || "U"}
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
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="inline-flex w-fit px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-600 mb-1">
                              Last Active
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar size={12} />
                              {timeAgo(user.last_login_at)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {showDeleted ? (
                              <>
                                <button
                                  onClick={() => handleDeleteClick(user)}
                                  className="p-2 text-gray-500 hover:green-red-600 hover:bg-green-50 rounded-lg transition-all"
                                  title="Delete User"
                                >
                                  <Recycle size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    navigate("/admin/users/view", {
                                      state: { userId: user.id },
                                    })
                                  }
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="View User"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setShowUpdateModel(true);
                                    setUserUpdateId(user.id);
                                  }}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Edit User"
                                >
                                  <Edit size={16} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteClick(user)}
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

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing {users?.from || 0} to {users?.to || 0} of{" "}
                  {totalUsers || 0} users
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
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UsersOverview;
