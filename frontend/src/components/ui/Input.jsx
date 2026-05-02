import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Input({ label, icon: Icon, type = 'text', className = '', ...props }) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label 
          initial={false}
          animate={{ color: focused ? '#38bdf8' : '#94a3b8' }}
          className="block text-[11px] font-bold uppercase tracking-[0.2em] mb-2 transition-colors"
        >
          {label}
        </motion.label>
      )}
      <div 
        className={`relative flex items-center rounded-xl border bg-white/[0.03] backdrop-blur-xl transition-all duration-300 ${
          focused ? 'border-brand-500 ring-1 ring-brand-500/50 shadow-[0_0_20px_rgba(56,189,248,0.15)] bg-white/[0.06]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
        }`}
      >
        {Icon && (
          <div className={`pl-4 transition-colors duration-300 ${focused ? 'text-brand-400' : 'text-slate-500'}`}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 ${Icon ? 'pl-3' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-slate-500 hover:text-white transition-colors outline-none focus:text-brand-400"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}
