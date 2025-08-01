import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function ForumDetail({ currentUser }) {
  const { forumId } = useParams()
  const [forum, setForum] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchForum()
    fetchMessages()
    // eslint-disable-next-line
  }, [forumId])

  async function fetchForum() {
    const { data } = await supabase.from('forums').select('*').eq('id', forumId).single()
    setForum(data)
  }

  async function fetchMessages() {
    const { data } = await supabase
      .from('forum_messages')
      .select('*, users(name)')
      .eq('forum_id', forumId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    const { error } = await supabase.from('forum_messages').insert([{
      forum_id: forumId,
      user_id: currentUser.id,
      message
    }])
    setMessage('')
    setLoading(false)
    if (!error) {
      fetchMessages()
    }
  }

  const deleteMessage = async (id) => {
    await supabase.from('forum_messages').delete().eq('id', id)
    setMessages(msgs => msgs.filter(m => m.id !== id))
  }

  if (!forum) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col" style={{ minHeight: '80vh' }}>
      <h1 className="text-2xl font-bold mb-2">{forum.title}</h1>
      <div className="mb-6 text-gray-600">{forum.description}</div>
      <div className="bg-gray-50 rounded p-4 mb-4 flex-1 max-h-96 overflow-y-auto">
        {messages.length === 0 && <div className="text-gray-400">Belum ada pesan.</div>}
        {messages.map(msg => (
          <div key={msg.id} className="mb-3 flex items-start gap-2">
            <div className="flex-1">
              <div className="font-semibold">{msg.users?.name || 'User'}</div>
              <div className="text-gray-700">{msg.message}</div>
              <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</div>
            </div>
            {(currentUser?.id === msg.user_id || currentUser?.role === 'admin') && (
              <button
                className="text-red-500 text-xs ml-2"
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
        <button
          className="bg-violet-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Kirim
        </button>
      </form>
    </div>
  )
}