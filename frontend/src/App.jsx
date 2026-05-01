import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Kanban from './pages/Kanban'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Team from './pages/Team'
import Layout from './components/Layout'
import useStore from './stores/useStore'

import { Toaster } from 'react-hot-toast'

function App(){
  const user = useStore(state => state.user)

  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-[#071028] dark:text-white border border-white/10' }} />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route element={<Layout/>}>
          <Route path="/dashboard" element={ user ? <Dashboard/> : <Navigate to="/login" />} />
          <Route path="/projects" element={ user ? <Projects/> : <Navigate to="/login" />} />
          <Route path="/kanban" element={ user ? <Kanban/> : <Navigate to="/login" />} />
          <Route path="/team" element={ user ? <Team/> : <Navigate to="/login" />} />
          <Route path="/profile" element={ user ? <Profile/> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
