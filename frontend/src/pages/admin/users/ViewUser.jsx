import React, { use, useEffect, useState } from "react";
import {
  Home,
  ChevronRight,
  Mail,
  Phone,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  ArrowLeft,
  Calendar,
  User as UserIcon,
  MapPin,
  Globe,
  Award,
  Clock,
  Building,
  Link as LinkIcon,
  Star,
  FileText,
  Activity,
  Smartphone,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchUserThunk,
  ResentFresherLogin,
} from "../../../features/admin/users/userSlice";

const ViewUser = () => {
  const [activeTab, setActiveTab] = useState("details");

  /**
   *  States
   */
  const location = useLocation();
  const { userId } = location.state;
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.user);

  /**
   *  useEffects
   */
  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(FetchUserThunk(userId));
    };
    fetchUser();
  }, [userId]);

  /**
   *  Funtions
   */
  const handleResetLoginRequest = async () => {
    const result = await dispatch(ResentFresherLogin(userId));
    if (ResentFresherLogin.fulfilled.match(result)) {
      alert("Success");
    }
  };
  console.log(user);
  const getRoleDetails = (role) => {
    switch (role) {
      case "admin":
        return {
          title: "Administrator",
          icon: Shield,
          color: "purple",
          bgGradient: "from-purple-50 to-purple-100",
          borderColor: "border-purple-200",
          textColor: "text-purple-700",
          description: "Full system access with all administrative privileges",
        };
      case "user":
        return {
          title: "Fresher User",
          icon: UserIcon,
          color: "blue",
          bgGradient: "from-blue-50 to-blue-100",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          description: "Limited access with basic user permissions",
        };
      default:
        return {
          title: role,
          icon: Briefcase,
          color: "gray",
          bgGradient: "from-gray-50 to-gray-100",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          description: "Standard user account",
        };
    }
  };

  const roleDetails = getRoleDetails(user?.role);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getActivityIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle size={14} className="text-green-500" />;
      case "warning":
        return <Activity size={14} className="text-yellow-500" />;
      default:
        return <Clock size={14} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full min-h-screen p-6 lg:p-8 font-sans">
        <div className="max-w-8xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Home size={16} className="text-gray-400" />
                <ChevronRight size={14} />
                <span className="hover:text-blue-600 transition-colors cursor-pointer">
                  Users
                </span>
                <ChevronRight size={14} />
                <span className="text-blue-600 font-semibold">
                  User Details
                </span>
              </nav>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                View User
              </h1>
              <p className="text-gray-500 mt-2">
                Complete user profile and account information
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden sticky top-6">
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-white p-1 shadow-xl">
                        {user?.profile ? (
                          <img
                            src={user.profile}
                            alt={user.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                            {user?.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        {user?.is_active ? (
                          <div className="bg-green-500 rounded-full p-1 border-2 border-white">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        ) : (
                          <div className="bg-red-500 rounded-full p-1 border-2 border-white">
                            <XCircle size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-16 pb-6 px-6 text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {user?.full_name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">ID: {user?.id}</p>
                  <div className="flex justify-center mb-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${roleDetails.bgGradient} ${roleDetails.borderColor} border`}
                    >
                      <roleDetails.icon
                        size={14}
                        className={roleDetails.textColor}
                      />
                      <span className={roleDetails.textColor}>
                        {roleDetails.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-600">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-600">{user?.mobile}</span>
                  </div>
                  {user?.iswhatsapp && (
                    <div className="flex items-center gap-3 text-sm">
                      <FaWhatsapp size={16} className="text-green-500" />
                      <span className="text-green-600 font-medium">
                        WhatsApp Enabled
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      Joined: {formatDate(user?.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      Last Login: {formatRelativeTime(user?.last_login)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                    Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {user?.projects_count}
                      </div>
                      <p className="text-xs text-gray-500">Projects</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {user?.tasks_completed}
                      </div>
                      <p className="text-xs text-gray-500">Tasks</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {user?.login_count}
                      </div>
                      <p className="text-xs text-gray-500">Logins</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {user?.documents_count}
                      </div>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Tab Navigation */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === "details"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Account Details
                  </button>
                  <button
                    onClick={() => setActiveTab("skills")}
                    className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === "skills"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Skills & Expertise
                  </button>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === "activity"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Activity Log
                  </button>
                  <button
                    onClick={() => setActiveTab("permissions")}
                    className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === "permissions"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Permissions
                  </button>
                </div>

                <div className="p-6">
                  {/* Account Details Tab */}
                  {activeTab === "details" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Full Name
                          </label>
                          <p className="text-gray-800 font-medium">
                            {user?.full_name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            User ID
                          </label>
                          <p className="text-gray-800 font-medium font-mono">
                            {user?.id}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Email Address
                          </label>
                          <p className="text-gray-800">{user?.email}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Mobile Number
                          </label>
                          <p className="text-gray-800">{user?.mobile}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Role
                          </label>
                          <p className="text-gray-800 capitalize">
                            {user?.role}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Status
                          </label>
                          {user?.is_active ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <CheckCircle size={14} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600">
                              <XCircle size={14} /> Disabled
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            WhatsApp Status
                          </label>
                          {user?.iswhatsapp ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <FaWhatsapp size={14} /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-400">
                              <FaWhatsapp size={14} /> Not Available
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Created On
                          </label>
                          <p className="text-gray-800">
                            {formatDate(user?.created_at)} at{" "}
                            {formatTime(user?.created_at)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Department
                          </label>
                          <p className="text-gray-800">{user?.department}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Designation
                          </label>
                          <p className="text-gray-800">{user?.designation}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Location
                          </label>
                          <p className="text-gray-800">{user?.location}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Education
                          </label>
                          <p className="text-gray-800"></p>
                          <p className="text-xs text-gray-500"></p>
                        </div>
                      </div>

                      {user?.bio && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Bio
                          </label>
                          <p className="text-gray-600 leading-relaxed">
                            {user?.bio}
                          </p>
                        </div>
                      )}

                      {/* Social Links */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">
                          Social Links
                        </label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                          Reset Password
                        </button>
                        <button
                          onClick={handleResetLoginRequest}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Resent Login Notification
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Skills Tab */}
                  {activeTab === "skills" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Star size={18} className="text-yellow-500" />
                          Technical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user?.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-semibold text-gray-800 mb-3">
                          Certifications
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Award size={20} className="text-purple-500" />
                            <div>
                              <p className="font-medium text-gray-800">
                                AWS Certified Solutions Architect
                              </p>
                              <p className="text-xs text-gray-500">
                                Issued: Jan 2023 · Expires: Jan 2026
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <FileText size={20} className="text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-800">
                                Meta Frontend Developer Certificate
                              </p>
                              <p className="text-xs text-gray-500">
                                Issued: Mar 2024
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Log Tab */}
                  {activeTab === "activity" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">
                          Recent user? activities
                        </p>
                        <button className="text-xs text-blue-600 hover:underline">
                          View All
                        </button>
                      </div>

                      <div className="space-y-3">
                        {user?.recent_activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {getActivityIcon(activity.status)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {activity.action}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatRelativeTime(activity.time)}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatTime(activity.time)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Permissions Tab */}
                  {activeTab === "permissions" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield size={18} className="text-blue-600" />
                          <h3 className="font-semibold text-blue-800">
                            Role-Based Access Control
                          </h3>
                        </div>
                        <p className="text-sm text-blue-700">
                          {roleDetails.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Allowed Actions
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-500"
                              />
                              View Dashboard
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-500"
                              />
                              Update Profile
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle
                                size={14}
                                className="text-green-500"
                              />
                              View Reports
                            </li>
                            {user?.role === "admin" && (
                              <>
                                <li className="flex items-center gap-2">
                                  <CheckCircle
                                    size={14}
                                    className="text-green-500"
                                  />
                                  Manage Users
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle
                                    size={14}
                                    className="text-green-500"
                                  />
                                  System Settings
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle
                                    size={14}
                                    className="text-green-500"
                                  />
                                  View Audit Logs
                                </li>
                              </>
                            )}
                          </ul>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Restricted Actions
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {user?.role !== "admin" && (
                              <>
                                <li className="flex items-center gap-2">
                                  <XCircle size={14} className="text-red-400" />
                                  Delete Users
                                </li>
                                <li className="flex items-center gap-2">
                                  <XCircle size={14} className="text-red-400" />
                                  Modify System Settings
                                </li>
                                <li className="flex items-center gap-2">
                                  <XCircle size={14} className="text-red-400" />
                                  Access Admin Panel
                                </li>
                              </>
                            )}
                            <li className="flex items-center gap-2">
                              <XCircle size={14} className="text-red-400" />
                              Access Billing Information
                            </li>
                            <li className="flex items-center gap-2">
                              <XCircle size={14} className="text-red-400" />
                              Modify User Roles
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Module Permissions */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Module Access
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">
                              Users Module
                            </span>
                            {user?.role === "admin" ? (
                              <span className="text-xs text-green-600">
                                Full Access
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">
                                Read Only
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-sm text-gray-600">
                              Reports Module
                            </span>
                            <span className="text-xs text-green-600">
                              Full Access
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-t">
                            <span className="text-sm text-gray-600">
                              Settings Module
                            </span>
                            {user?.role === "admin" ? (
                              <span className="text-xs text-green-600">
                                Full Access
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No Access
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ViewUser;
