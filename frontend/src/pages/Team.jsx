import React from 'react'
import api from '../services/apiClient'
import useStore from '../stores/useStore'
import { FiUsers, FiFilter, FiCheckCircle, FiClock, FiUser } from 'react-icons/fi'

export default function Team() {
  const user = useStore(state => state.user)
  const [users, setUsers] = React.useState([])
  const [tasks, setTasks] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [selectedUserId, setSelectedUserId] = React.useState('all')

  React.useEffect(() => {
    if (user?.role !== 'Admin') return;
    const load = async () => {
      setLoading(true)
      try {
        const [usersRes, tasksRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/tasks/all')
        ])
        setUsers(usersRes.data.data)
        setTasks(tasksRes.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (user?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FiUsers size={48} className="text-gray-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold text-white">Access Restricted</h2>
        <p className="mt-2 text-gray-400">Only administrators can view the Team Overview.</p>
      </div>
    )
  }

  const displayedTasks = selectedUserId === 'all' 
    ? tasks 
    : tasks.filter(t => t.assignedTo?._id === selectedUserId)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Team Overview</h2>
          <p className="text-sm text-gray-400 mt-1">View all members and their assigned tasks.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface/50 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <FiFilter className="text-gray-400 ml-2" />
          <select 
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-transparent text-sm text-gray-200 outline-none pr-4 py-1 appearance-none cursor-pointer"
          >
            <option value="all">All Members</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Members ({users.length})</h3>
          {loading ? (
            Array.from({length: 3}).map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)
          ) : users.map(member => {
            const memberTasks = tasks.filter(t => t.assignedTo?._id === member._id)
            const completedTasks = memberTasks.filter(t => t.status === 'done').length
            
            return (
              <div 
                key={member._id}
                onClick={() => setSelectedUserId(member._id)}
                className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 ${selectedUserId === member._id ? 'border-brand-500 shadow-glow bg-white/10' : 'hover:bg-white/5 border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-medium shadow-glow shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{member.name}</h4>
                    <p className="text-xs text-brand-400/80">{member.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-400 bg-white/5 px-2 py-1 rounded-md">{memberTasks.length} total tasks</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">{completedTasks} completed</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="md:col-span-2 glass-card rounded-2xl p-6 min-h-[500px]">
          <h3 className="text-lg font-medium text-white mb-6">Assigned Tasks</h3>
          {loading ? (
             Array.from({length: 4}).map((_, i) => <div key={i} className="h-20 skeleton rounded-xl mb-3" />)
          ) : displayedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <FiCheckCircle size={40} className="text-gray-500 mb-4 opacity-50" />
              <p className="text-gray-400">No tasks found for this selection.</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
              {displayedTasks.map(task => (
                <div key={task._id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10">
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 group-hover:text-cyan-400 transition-colors">{task.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{task.projectId?.title || 'Unknown Project'}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium shrink-0">
                    <span className="flex items-center gap-1 text-gray-400">
                      <FiUser /> {task.assignedTo?.name || 'Unassigned'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      task.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      task.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
