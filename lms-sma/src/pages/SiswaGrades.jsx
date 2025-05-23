import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function SiswaGrades() {
  const [submissions, setSubmissions] = useState([])
  const user = JSON.parse(localStorage.getItem('lms-user'))

  useEffect(() => {
    async function fetchGrades() {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, assignment_id, grade, feedback, submitted_at, assignments(title)')
        .eq('student_id', user.id)
        .order('submitted_at', { ascending: false })
      if (!error && data) setSubmissions(data)
    }
    fetchGrades()
  }, [user.id])

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl mb-6 font-bold text-center flex items-center gap-2 justify-center">
        <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4"/></svg>
        Nilai & Feedback Saya
      </h2>
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="italic text-center">Belum ada tugas yang dinilai.</div>
        ) : (
          submissions.map((sub) => (
            <div key={sub.id} className="bg-white border border-gray-200 p-5 rounded-xl shadow">
              <p>
                <b>Assignment:</b> {sub.assignments?.title || <span className="text-gray-400">Tanpa Judul</span>}
              </p>
              <p><b>Dikumpulkan:</b> {new Date(sub.submitted_at).toLocaleString()}</p>
              <p>
                <b>Nilai:</b>{' '}
                {sub.grade !== null && sub.grade !== undefined
                  ? <span className="font-semibold text-green-700">{sub.grade}</span>
                  : <span className="italic text-gray-500">Belum dinilai</span>
                }
              </p>
              <p>
                <b>Feedback:</b>{' '}
                {sub.feedback
                  ? <span className="text-blue-700">{sub.feedback}</span>
                  : <span className="italic text-gray-500">-</span>
                }
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
