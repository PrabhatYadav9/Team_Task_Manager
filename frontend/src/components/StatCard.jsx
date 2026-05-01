import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon, loading, trend }) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg skeleton" />
          <div className="h-4 w-24 rounded skeleton" />
        </div>
        <div className="h-8 w-16 rounded skeleton mt-2" />
      </div>
    )
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card rounded-xl p-5 group relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute -inset-24 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none" />
      
      <div className="flex items-center gap-3 text-gray-400 relative z-10">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-brand-400 group-hover:bg-brand-500/10 transition-colors">
          {icon}
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      
      <div className="mt-4 flex items-end justify-between relative z-10">
        <div className="text-3xl font-semibold text-white tracking-tight">{value}</div>
        {trend !== undefined && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </motion.div>
  )
}
