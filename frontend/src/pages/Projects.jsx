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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="flex items-center gap-3">
          <select className="p-2 rounded-lg border bg-transparent">
            <option>All projects</option>
            <option>Mine</option>
          </select>
          {user?.role === 'Admin' ? (
            <button onClick={() => setShowModal(true)} className="py-2 px-4 rounded-lg brand-gradient text-white">
              New Project
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />
          ))}
        </div>
      ) : projects.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-[#071028]/70 p-12 text-center">
          <h3 className="text-xl font-semibold">No projects yet</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create your first project to begin tracking tasks and team progress.</p>
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white dark:bg-[#0b1220] p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Create project</h3>
              <button onClick={() => setShowModal(false)} className="text-sm text-slate-500">Close</button>
            </div>

            <form onSubmit={createProject} className="mt-6 space-y-4">
              <div>
                <label className="text-sm">Project name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 outline-none"
                  rows={4}
                />
              </div>

              <button className="w-full rounded-xl brand-gradient py-3 font-semibold text-white">Create project</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
