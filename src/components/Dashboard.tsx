import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle,
  Buildings,
  UsersThree,
  Receipt,
  TrendUp,
  Clock
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DashboardProps {
  projects: Project[]
  clients: Client[]
  invoices: Invoice[]
  budgets: Budget[]
  onNavigate: (view: 'dashboard' | 'projects' | 'clients' | 'invoices' | 'project-detail') => void
}

export function Dashboard({ projects, clients, invoices, budgets, onNavigate }: DashboardProps) {
  const activeProjects = projects.filter(p => p.status === 'active')
  const issuedInvoices = invoices.filter(i => i.status === 'issued')
  const totalRevenue = issuedInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
  
  const completedPhases = projects.reduce((count, project) => {
    return count + project.phases.filter(phase => phase.status === 'completed').length
  }, 0)

  const recentProjects = projects
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  const stats = [
    {
      label: 'Proyectos Activos',
      value: activeProjects.length.toString(),
      icon: Buildings,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      label: 'Clientes',
      value: clients.length.toString(),
      icon: UsersThree,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: 'Facturas Emitidas',
      value: issuedInvoices.length.toString(),
      icon: Receipt,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      label: 'Fases Completadas',
      value: completedPhases.toString(),
      icon: CheckCircle,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general de tu actividad</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon size={28} weight="duotone" className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Proyectos Recientes</h3>
              <p className="text-sm text-muted-foreground mt-1">Actividad más reciente</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('projects')}
              className="gap-2"
            >
              Ver todos
            </Button>
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => {
                const completedPhasesCount = project.phases.filter(p => p.status === 'completed').length
                const totalPhasesCount = project.phases.length
                const progress = totalPhasesCount > 0 ? (completedPhasesCount / totalPhasesCount) * 100 : 0

                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => onNavigate('projects')}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={cn(
                        "p-2 rounded-lg",
                        project.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      )}>
                        <Buildings size={24} weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{project.title}</h4>
                          {project.status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              <CheckCircle size={12} weight="fill" />
                              Activo
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{project.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                            {completedPhasesCount}/{totalPhasesCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground ml-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(project.updatedAt).toLocaleDateString('es-ES', { 
                          day: '2-digit',
                          month: 'short'
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Buildings size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" weight="duotone" />
              <p className="text-muted-foreground">No hay proyectos recientes</p>
            </div>
          )}
        </Card>
      </motion.div>

      {totalRevenue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <TrendUp size={28} weight="duotone" className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Ingresos Facturados</p>
                <p className="text-3xl font-bold mt-1">
                  {totalRevenue.toLocaleString('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
