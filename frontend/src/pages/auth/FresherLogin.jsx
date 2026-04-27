import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router";
import { toast } from "react-toastify";
import { FresherLoginThunk } from "../../features/auth/authSlice";

// Validation schema for set password
const setPasswordValidation = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character",
    )
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const LoginFresher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const setPasswordForm = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: setPasswordValidation,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(
          FresherLoginThunk(params.get("url"), {
            password: values.password,
          }),
        );
        console.log(result);
        navigate("/");

        // toast.success("Password set successfully! You can now login.", {
        //   position: "bottom-right",
        //   className: "foo-bar",
        // });
      } catch (error) {
        toast.error(error.message || "Something went wrong", {
          position: "bottom-right",
          className: "foo-bar",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950">
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[600px]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-default mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30 transform group-hover:rotate-12 transition-transform duration-300">
              <img
                src="../svgviewer-output.svg"
                alt="ShiftLogix Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                Logis<span className="text-blue-600">tic</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                Training Camp
              </span>
            </div>
          </div>

          {/* Header Section */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Set New Password
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please create a strong password for your account
            </p>
          </div>

          {/* Password Requirements */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <li className="flex items-center gap-1">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    setPasswordForm.values.password.length >= 8
                      ? "bg-green-500"
                      : "bg-blue-400"
                  }`}
                ></span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-1">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    /[A-Z]/.test(setPasswordForm.values.password)
                      ? "bg-green-500"
                      : "bg-blue-400"
                  }`}
                ></span>
                One uppercase letter
              </li>
              <li className="flex items-center gap-1">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    /[a-z]/.test(setPasswordForm.values.password)
                      ? "bg-green-500"
                      : "bg-blue-400"
                  }`}
                ></span>
                One lowercase letter
              </li>
              <li className="flex items-center gap-1">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    /[0-9]/.test(setPasswordForm.values.password)
                      ? "bg-green-500"
                      : "bg-blue-400"
                  }`}
                ></span>
                One number
              </li>
              <li className="flex items-center gap-1">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    /[@$!%*?&#]/.test(setPasswordForm.values.password)
                      ? "bg-green-500"
                      : "bg-blue-400"
                  }`}
                ></span>
                One special character (@$!%*?&#)
              </li>
            </ul>
          </div>

          {/* Form Section */}
          <div className="mt-6">
            <form onSubmit={setPasswordForm.handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={setPasswordForm.values.password}
                    onChange={setPasswordForm.handleChange}
                    onBlur={setPasswordForm.handleBlur}
                    className={`
                      block w-full px-4 py-3 rounded-xl border transition-all outline-none
                      bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                      pr-12
                      ${
                        setPasswordForm.touched.password &&
                        setPasswordForm.errors.password
                          ? "border-red-500 ring-1 ring-red-500 focus:ring-red-600"
                          : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      }
                    `}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {setPasswordForm.touched.password &&
                  setPasswordForm.errors.password && (
                    <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">
                      {setPasswordForm.errors.password}
                    </p>
                  )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={setPasswordForm.values.confirm_password}
                    onChange={setPasswordForm.handleChange}
                    onBlur={setPasswordForm.handleBlur}
                    className={`
                      block w-full px-4 py-3 rounded-xl border transition-all outline-none
                      bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                      pr-12
                      ${
                        setPasswordForm.touched.confirm_password &&
                        setPasswordForm.errors.confirm_password
                          ? "border-red-500 ring-1 ring-red-500 focus:ring-red-600"
                          : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      }
                    `}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {setPasswordForm.touched.confirm_password &&
                  setPasswordForm.errors.confirm_password && (
                    <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">
                      {setPasswordForm.errors.confirm_password}
                    </p>
                  )}
              </div>

              {/* Password Strength Indicator */}
              {setPasswordForm.values.password && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        setPasswordForm.values.password.length >= 8 &&
                        /[A-Z]/.test(setPasswordForm.values.password) &&
                        /[a-z]/.test(setPasswordForm.values.password) &&
                        /[0-9]/.test(setPasswordForm.values.password) &&
                        /[@$!%*?&#]/.test(setPasswordForm.values.password)
                          ? "w-full bg-green-500"
                          : setPasswordForm.values.password.length >= 6
                            ? "w-2/3 bg-yellow-500"
                            : setPasswordForm.values.password.length >= 4
                              ? "w-1/3 bg-orange-500"
                              : "w-1/6 bg-red-500"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password strength:{" "}
                    {setPasswordForm.values.password.length >= 8 &&
                    /[A-Z]/.test(setPasswordForm.values.password) &&
                    /[a-z]/.test(setPasswordForm.values.password) &&
                    /[0-9]/.test(setPasswordForm.values.password) &&
                    /[@$!%*?&#]/.test(setPasswordForm.values.password)
                      ? "Strong"
                      : setPasswordForm.values.password.length >= 6
                        ? "Medium"
                        : "Weak"}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={setPasswordForm.isSubmitting}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {setPasswordForm.isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Set Password"
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center">
                <a
                  href="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  ← Back to Sign In
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE/OVERLAY SECTION */}
      <div className="hidden lg:block relative flex-1 w-0">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="../hero.png"
          alt="Logistics background"
        />
        {/* Blue Tint Overlay */}
        <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20" />

        {/* Featured Content on Image */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium leading-relaxed italic">
              "Security is our top priority. Create a strong password to keep
              your account safe and secure."
            </p>
            <footer className="flex flex-col">
              <span className="text-lg font-bold">Security Team</span>
              <span className="text-blue-400">Logistic Training Camp</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default LoginFresher;
