import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Buildings, Users, CurrencyEur, FileText, TrendUp, CheckCircle, Clock, WarningCircle, ChartBar } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface DashboardProps {
  projects: Project[]
  clients: Client[]
  invoices: Invoice[]
  budgets: Budget[]
  onNavigate: (view: 'projects' | 'clients' | 'invoices') => void
}

export function Dashboard({ projects, clients, invoices, budgets, onNavigate }: DashboardProps) {
  const activeProjects = projects.filter(p => p.status === 'active')
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0)
  const pendingInvoices = invoices.filter(i => i.status === 'issued' || i.status === 'overdue')
  const completedPhases = projects.reduce((sum, p) => 
    sum + p.phases.filter(ph => ph.status === 'completed').length, 0
  )
  const totalPhases = projects.reduce((sum, p) => sum + p.phases.length, 0)
  
  const recentProjects = [...projects]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  const stats = [
    {
      label: 'Proyectos Activos',
      value: activeProjects.length,
      total: projects.length,
      icon: Buildings,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
      onClick: () => onNavigate('projects')
    },
    {
      label: 'Clientes Totales',
      value: clients.length,
      icon: Users,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      onClick: () => onNavigate('clients')
    },
    {
      label: 'Facturación Cobrada',
      value: `${(totalRevenue / 1000).toFixed(1)}k €`,
      icon: CurrencyEur,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      onClick: () => onNavigate('invoices')
    },
    {
      label: 'Fases Completadas',
      value: completedPhases,
      total: totalPhases,
      icon: CheckCircle,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ]

  const projectsByStatus = [
    { label: 'Activos', count: activeProjects.length, color: 'bg-chart-1' },
    { label: 'En Pausa', count: projects.filter(p => p.status === 'on-hold').length, color: 'bg-chart-5' },
    { label: 'Archivados', count: projects.filter(p => p.status === 'archived').length, color: 'bg-muted' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Panel de Control</h2>
        <p className="text-muted-foreground">Vista general de tu estudio arquitectónico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-primary/30"
              onClick={stat.onClick}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon size={24} weight="duotone" className={stat.color} />
                </div>
                {stat.onClick && (
                  <TrendUp size={20} className="text-muted-foreground" weight="duotone" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  {stat.total && (
                    <span className="text-sm text-muted-foreground">/ {stat.total}</span>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Proyectos Recientes</h3>
                <p className="text-sm text-muted-foreground">Últimas actualizaciones</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate('projects')}>
                Ver Todos
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => {
                  const completedPhasesCount = project.phases.filter(p => p.status === 'completed').length
                  const progress = project.phases.length > 0 
                    ? (completedPhasesCount / project.phases.length) * 100 
                    : 0
                  
                  return (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/5 transition-all cursor-pointer"
                      onClick={() => onNavigate('projects')}
                    >
                      <div className={`p-2 rounded-lg ${
                        project.status === 'active' ? 'bg-chart-1/10 text-chart-1' :
                        project.status === 'on-hold' ? 'bg-chart-5/10 text-chart-5' :
                        'bg-muted/50 text-muted-foreground'
                      }`}>
                        <Buildings size={20} weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{project.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            project.status === 'active' ? 'bg-chart-1/20 text-chart-1' :
                            project.status === 'on-hold' ? 'bg-chart-5/20 text-chart-5' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {project.status === 'active' ? 'Activo' : 
                             project.status === 'on-hold' ? 'En Pausa' : 'Archivado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{project.location}</span>
                          <span>•</span>
                          <span>{completedPhasesCount} / {project.phases.length} fases</span>
                        </div>
                        <Progress value={progress} className="h-1.5 mt-2" />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Buildings size={48} className="mx-auto mb-3 opacity-50" weight="duotone" />
                  <p>No hay proyectos todavía</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          <Card className="p-6 border-border/50">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Distribución</h3>
              <p className="text-sm text-muted-foreground">Proyectos por estado</p>
            </div>
            
            <div className="space-y-4">
              {projectsByStatus.map((status) => (
                <div key={status.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{status.label}</span>
                    <span className="text-sm text-muted-foreground">{status.count}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${status.color} transition-all duration-500`}
                      style={{ width: `${projects.length > 0 ? (status.count / projects.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Facturas Pendientes</h3>
              <p className="text-sm text-muted-foreground">Requieren atención</p>
            </div>
            
            {pendingInvoices.length > 0 ? (
              <div className="space-y-3">
                {pendingInvoices.slice(0, 3).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => onNavigate('invoices')}
                  >
                    <div className={`p-2 rounded-lg ${
                      invoice.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-chart-5/10 text-chart-5'
                    }`}>
                      {invoice.status === 'overdue' ? (
                        <WarningCircle size={18} weight="duotone" />
                      ) : (
                        <Clock size={18} weight="duotone" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">{invoice.total.toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
                {pendingInvoices.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => onNavigate('invoices')}
                  >
                    Ver {pendingInvoices.length - 3} más
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle size={40} className="mx-auto mb-2 opacity-50" weight="duotone" />
                <p className="text-sm">Todo al día</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
