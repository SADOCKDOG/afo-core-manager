import { Project, Client, Invoice, Budget } from '@/lib/types'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface DashboardProps {
  onNavigate: (view: 

  const activeProject
  
    .filter(inv => inv.status === 'issued' || inv.status === 'paid')



  const activeProjects = projects.filter(p => p.status === 'active')
  const archivedProjects = projects.filter(p => p.status === 'archived')
  
  const totalRevenue = invoices
    .filter(inv => inv.status === 'issued' || inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0)

  const pendingInvoices = invoices.filter(inv => 
    inv.status === 'issued' || inv.status === 'overdue'
  )

  const completedPhases = projects.reduce((sum, p) => 
    sum + p.phases.filter(ph => ph.status === 'completed').length, 0
  )
  const totalPhases = projects.reduce((sum, p) => sum + p.phases.length, 0)

      onClick: () => onNavigate('proje
    {
      value: cli

      onClick: ()
    {
      value: `${(totalRevenue / 1
      color: 'text-chart-3',
      onClick: () => onNaviga
    {
      value: `${completedPha
      color: 'text-chart-4',
    }

    {
  ]
  return (
      <div>
        <p className="text-m

        {stats.map((stat, index) => (
      
     
          >
              className={`p-6 hover:shadow-lg transiti
            >
                <div classNa
                </div>
                  <span className="text-sm 
      
     
              </div>
          </motion.div>
      </div>
      <div className="grid g
          className="lg:col-spa
     
   

                <h3 clas
              </div>
                variant="ghost" 
   

          
            {recentProjects.len
           
                  const progress = project.phases.length > 0 
                    : 0
            

                    >
                        <div classNam
                     
                            
                          <div>
                            <p className="
                        </div>
           
                  
                        </div>
                      </div>
             
              </div>
              <div className="text-center py-8 text-muted-foregrou
                <p>No hay proyectos recientes</p>
            )}
        </motion.div>
        <motion.div
          animate=
        >
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Distribución por estado</p
            <div className="space-y-4">
                <div
                   
                  </div
           
            

              ))}

              <div className="mb-4"
                <p className="text-sm tex
              <div className="space-y-3"
                  pendingInvoices.slice(0, 3).map((i
         
                      }`}>
                          <Warning size={20} weight="duotone" />
                   
                      </div>
                        <p className="text-sm font-medium truncate">{invoice.invoiceNumb
                    
                  ))
                  <div className
                    <p>No
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
