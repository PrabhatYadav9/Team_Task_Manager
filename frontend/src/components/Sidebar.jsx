import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiGrid, FiList, FiLogOut, FiChevronLeft, FiChevronRight, FiUser, FiUsers } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../stores/useStore'

export default function Sidebar() {
  const logout = useStore(state => state.logout)
  const user = useStore(state => state.user)
  const [collapsed, setCollapsed] = useState(false)

  const items = [
    { to: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { to: '/projects', icon: <FiGrid size={20} />, label: 'Projects' },
    { to: '/kanban', icon: <FiList size={20} />, label: 'Kanban' },
    ...(user?.role === 'Admin' ? [{ to: '/team', icon: <FiUsers size={20} />, label: 'Team' }] : []),
    { to: '/profile', icon: <FiUser size={20} />, label: 'Profile' },
  ]

  return (
    <motion.aside 
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative h-screen bg-surface/40 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-all duration-300 z-50 shrink-0"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-glow shrink-0">
          T
        </div>
        <AnimatePresence mode="popLayout">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-semibold text-lg whitespace-nowrap overflow-hidden text-white"
            >
              Team Task
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        {items.map(item => (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <div className={`relative flex items-center h-10 px-3 rounded-lg cursor-pointer transition-colors group ${isActive ? 'text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/10 shadow-glow" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-brand-400 rounded-r-full shadow-glow" />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <div className={`${isActive ? 'text-brand-400' : ''}`}>{item.icon}</div>
                  <AnimatePresence mode="popLayout">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 flex flex-col gap-2">
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="flex items-center h-10 px-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors justify-center lg:justify-start"
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          <AnimatePresence mode="popLayout">
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ml-3 font-medium whitespace-nowrap">Collapse</motion.span>
            )}
          </AnimatePresence>
        </button>

        <button 
          onClick={() => logout()} 
          className="flex items-center h-10 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors justify-center lg:justify-start"
        >
          <FiLogOut size={20} />
          <AnimatePresence mode="popLayout">
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ml-3 font-medium whitespace-nowrap">Logout</motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
