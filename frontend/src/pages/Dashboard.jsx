import React from 'react'
import StatCard from '../components/StatCard'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { FiCheckCircle, FiClock, FiActivity, FiFolder, FiInbox, FiPlus } from 'react-icons/fi'
import { motion } from 'framer-motion'
import api from '../services/apiClient'
import useStore from '../stores/useStore'

const mockChartData = [
  { name: 'Mon', tasks: 12 },
  { name: 'Tue', tasks: 19 },
  { name: 'Wed', tasks: 15 },
  { name: 'Thu', tasks: 22 },
  { name: 'Fri', tasks: 30 },
  { name: 'Sat', tasks: 25 },
  { name: 'Sun', tasks: 28 },
]

export default function Dashboard() {
  const user = useStore((state) => state.user)
  const [stats, setStats] = React.useState(null)
  const [projects, setProjects] = React.useState([])
  const [selectedProject, setSelectedProject] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [statsResponse, projectsResponse] = await Promise.all([
          api.get(`/tasks/dashboard/stats${selectedProject ? `?projectId=${selectedProject}` : ''}`),
          api.get('/projects'),
        ])
        setStats(statsResponse.data.data)
        setProjects(projectsResponse.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedProject])

  const overdueCount = stats?.overdueTasks?.length || 0

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="text-lg text-gray-400 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="rounded-lg border border-white/10 bg-surface/50 backdrop-blur-md px-4 py-2.5 text-sm text-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 hover:bg-surface transition-all appearance-none cursor-pointer"
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
        <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon={<FiFolder size={20} />} loading={loading} trend={12} />
        <StatCard title="To Do" value={stats?.todoTasks ?? 0} icon={<FiInbox size={20} />} loading={loading} />
        <StatCard title="In Progress" value={stats?.inProgressTasks ?? 0} icon={<FiActivity size={20} />} loading={loading} />
        <StatCard title="Done" value={stats?.doneTasks ?? 0} icon={<FiCheckCircle size={20} />} loading={loading} trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative group overflow-hidden flex flex-col h-full min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500 pointer-events-none" />
          <h3 className="text-lg font-semibold text-white mb-6">Task Velocity</h3>
          <div className="flex-1 w-full relative">
            {loading ? (
              <div className="absolute inset-0 skeleton rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(18,18,18,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="tasks" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col h-full min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-full text-gray-400 border border-white/10">Updates</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full skeleton shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 skeleton rounded" />
                    <div className="h-3 w-1/2 skeleton rounded" />
                  </div>
                </div>
              ))
            ) : overdueCount > 0 ? (
              stats.overdueTasks.slice(0, 5).map((task) => (
                <div key={task._id} className="group relative flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                    <FiClock size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Overdue • {task.projectId?.title || 'Unknown Project'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-3 border border-white/10 shadow-inner">
                  <FiCheckCircle size={24} />
                </div>
                <h4 className="text-gray-200 font-medium text-sm">All caught up</h4>
                <p className="text-gray-500 text-xs mt-1 max-w-[180px]">No overdue tasks or recent alerts.</p>
                <button className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10 shadow-sm flex items-center gap-2">
                  <FiPlus /> New Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
