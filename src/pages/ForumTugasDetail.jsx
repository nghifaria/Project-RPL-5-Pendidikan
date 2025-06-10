import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useAuth } from '../context/AuthContext'

// --- Komponen Message (Telah Direkayasa Ulang) ---
const Message = ({ msg, onStartReply, onDelete, user }) => {
  const messageContainerClasses = msg.level > 0 
    ? "ml-4 pl-4 border-l-2 border-gray-200" 
    : "";

  return (
    <div className={messageContainerClasses}>
      <div className="group flex flex-col pt-2">
        <div className="p-2 rounded hover:bg-gray-100 transition-colors duration-200">
          
          {msg.parent_message && (
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Membalas kepada <span className="font-semibold text-violet-700">{msg.parent_message.users?.name || 'User'}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* FIX: Mengembalikan warna nama pengguna menjadi ungu (violet) */}
            <p className="font-semibold text-violet-700">{msg.users?.name || 'User Tanpa Nama'}</p>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onStartReply(msg)} className="text-xs font-semibold text-gray-500 hover:text-black">Balas</button>
              {(user?.id === msg.user_id || user?.role === 'admin') && (
                <button
                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  onClick={() => onDelete(msg.id)}
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
          <p className="py-1 text-gray-700 whitespace-pre-wrap">{msg.message}</p>
          <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString('id-ID')}</p>
        </div>

        {msg.children && msg.children.length > 0 && (
          <div>
            {msg.children.map(childMsg => (
              <Message key={childMsg.id} msg={childMsg} onStartReply={onStartReply} onDelete={onDelete} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


// --- KOMPONEN UTAMA ---
export default function ForumTugasDetail() {
  const { forumId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [forum, setForum] = useState(null)
  const [nestedMessages, setNestedMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)

  const messageInputRef = useRef(null)

  useEffect(() => {
    if (!forumId) return;
    fetchForumAndMessages()
    // eslint-disable-next-line
  }, [forumId])

  async function fetchForumAndMessages() {
    setLoading(true);

    const forumPromise = supabase.from('forums').select('*').eq('id', forumId).single()
    const messagesPromise = supabase
      .from('forum_messages')
      .select('*, users(id, name, role)')
      .eq('forum_id', forumId)
      .order('created_at', { ascending: true })

    const [{ data: forumData }, { data: messagesData, error: messagesError }] = await Promise.all([forumPromise, messagesPromise]);

    setForum(forumData);

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
    } else {
      const messagesById = new Map(messagesData.map(msg => [msg.id, { ...msg, children: [], level: 0 }]));
      const topLevelMessages = [];
      
      messagesData.forEach(msg => {
        const currentMsgNode = messagesById.get(msg.id);
        if (msg.parent_message_id && messagesById.has(msg.parent_message_id)) {
            const parentMsgNode = messagesById.get(msg.parent_message_id);
            currentMsgNode.parent_message = {
                message: parentMsgNode.message,
                users: parentMsgNode.users
            };
            currentMsgNode.level = parentMsgNode.level + 1;
            parentMsgNode.children.push(currentMsgNode);
        } else {
            topLevelMessages.push(currentMsgNode);
        }
      });
      setNestedMessages(topLevelMessages);
    }
    setLoading(false);
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !user?.id) return
    
    setLoading(true)
    const payload = {
      forum_id: forumId,
      user_id: user.id, 
      message: message.trim(),
      parent_message_id: replyingTo ? replyingTo.id : null
    };

    const { error } = await supabase.from('forum_messages').insert([payload])

    if (error) {
        alert('Gagal kirim pesan: ' + error.message)
    } else {
        setMessage('')
        setReplyingTo(null)
        await fetchForumAndMessages()
    }
    setLoading(false)
  }

  const deleteMessage = async (id) => {
    if (!confirm('Anda yakin ingin menghapus pesan ini?')) return;
    await supabase.from('forum_messages').delete().eq('id', id)
    await fetchForumAndMessages();
  }
  
  const handleStartReply = (msg) => {
    setReplyingTo(msg)
    messageInputRef.current?.focus()
  }

  if (!forum) return <div className="p-6">Loading forum...</div>

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
        {!loading && nestedMessages.length === 0 && <div className="text-center text-gray-400">Belum ada pesan.</div>}
        
        {nestedMessages.map(msg => (
          <Message key={msg.id} msg={msg} onStartReply={handleStartReply} onDelete={deleteMessage} user={user} />
        ))}
      </div>
      
      <div className="bg-white pt-3 border-t">
        {replyingTo && (
            <div className="relative p-2 mb-2 bg-gray-200 rounded-md text-sm">
                <p className="font-semibold">Membalas kepada: {replyingTo.users?.name}</p>
                <p className="text-gray-600 truncate">{replyingTo.message}</p>
                <button 
                    onClick={() => setReplyingTo(null)}
                    className="absolute top-1 right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                    X
                </button>
            </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-2">
            <input
                ref={messageInputRef}
                className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:outline-none"
                placeholder="Tulis pesan..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
            />
            <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim'}
            </button>
        </form>
      </div>
    </div>
  )
}