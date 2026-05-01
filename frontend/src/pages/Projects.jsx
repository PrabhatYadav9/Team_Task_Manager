import React from 'react'
import ProjectCard from '../components/ProjectCard'
import api from '../services/apiClient'
import useStore from '../stores/useStore'

export default function Projects(){
  const user = useStore((state) => state.user)
  const [projects, setProjects] = React.useState([])
  const [showModal, setShowModal] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [form, setForm] = React.useState({ name: '', description: '' })

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await api.get('/projects')
      setProjects(data.data)
      setLoading(false)
    }

    load().catch(() => setLoading(false))
  }, [])

  const createProject = async (e) => {
    e.preventDefault()
    const { data } = await api.post('/projects', form)
    setProjects((current) => [data.data, ...current])
    setForm({ name: '', description: '' })
    setShowModal(false)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Projects</h2>
          <p className="text-sm text-gray-400 mt-1">Manage and track your team's initiatives.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-white/10 bg-surface/50 backdrop-blur-md px-4 py-2 text-sm text-gray-200 shadow-sm outline-none focus:border-brand-500/50 appearance-none">
            <option>All projects</option>
            <option>Mine</option>
          </select>
          {user?.role === 'Admin' ? (
            <button onClick={() => setShowModal(true)} className="py-2 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-glow">
              New Project
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 rounded-xl skeleton" />
          ))}
        </div>
      ) : projects.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-4 border border-white/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </div>
          <h3 className="text-xl font-semibold text-white">No projects yet</h3>
          <p className="mt-2 text-sm text-gray-400 max-w-sm">Create your first project to begin tracking tasks and team progress.</p>
          {user?.role === 'Admin' && (
            <button onClick={() => setShowModal(true)} className="mt-6 py-2 px-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors">
              Create Project
            </button>
          )}
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 glass-card p-6 shadow-surface relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-cyan-400" />
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Create project</h3>
              <button onClick={() => setShowModal(false)} className="text-sm text-gray-400 hover:text-white transition-colors">Close</button>
            </div>

            <form onSubmit={createProject} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Project name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 outline-none text-white focus:border-brand-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 outline-none text-white focus:border-brand-500 transition-colors"
                  rows={4}
                />
              </div>

              <button className="w-full rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors py-2.5 font-medium text-white mt-2">Create project</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
