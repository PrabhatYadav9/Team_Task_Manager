import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiSearch, FiCheck, FiUser } from 'react-icons/fi'

export default function UserPicker({ value, onChange, users = [], placeholder = 'Select User', error }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedUser = users.find(u => u._id === value)

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-xl border bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm transition-all duration-300 outline-none ${
          open 
            ? 'border-brand-500 ring-1 ring-brand-500/50 shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
            : error 
              ? 'border-red-500/50 hover:border-red-500' 
              : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
        }`}
      >
        {selectedUser ? (
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-[10px] font-bold text-white shadow-glow shrink-0">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start overflow-hidden">
              <span className="font-medium text-slate-900 dark:text-white leading-none truncate">{selectedUser.name}</span>
            </div>
          </div>
        ) : (
          <span className="text-slate-500 flex items-center gap-2"><FiUser className="opacity-50"/> {placeholder}</span>
        )}
        <FiChevronDown className={`text-slate-400 transition-transform duration-300 shrink-0 ${open ? 'rotate-180 text-brand-500' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0a1638] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center border-b border-slate-100 px-3 py-2.5 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <FiSearch className="text-slate-400 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team member..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                autoFocus
              />
            </div>
            <div className="max-h-56 overflow-y-auto p-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
              {filteredUsers.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
                  <FiUser className="text-2xl opacity-20" />
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      onChange(user._id)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${
                      value === user._id 
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' 
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                        value === user._id 
                          ? 'bg-brand-500 text-white shadow-glow' 
                          : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/5 text-slate-600 dark:text-slate-300'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium leading-tight ${value === user._id ? 'text-brand-600 dark:text-brand-400' : ''}`}>{user.name}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 mt-0.5">{user.role}</span>
                      </div>
                    </div>
                    {value === user._id && <FiCheck className="text-brand-500 shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
