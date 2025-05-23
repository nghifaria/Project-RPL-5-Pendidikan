import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()
  const menus = {
    guru: [
      { label: 'Dashboard',           path: '/guru' },
      { label: 'Materi & Tugas',      path: '/guru/materials' },
      { label: 'Lihat Submisi Tugas', path: '/guru/submissions' },
    ],
    admin: [
      { label: 'Dashboard',     path: '/admin' },
      { label: 'Kelola Mapel',  path: '/admin/subjects' },
      { label: 'Kelola User',   path: '/admin/users' },
      { label: 'Kelola Forum',  path: '/admin/forums' }, // tambah ini
    ],
    siswa: [
      { label: 'Dashboard',        path: '/siswa' },
      { label: 'Tugas & Materi',   path: '/siswa/assignments' },
      { label: 'Nilai Saya',       path: '/siswa/grades' },
    ],
  }
  if (!user) return null

  return (
    <aside className="w-64 bg-white min-h-screen border-r border-gray-200 py-6 px-3 flex flex-col gap-2">
      <nav className="flex flex-col gap-1">
        {menus[user.role].map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
              ${isActive
                ? 'bg-[#4B23A0] text-white'
                : 'text-gray-900 hover:bg-gray-100'}`
            }
            end
          >
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {(user?.role === 'guru' || user?.role === 'siswa') && (
        <Link to="/forum-tugas" className="sidebar-item">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8zM7 12V6a2 2 0 012-2h8" />
          </svg>
          Forum Tugas
        </Link>
      )}
    </aside>
  )
}
