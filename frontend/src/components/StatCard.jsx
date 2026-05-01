import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({title, value, delta, color}){
  return (
    <motion.div whileHover={{ y: -6 }} className={`card-hover p-4 rounded-2xl bg-white dark:bg-[#071028] shadow-soft border border-slate-200/5`}>
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {delta && <div className={`mt-2 text-sm ${color==='red' ? 'text-red-400' : 'text-green-400'}`}>{delta}</div>}
    </motion.div>
  )
}
