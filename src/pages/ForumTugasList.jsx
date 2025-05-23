import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function ForumTugasList() {
  const [forums, setForums] = useState([])
  const navigate = useNavigate()

  useEffect(() => { fetchForums() }, [])

  async function fetchForums() {
    // Coba filter type='tugas', jika error fallback ke select semua
    let { data, error } = await supabase
      .from('forums')
      .select('*')
      .eq('type', 'tugas')
      .order('created_at', { ascending: false })
    if (error) {
      // fallback jika kolom type tidak ada
      const res = await supabase
        .from('forums')
        .select('*')
        .order('created_at', { ascending: false })
      data = res.data
    }
    setForums(data || [])
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Kembali
      </button>
      <h1 className="text-2xl font-bold mb-4">Forum Tugas</h1>
      <div className="space-y-4">
        {forums.map(forum => (
          <Link
            key={forum.id}
            to={`/forum-tugas/${forum.id}`}
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
