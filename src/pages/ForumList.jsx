import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function ForumList({ currentUser }) {
  const [forums, setForums] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchForums()
  }, [])

  async function fetchForums() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('forums')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setForums(data || [])

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false) 
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setLoading(true)
    setStatus('')
    const { error } = await supabase.from('forums').insert([{ title, description: desc }])
    setLoading(false)
    if (error) {
      setStatus('Gagal membuat forum: ' + error.message)
    } else {
      setTitle('')
      setDesc('')
      setShowForm(false)
      setStatus('Forum berhasil dibuat')
      fetchForums()
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Forum Diskusi</h1>
        {currentUser?.role === 'admin' && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? 'Batal' : 'Buat Forum'}
          </button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-white border rounded-xl shadow p-4 flex flex-col gap-3">
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
          <button className="btn btn-primary w-fit" disabled={loading}>
            Simpan
          </button>
          {status && <div className="text-sm text-gray-600">{status}</div>}
        </form>
      )}
      <div className="space-y-4">
        {forums.map(forum => (
          <Link
            key={forum.id}
            to={`/forums/${forum.id}`}
            className="block p-4 bg-white rounded shadow hover:bg-violet-50"
          >
            <div className="font-semibold text-lg">{forum.title}</div>
            <div className="text-gray-500">{forum.description}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
