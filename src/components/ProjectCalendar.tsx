import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, ProjectMilestone, MILESTONE_TYPE_LABELS, MILESTONE_PRIORITY_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MilestoneDialog } from '@/components/MilestoneDialog'
import { 
  CalendarBlank, 
  CaretLeft, 
  CaretRight,
  Plus,
  CheckCircle,
  Clock,
  WarningCircle,
  Prohibit
} from '@phosphor-icons/react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isPast, isFuture } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProjectCalendarProps {
  projects: Project[]
}

export function ProjectCalendar({ projects }: ProjectCalendarProps) {
  const [milestones, setMilestones] = useKV<ProjectMilestone[]>('project-milestones', [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<ProjectMilestone | undefined>()
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const filteredMilestones = useMemo(() => {
    let filtered = milestones || []
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(m => m.priority === filterPriority)
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === filterStatus)
    }
    
    return filtered.sort((a, b) => a.date - b.date)
  }, [milestones, filterPriority, filterStatus])

  const getMilestonesForDay = (day: Date) => {
    return filteredMilestones.filter(milestone => 
      isSameDay(new Date(milestone.date), day)
    )
  }

  const upcomingMilestones = useMemo(() => {
    const now = Date.now()
    return filteredMilestones
      .filter(m => m.status === 'pending' && m.date >= now)
      .slice(0, 5)
  }, [filteredMilestones])

  const overdueMilestones = useMemo(() => {
    const now = Date.now()
    return filteredMilestones.filter(m => 
      m.status === 'pending' && m.date < now
    )
  }, [filteredMilestones])

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleSaveMilestone = (milestoneData: Partial<ProjectMilestone>) => {
    setMilestones(currentMilestones => {
      const milestonesList = currentMilestones || []
      if (milestoneData.id) {
        return milestonesList.map(m => 
          m.id === milestoneData.id 
            ? { ...m, ...milestoneData, updatedAt: Date.now() } as ProjectMilestone
            : m
        )
      } else {
        const newMilestone: ProjectMilestone = {
          id: Date.now().toString(),
          projectId: milestoneData.projectId!,
          title: milestoneData.title!,
          description: milestoneData.description,
          type: milestoneData.type!,
          date: milestoneData.date!,
          priority: milestoneData.priority || 'medium',
          status: milestoneData.status || 'pending',
          relatedPhase: milestoneData.relatedPhase,
          relatedInvoiceId: milestoneData.relatedInvoiceId,
          relatedVisaId: milestoneData.relatedVisaId,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        return [...milestonesList, newMilestone]
      }
    })
  }

  const handleEditMilestone = (milestone: ProjectMilestone) => {
    setEditingMilestone(milestone)
    setMilestoneDialogOpen(true)
  }

  const handleToggleMilestoneStatus = (milestoneId: string) => {
    setMilestones(currentMilestones => 
      (currentMilestones || []).map(m => {
        if (m.id === milestoneId) {
          const newStatus = m.status === 'completed' ? 'pending' : 'completed'
          return {
            ...m,
            status: newStatus,
            completedAt: newStatus === 'completed' ? Date.now() : undefined,
            updatedAt: Date.now()
          }
        }
        return m
      })
    )
  }

  const handleDeleteMilestone = (milestoneId: string) => {
    setMilestones(currentMilestones => 
      (currentMilestones || []).filter(m => m.id !== milestoneId)
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle weight="fill" className="text-green-500" />
      case 'overdue': return <WarningCircle weight="fill" className="text-destructive" />
      case 'cancelled': return <Prohibit weight="fill" className="text-muted-foreground" />
      default: return <Clock weight="fill" className="text-primary" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-primary text-primary-foreground'
      case 'low': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.title || 'Proyecto desconocido'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Calendario de Proyectos</h2>
          <p className="text-muted-foreground">Gestiona plazos y fechas importantes</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-card border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('month')}
              className={cn(viewMode === 'month' && 'bg-primary/10 text-primary')}
            >
              Mes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(viewMode === 'list' && 'bg-primary/10 text-primary')}
            >
              Lista
            </Button>
          </div>
          
          <Button
            onClick={() => {
              setEditingMilestone(undefined)
              setMilestoneDialogOpen(true)
            }}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={18} weight="bold" />
            Nuevo Hito
          </Button>
        </div>
      </div>

      {overdueMilestones.length > 0 && (
        <Card className="p-4 bg-destructive/10 border-destructive/50">
          <div className="flex items-start gap-3">
            <WarningCircle size={24} weight="fill" className="text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">
                {overdueMilestones.length} {overdueMilestones.length === 1 ? 'hito vencido' : 'hitos vencidos'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Revisa los plazos pendientes que han superado su fecha límite
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {viewMode === 'month' ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h3>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Hoy
                  </Button>
                  <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                    <CaretLeft size={18} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextMonth}>
                    <CaretRight size={18} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const dayMilestones = getMilestonesForDay(day)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isCurrentDay = isToday(day)
                  const hasMilestones = dayMilestones.length > 0

                  return (
                    <motion.div
                      key={day.toISOString()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      className={cn(
                        "min-h-[100px] p-2 rounded-lg border-2 cursor-pointer transition-all",
                        isCurrentMonth ? 'bg-card' : 'bg-muted/30',
                        isCurrentDay && 'border-primary ring-2 ring-primary/20',
                        !isCurrentDay && 'border-transparent hover:border-primary/50',
                        hasMilestones && 'bg-primary/5'
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={cn(
                        "text-sm font-semibold mb-1",
                        !isCurrentMonth && 'text-muted-foreground',
                        isCurrentDay && 'text-primary'
                      )}>
                        {format(day, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayMilestones.slice(0, 2).map(milestone => (
                          <div
                            key={milestone.id}
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded truncate",
                              getPriorityColor(milestone.priority)
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditMilestone(milestone)
                            }}
                          >
                            {milestone.title}
                          </div>
                        ))}
                        {dayMilestones.length > 2 && (
                          <div className="text-xs text-muted-foreground px-1.5">
                            +{dayMilestones.length - 2} más
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-2">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 bg-background border rounded-lg text-sm"
                  >
                    <option value="all">Todas las prioridades</option>
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-background border rounded-lg text-sm"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completado</option>
                    <option value="overdue">Vencido</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredMilestones.length > 0 ? (
                  filteredMilestones.map((milestone) => {
                    const project = projects.find(p => p.id === milestone.projectId)
                    const isOverdue = milestone.status === 'pending' && isPast(new Date(milestone.date))
                    
                    return (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer",
                          milestone.status === 'completed' && 'bg-green-500/5 border-green-500/20',
                          isOverdue && 'bg-destructive/5 border-destructive/20',
                          milestone.status === 'pending' && !isOverdue && 'bg-card border-border'
                        )}
                        onClick={() => handleEditMilestone(milestone)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {getStatusIcon(isOverdue && milestone.status === 'pending' ? 'overdue' : milestone.status)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{milestone.title}</h4>
                                <Badge variant="outline" className={cn("text-xs", getPriorityColor(milestone.priority))}>
                                  {MILESTONE_PRIORITY_LABELS[milestone.priority]}
                                </Badge>
                              </div>
                              
                              {milestone.description && (
                                <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarBlank size={14} />
                                  {format(new Date(milestone.date), 'dd MMM yyyy', { locale: es })}
                                </span>
                                
                                {project && (
                                  <Badge variant="secondary" className="text-xs">
                                    {project.title}
                                  </Badge>
                                )}
                                
                                <Badge variant="outline" className="text-xs">
                                  {MILESTONE_TYPE_LABELS[milestone.type]}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleMilestoneStatus(milestone.id)
                            }}
                          >
                            {milestone.status === 'completed' ? 'Reabrir' : 'Completar'}
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <CalendarBlank size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                    <p className="text-muted-foreground">No hay hitos que coincidan con los filtros</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} weight="duotone" />
              Próximos Hitos
            </h4>
            
            {upcomingMilestones.length > 0 ? (
              <div className="space-y-3">
                {upcomingMilestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleEditMilestone(milestone)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("text-xs", getPriorityColor(milestone.priority))}>
                        {MILESTONE_PRIORITY_LABELS[milestone.priority]}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm mb-1">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(milestone.date), 'dd MMM yyyy', { locale: es })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getProjectName(milestone.projectId)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay hitos próximos
              </p>
            )}
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-4">Resumen</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total hitos</span>
                <span className="font-semibold">{milestones?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pendientes</span>
                <span className="font-semibold text-primary">
                  {milestones?.filter(m => m.status === 'pending').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completados</span>
                <span className="font-semibold text-green-600">
                  {milestones?.filter(m => m.status === 'completed').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vencidos</span>
                <span className="font-semibold text-destructive">
                  {overdueMilestones.length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <MilestoneDialog
        open={milestoneDialogOpen}
        onOpenChange={setMilestoneDialogOpen}
        onSave={handleSaveMilestone}
        onDelete={handleDeleteMilestone}
        milestone={editingMilestone}
        projects={projects}
        preselectedDate={selectedDate}
      />
    </div>
  )
}
