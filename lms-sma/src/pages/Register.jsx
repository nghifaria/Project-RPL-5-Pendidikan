import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('siswa')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password, role }])
    if (error) setError(error.message)
    else navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <form className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg w-full max-w-md" onSubmit={handleRegister}>
        <div className="flex items-center gap-2 mb-6 justify-center">
          <span className="bg-gradient-to-tr from-violet-600 to-blue-400 rounded-lg p-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/>
              <rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/>
              <path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-gray-500">Register LMS SMA</h1>
        </div>
        {error && <div className="mb-4 text-sm px-3 py-2 rounded bg-red-50 text-red-700 text-center">{error}</div>}
        <input
          type="text"
          className="input input-bordered w-full mb-4 bg-white text-gray-800 placeholder-gray-400"
          placeholder="Nama"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          className="input input-bordered w-full mb-4 bg-white text-gray-800 placeholder-gray-400"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input input-bordered w-full mb-4 bg-white text-gray-800 placeholder-gray-400"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <select
          className="select select-bordered w-full mb-6 bg-white text-gray-800"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="siswa">Siswa</option>
          <option value="guru">Guru</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full rounded-xl text-base font-bold tracking-wide bg-gradient-to-r from-violet-600 to-blue-500 text-white py-3 hover:from-violet-700 hover:to-blue-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  )
}
