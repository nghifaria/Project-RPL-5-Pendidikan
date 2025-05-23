import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('siswa')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // fetch semua users
  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true })
    if (error) setError(error.message)
    else setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // tambah user
  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('Semua field wajib diisi')
      return
    }
    const { error } = await supabase.from('users').insert([{
      name,
      email,
      password,
      role
    }])
    if (error) setError(error.message)
    else {
      setName(''); setEmail(''); setPassword(''); setRole('siswa')
      fetchUsers()
    }
  }

  // update user
  const handleUpdate = async (id) => {
    const newName = prompt('Nama baru:', users.find(u => u.id === id).name)
    const newEmail = prompt('Email baru:', users.find(u => u.id === id).email)
    const newRole = prompt('Role baru (admin/guru/siswa):', users.find(u => u.id === id).role)
    if (!newName || !newEmail || !newRole) return
    const { error } = await supabase.from('users')
      .update({ name: newName, email: newEmail, role: newRole })
      .eq('id', id)
    if (error) setError(error.message)
    else fetchUsers()
  }

  // hapus user
  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus user ini?')) return
    const { error } = await supabase.from('users')
      .delete()
      .eq('id', id)
    if (error) setError(error.message)
    else fetchUsers()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        {/* User icon */}
        <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
        Kelola User
      </h2>
      {error && (
        <div className="mb-4 text-sm px-3 py-2 rounded bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-6 bg-white border border-gray-200 rounded-xl shadow p-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
        <input
          type="text"
          placeholder="Nama"
          className="input input-bordered"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="admin">admin</option>
          <option value="guru">guru</option>
          <option value="siswa">siswa</option>
        </select>
        <button type="submit" className="btn btn-primary flex items-center gap-2 sm:col-span-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          Tambah
        </button>
      </form>

      {loading
        ? <p>Loading…</p>
        : (
          <div className="bg-white border border-gray-200 rounded-xl shadow p-4">
            <table className="table w-full">
              <thead>
                <tr className="text-gray-700 font-semibold bg-gray-100">
                  <th>NAMA</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="capitalize">{u.role}</td>
                    <td>
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <button
                          onClick={() => handleUpdate(u.id)}
                          className="flex items-center gap-1 border border-gray-400 bg-white text-gray-800 px-3 py-1.5 rounded-md font-medium text-sm hover:bg-gray-100 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11-11a2.828 2.828 0 00-4-4L5 17v4z"/></svg>
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="flex items-center gap-1 bg-[#F87171] text-black px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-[#ef4444] transition"
                          style={{ border: 'none' }}
                        >
                          <span className="text-base font-bold" style={{fontFamily: 'monospace'}}>x</span>
                          HAPUS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
