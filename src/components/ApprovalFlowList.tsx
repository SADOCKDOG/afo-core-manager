import { ApprovalFlow } from '@/lib/approval-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Buildings, 
  Clock, 
  Users,
  CheckCircle
} from '@phosphor-icons/react'
import { 
  getApprovalProgress, 
  getFlowStatusLabel, 
  getFlowStatusBadge,
  formatFlowDuration,
  isFlowOverdue
} from '@/lib/approval-utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ApprovalFlowListProps {
  flows: ApprovalFlow[]
  onFlowClick: (flow: ApprovalFlow) => void
  emptyMessage: string
}

export function ApprovalFlowList({ flows, onFlowClick, emptyMessage }: ApprovalFlowListProps) {
  if (flows.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Users size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" weight="duotone" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {flows.map((flow) => {
        const progress = getApprovalProgress(flow)
        const isOverdue = isFlowOverdue(flow)

        return (
          <Card
            key={flow.id}
            className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
            onClick={() => onFlowClick(flow)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={20} weight="duotone" className="text-primary" />
                    <CardTitle className="text-lg">{flow.documentName}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Buildings size={14} />
                    {flow.projectName}
                  </CardDescription>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className={getFlowStatusBadge(flow.status)}>
                    {getFlowStatusLabel(flow.status)}
                  </Badge>
                  {isOverdue && (
                    <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30">
                      Vencido
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso de aprobación</span>
                <span className="font-semibold">
                  {progress.completedSteps}/{progress.totalSteps} pasos
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />

              <div className="flex items-center justify-between text-sm pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} />
                    <span>
                      {flow.completedAt 
                        ? `Completado: ${formatFlowDuration(flow.initiatedAt, flow.completedAt)}`
                        : `Iniciado: ${format(flow.initiatedAt, 'dd MMM yyyy', { locale: es })}`
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle size={14} />
                    <span>{progress.completedSignatures}/{progress.totalSignatures} firmas</span>
                  </div>
                </div>

                {flow.dueDate && !flow.completedAt && (
                  <div className={`text-xs ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Vence: {format(flow.dueDate, 'dd MMM yyyy', { locale: es })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
