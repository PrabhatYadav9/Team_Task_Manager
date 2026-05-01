import React from 'react'
import useStore from '../stores/useStore'
import { FiUser, FiMail, FiShield, FiCalendar } from 'react-icons/fi'

export default function Profile() {
  const user = useStore(state => state.user)

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">User Profile</h2>
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 p-1 flex items-center justify-center shrink-0 shadow-glow">
            <div className="w-full h-full rounded-full bg-[#071028] flex items-center justify-center text-4xl text-white font-bold">
              {user.name ? user.name.slice(0, 1).toUpperCase() : <FiUser />}
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h3 className="text-3xl font-bold text-white">{user.name}</h3>
              <p className="text-cyan-400 font-medium mt-1 uppercase tracking-widest text-sm flex items-center justify-center md:justify-start gap-2">
                <FiShield /> {user.role}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-2"><FiUser /> Full Name</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-2"><FiMail /> Email Address</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-2"><FiShield /> Account Role</p>
                <p className="text-white font-medium">{user.role}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-2"><FiCalendar /> Member Since</p>
                <p className="text-white font-medium">Recently Joined</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
