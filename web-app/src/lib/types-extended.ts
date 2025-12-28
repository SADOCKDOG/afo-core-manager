export interface Milestone {
    id: string
    projectId: string
    title: string
    date: Date
    type: 'entrega' | 'visado' | 'inspeccion' | 'otro'
    completed: boolean
}

export interface Notification {
    id: string
    type: 'visado' | 'pago' | 'comentario' | 'recordatorio'
    message: string
    timestamp: Date
    projectId?: string
    read: boolean
}

export interface Task {
    id: string
    projectId: string
    title: string
    priority: 'high' | 'medium' | 'low'
    dueDate?: Date
    completed: boolean
}

export interface VisadoState {
    status: 'tramitacion' | 'requerido' | 'pendiente-pago' | 'pendiente-retirar' | 'completado'
    fechaSolicitud?: Date
    fechaResolucion?: Date
    motivosRequerido?: string[]
    observaciones?: string
}
