// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Protected layout & auth
import ProtectedRoute from './components/ProtectedRoute'
import DefaultLayout  from './layouts/DefaultLayout'

// Auth pages
import Login    from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Landing  from './pages/Landing.jsx'

// Admin pages
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import AdminSubjects  from './pages/AdminSubjects.jsx'
import AdminUsers     from './pages/AdminUsers.jsx'
import AdminForums    from './pages/AdminForums'

// Guru pages
import DashboardGuru                 from './pages/DashboardGuru.jsx'
import GuruMaterialsAndAssignments   from './pages/GuruMaterialsAndAssignments.jsx'
import GuruSubmissions               from './pages/GuruSubmissions.jsx'

// Siswa pages
import DashboardSiswa   from './pages/DashboardSiswa.jsx'
import SiswaAssignments from './pages/SiswaAssignments.jsx'
import SiswaGrades      from './pages/SiswaGrades.jsx'
import SiswaMaterials   from './pages/SiswaMaterials.jsx'
import Profile          from './pages/Profile.jsx'
import ForumList        from './pages/ForumList'
import ForumDetail      from './pages/ForumDetail'
import ForumTugasList   from './pages/ForumTugasList'
import ForumTugasDetail from './pages/ForumTugasDetail'

export default function App() {
  const currentUser = JSON.parse(localStorage.getItem('lms-user'))
  
  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <DefaultLayout>
              <Routes>
                <Route index             element={<DashboardAdmin />} />
                <Route path="subjects"   element={<AdminSubjects />}  />
                <Route path="users"      element={<AdminUsers />}     />
                <Route path="forums"     element={<AdminForums />}    />
                <Route path="profile"    element={<Profile />}        />
              </Routes>
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      {/* Guru */}
      <Route
        path="/guru/*"
        element={
          <ProtectedRoute roles={['guru']}>
            <DefaultLayout>
              <Routes>
                <Route index                  element={<DashboardGuru />}               />
                <Route path="materials"       element={<GuruMaterialsAndAssignments />} />
                <Route path="submissions"     element={<GuruSubmissions />}             />
                <Route path="profile"         element={<Profile />}                     />
              </Routes>
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      {/* Siswa */}
      <Route
        path="/siswa/*"
        element={
          <ProtectedRoute roles={['siswa']}>
            <DefaultLayout>
              <Routes>
                <Route index                element={<DashboardSiswa />}    />
                <Route path="materials"     element={<SiswaMaterials />}    />
                <Route path="assignments"   element={<SiswaAssignments />}  />
                <Route path="grades"        element={<SiswaGrades />}       />
                <Route path="profile"       element={<Profile />}           />
              </Routes>
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      {/* Forum */}
      <Route path="/forums" element={<ForumList currentUser={currentUser} />} />
      <Route path="/forums/:forumId" element={<ForumDetail currentUser={currentUser} />} />
      <Route path="/forum-tugas" element={<ForumTugasList />} />
      <Route path="/forum-tugas/:forumId" element={
        <ForumTugasDetail currentUser={currentUser} />
      } />
    </Routes>
  )
}
