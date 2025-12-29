import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Buildings, Users, CurrencyEur, CheckCi
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface DashboardProps {
  budgets: Budget[]
}
export function Dashb
  const archivedPro
    .filter(i => i.status === 'paid')
 

  const totalPhases = projects.reduce((sum, p) => sum + p.phases.length, 0)
  const activeProjects = projects.filter(p => p.status === 'active')
  const archivedProjects = projects.filter(p => p.status === 'archived')
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
     
      color: 'text-chart-2',
      onClick: () => onNavigate('cl
    {
      value: `${(total
      color: 'text-chart-3',
      onClick: () => onNavigate
    {
      
     
      bgColor: 'bg-chart-4/10',
  ]
  const projectSta
    { label: 'Archivados', c

    <div className="space-y-8">
      
     
      <div className="grid grid-col
          <motion.div
            initial={{ op
            transition={{ du
            <Card 
              className={`p-6 hover:shadow-
      
     
                {stat.onClick && 
                )}
              <div classN
                <div cla
                  {stat.tota
                  )}
      
   

      <div className="grid gr
          className="lg:col-span-2"
          animate={{ opacity: 1, y: 0 }}
   

          
              </div>
           
                onClick={() => onNavigate('projects')}
              >
            

              {recentProjects.length > 0 ? (
                  const completedCoun
                    ?
                  return (
                      key={project.id}
                      className="p-4 round
                      <div className="flex items-start justify
           
                  
                          project.st
                          <Buildings size={20} weight="duotone" />
             
                        <div className="flex items-center justify-bet
                          <span className="font-medium">{completed
                        <Progress value={progress} className="h-2" />
                    </
                })
                <div className="text-center py-8 text-muted-foreground">
                  
              )}
          </Card>

          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          <Card className="p-6">
              <h3 className="text-xl font-semibold mb-1">Estado de Proyectos</h3>
            </div>
              {project
                  <d
                   
                  <div 
           
            

            </div>
            <div cl
              <div className="space
                  pendingInvoices.slice(0
                      key={invoice.id}
                        invoice.status === 'overdue'
         
                        <Warning
                        <Clock size={20} weight="duotone" />
                   
                        <p className="text-xs text-muted-foreground">{invoice.total
                    </div>
                ) : 
                    <C
                  </div>
                {pendingI
                    variant="ghost" 
                    className="w-
               
                  </Butto
              </div>
          </Card>
      </div>
  )




















































































































