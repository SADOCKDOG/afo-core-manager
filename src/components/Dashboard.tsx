import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Buildings, Users, CurrencyEur, Che
import { motion } from 'framer-motion'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface DashboardProps {
  onNavigate: (view: 

  const activeProject
  const totalRevenu
    .reduce((sum, inv) => sum + inv.total, 0)
 

  
    .sort((a, b) => b.updatedAt - a.updatedAt)

    {
      value: activeProjects.length.to
      icon: Buildings,
      bgColor: 'bg-chart-1/10',
    },
      label: 'Clientes',
   
      bgColor: 'bg-chart-2/10',
  
      label: 'Facturación',
      icon: CurrencyEur,
      bgColor: '

      label: 'Fas
    {
      label: 'Proyectos Activos',
      value: activeProjects.length.toString(),
      total: projects.length,
      icon: Buildings,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
      onClick: () => onNavigate('projects')
    },
    {
      label: 'Clientes',
      value: clients.length.toString(),
      icon: Users,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      onClick: () => onNavigate('clients')
    },
    {
      label: 'Facturación',
      value: `${(totalRevenue / 1000).toFixed(1)}k €`,
      icon: CurrencyEuro,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      onClick: () => onNavigate('invoices')
    },
    {
      label: 'Fases Completadas',
      value: `${completedPhases}/${totalPhases}`,
      icon: CheckCircle,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    }
  ]

  const projectStats = [
    { label: 'Activos', count: activeProjects.length, color: 'bg-chart-1' },
    { label: 'Archivados', count: archivedProjects.length, color: 'bg-muted-foreground' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visión general de tu gestión</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className={`p-6 hover:shadow-lg transition-all ${stat.onClick ? 'cursor-pointer' : ''}`}
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon size={24} weight="duotone" className={stat.color} />
                </div>
                {stat.total && (
                  <span className="text-sm text-muted-foreground">de {stat.total}</span>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Proyectos Recientes</h3>
                <p className="text-sm text-muted-foreground">Últimas actualizaciones</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('projects')}
              >
                Ver todos
              </Button>
            </div>

            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => {
                  const completedCount = project.phases.filter(p => p.status === 'completed').length
                  const progress = project.phases.length > 0 
                    ? (completedCount / project.phases.length) * 100 
                    : 0
                  return (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('projects')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            project.status === 'active' ? 'bg-chart-1/10 text-chart-1' : 'bg-muted'
                          }`}>
                            <Buildings size={20} weight="duotone" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{completedCount}/{project.phases.length} fases</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Buildings size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
                <p>No hay proyectos recientes</p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Estado de Proyectos</h3>
              <p className="text-sm text-muted-foreground">Distribución por estado</p>
            </div>
            <div className="space-y-4">
              {projectStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="text-sm text-muted-foreground">{stat.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} transition-all`}
                      style={{ width: `${projects.length > 0 ? (stat.count / projects.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Facturas Pendientes</h4>
                <p className="text-sm text-muted-foreground">{pendingInvoices.length} facturas</p>
              </div>
              <div className="space-y-3">
                {pendingInvoices.length > 0 ? (
                  pendingInvoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`p-2 rounded-lg ${
                        invoice.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-chart-3/10 text-chart-3'
                      }`}>
                        {invoice.status === 'overdue' ? (
                          <Warning size={20} weight="duotone" />
                        ) : (
                          <Clock size={20} weight="duotone" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">{invoice.total.toFixed(2)} €</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    <CheckCircle size={32} className="mx-auto mb-2 opacity-50" weight="duotone" />
                    <p>No hay facturas pendientes</p>
                  </div>
                )}
                {pendingInvoices.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full"
                    onClick={() => onNavigate('invoices')}
                  >
                    Ver todas ({pendingInvoices.length})
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
      icon: CheckCircle,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    }
  ]

  const projectStats = [
    { label: 'Activos', count: activeProjects.length, color: 'bg-chart-1' },
    { label: 'Archivados', count: archivedProjects.length, color: 'bg-muted-foreground' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visión general de tu gestión</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className={`p-6 hover:shadow-lg transition-all ${stat.onClick ? 'cursor-pointer' : ''}`}
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon size={24} weight="duotone" className={stat.color} />
                </div>
                {stat.total && (
                  <span className="text-sm text-muted-foreground">de {stat.total}</span>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Proyectos Recientes</h3>
                <p className="text-sm text-muted-foreground">Últimas actualizaciones</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('projects')}
              >
                Ver todos
              </Button>
            </div>

            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => {
                  const completedCount = project.phases.filter(p => p.status === 'completed').length
                  const progress = project.phases.length > 0 
                    ? (completedCount / project.phases.length) * 100 
                    : 0
                  return (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('projects')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            project.status === 'active' ? 'bg-chart-1/10 text-chart-1' : 'bg-muted'
                          }`}>
                            <Buildings size={20} weight="duotone" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{completedCount}/{project.phases.length} fases</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Buildings size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
                <p>No hay proyectos recientes</p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Estado de Proyectos</h3>
              <p className="text-sm text-muted-foreground">Distribución por estado</p>
            </div>
            <div className="space-y-4">
              {projectStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="text-sm text-muted-foreground">{stat.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} transition-all`}
                      style={{ width: `${projects.length > 0 ? (stat.count / projects.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Facturas Pendientes</h4>
                <p className="text-sm text-muted-foreground">{pendingInvoices.length} facturas</p>
              </div>
              <div className="space-y-3">
                {pendingInvoices.length > 0 ? (
                  pendingInvoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`p-2 rounded-lg ${
                        invoice.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-chart-3/10 text-chart-3'
                      }`}>
                        {invoice.status === 'overdue' ? (
                          <Warning size={20} weight="duotone" />
                        ) : (
                          <Clock size={20} weight="duotone" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">{invoice.total.toFixed(2)} €</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    <CheckCircle size={32} className="mx-auto mb-2 opacity-50" weight="duotone" />
                    <p>No hay facturas pendientes</p>
                  </div>
                )}
                {pendingInvoices.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full"
                    onClick={() => onNavigate('invoices')}
                  >
                    Ver todas ({pendingInvoices.length})
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
