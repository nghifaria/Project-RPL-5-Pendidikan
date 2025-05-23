import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { Link }    from 'react-router-dom'

export default function DashboardAdmin() {
  const [counts, setCounts] = useState({
    users: 0,
    subjects: 0,
    materials: 0,
    assignments: 0
  })

  useEffect(() => {
    async function fetchCounts() {
      const { count: uCount } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })

      const { count: sCount } = await supabase
        .from('subjects')
        .select('id', { count: 'exact', head: true })

      const { count: mCount } = await supabase
        .from('materials')
        .select('id', { count: 'exact', head: true })

      const { count: aCount } = await supabase
        .from('assignments')
        .select('id', { count: 'exact', head: true })

      setCounts({
        users: uCount || 0,
        subjects: sCount || 0,
        materials: mCount || 0,
        assignments: aCount || 0
      })
    }
    fetchCounts()
  }, [])

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Dashboard Admin</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 flex items-center gap-4">
          <span className="bg-violet-100 text-violet-600 rounded-lg p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
          </span>
          <div>
            <div className="text-lg font-semibold">Users</div>
            <div className="text-3xl font-bold">{counts.users}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 flex items-center gap-4">
          <span className="bg-blue-100 text-blue-600 rounded-lg p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M7 8h10M7 12h10M7 16h6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </span>
          <div>
            <div className="text-lg font-semibold">Subjects</div>
            <div className="text-3xl font-bold">{counts.subjects}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 flex items-center gap-4">
          <span className="bg-green-100 text-green-600 rounded-lg p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13.5z"/><path d="M16 2v4"/></svg>
          </span>
          <div>
            <div className="text-lg font-semibold">Materials</div>
            <div className="text-3xl font-bold">{counts.materials}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 flex items-center gap-4">
          <span className="bg-orange-100 text-orange-600 rounded-lg p-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/></svg>
          </span>
          <div>
            <div className="text-lg font-semibold">Assignments</div>
            <div className="text-3xl font-bold">{counts.assignments}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          to="/admin/subjects"
          className="btn btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M7 8h10M7 12h10M7 16h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Kelola Mata Pelajaran
        </Link>
        <Link
          to="/admin/users"
          className="btn btn-secondary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
          Kelola User
        </Link>
      </div>
    </div>
  )
}
