import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useAuth } from '../context/AuthContext' // <-- IMPORT HOOK

export default function ForumTugasDetail() { // <-- Hapus props currentUser
  const { forumId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth() // <-- GUNAKAN HOOK untuk mendapatkan user
  
  const [forum, setForum] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

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
    setLoading(true);
    const { data, error } = await supabase
      .from('forum_messages')
      .select('*, users(id, name, role)')
      .eq('forum_id', forumId)
      .order('created_at', { ascending: true })
    
    if (error) {
        console.error("Error fetching messages:", error)
        setMessages([])
    } else {
        setMessages(data || [])
    }
    setLoading(false);
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !user?.id) return
    
    setLoading(true)
    const { error } = await supabase.from('forum_messages').insert([{
      forum_id: forumId,
      user_id: user.id, 
      message: message.trim()
    }])

    if (error) {
        alert('Gagal kirim pesan: ' + error.message)
    } else {
        setMessage('')
        await fetchMessages()
    }
    setLoading(false)
  }

  const deleteMessage = async (id) => {
    if (!confirm('Anda yakin ingin menghapus pesan ini?')) return;
    await supabase.from('forum_messages').delete().eq('id', id)
    setMessages(msgs => msgs.filter(m => m.id !== id))
  }

  if (!forum) return <div>Loading forum...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <button
        className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm self-start"
        onClick={() => navigate(-1)}
      >
        &larr; Kembali
      </button>
      <h1 className="text-2xl font-bold mb-2">{forum.title}</h1>
      <div className="mb-6 text-gray-600">{forum.description}</div>
      <div className="bg-gray-50 rounded p-4 mb-4 flex-1 overflow-y-auto">
        {loading && <div className="text-center text-gray-500">Memuat pesan...</div>}
        {!loading && messages.length === 0 && <div className="text-center text-gray-400">Belum ada pesan.</div>}
        {messages.map(msg => (
          <div key={msg.id} className="mb-3 flex items-start gap-3 p-3 rounded hover:bg-gray-100">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-violet-700">{msg.users?.name || 'User Tanpa Nama'}</p>
                {(user?.id === msg.user_id || user?.role === 'admin') && (
                  <button
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    onClick={() => deleteMessage(msg.id)}
                  >
                    Hapus
                  </button>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleString('id-ID')}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="flex gap-2 bg-white pt-3"
      >
        <input
          className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:outline-none"
          placeholder="Tulis pesan..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <button
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim'}
        </button>
      </form>
    </div>
  )
}