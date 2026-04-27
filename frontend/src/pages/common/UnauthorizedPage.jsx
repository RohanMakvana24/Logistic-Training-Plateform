import React from "react";
import { ShieldAlert, ArrowLeft, LockKeyhole, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon Header */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
            <LockKeyhole className="w-16 h-16 text-red-500 mx-auto" />
            <ShieldAlert className="w-8 h-8 text-amber-500 absolute -bottom-2 -right-2 animate-bounce" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          RESTRICTED AREA
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Your current clearance level does not permit entry to this sector of
          the
          <span className="font-bold text-green-700 dark:text-green-500">
            {" "}
            Logistic Training Camp
          </span>
          .
        </p>

        {/* Interactive Console Mockup */}
        <div className="bg-gray-900 rounded-lg p-4 mb-8 text-left font-mono text-sm shadow-inner">
          <div className="flex gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          <p className="text-red-400 underline mb-1">Error: 403_FORBIDDEN</p>
          <p className="text-gray-500">{`> Identification: Unverified`}</p>
          <p className="text-gray-500">{`> Status: Access_Denied`}</p>
          <p className="text-green-500 animate-pulse">{`> Redirecting recommended...`}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-green-600 text-white font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-green-500 transition-all shadow-lg shadow-gray-200 dark:shadow-none"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
