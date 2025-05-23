import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function SiswaKelas({ onSelectKelas }) {
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    async function fetchSubjects() {
      const { data } = await supabase
        .from('subjects')
        .select('id, name, description')
        .order('name', { ascending: true })
      setSubjects(data || [])
    }
    fetchSubjects()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-14 px-4">
      <h2 className="text-3xl font-semibold mb-12 text-center text-black tracking-tight font-sans">
        Pilih Kelas / Mapel
      </h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.length === 0 ? (
          <div className="italic col-span-4 text-center text-gray-400">Belum ada kelas tersedia.</div>
        ) : (
          subjects.map(subj => (
            <button
              key={subj.id}
              onClick={() => onSelectKelas(subj)}
              className="bg-white border border-gray-300 rounded-xl shadow-md p-7 text-left hover:shadow-lg hover:border-violet-400 transition flex flex-col cursor-pointer"
              style={{ minHeight: 140 }}
            >
              <span className="text-xl font-semibold text-black mb-2 font-sans">
                {subj.name}
              </span>
              <span className="text-base text-gray-800 font-sans">
                {subj.description || <span className="italic text-gray-300">-</span>}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
