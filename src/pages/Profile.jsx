import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/client'

export default function Profile() {
  const { user, login } = useAuth()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  if (!user) return null

  async function handleSave(e) {
    e.preventDefault()
    setStatus('')
    // Update ke Supabase
    const updates = { name, email }
    if (password) updates.password = password
    const { error, data } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (error) {
      setStatus('Gagal update: ' + error.message)
    } else {
      setStatus('✅ Profil berhasil diupdate')
      login({ ...user, ...updates }) // update context
      setEdit(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-14 bg-white border border-gray-100 rounded-2xl shadow-2xl p-10">
      <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-800 tracking-tight">
        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
        Profil Saya
      </h2>
      {status && (
        <div className={`mb-6 text-base px-4 py-3 rounded-xl ${
          status.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status}
        </div>
      )}
      {!edit ? (
        <div className="space-y-5 text-gray-800 text-lg">
          <div><span className="font-semibold">Nama:</span> {user.name}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">Role:</span> <span className="capitalize">{user.role}</span></div>
          <button className="btn btn-primary mt-8 px-8 py-3 rounded-full text-base font-semibold shadow hover:scale-105 transition" onClick={() => setEdit(true)}>
            Edit Profil
          </button>
        </div>
      ) : (
        <form className="space-y-7" onSubmit={handleSave}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-500">Nama</label>
            <input
              className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400 text-lg px-5 py-3 rounded-xl"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-500">Email</label>
            <input
              className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400 text-lg px-5 py-3 rounded-xl"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-500">Password (opsional)</label>
            <input
              className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-400 text-lg px-5 py-3 rounded-xl"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin ganti"
              autoComplete="new-password"
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button type="submit" className="btn btn-primary px-8 py-3 rounded-full text-base font-semibold shadow hover:scale-105 transition">Simpan</button>
            <button type="button" className="btn btn-outline px-8 py-3 rounded-full text-base font-semibold" onClick={() => setEdit(false)}>
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
