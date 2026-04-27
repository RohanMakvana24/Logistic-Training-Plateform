import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Calendar,
  Users,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";

export default function CreateProject() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-slate-800 transition-colors mb-4">
          <ArrowLeft size={16} /> Back to projects
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Create new project
          </h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white transition-all">
              Save as draft
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all">
              Publish Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Basic Info */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">General Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Redesign Landing Page"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="What is this project about?"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section: Deliverables / Links */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Project Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 cursor-pointer transition-colors">
                <Upload className="text-gray-400" size={24} />
                <span className="text-sm font-medium text-gray-600">
                  Upload brief (PDF/DOC)
                </span>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-3">
                <LinkIcon className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Preview link (URL)"
                  className="w-full text-sm focus:outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              Project Settings
            </h2>

            <div className="space-y-5">
              {/* Status Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Status
                </label>
                <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  <option>In progress</option>
                  <option>In review</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={14}
                  />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Assign Users */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Team Members
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Dummy User Avatars */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-600">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-[10px] font-bold text-green-600">
                    AS
                  </div>
                  <button className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
                    <Users size={14} />
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* Checklist Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle2 size={14} /> Description added
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3.5 h-3.5 border border-gray-300 rounded-full" />{" "}
                No team members added
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
