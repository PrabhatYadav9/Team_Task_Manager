import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiGrid, FiList, FiLogOut } from 'react-icons/fi'
import useStore from '../stores/useStore'

const items = [
  { to: '/dashboard', icon: <FiHome/>, label: 'Dashboard' },
  { to: '/projects', icon: <FiGrid/>, label: 'Projects' },
  { to: '/kanban', icon: <FiList/>, label: 'Kanban' },
]

export default function Sidebar(){
  const logout = useStore(state => state.logout)

  return (
    <aside className="w-20 lg:w-72 bg-white/60 dark:bg-[#081026]/60 glass backdrop-blur-md border-r border-slate-200/5">
      <div className="h-full flex flex-col py-6 px-4 lg:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg brand-gradient flex items-center justify-center text-white font-bold shadow-card">TT</div>
          <div className="hidden lg:block">
            <div className="text-lg font-semibold">Team Tasks</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Premium</div>
          </div>
        </div>

        <nav className="flex-1">
          {items.map(i => (
            <NavLink key={i.to} to={i.to} className={({isActive})=> `flex items-center gap-4 p-3 rounded-md mb-1 transition ${isActive ? 'bg-slate-100 dark:bg-[#0f172a]' : 'hover:bg-slate-50/60'}`}>
              <div className="text-lg text-slate-700 dark:text-slate-200">{i.icon}</div>
              <div className="hidden lg:block">{i.label}</div>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6">
          <button onClick={()=>logout()} className="w-full text-left flex items-center gap-3 p-3 rounded-md hover:bg-red-50/60 text-red-600">
            <FiLogOut/> <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
