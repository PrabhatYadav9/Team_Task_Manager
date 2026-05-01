import React from 'react'
import StatCard from '../components/StatCard'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../services/apiClient'
import useStore from '../stores/useStore'

const data = [
  { name: 'Mon', tasks: 20 },
  { name: 'Tue', tasks: 26 },
  { name: 'Wed', tasks: 22 },
  { name: 'Thu', tasks: 30 },
  { name: 'Fri', tasks: 18 },
  { name: 'Sat', tasks: 14 },
  { name: 'Sun', tasks: 25 },
]

export default function Dashboard() {
  const user = useStore((state) => state.user)
  const [stats, setStats] = React.useState(null)
  const [projects, setProjects] = React.useState([])
  const [selectedProject, setSelectedProject] = React.useState('')
  const [chartMounted, setChartMounted] = React.useState(false)

  React.useEffect(() => {
    setChartMounted(true)
  }, [])

  React.useEffect(() => {
    const load = async () => {
      const [statsResponse, projectsResponse] = await Promise.all([
        api.get(`/tasks/dashboard/stats${selectedProject ? `?projectId=${selectedProject}` : ''}`),
        api.get('/projects'),
      ])

      setStats(statsResponse.data.data)
      setProjects(projectsResponse.data.data)
    }

    load().catch(() => {
      setStats(null)
      setProjects([])
    })
  }, [selectedProject])

  const overdueCount = stats?.overdueTasks?.length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'User'}</p>
          <h2 className="text-3xl font-semibold mt-1">Task intelligence</h2>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-[#071028] px-4 py-3 text-sm shadow-sm outline-none"
        >
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} delta="Live from backend" />
        <StatCard title="To Do" value={stats?.todoTasks ?? 0} />
        <StatCard title="In Progress" value={stats?.inProgressTasks ?? 0} />
        <StatCard title="Done" value={stats?.doneTasks ?? 0} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        <div className="lg:col-span-2 min-w-0 p-4 bg-white dark:bg-[#071028] rounded-2xl shadow-card overflow-hidden">
          <h3 className="font-semibold mb-4">Activity</h3>
          <div className="h-[240px] min-w-0">
            {chartMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="tasks" stroke="#7c3aed" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-2xl bg-slate-100 dark:bg-white/5" />
            )}
          </div>
        </div>

        <div className="min-w-0 p-4 bg-white dark:bg-[#071028] rounded-2xl shadow-card">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {(stats?.overdueTasks || []).slice(0, 4).map((task) => (
              <div key={task._id} className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-sm font-medium text-red-200">Overdue: {task.title}</p>
                <p className="text-xs text-red-300/70">{task.projectId?.title}</p>
              </div>
            ))}
            {overdueCount === 0 ? <p className="text-sm text-slate-500">No overdue tasks right now.</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
