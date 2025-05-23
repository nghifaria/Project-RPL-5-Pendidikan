import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    const { data } = await supabase
      .from('subjects')
      .select('id, name, description')
      .order('name', { ascending: true })
    setSubjects(data || [])
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName) return setStatus('Nama mapel wajib diisi!')
    const { error } = await supabase
      .from('subjects')
      .insert([{ name: newName, description: newDesc }])
    if (error) setStatus('Gagal tambah: ' + error.message)
    else {
      setNewName('')
      setNewDesc('')
      setStatus('✅ Mapel berhasil ditambah')
      fetchSubjects()
    }
  }

  function startEdit(sub) {
    setEditingId(sub.id)
    setEditName(sub.name)
    setEditDesc(sub.description || '')
    setStatus('')
  }

  async function handleEdit(e) {
    e.preventDefault()
    const { error } = await supabase
      .from('subjects')
      .update({ name: editName, description: editDesc })
      .eq('id', editingId)
    if (error) setStatus('Gagal update: ' + error.message)
    else {
      setEditingId(null)
      setEditName('')
      setEditDesc('')
      setStatus('✅ Berhasil diupdate')
      fetchSubjects()
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Yakin ingin menghapus mapel ini? Semua materi, tugas, dan submissions terkait juga akan hilang!')) return

    // Ambil semua assignments dari subject yang akan dihapus
    const { data: assignments } = await supabase.from('assignments').select('id').eq('subject_id', id)

    // Hapus semua submissions untuk assignments itu (jika ada assignments)
    if (assignments && assignments.length > 0) {
      const assignmentIds = assignments.map(a => a.id)
      await supabase.from('submissions').delete().in('assignment_id', assignmentIds)
      await supabase.from('assignments').delete().in('id', assignmentIds)
    }

    // Hapus semua materials yang terkait
    await supabase.from('materials').delete().eq('subject_id', id)

    // Hapus subject
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) setStatus('Gagal hapus: ' + error.message)
    else {
      setStatus('✅ Mapel & data terkait dihapus')
      fetchSubjects()
    }
  }


  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        {/* Book icon */}
        <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/><rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Kelola Mata Pelajaran
      </h2>
      <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-3 bg-white border border-gray-200 rounded-xl shadow p-4">
        <input
          className="input input-bordered"
          placeholder="Nama mapel baru"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Deskripsi (opsional)"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
        />
        <button className="btn btn-primary w-fit flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          Tambah Mapel
        </button>
      </form>
      {status && (
        <div className={`mb-4 text-sm px-3 py-2 rounded ${
          status.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status}
        </div>
      )}
      <ul className="space-y-4">
        {subjects.map(sub =>
          editingId === sub.id ? (
            <li key={sub.id} className="bg-white border border-violet-200 p-4 rounded-xl shadow flex flex-col gap-2">
              <form onSubmit={handleEdit} className="flex flex-col gap-2">
                <input
                  className="input input-bordered"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <input
                  className="input input-bordered"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Deskripsi (opsional)"
                />
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary btn-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    Simpan
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setEditingId(null)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </li>
          ) : (
            <li key={sub.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{sub.name}</div>
                <div className="text-sm text-gray-500">{sub.description}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-xs btn-outline flex items-center gap-1"
                  onClick={() => startEdit(sub)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11-11a2.828 2.828 0 00-4-4L5 17v4z"/></svg>
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-error flex items-center gap-1"
                  onClick={() => handleDelete(sub.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  Hapus
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
