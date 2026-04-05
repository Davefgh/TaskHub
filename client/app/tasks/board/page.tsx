'use client'

import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Task {
  _id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  assigneeId?: any
}

const STATUSES = ['To Do', 'In Progress', 'Done', 'Blocked']

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'border-l-4 border-red-500 bg-red-50'
      case 'High':
        return 'border-l-4 border-orange-500 bg-orange-50'
      case 'Medium':
        return 'border-l-4 border-yellow-500 bg-yellow-50'
      case 'Low':
        return 'border-l-4 border-green-500 bg-green-50'
      default:
        return 'border-l-4 border-gray-500 bg-gray-50'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition ${getPriorityColor(
        task.priority
      )}`}
    >
      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}

function KanbanColumn({ status, tasks }: { status: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({
    id: status,
  })

  return (
    <div className="bg-gray-100 rounded-lg p-4 min-h-96 flex-1">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">{status}</h3>
        <p className="text-sm text-gray-600">{tasks.length} tasks</p>
      </div>

      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No tasks</p>
            </div>
          ) : (
            tasks.map(task => <TaskCard key={task._id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function TaskBoardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated])

  const fetchTasks = async () => {
    try {
      setIsLoadingTasks(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks?limit=100`,
        { withCredentials: true }
      )
      setTasks(response.data.data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setIsLoadingTasks(false)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (!over) return

    const task = tasks.find(t => t._id === active.id)
    if (!task) return

    const newStatus = over.id
    if (task.status === newStatus) return

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task._id}`,
        { status: newStatus },
        { withCredentials: true }
      )

      setTasks(prevTasks =>
        prevTasks.map(t =>
          t._id === task._id ? { ...t, status: newStatus } : t
        )
      )
    } catch (error) {
      console.error('Failed to update task:', error)
      fetchTasks()
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
            TaskHub
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.name}</span>
            <Link href="/profile" className="text-blue-600 hover:underline">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Task Board</h2>
          <div className="space-x-4">
            <Link
              href="/tasks"
              className="inline-block px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              List View
            </Link>
            <Link
              href="/tasks/create"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Task
            </Link>
          </div>
        </div>

        {isLoadingTasks ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
              {STATUSES.map(status => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status] || []}
                />
              ))}
            </div>
          </DndContext>
        )}
      </main>
    </div>
  )
}
