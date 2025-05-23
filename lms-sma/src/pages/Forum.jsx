import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function Forum({ currentUser }) {
  const [forums, setForums] = useState([])
  const [selectedForum, setSelectedForum] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchForums()
  }, [])

  async function fetchForums() {
    const { data } = await supabase.from('forums').select('*').order('created_at', { ascending: false })
    setForums(data || [])
  }

  async function selectForum(forum) {
    setSelectedForum(forum)
    setMessages([])
    const { data } = await supabase
      .from('forum_messages')
      .select('*, users(name)')
      .eq('forum_id', forum.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    const { error } = await supabase.from('forum_messages').insert([{
      forum_id: selectedForum.id,
      user_id: currentUser.id,
      message
    }])
    setMessage('')
    setLoading(false)
    if (!error) {
      selectForum(selectedForum)
    }
  }

  async function deleteMessage(id) {
    await supabase.from('forum_messages').delete().eq('id', id)
    setMessages(msgs => msgs.filter(m => m.id !== id))
  }

  return (
    <div className="flex max-w-4xl mx-auto gap-6 py-8">
      <div className="w-1/3">
        <h2 className="font-bold mb-4">Forum Diskusi</h2>
        <ul className="space-y-2">
          {forums.map(forum => (
            <li key={forum.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded ${selectedForum?.id === forum.id ? 'bg-violet-100 font-semibold' : 'hover:bg-gray-100'}`}
                onClick={() => selectForum(forum)}
              >
                {forum.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col" style={{ minHeight: '60vh' }}>
        {!selectedForum ? (
          <div className="text-gray-400">Pilih forum untuk mulai diskusi.</div>
        ) : (
          <>
            <div className="mb-2 font-bold text-lg">{selectedForum.title}</div>
            <div className="mb-4 text-gray-500">{selectedForum.description}</div>
            <div className="max-h-80 overflow-y-auto mb-4 space-y-3 flex-1">
              {messages.length === 0 && <div className="text-gray-400">Belum ada pesan.</div>}
              {messages.map(msg => (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="font-semibold">{msg.users?.name || 'User'}</div>
                    <div>{msg.message}</div>
                    <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                  {(msg.user_id === currentUser.id) && (
                    <button
                      className="text-xs text-red-500"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>
            <form
              onSubmit={sendMessage}
              className="flex gap-2 bg-white pt-3"
              style={{
                position: 'sticky',
                bottom: 0,
                zIndex: 10,
                borderTop: '1px solid #eee',
                marginTop: 'auto'
              }}
            >
              <input
                className="flex-1 border rounded px-3 py-2"
                placeholder="Tulis pesan..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
              <button className="bg-violet-600 text-white px-4 py-2 rounded" disabled={loading}>
                Kirim
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
