// src/pages/DashboardGuru.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardGuru() {
  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-2xl font-extrabold mb-10 flex items-center gap-2 text-gray-900 tracking-tight">
        <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/><rect width="20" height="20" x="2" y="2" rx="5" stroke="#a78bfa" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Dashboard Guru
      </h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {/* Materi & Tugas */}
        <Link
          to="/guru/materials"
          className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-md px-12 py-10 hover:shadow-lg transition"
        >
          <svg className="w-10 h-10 mb-3 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#a78bfa" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span className="text-lg font-semibold text-gray-900">Materi & Tugas</span>
        </Link>
        {/* Submissions */}
        <Link
          to="/guru/submissions"
          className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-md px-12 py-10 hover:shadow-lg transition"
        >
          <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#60a5fa" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-lg font-semibold text-gray-900">Submissions</span>
        </Link>
      </div>
    </div>
)
}
