import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('siswa');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // State untuk inline editing
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });

  // Fetch semua users
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true });
    if (error) setError(error.message);
    else setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tambah user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Semua field wajib diisi');
      return;
    }
    const { error } = await supabase.from('users').insert([{
      name,
      email,
      password,
      role
    }]);
    if (error) setError(error.message);
    else {
      setName(''); setEmail(''); setPassword(''); setRole('siswa');
      fetchUsers();
    }
  };

  // Memulai mode edit
  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
  };
  
  // Batal edit
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Menyimpan perubahan setelah edit
  const handleUpdateUser = async (id) => {
    const { error } = await supabase
      .from('users')
      .update({ name: editFormData.name, email: editFormData.email, role: editFormData.role })
      .eq('id', id);
    if (error) setError(error.message);
    else {
      setEditingId(null);
      fetchUsers();
    }
  };

  // Menghapus user
  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus user ini?')) return;
    const { error } = await supabase.from('users')
      .delete()
      .eq('id', id);
    if (error) setError(error.message);
    else fetchUsers();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
        Kelola User
      </h2>
      {error && (
        <div className="mb-4 text-sm px-3 py-2 rounded bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {/* Formulir Tambah User */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow p-4">
        <h3 className="font-semibold text-lg mb-3">Tambah User Baru</h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input type="text" placeholder="Nama" className="input input-bordered col-span-1 sm:col-span-1" value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" className="input input-bordered col-span-1 sm:col-span-1" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="input input-bordered col-span-1 sm:col-span-1" value={password} onChange={e => setPassword(e.target.value)} />
            <select className="select select-bordered col-span-1 sm:col-span-1" value={role} onChange={e => setRole(e.target.value)}>
                <option value="siswa">Siswa</option>
                <option value="guru">Guru</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary flex items-center gap-2 col-span-1 sm:col-span-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                Tambah
            </button>
        </form>
      </div>


      {/* Tabel User */}
      {loading
        ? <p>Loading...</p>
        : (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow">
            <table className="table w-full">
              <thead>
                <tr className="text-gray-700 font-semibold bg-gray-100">
                  <th className="p-4">NAMA</th>
                  <th className="p-4">EMAIL</th>
                  <th className="p-4">ROLE</th>
                  <th className="p-4 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 border-t">
                    {editingId === user.id ? (
                      <>
                        <td className="p-2"><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="input input-bordered w-full" /></td>
                        <td className="p-2"><input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="input input-bordered w-full" /></td>
                        <td className="p-2">
                          <select value={editFormData.role} onChange={(e) => setEditFormData({...editFormData, role: e.target.value})} className="select select-bordered w-full">
                            <option value="admin">Admin</option>
                            <option value="guru">Guru</option>
                            <option value="siswa">Siswa</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleUpdateUser(user.id)} className="btn btn-sm btn-success text-white">Simpan</button>
                            <button onClick={handleCancelClick} className="btn btn-sm btn-ghost">Batal</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4 capitalize">{user.role}</td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleEditClick(user)} className="btn btn-sm btn-outline btn-info">EDIT</button>
                            <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-outline btn-error">HAPUS</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}