import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout(){
  return (
    <div className="min-h-screen flex bg-white dark:bg-[#081026] text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
