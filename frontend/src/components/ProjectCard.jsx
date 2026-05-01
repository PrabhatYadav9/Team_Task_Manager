import React from 'react'

export default function ProjectCard({project}){
  return (
    <div className="p-4 bg-white dark:bg-[#071028] rounded-2xl shadow-card card-hover border border-slate-200/5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.description || 'No description yet'}</p>
        </div>
        <div className="text-sm text-slate-400">{project.tasks?.length || 0} tasks</div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-cyan-400" style={{width: `${project.progress || 0}%`}} />
        </div>
      </div>
    </div>
  )
}
