import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { ApprovalFlow, ApprovalFlowTemplate } from '@/lib/approval-types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ApprovalFlowList } from './ApprovalFlowList'
import { CreateApprovalFlowDialog } from './CreateApprovalFlowDialog'
import { ApprovalFlowTemplateManager } from './ApprovalFlowTemplateManager'
import { ApprovalFlowDetailDialog } from './ApprovalFlowDetailDialog'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users,
  FileText,
  ListChecks
} from '@phosphor-icons/react'
import { getFlowStatusLabel } from '@/lib/approval-utils'

export function ApprovalFlowManager() {
  const [flows, setFlows] = useKV<ApprovalFlow[]>('approval-flows', [])
  const [templates] = useKV<ApprovalFlowTemplate[]>('approval-flow-templates', [])
  const [open, setOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<ApprovalFlow | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const activeFlows = (flows || []).filter(f => f.status === 'pending' || f.status === 'in-review')
  const completedFlows = (flows || []).filter(f => f.status === 'approved')
  const rejectedFlows = (flows || []).filter(f => f.status === 'rejected' || f.status === 'cancelled')

  const handleFlowClick = (flow: ApprovalFlow) => {
    setSelectedFlow(flow)
    setDetailDialogOpen(true)
  }

  const stats = [
    {
      label: 'Activos',
      value: activeFlows.length,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Aprobados',
      value: completedFlows.length,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Rechazados',
      value: rejectedFlows.length,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Plantillas',
      value: (templates || []).length,
      icon: ListChecks,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users size={16} weight="duotone" />
          Aprobaciones y Firmas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users size={24} weight="duotone" />
            </div>
            Flujos de Aprobación y Firma Digital
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon size={24} weight="duotone" className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="active" className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="active" className="gap-2">
                <Clock size={16} weight="duotone" />
                Activos ({activeFlows.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle size={16} weight="duotone" />
                Completados ({completedFlows.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle size={16} weight="duotone" />
                Rechazados ({rejectedFlows.length})
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <ListChecks size={16} weight="duotone" />
                Plantillas ({(templates || []).length})
              </TabsTrigger>
            </TabsList>

            <CreateApprovalFlowDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
            />
          </div>

          <ScrollArea className="h-[450px]">
            <TabsContent value="active" className="mt-0">
              <ApprovalFlowList
                flows={activeFlows}
                onFlowClick={handleFlowClick}
                emptyMessage="No hay flujos de aprobación activos"
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <ApprovalFlowList
                flows={completedFlows}
                onFlowClick={handleFlowClick}
                emptyMessage="No hay flujos completados"
              />
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              <ApprovalFlowList
                flows={rejectedFlows}
                onFlowClick={handleFlowClick}
                emptyMessage="No hay flujos rechazados"
              />
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <ApprovalFlowTemplateManager />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>

      {selectedFlow && (
        <ApprovalFlowDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          flow={selectedFlow}
          onFlowUpdate={(updatedFlow) => {
            setFlows(currentFlows => 
              (currentFlows || []).map(f => f.id === updatedFlow.id ? updatedFlow : f)
            )
            setSelectedFlow(updatedFlow)
          }}
        />
      )}
    </Dialog>
  )
}
