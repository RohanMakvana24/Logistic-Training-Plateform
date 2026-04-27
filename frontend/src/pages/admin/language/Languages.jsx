import React from "react";
import {
  Search,
  Plus,
  ExternalLink,
  Play,
  Pause,
  MoreHorizontal,
  ChevronDown,
  Home,
  ChevronRight,
} from "lucide-react";

// --- Sub-components ---

const StatusBadge = ({ status }) => {
  const styles = {
    "In progress": "bg-blue-50 text-blue-600",
    Completed: "bg-green-50 text-green-600",
    "In review": "bg-yellow-50 text-yellow-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}
    >
      {status}
    </span>
  );
};

const ProgressBar = ({ progress, status }) => {
  const color =
    status === "Completed"
      ? "bg-green-500"
      : status === "In review"
        ? "bg-yellow-500"
        : "bg-blue-600";
  return (
    <div className="flex items-center gap-3 w-full max-w-[150px]">
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${progress}%` }} />
      </div>
      <span className="text-xs text-gray-500 font-medium">{progress}%</span>
    </div>
  );
};

// --- Main Component ---

export default function LanguageOverview() {
  const projects = [
    {
      name: "Upload feed and Reels in Instagram",
      status: "In progress",
      progress: 75,
      time: "6:47/8:00",
      date: "23 Nov 2025",
      preview: true,
      active: true,
    },
    {
      name: "Crossplatform analysis",
      status: "Completed",
      progress: 100,
      time: "7:00",
      date: "03 Nov 2025",
      preview: true,
    },
    {
      name: "Product features analysis",
      status: "In progress",
      progress: 50,
      time: "3:25/8:00",
      date: "Yesterday",
      preview: true,
      active: true,
    },
    {
      name: "Create user story",
      status: "Completed",
      progress: 100,
      time: "8:00",
      date: "23 Nov 2025",
      preview: false,
    },
    {
      name: "Update design system",
      status: "In review",
      progress: 100,
      time: "7:00",
      date: "02 Nov 2025",
      preview: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-900">
      {/* Breadcrumbs & Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Home size={14} /> <ChevronRight size={14} />
            <span>Project management</span> <ChevronRight size={14} />
            <span className="text-blue-600 font-medium">All projects</span>
          </nav>
          <h1 className="text-2xl font-bold">All projects</h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all">
          <Plus size={18} /> Add new project
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search for projects"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {[
          "Status",
          "Number of users",
          "Progress",
          "Preview link",
          "Due date",
        ].map((filter) => (
          <div
            key={filter}
            className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 min-w-[140px] cursor-pointer hover:bg-gray-50"
          >
            {filter} <ChevronDown size={14} />
          </div>
        ))}
      </div>

      {/* Secondary Filter Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-gray-500 font-medium">Show:</span>
          {["All", "Completed", "In progress", "In review"].map((tab) => (
            <label
              key={tab}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="filter"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                defaultChecked={tab === "All"}
              />
              <span className="group-hover:text-blue-600 transition-colors">
                {tab}
              </span>
            </label>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">
          Actions <ChevronDown size={14} />
        </button>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
            <tr>
              <th className="p-4 w-8">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Users</th>
              <th className="p-4 font-semibold">Progress</th>
              <th className="p-4 font-semibold">Preview</th>
              <th className="p-4 font-semibold">Time Tracking</th>
              <th className="p-4 font-semibold">Due Date</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {projects.map((project, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="p-4 font-medium text-slate-700">
                  {project.name}
                </td>
                <td className="p-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="p-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((u) => (
                      <div
                        key={u}
                        className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                      >
                        <img
                          src={`https://i.pravatar.cc/100?u=${idx}${u}`}
                          alt="user"
                        />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <ProgressBar
                    progress={project.progress}
                    status={project.status}
                  />
                </td>
                <td className="p-4">
                  {project.preview ? (
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-blue-600 hover:underline"
                    >
                      <ExternalLink size={14} /> Website
                    </a>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs ${project.active ? "text-green-600" : "text-gray-500"}`}
                    >
                      {project.time}
                    </span>
                    <button
                      className={`${project.active ? "text-orange-500" : "text-green-600"}`}
                    >
                      {project.active ? (
                        <Pause size={16} fill="currentColor" />
                      ) : (
                        <Play size={16} fill="currentColor" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{project.date}</td>
                <td className="p-4 text-gray-400">
                  <MoreHorizontal size={18} className="cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
