// src/pages/UploadMateri.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate }      from 'react-router-dom'
import DefaultLayout                   from '../layouts/DefaultLayout'
import { supabase }                    from '../supabase/client'
import { v4 as uuidv4 }                from 'uuid'

export default function UploadMateri() {
  const { subjectId } = useParams()
  const [file, setFile]           = useState(null)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  // Redirect kalau belum auth
  useEffect(() => {
    const session = supabase.auth.session() || supabase.auth.getSession()
    if (!session) navigate('/login')
  }, [])

  async function handleUpload() {
    if (!file) {
      return alert('⚠️ Mohon pilih file PDF terlebih dahulu.')
    }
    try {
      setUploading(true)

      // 1) Generate nama & path
      const ext      = file.name.split('.').pop()
      const filename = `${uuidv4()}.${ext}`
      const path     = `materials/${filename}`

      // 2) Upload ke bucket 'materials'
      let { error: uploadError } = await supabase
        .storage
        .from('materials')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw uploadError

      // 3) Dapatkan public URL
      let { data: urlData, error: urlError } = supabase
        .storage
        .from('materials')
        .getPublicUrl(path)
      if (urlError) throw urlError
      const publicUrl = urlData.publicUrl

      // 4) Insert ke tabel materials
      let { error: dbError } = await supabase
        .from('materials')
        .insert([{
          subject_id : subjectId,
          title      : file.name,
          file_url   : publicUrl,
          uploaded_by: supabase.auth.session()?.user.id,
          created_at : new Date()
        }])
      if (dbError) throw dbError

      alert('✅ Materi berhasil di-upload!')
      setFile(null)
    } catch (err) {
      console.error('Upload error:', err)
      alert('❌ Gagal upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <DefaultLayout>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/><rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Upload Materi Pelajaran
        </h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files[0] ?? null)}
            className="file-input file-input-bordered w-full"
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`btn btn-primary w-full ${uploading ? 'btn-disabled' : ''}`}
          >
            {uploading ? 'Mengunggah…' : 'Upload Materi'}
          </button>
        </div>
      </div>
    </DefaultLayout>
  )
}
