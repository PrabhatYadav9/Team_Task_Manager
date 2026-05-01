import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { FiBell, FiSearch } from 'react-icons/fi'

export default function Topbar() {
  const user = useStore(state => state.user)
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-transparent relative z-20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks, projects, or people..." 
            className="w-full bg-surface/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all backdrop-blur-md"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors relative">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border border-[#0a0a0a]"></span>
        </button>

        <div onClick={() => navigate('/profile')} className="flex items-center gap-3 bg-white/5 border border-white/10 py-1.5 px-2 rounded-full backdrop-blur-md cursor-pointer hover:bg-white/10 transition-colors">
          <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=6366f1`} alt="avatar" className="w-8 h-8 rounded-full" />
          <div className="hidden sm:block pr-2">
            <div className="text-sm font-medium text-gray-200 leading-tight">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-500">{user?.role || 'Member'}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
