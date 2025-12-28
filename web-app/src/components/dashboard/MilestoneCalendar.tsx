import { Milestone } from '../../lib/types-extended'

interface MilestoneCalendarProps {
    milestones: Milestone[]
}

export function MilestoneCalendar({ milestones }: MilestoneCalendarProps) {
    const sortedMilestones = [...milestones]
        .filter(m => !m.completed)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5)

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'entrega': return 'type-entrega'
            case 'visado': return 'type-visado'
            case 'inspeccion': return 'type-inspeccion'
            default: return ''
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short'
        }).format(date)
    }

    const getDaysUntil = (date: Date) => {
        const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        if (diff < 0) return `Hace ${Math.abs(diff)} días`
        if (diff === 0) return 'Hoy'
        if (diff === 1) return 'Mañana'
        return `En ${diff} días`
    }

    return (
        <div className="milestone-calendar">
            {sortedMilestones.map(milestone => (
                <div key={milestone.id} className="milestone-item">
                    <div className="milestone-date">
                        <div className="date-num">{formatDate(milestone.date)}</div>
                        <div className="date-rel muted">{getDaysUntil(milestone.date)}</div>
                    </div>
                    <div className="milestone-content">
                        <div className="milestone-title">{milestone.title}</div>
                        <span className={`milestone-type ${getTypeColor(milestone.type)}`}>
                            {milestone.type}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
