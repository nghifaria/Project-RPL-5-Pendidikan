import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function DefaultLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
