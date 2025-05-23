import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function AdminForums() {
  const [forums, setForums] = useState([])
  const [showForm, setShowForm] = useState(false) // tambah state ini
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchForums()
  }, [])

  async function fetchForums() {
    const { data } = await supabase.from('forums').select('*').order('created_at', { ascending: false })
    setForums(data || [])
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title) return setStatus('Judul wajib diisi')
    const { error } = await supabase.from('forums').insert([{ title, description: desc }])
    if (error) setStatus('Gagal tambah: ' + error.message)
    else {
      setTitle('')
      setDesc('')
      setStatus('✅ Forum berhasil dibuat')
      fetchForums()
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus forum beserta semua pesan?')) return
    // Hapus semua pesan forum
    await supabase.from('forum_messages').delete().eq('forum_id', id)
    // Hapus forum
    const { error } = await supabase.from('forums').delete().eq('id', id)
    if (error) setStatus('Gagal hapus: ' + error.message)
    else {
      setStatus('✅ Forum dihapus')
      fetchForums()
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Forum Diskusi</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Batal' : '+ Buat Forum'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-3 bg-white border border-gray-200 rounded-xl shadow p-4">
          <input
            className="input input-bordered"
            placeholder="Judul forum"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            className="input input-bordered"
            placeholder="Deskripsi (opsional)" 
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <button className="btn btn-primary w-fit">Simpan Forum</button>
        </form>
      )}

      {status && (
        <div className={`mb-4 text-sm px-3 py-2 rounded ${
          status.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status}
        </div>
      )}
      <ul className="space-y-4">
        {forums.map(forum => (
          <li key={forum.id} className="bg-white border p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg">{forum.title}</div>
              <div className="text-sm text-gray-500">{forum.description}</div>
            </div>
            <button
              className="btn btn-xs btn-error"
              onClick={() => handleDelete(forum.id)}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
