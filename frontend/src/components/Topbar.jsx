import React from 'react'
import useStore from '../stores/useStore'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function Topbar(){
  const toggleTheme = useStore(state=>state.toggleTheme)

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200/5 bg-transparent">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Overview</h1>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-white/5">
          <FiMoon className="hidden dark:block" />
          <FiSun className="dark:hidden" />
        </button>

        <div className="flex items-center gap-3 bg-white dark:bg-[#071028] p-2 rounded-xl shadow-sm">
          <img src="https://api.dicebear.com/6.x/initials/svg?seed=User" alt="avatar" className="w-8 h-8 rounded-full" />
          <div className="hidden sm:block">
            <div className="text-sm font-medium">Jane Doe</div>
            <div className="text-xs text-slate-400">Product Manager</div>
          </div>
        </div>
      </div>
    </header>
  )
}
