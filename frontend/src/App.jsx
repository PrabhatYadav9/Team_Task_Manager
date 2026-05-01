import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Kanban from './pages/Kanban'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import useStore from './stores/useStore'

function App(){
  const user = useStore(state => state.user)

  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route element={<Layout/>}>
        <Route path="/dashboard" element={ user ? <Dashboard/> : <Navigate to="/login" />} />
        <Route path="/projects" element={ user ? <Projects/> : <Navigate to="/login" />} />
        <Route path="/kanban" element={ user ? <Kanban/> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  )
}

export default App
