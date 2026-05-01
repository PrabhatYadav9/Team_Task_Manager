import React from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiCheckSquare } from 'react-icons/fi'

export default function ProjectCard({ project }) {
  const progress = project.progress || 0

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card rounded-2xl p-5 group cursor-pointer relative overflow-hidden flex flex-col h-full min-h-[160px]"
    >
      <div className="absolute -inset-24 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none" />

      <div className="flex-1 relative z-10">
        <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors">{project.name || project.title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description || 'No description yet'}</p>
      </div>

      <div className="mt-6 relative z-10">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-medium">
          <div className="flex items-center gap-1.5"><FiUsers size={14}/> {project.members?.length || 1} Members</div>
          <div className="flex items-center gap-1.5"><FiCheckSquare size={14}/> {project.tasks?.length || 0} Tasks</div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-brand-500" 
          />
        </div>
      </div>
    </motion.div>
  )
}
