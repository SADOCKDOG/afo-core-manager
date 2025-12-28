import { mockProjects } from '../../lib/data/mockProjects'
import { Task } from '../../lib/types-extended'

interface TaskListProps {
    tasks: Task[]
    onToggleComplete?: (id: string) => void
}

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {
    const getProjectName = (projectId: string) => {
        return mockProjects.find(p => p.id === projectId)?.title || 'Proyecto desconocido'
    }

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'high': return 'priority-high'
            case 'medium': return 'priority-medium'
            case 'low': return 'priority-low'
            default: return ''
        }
    }

    const formatDueDate = (date?: Date) => {
        if (!date) return null
        const now = Date.now()
        const diff = date.getTime() - now
        const days = Math.ceil(diff / 86400000)

        if (days < 0) return <span className="overdue">Vencida</span>
        if (days === 0) return <span className="today">Hoy</span>
        if (days === 1) return <span className="tomorrow">Mañana</span>
        return <span>{days}d</span>
    }

    return (
        <ul className="task-list">
            {tasks.filter(t => !t.completed).slice(0, 8).map(task => (
                <li key={task.id} className="task-item">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleComplete && onToggleComplete(task.id)}
                        className="task-checkbox"
                    />
                    <div className="task-content">
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta muted">
                            <span>{getProjectName(task.projectId)}</span>
                            <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                {task.priority}
                            </span>
                        </div>
                    </div>
                    {task.dueDate && (
                        <div className="task-due">{formatDueDate(task.dueDate)}</div>
                    )}
                </li>
            ))}
        </ul>
    )
}
