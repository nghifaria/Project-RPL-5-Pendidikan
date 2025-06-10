import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-tr from-violet-600 to-blue-400 rounded-lg p-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" fill="#fff"/>
              <rect width="20" height="20" x="2" y="2" rx="5" stroke="#7c3aed" strokeWidth="2"/>
              <path d="M7 8h10M7 12h10M7 16h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="text-2xl font-bold text-gray-800">EduLearn</span>
        </div>
        <Link to="/login" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-violet-700 hover:to-blue-600 transition">
          Login
        </Link>
      </nav>
      <main className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center px-6 py-12 gap-8">
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500">EduLearn</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Platform Learning Management System (LMS) modern untuk SMA.<br />
            Akses materi, tugas, nilai, dan kolaborasi belajar dengan mudah.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link to="/login" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:from-violet-700 hover:to-blue-600 transition">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline rounded-xl px-8 text-lg font-semibold border-violet-200 text-violet-700 hover:bg-violet-50">
              Register
            </Link>
          </div>
        </div>
        {/* Gambar diganti menjadi lebih relevan */}
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
          alt="Students learning"
          className="rounded-xl shadow-lg w-full max-w-md object-cover"
        />
      </main>
      <footer className="text-center text-gray-400 py-4 text-sm">
        &copy; {new Date().getFullYear()} EduLearn. All rights reserved.
      </footer>
    </div>
  )
}