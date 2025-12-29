import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { 
  UsersTh
  CheckCircle
} from '@phosp


  Clock
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

type ViewMode = 'dashboard' | 'projects' | 'clients' | 'invoices' | 'project-detail'

interface DashboardProps {
  projects: Project[]
  const activeProje
  const issuedInvoice

    sum + p.phases.filter(phase => pha
 

    .slice(0, 5)
  const projectStats = [
    { label: 'Archivados', count: archivedProjects.length, color: 'bg-ch

    {

      color: 'text-chart-1',
    },
   
      icon: UsersThree,

    {
      value: invoices.length.toString(),
      color: 'te

      label: 'Fases Comp
      icon: CheckCircle,
    }


        <h2 class
     
      <div className="gri
          <motion.div
            initial={{
            transition={{ de
            <Card 
      
     
              </div>
                <p className="text-3xl 
              </div>
          </motion.div>
      </div>
      
     
          transition={{ 
        >
            <div cla
                <h3 classNam
              </div>
      
     
                Ver todos
            </div>
            {recentProje
                {recentProj
     
   

          
                      <div clas
           
                        </div>
                          project.status === 'active' 
            

                      </div>
                      {totalCount > 0
                     
                            
                            />
                          <span>{completed
                      )}
           
              </di
              <div className="text-center py-8 text-muted-foreground">
              </div>
          </C

          initial={{ opacity: 0, y: 20 }}
          transition
          <Card className="p-6">
            
              {projectStats.map((stat) => (
                  <d
                   
                  <div 
           
            

            </div>
            <div cl
            </div>
            <div className="space-y-3">
                <>
                    <div
         
                    >
                        <div className="flex-1">
                   
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                    
                     
                  ))}
                    <Butt
                      size="sm"
               
                      Ver
                  )}
              ) : 

                </div>
            </div>
        </motion.div>
    </div>
}
























































































































