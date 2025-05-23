import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/client'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // manual cek tabel users
    const { data, error: sbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()

    if (sbError) {
      setError('Login gagal: ' + sbError.message)
      return
    }
    if (!data) {
      setError('Email/password salah!')
      return
    }

    // simpan user ke Context
    login(data)

    // redirect sesuai role
    if (data.role === 'admin') {
      navigate('/admin/subjects', { replace: true })
    } else if (data.role === 'guru') {
      navigate('/guru/materials', { replace: true })
    } else if (data.role === 'siswa') {
      navigate('/siswa/materials', { replace: true })
    } else {
      setError('Role tidak dikenali')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white border border-gray-200 rounded-xl shadow p-8 w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-5 justify-center">
          <span className="bg-gradient-to-tr from-violet-600 to-blue-400 rounded-lg p-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/>
              <rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/>
              <path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-gray-500">Login LMS SMA</h1>
        </div>
        {error && (
          <div className="mb-4 text-sm px-3 py-2 rounded bg-red-50 text-red-700">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3 bg-white text-gray-800 placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-3 bg-white text-gray-800 placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full rounded-xl text-base font-bold tracking-wide bg-gradient-to-r from-violet-600 to-blue-500 text-white py-3 hover:from-violet-700 hover:to-blue-600 transition">
          Login
        </button>
      </form>
    </div>
  )
}
