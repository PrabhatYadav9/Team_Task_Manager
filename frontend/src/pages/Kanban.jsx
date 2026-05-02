import React from 'react'
import { DndContext, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiCalendar, FiCheckCircle, FiClock, FiUser, FiAlertCircle, FiPlus, FiList, FiX, FiEdit2 } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/apiClient'
import useStore from '../stores/useStore'
import toast from 'react-hot-toast'
import UserPicker from '../components/ui/UserPicker'

const columns = [
  { id: 'todo', label: 'To Do', tone: 'from-slate-500 to-slate-400' },
  { id: 'in-progress', label: 'In Progress', tone: 'from-indigo-500 to-cyan-400' },
  { id: 'done', label: 'Done', tone: 'from-emerald-500 to-lime-400' },
]

function formatDate(value) {
  if (!value) return 'No due date'
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function TaskCard({ task, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id })

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(task)}
      className={`group w-full rounded-2xl border border-white/10 bg-white/90 dark:bg-[#071028] p-4 text-left shadow-card backdrop-blur-sm transition-all duration-300 ${isDragging ? 'opacity-60 ring-2 ring-cyan-400 scale-105' : 'hover:-translate-y-1 hover:shadow-glow hover:border-white/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold leading-6 text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">{task.title}</h4>
          {task.description ? <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p> : null}
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${isOverdue ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'border-slate-200/10 bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300'}`}>
          {isOverdue ? 'Overdue' : task.status.replace('-', ' ')}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-glow">
            {task.assignedTo?.name ? task.assignedTo.name.slice(0, 1).toUpperCase() : <FiUser />}
          </div>
          <div>
            <div className="font-medium text-slate-700 dark:text-slate-200">{task.assignedTo?.name || 'Unassigned'}</div>
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-medium' : ''}`}>
              <FiCalendar /> {formatDate(task.dueDate)}
            </div>
          </div>
        </div>

        {task.status === 'done' ? <FiCheckCircle className="text-emerald-400 text-lg" /> : <FiClock className={`text-lg ${isOverdue ? 'text-red-400' : 'text-cyan-400'}`} />}
      </div>
    </button>
  )
}

function Column({ column, tasks, onOpen }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[32rem] rounded-3xl border border-white/10 bg-white/60 dark:bg-[#071028]/80 p-4 shadow-card backdrop-blur-sm ${isOver ? 'ring-2 ring-cyan-400/60' : ''}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{column.label}</h3>
          <p className="mt-1 text-xs text-slate-400">{tasks.length} tasks</p>
        </div>
        <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${column.tone}`} />
      </div>

      <SortableContext items={tasks.map((task) => task._id)} strategy={rectSortingStrategy}>
        <div className="space-y-3">
          {tasks.length ? tasks.map((task) => <TaskCard key={task._id} task={task} onOpen={onOpen} />) : <EmptyColumn label={column.label} />}
        </div>
      </SortableContext>
    </section>
  )
}

function EmptyColumn({ label }) {
  return (
    <div className="flex flex-col min-h-[10rem] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/30 px-4 py-8 text-center text-sm text-slate-400 dark:bg-white/5">
      <FiList className="text-3xl mb-2 opacity-50" />
      <p>Drop tasks into {label.toLowerCase()}</p>
    </div>
  )
}

function TaskModal({ task, onClose, onStatusChange, users, onSave, isAdmin }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [form, setForm] = React.useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo?._id || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  })
  const [saving, setSaving] = React.useState(false)

  if (!task) return null

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  const handleSave = async () => {
    setSaving(true)
    await onSave(task._id, form)
    setSaving(false)
    setIsEditing(false)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white shadow-2xl dark:bg-[#071028] text-slate-900 dark:text-white overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400" />
          
          <div className="flex items-center justify-between border-b border-slate-200/80 px-8 py-6 dark:border-white/5">
            <div className="flex-1 mr-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300 uppercase tracking-wider">
                  Task details
                </span>
                {isAdmin && !isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-medium bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 px-3 py-1.5 rounded-lg transition-colors">
                    <FiEdit2 size={12} /> Edit Task
                  </button>
                )}
              </div>
              {isEditing ? (
                <input 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="mt-2 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-2xl font-semibold outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
                  placeholder="Task title..."
                />
              ) : (
                <h3 className="mt-1 text-3xl font-semibold tracking-tight">{task.title}</h3>
              )}
            </div>
            <button onClick={onClose} className="shrink-0 p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">
              <FiX size={20} />
            </button>
          </div>

          <div className="grid gap-8 px-8 py-8 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</p>
              {isEditing ? (
                <textarea 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
                  rows={5}
                  placeholder="Add a detailed description..."
                />
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5 border border-transparent dark:border-white/5">
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{task.description || 'No description provided for this task yet.'}</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {isEditing ? (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">Assignee</p>
                  <UserPicker 
                    value={form.assignedTo} 
                    onChange={val => setForm({...form, assignedTo: val})} 
                    users={users} 
                  />
                </div>
              ) : (
                <InfoPill label="Assignee" value={task.assignedTo?.name || 'Unassigned'} />
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">Due date</p>
                  <input 
                    type="date"
                    value={form.dueDate} 
                    onChange={e => setForm({...form, dueDate: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
              ) : (
                <InfoPill label="Due date" value={formatDate(task.dueDate)} />
              )}
              
              <InfoPill label="Created by" value={task.createdBy?.name || 'Unknown'} />
              <InfoPill label="Project" value={task.projectId?.title || task.projectId?.name || 'Project'} />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-slate-300 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:opacity-90 text-white rounded-xl text-sm font-semibold shadow-glow transition-all disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-6 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Workflow Status</p>
            <div className="space-y-3 flex-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onStatusChange(task, option.value)}
                  className={`w-full rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 flex items-center justify-between ${task.status === option.value ? 'bg-white dark:bg-[#071028] text-brand-500 shadow-card border border-brand-500/20 ring-1 ring-brand-500/10' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-[#071028] border border-transparent hover:border-slate-200 dark:hover:border-white/10'}`}
                >
                  {option.label}
                  {task.status === option.value && <FiCheckCircle className="text-brand-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </AnimatePresence>
  )
}

function CreateTaskModal({ open, projectName, users = [], onClose, onSubmit, form, setForm, loading, error }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white text-slate-900 shadow-2xl dark:bg-[#071028] dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Create task</p>
            <h3 className="mt-1 text-2xl font-semibold">New task for {projectName}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
            Close
          </button>
        </div>

        {error ? (
          <div className="mx-6 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-4 px-6 py-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Title <span className="text-red-400">*</span></label>
              <input
                value={form.title}
                onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-white/10"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-white/10"
                rows={5}
                placeholder="Describe the task"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl bg-slate-50 p-4 dark:bg-white/5">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#071028]"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">Assignee <span className="text-red-400">*</span></label>
              <UserPicker 
                value={form.assignedTo} 
                onChange={val => setForm((current) => ({ ...current, assignedTo: val }))} 
                users={users} 
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Due date <span className="text-red-400">*</span></label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((current) => ({ ...current, dueDate: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#071028]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#071028]">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{value}</p>
    </div>
  )
}

export default function Kanban() {
  const user = useStore((state) => state.user)
  const [projects, setProjects] = React.useState([])
  const [allUsers, setAllUsers] = React.useState([])
  const [selectedProjectId, setSelectedProjectId] = React.useState('')
  const [taskGroups, setTaskGroups] = React.useState({ todo: [], 'in-progress': [], done: [] })
  const [activeTask, setActiveTask] = React.useState(null)
  const [showCreateTaskModal, setShowCreateTaskModal] = React.useState(false)
  const [createTaskForm, setCreateTaskForm] = React.useState({ title: '', description: '', status: 'todo', dueDate: '', assignedTo: '' })
  const [creatingTask, setCreatingTask] = React.useState(false)
  const [createTaskError, setCreateTaskError] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [savingTaskId, setSavingTaskId] = React.useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const loadBoard = React.useCallback(async (projectId) => {
    if (!projectId) {
      setTaskGroups({ todo: [], 'in-progress': [], done: [] })
      setLoading(false)
      return
    }

    setLoading(true)
    const { data } = await api.get(`/tasks/project/${projectId}`)
    const grouped = { todo: [], 'in-progress': [], done: [] }

    data.data.forEach((task) => {
      grouped[task.status].push(task)
    })

    setTaskGroups(grouped)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/auth/users').catch(() => ({ data: { data: [] } }))
        ])
        
        const items = projectsRes.data.data || []
        setProjects(items)
        setAllUsers(usersRes.data.data || [])

        if (items.length) {
          setSelectedProjectId((current) => current || items[0]._id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  React.useEffect(() => {
    if (selectedProjectId) {
      loadBoard(selectedProjectId).catch(() => setLoading(false))
    }
  }, [selectedProjectId, loadBoard])

  const allTasks = React.useMemo(
    () => columns.flatMap((column) => taskGroups[column.id]),
    [taskGroups]
  )

  const findTaskById = React.useCallback(
    (taskId) => allTasks.find((task) => task._id === taskId),
    [allTasks]
  )

  const persistMove = async (taskId, newStatus) => {
    setSavingTaskId(taskId)
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus })
      await loadBoard(selectedProjectId)
      toast.success('Task status updated')
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setSavingTaskId(null)
    }
  }

  const handleEditTask = async (taskId, updatedData) => {
    try {
      await api.put(`/tasks/${taskId}`, updatedData)
      await loadBoard(selectedProjectId)
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return

    const activeTaskItem = findTaskById(active.id)
    if (!activeTaskItem) return

    const sourceStatus = activeTaskItem.status
    const destinationTask = findTaskById(over.id)
    const destinationStatus = columns.some((column) => column.id === over.id)
      ? over.id
      : destinationTask?.status || sourceStatus

    if (sourceStatus === destinationStatus && active.id === over.id) return

    const nextGroups = {
      todo: [...taskGroups.todo],
      'in-progress': [...taskGroups['in-progress']],
      done: [...taskGroups.done],
    }

    const sourceList = nextGroups[sourceStatus]
    const sourceIndex = sourceList.findIndex((task) => task._id === active.id)
    const [movedTask] = sourceList.splice(sourceIndex, 1)
    movedTask.status = destinationStatus

    const destinationList = nextGroups[destinationStatus]
    const destinationIndex = destinationTask && destinationTask.status === destinationStatus ? destinationList.findIndex((task) => task._id === over.id) : destinationList.length
    destinationList.splice(Math.max(0, destinationIndex), 0, movedTask)

    if (sourceStatus === destinationStatus && destinationTask) {
      const reordered = arrayMove(destinationList, destinationList.findIndex((task) => task._id === active.id), destinationList.findIndex((task) => task._id === over.id))
      nextGroups[destinationStatus] = reordered
    } else {
      nextGroups[sourceStatus] = sourceList
      nextGroups[destinationStatus] = destinationList
    }

    setTaskGroups(nextGroups)
    await persistMove(active.id, destinationStatus)
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()

    if (!selectedProjectId) return

    setCreatingTask(true)
    setCreateTaskError('')
    
    try {
      const payload = {
        ...createTaskForm,
        projectId: selectedProjectId,
      }

      const { data } = await api.post('/tasks', payload)
      const createdTask = data.data

      setTaskGroups((current) => ({
        ...current,
        [createdTask.status]: [createdTask, ...current[createdTask.status]],
      }))

      setCreateTaskForm({ title: '', description: '', status: 'todo', dueDate: '', assignedTo: '' })
      setShowCreateTaskModal(false)
      toast.success('Task created successfully!')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create task'
      setCreateTaskError(msg)
      toast.error(msg)
    } finally {
      setCreatingTask(false)
    }
  }

  const selectedProject = projects.find((project) => project._id === selectedProjectId)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Project workflow</p>
          <h2 className="text-3xl font-semibold">Kanban board</h2>
        </div>

        <div className="w-full max-w-sm">
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Project filter</label>
          <div className="flex gap-3">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-[#071028] dark:text-white"
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            {user?.role === 'Admin' && selectedProjectId ? (
              <button
                type="button"
                onClick={() => setShowCreateTaskModal(true)}
                className="shrink-0 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:shadow-glow hover:scale-105"
              >
                <FiPlus size={18} /> New Task
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {selectedProject ? (
        <div className="rounded-3xl border border-white/10 bg-white/60 px-5 py-4 text-sm text-slate-600 shadow-card backdrop-blur dark:bg-[#071028]/60 dark:text-slate-300">
          Showing tasks for <span className="font-semibold text-slate-900 dark:text-white">{selectedProject.name}</span>. Drag cards across columns to update their status.
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.id} className="h-[32rem] rounded-3xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 py-20 px-4 text-center dark:border-white/10 dark:bg-white/5">
          <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle size={32} />
          </div>
          <h3 className="text-xl font-semibold">No projects available</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">You need a project to start organizing tasks. Create a new project from the Projects tab to unlock the Kanban board.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid gap-4 lg:grid-cols-3">
            {columns.map((column) => (
              <Column key={column.id} column={column} tasks={taskGroups[column.id]} onOpen={setActiveTask} />
            ))}
          </div>
        </DndContext>
      )}

      {savingTaskId ? <div className="text-sm text-slate-500 dark:text-slate-400">Saving task update...</div> : null}

      {activeTask ? (
        <TaskModal
          task={{ ...activeTask, projectId: selectedProject || activeTask.projectId }}
          users={allUsers}
          isAdmin={user?.role === 'Admin'}
          onClose={() => setActiveTask(null)}
          onSave={handleEditTask}
          onStatusChange={async (task, status) => {
            setActiveTask(null)
            await persistMove(task._id, status)
          }}
        />
      ) : null}

      <CreateTaskModal
        open={showCreateTaskModal}
        projectName={selectedProject?.name || 'project'}
        users={allUsers}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={handleCreateTask}
        form={createTaskForm}
        setForm={setCreateTaskForm}
        loading={creatingTask}
        error={createTaskError}
      />
    </div>
  )
}
