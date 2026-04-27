import React, { useState } from "react";
import { useFormik } from "formik";
import loginValidation from "../../validations/authValidations";
import { LoginAsyncThunk } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Login Form Submit */
  const loginForn = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember_me: false,
    },
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      const result = await dispatch(LoginAsyncThunk(values));
      if (LoginAsyncThunk.fulfilled.match(result)) {
        toast.success(result.payload.message, "Login Successfull!", {
          position: "bottom-right",
          className: "foo-bar",
        });
        navigate("/");
      } else {
        toast.error(result.payload.message || "Somenthing Went Wrong", {
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

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={loginForn.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    value={loginForn.values.email}
                    onChange={loginForn.handleChange}
                    onBlur={loginForn.handleBlur}
                    className={`
      block w-full px-4 py-3 rounded-xl border transition-all outline-none
      bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
      
      ${
        loginForn.touched.email && loginForn.errors.email
          ? "border-red-500 ring-1 ring-red-500 focus:ring-red-600"
          : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      }
    `}
                    placeholder="you@company.com"
                  />

                  {loginForn.touched.email && loginForn.errors.email && (
                    <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">
                      {loginForn.errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    value={loginForn.values.password}
                    onChange={loginForn.handleChange}
                    onBlur={loginForn.handleBlur}
                    className={`
      block w-full px-4 py-3 rounded-xl border transition-all outline-none
      bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
      
      ${
        loginForn.touched.password && loginForn.errors.password
          ? "border-red-500 ring-1 ring-red-500 focus:ring-red-600"
          : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      }
    `}
                    placeholder="you@company.com"
                  />

                  {loginForn.touched.password && loginForn.errors.password && (
                    <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">
                      {loginForn.errors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember_me"
                    checked={loginForn.values.remember_me}
                    onChange={loginForn.handleChange}
                    onBlur={loginForn.handleBlur}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-500 dark:text-gray-400"
                  >
                    Remember me
                  </label>
                  {loginForn.touched.remember_me &&
                    loginForn.errors.remember_me && (
                      <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">
                        {loginForn.errors.remember_me}
                      </p>
                    )}
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-bold text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform active:scale-[0.98] transition-all"
              >
                Sign In
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-bold text-blue-600 hover:text-blue-500"
              >
                Contacts Admin
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE/OVERLAY SECTION */}
      <div className="hidden lg:block relative flex-1 w-0">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="../hero.png" // High-quality Logistics Image
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
              "This platform has completely transformed how we manage training
              for new logistics fresher recruits and IT-related computer
              training.."
            </p>
            <footer className="flex flex-col">
              <span className="text-lg font-bold">Chintan Adatiya</span>
              <span className="text-blue-400">
                Operations Director at Logistic
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
