import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function SiswaMaterials() {
  const [subjects, setSubjects] = useState([])
  const [selectedSubj, setSelectedSubj] = useState('')
  const [materials, setMaterials] = useState([])

  // load daftar mapel
  useEffect(() => {
    supabase.from('subjects')
      .select('id,name')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setSubjects(data)
      })
  }, [])

  // load materi untuk mapel terpilih
  useEffect(() => {
    if (!selectedSubj) return setMaterials([])
    supabase.from('materials')
      .select('*')
      .eq('subject_id', selectedSubj)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setMaterials(data)
      })
  }, [selectedSubj])

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-semibold mb-8 flex items-center gap-2 text-black tracking-tight font-sans">
        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/><rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Daftar Materi
      </h2>
      <div className="mb-6">
        <select
          className="select select-bordered w-full max-w-xs bg-white text-black border-gray-300 text-lg px-4 py-3 rounded-xl font-sans"
          value={selectedSubj}
          onChange={e => setSelectedSubj(e.target.value)}
        >
          <option value="">-- Pilih Mata Pelajaran --</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedSubj === '' ? (
        <p className="italic text-gray-400">Pilih mata pelajaran untuk melihat materinya.</p>
      ) : materials.length === 0 ? (
        <p className="italic text-gray-400">Belum ada materi untuk mapel ini.</p>
      ) : (
        <ul className="space-y-4">
          {materials.map(m => (
            <li key={m.id} className="flex justify-between items-center bg-white border border-gray-300 p-5 rounded-xl shadow font-sans">
              <span className="font-medium text-lg text-black">{m.title}</span>
              <a
                href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/materials/${m.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline rounded-xl text-violet-700 border-violet-200 hover:bg-violet-100 px-5 py-2"
              >
                Lihat
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
