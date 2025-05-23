// src/pages/DashboardSiswa.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardSiswa() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-extrabold mb-10 flex items-center gap-2 text-gray-800 tracking-tight">
        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/><rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Dashboard Siswa
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Tugas & Materi */}
        <Link
          to="/siswa/assignments"
          className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl hover:border-violet-300 transition"
        >
          <span className="mb-4">
            <svg className="w-12 h-12 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/></svg>
          </span>
          <span className="text-xl font-bold text-gray-900">Tugas & Materi</span>
        </Link>
        {/* Nilai */}
        <Link
          to="/siswa/grades"
          className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl hover:border-violet-300 transition"
        >
          <span className="mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4"/></svg>
          </span>
          <span className="text-xl font-bold text-gray-900">Nilai Saya</span>
        </Link>
      </div>
    </div>
  )
}
