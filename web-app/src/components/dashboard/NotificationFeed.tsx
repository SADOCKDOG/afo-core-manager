import { Notification } from '../../lib/types-extended'

interface NotificationFeedProps {
    notifications: Notification[]
    onMarkAsRead?: (id: string) => void
}

export function NotificationFeed({ notifications, onMarkAsRead }: NotificationFeedProps) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'visado': return '📋'
            case 'pago': return '💰'
            case 'comentario': return '💬'
            case 'recordatorio': return '⏰'
            default: return '📌'
        }
    }

    const formatTimestamp = (date: Date) => {
        const now = Date.now()
        const diff = now - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 60) return `Hace ${minutes}m`
        if (hours < 24) return `Hace ${hours}h`
        return `Hace ${days}d`
    }

    return (
        <div className="notification-feed">
            {notifications.slice(0, 6).map(notif => (
                <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    onClick={() => onMarkAsRead && onMarkAsRead(notif.id)}
                >
                    <div className="notif-icon">{getTypeIcon(notif.type)}</div>
                    <div className="notif-content">
                        <div className="notif-message">{notif.message}</div>
                        <div className="notif-time muted">{formatTimestamp(notif.timestamp)}</div>
                    </div>
                    {!notif.read && <div className="notif-badge"></div>}
                </div>
            ))}
        </div>
    )
}
