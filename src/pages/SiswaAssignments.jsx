import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import UploadTugas from './UploadTugas'

export default function SiswaAssignments() {
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [tab, setTab] = useState('materi')
  const [materials, setMaterials] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState({})
  const [uploadingAssignment, setUploadingAssignment] = useState(null)
  const user = JSON.parse(localStorage.getItem('lms-user'))

  // Fetch subjects (kelas/mapel)
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

  // Fetch materials & assignments for selectedSubject
  useEffect(() => {
    if (!selectedSubject) {
      setMaterials([])
      setAssignments([])
      return
    }
    async function fetchAll() {
      const { data: matData } = await supabase
        .from('materials')
        .select('id, title, file_url, uploaded_at, subject_id')
        .eq('subject_id', selectedSubject.id)
        .order('uploaded_at', { ascending: false })
      setMaterials(matData || [])

      // **PASTIKAN select ambil file_url di assignments!**
      const { data: assignmentList } = await supabase
        .from('assignments')
        .select('id, title, due_date, subject_id, file_url')
        .eq('subject_id', selectedSubject.id)
        .order('due_date', { ascending: true })
      setAssignments(assignmentList || [])

      const { data: submissionList } = await supabase
        .from('submissions')
        .select('id, assignment_id, file_url, grade, feedback, submitted_at')
        .eq('student_id', user.id)
      const map = {}
      for (const sub of submissionList || []) {
        if (!map[sub.assignment_id] || new Date(sub.submitted_at) > new Date(map[sub.assignment_id].submitted_at)) {
          map[sub.assignment_id] = sub
        }
      }
      setSubmissions(map)
    }
    fetchAll()
    // eslint-disable-next-line
  }, [selectedSubject, user.id, uploadingAssignment])

  // Download handlers
  async function handleDownloadMaterial(fileUrl) {
    const { data, error } = await supabase
      .storage
      .from('materials')
      .createSignedUrl(fileUrl, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else alert('Gagal download')
  }
  async function handleDownloadSubmission(fileUrl) {
    const { data, error } = await supabase
      .storage
      .from('submissions')
      .createSignedUrl(fileUrl, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else alert('Gagal download')
  }
  // **Handler baru: Download file tugas dari guru**
  async function handleDownloadAssignment(fileUrl) {
    if (!fileUrl) return
    // Ganti 'assignments' sesuai nama bucket Storage untuk file tugas!
    const { data, error } = await supabase
      .storage
      .from('assignments')
      .createSignedUrl(fileUrl, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else alert('Gagal download tugas dari guru')
  }

  function showUploadForm(assignmentId) {
    setUploadingAssignment(assignmentId)
  }
  function closeUploadForm() {
    setUploadingAssignment(null)
  }

  // Render: card list jika belum pilih kelas, tab materi/tugas jika sudah
  if (!selectedSubject) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Pilih Kelas</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {subjects.length === 0 ? (
            <div className="italic col-span-2 text-center">Belum ada kelas tersedia.</div>
          ) : (
            subjects.map(subj => (
              <button
                key={subj.id}
                onClick={() => {
                  setSelectedSubject(subj)
                  setTab('materi')
                }}
                className="bg-white border border-gray-200 rounded-xl shadow p-6 text-left hover:bg-violet-50 transition flex flex-col"
              >
                <span className="text-lg font-semibold">{subj.name}</span>
                <span className="text-sm text-gray-500 mt-2">{subj.description || '-'}</span>
              </button>
            ))
          )}
        </div>
      </div>
    )
  }

  // Jika sudah pilih kelas, tampilkan tab
  return (
    <div className="max-w-2xl mx-auto">
      <button
        className="btn btn-xs btn-outline mb-4"
        onClick={() => setSelectedSubject(null)}
      >
        &larr; <span className="text-gray-900 font-medium">Kembali ke Daftar Kelas</span>
      </button>
      <h2 className="text-2xl mb-2 text-center text-gray-900 font-semibold">{selectedSubject.name}</h2>
      <div className="flex gap-4 justify-center mb-8">
        <button
          className={`px-8 py-3 rounded-xl font-medium text-base border transition ${
            tab === 'materi'
              ? 'bg-violet-600 text-white border-violet-600 shadow'
              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setTab('materi')}
        >
          Materi
        </button>
        <button
          className={`px-8 py-3 rounded-xl font-medium text-base border transition ${
            tab === 'tugas'
              ? 'bg-violet-600 text-white border-violet-600 shadow'
              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setTab('tugas')}
        >
          Tugas
        </button>
      </div>

      {tab === 'materi' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6 mb-8">
          <h3 className="font-semibold text-lg mb-2">Materi</h3>
          {materials.length === 0 ? (
            <div className="italic">Belum ada materi.</div>
          ) : (
            <ul className="space-y-2">
              {materials.map(mat => (
                <li key={mat.id} className="bg-violet-50 border border-violet-100 rounded p-3 flex justify-between items-center">
                  <span className="font-medium">{mat.title}</span>
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={() => handleDownloadMaterial(mat.file_url)}
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'tugas' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="font-semibold text-2xl mb-6 text-gray-900">Tugas</h3>
          {assignments.length === 0 ? (
            <div className="italic text-gray-400">Tidak ada tugas.</div>
          ) : (
            <div className="space-y-7">
              {assignments.map(asgn => {
                const sub = submissions[asgn.id]
                return (
                  <div
                    key={asgn.id}
                    className="relative bg-gradient-to-br from-white to-blue-50 border border-violet-100 rounded-xl p-6 flex flex-col gap-2 shadow group transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <span className="text-lg font-semibold text-gray-900">{asgn.title}</span>
                      <span className="text-xs text-gray-400 font-medium">
                        Deadline: {new Date(asgn.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-gray-700">Lampiran Tugas:</span>
                      {asgn.file_url
                        ? (
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-green-600 transition"
                            onClick={() => handleDownloadAssignment(asgn.file_url)}
                          >
                            Download
                          </button>
                        )
                        : <span className="text-gray-400">Tidak ada</span>
                      }
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-700">Status:</span>
                      {sub
                        ? (
                          <span className="text-green-600 font-medium">
                            Sudah dikumpulkan
                            <span className="block text-xs text-gray-400 font-normal">
                              {new Date(sub.submitted_at).toLocaleString()}
                            </span>
                          </span>
                        )
                        : (
                          <span className="text-red-500 font-medium flex items-center gap-1">
                            <span className="text-lg font-bold">✗</span>
                            Belum dikumpulkan
                          </span>
                        )
                      }
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-700">File Tugas Anda:</span>
                      {sub && sub.file_url
                        ? (
                          <button
                            onClick={() => handleDownloadSubmission(sub.file_url)}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-gray-300 transition"
                          >
                            Download
                          </button>
                        )
                        : <span className="text-gray-400">-</span>
                      }
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-700">Nilai:</span>
                      {sub && sub.grade !== null && sub.grade !== undefined
                        ? <span className="font-semibold text-green-700">{sub.grade}</span>
                        : <span className="italic text-gray-400">-</span>
                      }
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-700">Feedback:</span>
                      {sub && sub.feedback
                        ? <span className="text-blue-700">{sub.feedback}</span>
                        : <span className="italic text-gray-400">-</span>
                      }
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {!sub && uploadingAssignment !== asgn.id && (
                        <button
                          className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:from-violet-700 hover:to-blue-600 transition flex items-center gap-2"
                          onClick={() => showUploadForm(asgn.id)}
                        >
                          <span className="text-lg font-bold">+</span> Upload Tugas
                        </button>
                      )}
                      {sub && uploadingAssignment !== asgn.id && (
                        <button
                          className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:from-pink-600 hover:to-violet-500 transition flex items-center gap-2"
                          onClick={() => showUploadForm(asgn.id)}
                        >
                          <span className="text-lg font-bold">✎</span> Perbarui Tugas
                        </button>
                      )}
                    </div>
                    {uploadingAssignment === asgn.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center rounded-xl shadow-lg p-4">
                        <UploadTugas
                          assignmentId={asgn.id}
                          onUploaded={closeUploadForm}
                          onClose={closeUploadForm}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
