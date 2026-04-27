import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  ChevronRight,
  Mail,
  XCircle,
  UserPlus,
  User,
  Briefcase,
  Shield,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Upload,
  UserStar,
  Loader,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ProfileImageDropzone from "../../../components/common/ProfileImageDropzone";
import { useFormik } from "formik";
import { newUserValidation } from "../../../validations/admin/UsersValidation";
import { useDispatch } from "react-redux";
import {
  CheckWhatsappThunk,
  CreateUserThunk,
} from "../../../features/admin/users/userSlice";

const UserAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWhatsapp, setIsWhatsapp] = useState(false);
  const [isCheckingWhatsapp, setIsCheckingWhatsapp] = useState(false);
  const [whatsappCheckError, setWhatsappCheckError] = useState(false);
  const [isRemovePrevImg, setIsRemovePrevImg] = useState(false);
  const dispatch = useDispatch();

  const userFormik = useFormik({
    initialValues: {
      full_name: "",
      role: "",
      is_active: "",
      email: "",
      mobile: "",
      profile: null,
      iswhatsapp: false,
    },
    validationSchema: newUserValidation,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const result = await dispatch(CreateUserThunk(values));

        if (CreateUserThunk.fulfilled.match(result)) {
          setShowSuccess(true);
          setIsRemovePrevImg(true);
          setTimeout(() => setShowSuccess(false), 3000);
          userFormik.resetForm();
          setIsWhatsapp(false);
          setWhatsappCheckError(false);
        } else if (CreateUserThunk.rejected.match(result)) {
          const errorMessage = result.payload?.message || result.error?.message;
          if (errorMessage.includes("email")) {
            userFormik.setFieldError("email", errorMessage);
          } else if (errorMessage.includes("mobile")) {
            userFormik.setFieldError("mobile", errorMessage);
          }
          console.log("Error:", errorMessage);
        }
      } catch (error) {
        console.error("Error creating user:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = userFormik;

  const getProfile = (file) => {
    console.log(file);
    setFieldValue("profile", file, true);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 font-medium ${
      touched[field] && errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300"
    }`;

  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  /** Handle Whatsapp Number Check */
  const prevLengthRef = useRef(0);
  const checkingTimeoutRef = useRef(null);

  useEffect(() => {
    const mobile = values.mobile?.replace(/\D/g, "") || "";
    if (checkingTimeoutRef.current) {
      clearTimeout(checkingTimeoutRef.current);
    }
    if (mobile.length === 10 && prevLengthRef.current !== 10) {
      checkWhatsappNum(mobile);
    } else if (
      mobile.length !== 10 &&
      (isWhatsapp || whatsappCheckError || isCheckingWhatsapp)
    ) {
      setIsWhatsapp(false);
      setWhatsappCheckError(false);
      setIsCheckingWhatsapp(false);
    }

    prevLengthRef.current = mobile.length;
  }, [values.mobile]);

  useEffect(() => {
    if (touched.mobile && errors.mobile && (isWhatsapp || whatsappCheckError)) {
      setIsWhatsapp(false);
      setWhatsappCheckError(false);
      setIsCheckingWhatsapp(false);
    }
  }, [touched.mobile, errors.mobile]);

  const checkWhatsappNum = async (mobile) => {
    setIsCheckingWhatsapp(true);
    setWhatsappCheckError(false);
    setIsWhatsapp(false);

    try {
      const result = await dispatch(CheckWhatsappThunk({ mobile }));
      if (CheckWhatsappThunk.fulfilled.match(result)) {
        setFieldValue("iswhatsapp", true);
        setIsWhatsapp(true);
        setWhatsappCheckError(false);
        setIsRemovePrevImg(true);
      } else {
        setIsWhatsapp(false);
        setWhatsappCheckError(true);
      }
    } catch (error) {
      console.error("WhatsApp check failed:", error);
      setIsWhatsapp(false);
      setWhatsappCheckError(true);
    } finally {
      checkingTimeoutRef.current = setTimeout(() => {
        setIsCheckingWhatsapp(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg">
            <CheckCircle size={20} />
            <span className="font-semibold">User created successfully!</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full h-full">
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
                    Create New User
                  </span>
                </nav>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Add New User
                </h1>
                <p className="text-gray-500 mt-2">
                  Create a new user account with role-based access
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    userFormik.resetForm();
                    setIsWhatsapp(false);
                    setWhatsappCheckError(false);
                    setIsCheckingWhatsapp(false);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <XCircle size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} /> Create User
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-white px-8 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          General Information
                        </h2>
                        <p className="text-sm text-gray-500">
                          Basic user details and role assignment
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className={labelClass}>
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={values.full_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter full name"
                          className={inputClass("full_name")}
                        />
                        {touched.full_name && errors.full_name && (
                          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                            <AlertCircle size={12} />
                            <span>{errors.full_name}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>
                          <div className="flex items-center gap-2">
                            <Briefcase size={16} />
                            Role <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <select
                          name="role"
                          value={values.role}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={inputClass("role")}
                        >
                          <option value="">Select Role</option>
                          <option value="user">Fresher User</option>
                          <option value="admin">Administrator</option>
                        </select>
                        {touched.role && errors.role && (
                          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                            <AlertCircle size={12} />
                            <span>{errors.role}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>
                          <div className="flex items-center gap-2">
                            <Shield size={16} />
                            Status <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <select
                          name="is_active"
                          value={values.is_active}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={inputClass("is_active")}
                        >
                          <option value="">Select Status</option>
                          <option value="1">🟢 Active</option>
                          <option value="0">🔴 Disabled</option>
                        </select>
                        {touched.is_active && errors.is_active && (
                          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                            <AlertCircle size={12} />
                            <span>{errors.is_active}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security & Access Section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-white px-8 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Shield size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          Security & Access
                        </h2>
                        <p className="text-sm text-gray-500">
                          Contact information and account credentials
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="space-y-6">
                      <div>
                        <label className={labelClass}>
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="example@company.com"
                          className={inputClass("email")}
                        />
                        {touched.email && errors.email && (
                          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                            <AlertCircle size={12} />
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>
                          <div className="flex items-center gap-2">
                            <Smartphone size={16} />
                            Mobile Number{" "}
                            <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="mobile"
                            value={values.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="+917043853092"
                            className={inputClass("mobile")}
                          />
                          {isCheckingWhatsapp && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Loader
                                size={20}
                                className="animate-spin text-blue-500"
                              />
                            </div>
                          )}
                        </div>
                        {touched.mobile && errors.mobile && (
                          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                            <AlertCircle size={12} />
                            <span>{errors.mobile}</span>
                          </div>
                        )}

                        {/* WhatsApp Status Messages */}
                        {!errors.mobile &&
                          values.mobile?.replace(/\D/g, "").length === 10 && (
                            <div className="mt-3">
                              {isCheckingWhatsapp && (
                                <div className="flex items-center gap-2">
                                  <Loader
                                    size={14}
                                    className="animate-spin text-blue-500"
                                  />
                                  <span className="text-xs text-gray-500 font-medium">
                                    Checking WhatsApp availability...
                                  </span>
                                </div>
                              )}

                              {isWhatsapp && !isCheckingWhatsapp && (
                                <div className="flex items-center gap-2 group cursor-pointer animate-slide-down">
                                  <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                  </div>
                                  <div className="flex items-center gap-1 text-green-600 font-semibold text-[11px] uppercase tracking-wider group-hover:text-green-500 transition-colors">
                                    <FaWhatsapp size={14} />
                                    <span>Live on WhatsApp</span>
                                  </div>
                                </div>
                              )}

                              {whatsappCheckError &&
                                !isCheckingWhatsapp &&
                                !isWhatsapp && (
                                  <div className="flex items-center gap-2 animate-slide-down">
                                    <div className="relative flex h-2 w-2">
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 text-[11px] uppercase tracking-wider">
                                      <FaWhatsapp
                                        size={14}
                                        className="text-gray-400"
                                      />
                                      <span>WhatsApp not available</span>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}

                        {/* Hint for incomplete number */}
                        {!errors.mobile &&
                          values.mobile &&
                          values.mobile?.replace(/\D/g, "").length > 0 &&
                          values.mobile?.replace(/\D/g, "").length < 10 && (
                            <div className="flex items-center gap-2 mt-3">
                              <div className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-300"></span>
                              </div>
                              <span className="text-xs text-gray-400">
                                Enter 10-digit mobile number to check WhatsApp
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Image */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 sticky top-6">
                  <div className="bg-gradient-to-r from-orange-50 to-white px-8 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Upload size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          Profile Picture
                        </h2>
                        <p className="text-sm text-gray-500">
                          Upload user avatar
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <ProfileImageDropzone
                      removePrevImg={isRemovePrevImg}
                      getProfile={getProfile}
                    />
                    {touched.profile && errors.profile && (
                      <div className="flex items-center justify-center gap-1 mt-4 text-red-500 text-xs">
                        <AlertCircle size={12} />
                        <span>{errors.profile}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 text-center mt-4">
                      Recommended: Square image, max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

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

export default UserAdd;
