import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Buildings, Users, CurrencyEuro, FileText, TrendUp, CheckCircle, Clock, WarningCircle, ChartBar } from '@phosphor-icons/react'
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
      icon: CurrencyEuro,
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


    { label: 'Archivados', c

    <div className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Panel de Control</h2>
   

          
            initial={{ opacity:
           
            <Card 
              onClick={stat.onClick}
            

                {stat.onClick && (
                )}
              <div cl
                <div classNa
                  {stat.total && (
                  )}
              </div>
          <
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          initial={{ opacity: 0, y: 
          tra
        >
            <div className="flex items-center justify-between mb-6
                <h3 className="text-xl font-semibold mb-1">Proyectos Recientes</h
              </div>
                Ver Todos
            </div>
            <div c
                rece
                  const progress = projec
                    : 0
                  return (
                      key={project.id}
                      onClick={() 
                      <div className={`p-2 rounded-lg ${
                    
                      
                    
                   
                       
           
            

                        </div>
                   
                          <span>{complete
                        <Progress value=
                    </div>
                })
         
                  <p>No hay proyectos todavía</p>
              )}
          </Card>

          initial={{ opacity: 0, y: 20 }}
          transition
        >
            <div classNam
              <p classN
            
            
                  <div className="flex 
                    <span className="text-sm
                  <div className="w-full h-2 bg-m
                      className={`h-full ${status.color} transition-all duration-500`}
                    />
                </div>
            </div>

            <div className
              <p classNa
            
              <div className="space-y-3">
                  <div
                    c
                  >
                      invoice.status === 'overdue' ? 'bg-destructive/10 text-destruc
                      {invoice.status === 'overdue' ? (
                      ) : (
                      )}
                    <div className="flex-1 min-w-0">
                      <p cla
                  </div>
                {pendingInvoices.length > 3 && (
                    variant="ghost" 
                    className="w-full mt-2"
                  >
                  </Button>
              </div>
              <div className="
                <p className="text-sm">Todo al día</p>
            )}
        </motion.div>
    </div>
}



























































































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
