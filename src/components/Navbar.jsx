// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        {/* Logo & App Name */}
        <div className="flex items-center gap-2">
           <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none">
             <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <Link
            to={user?.role ? `/${user.role}` : '/'}
            className="flex items-center gap-2"
          >
            {/* Simple book icon */}
            <span className="bg-primary rounded-lg p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/>
                <rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/>
                <path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="text-2xl font-bold text-gray-900">EduLearn</span>
          </Link>
        </div>

        {/* Right section - Profile Dropdown */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center focus:outline-none"
                onClick={() => setOpen((v) => !v)}
              >
                {/* Avatar */}
                <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-700">
                  {user.name ? user.name[0] : user.email[0]}
                </span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-800 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{user.name || user.email}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        to={`/${user.role}/profile`}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                        onClick={() => setOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}