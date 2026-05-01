import React from 'react'
import { DndContext, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiCalendar, FiCheckCircle, FiClock, FiUser } from 'react-icons/fi'
import api from '../services/apiClient'

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

  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(task)}
      className={`w-full rounded-2xl border border-white/10 bg-white/90 dark:bg-[#071028] p-4 text-left shadow-card backdrop-blur-sm transition ${isDragging ? 'opacity-60 ring-2 ring-cyan-400' : 'hover:-translate-y-0.5 hover:shadow-soft'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold leading-6 text-slate-900 dark:text-white">{task.title}</h4>
          {task.description ? <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p> : null}
        </div>
        <span className="rounded-full border border-slate-200/10 bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-300">
          {task.status.replace('-', ' ')}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
            {task.assignedTo?.name ? task.assignedTo.name.slice(0, 1).toUpperCase() : <FiUser />}
          </div>
          <div>
            <div className="font-medium text-slate-700 dark:text-slate-200">{task.assignedTo?.name || 'Unassigned'}</div>
            <div className="flex items-center gap-1">
              <FiCalendar /> {formatDate(task.dueDate)}
            </div>
          </div>
        </div>

        {task.status === 'done' ? <FiCheckCircle className="text-emerald-400" /> : <FiClock className="text-cyan-400" />}
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
    <div className="flex min-h-[10rem] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/30 px-4 text-center text-sm text-slate-400 dark:bg-white/5">
      Drop tasks into {label.toLowerCase()}
    </div>
  )
}

function TaskModal({ task, onClose, onStatusChange }) {
  if (!task) return null

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white text-slate-900 shadow-2xl dark:bg-[#071028] dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Task details</p>
            <h3 className="mt-1 text-2xl font-semibold">{task.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
            Close
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</p>
              <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">{task.description || 'No description provided for this task yet.'}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoPill label="Assignee" value={task.assignedTo?.name || 'Unassigned'} />
              <InfoPill label="Due date" value={formatDate(task.dueDate)} />
              <InfoPill label="Created by" value={task.createdBy?.name || 'Unknown'} />
              <InfoPill label="Project" value={task.projectId?.title || 'Project'} />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-white/5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Update status</p>
            <div className="mt-4 space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onStatusChange(task, option.value)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${task.status === option.value ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-card' : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#071028] dark:text-slate-200 dark:hover:bg-white/5'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  )
}

export default function Kanban() {
  const [projects, setProjects] = React.useState([])
  const [selectedProjectId, setSelectedProjectId] = React.useState('')
  const [taskGroups, setTaskGroups] = React.useState({ todo: [], 'in-progress': [], done: [] })
  const [activeTask, setActiveTask] = React.useState(null)
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
    const loadProjects = async () => {
      const { data } = await api.get('/projects')
      const items = data.data || []
      setProjects(items)

      if (items.length) {
        setSelectedProjectId((current) => current || items[0]._id)
      } else {
        setLoading(false)
      }
    }

    loadProjects().catch(() => setLoading(false))
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
    } finally {
      setSavingTaskId(null)
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
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-[#071028] dark:text-white"
          >
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
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
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center dark:border-white/10 dark:bg-white/5">
          <h3 className="text-xl font-semibold">No projects yet</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a project first, then the Kanban board will appear here.</p>
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
          onClose={() => setActiveTask(null)}
          onStatusChange={async (task, status) => {
            setActiveTask(null)
            await persistMove(task._id, status)
          }}
        />
      ) : null}
    </div>
  )
}
