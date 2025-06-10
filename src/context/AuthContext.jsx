import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cek sesi dari localStorage saat komponen pertama kali dimuat
    try {
        const storedUser = localStorage.getItem('lms-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUser(null);
    } finally {
        setLoading(false);
    }
  }, [])


  const login = (userData) => {
    try {
        localStorage.setItem('lms-user', JSON.stringify(userData));
        setUser(userData);
    } catch (e) {
        console.error("Failed to save user to localStorage", e);
    }
  }
  
  const logout = () => {
    setUser(null);
    try {
        localStorage.removeItem('lms-user');
    } catch (e) {
        console.error("Failed to remove user from localStorage", e);
    }
  }
  
  // Jangan render aplikasi sampai status otentikasi selesai dicek
  if (loading) {
    return <div>Loading...</div>; // Atau tampilkan komponen loading yang lebih baik
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}