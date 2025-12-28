import { Milestone, Notification, Task, VisadoState } from '../types-extended'

export const mockMilestones: Milestone[] = [
    {
        id: 'm-001',
        projectId: 'p-001',
        title: 'Entrega planos ejecución',
        date: new Date('2025-02-12'),
        type: 'entrega',
        completed: false
    },
    {
        id: 'm-002',
        projectId: 'p-001',
        title: 'Inspección estructural',
        date: new Date('2025-02-20'),
        type: 'inspeccion',
        completed: false
    },
    {
        id: 'm-003',
        projectId: 'p-002',
        title: 'Revisión PGOU Madrid',
        date: new Date('2025-02-22'),
        type: 'otro',
        completed: false
    },
    {
        id: 'm-004',
        projectId: 'p-001',
        title: 'Presentación visado COAM',
        date: new Date('2025-01-30'),
        type: 'visado',
        completed: false
    }
]

export const mockNotifications: Notification[] = [
    {
        id: 'n-001',
        type: 'visado',
        message: 'Expediente Vivienda Seseña: estado actualizado a "Requerido"',
        timestamp: new Date('2025-01-15T10:30:00'),
        projectId: 'p-001',
        read: false
    },
    {
        id: 'n-002',
        type: 'pago',
        message: 'Factura vencida: Certificación obra enero - 6.100€',
        timestamp: new Date('2025-01-14T14:20:00'),
        projectId: 'p-001',
        read: false
    },
    {
        id: 'n-003',
        type: 'recordatorio',
        message: 'Próximo hito mañana: Presentación visado COAM',
        timestamp: new Date('2025-01-13T09:00:00'),
        projectId: 'p-001',
        read: true
    }
]

export const mockTasks: Task[] = [
    {
        id: 't-001',
        projectId: 'p-001',
        title: 'Responder requerimientos COAM',
        priority: 'high',
        dueDate: new Date('2025-01-18'),
        completed: false
    },
    {
        id: 't-002',
        projectId: 'p-001',
        title: 'Completar justificación CTE DB-HE',
        priority: 'high',
        dueDate: new Date('2025-01-20'),
        completed: false
    },
    {
        id: 't-003',
        projectId: 'p-002',
        title: 'Revisar alineación fachada con PGOU',
        priority: 'medium',
        dueDate: new Date('2025-02-22'),
        completed: false
    },
    {
        id: 't-004',
        projectId: 'p-001',
        title: 'Enviar recordatorio pago cliente',
        priority: 'medium',
        completed: false
    }
]

export const mockVisadoStates: Record<string, VisadoState> = {
    'p-001': {
        status: 'requerido',
        fechaSolicitud: new Date('2025-01-05'),
        motivosRequerido: [
            'Falta justificación de evacuación DB-SI 3',
            'Memoria estructural incompleta',
            'Carátula planos sin firma digital'
        ],
        observaciones: 'Plazo de subsanación: 15 días hábiles'
    },
    'p-002': {
        status: 'tramitacion',
        fechaSolicitud: new Date('2025-01-10'),
        observaciones: 'En revisión por el colegio'
    }
}
