import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle,
  Warning,
  FileText,
  Clock,
  Sparkle,
  X,
  ArrowsClockwise
} from '@phosphor-icons/react'
import {
  BatchProgress,
  BatchResult,
  formatTimeRemaining,
  formatFileSize
} from '@/lib/batch-processor'
import { motion, AnimatePresence } from 'framer-motion'

interface BulkDocumentProcessorProps {
  isProcessing: boolean
  progress: BatchProgress | null
  onCancel?: () => void
}

export function BulkDocumentProcessor({
  isProcessing,
  progress,
  onCancel
}: BulkDocumentProcessorProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!isProcessing && !progress) return null

  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 w-96"
        >
          <Card className="shadow-2xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ArrowsClockwise size={24} className="text-primary" weight="bold" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-lg">Procesando Documentos</CardTitle>
                    <CardDescription>
                      Lote {progress?.currentBatch} de {progress?.totalBatches}
                    </CardDescription>
                  </div>
                </div>
                {onCancel && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onCancel}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso Total</span>
                  <span className="font-semibold">
                    {progress?.processed || 0} / {progress?.total || 0}
                  </span>
                </div>
                <Progress value={progress?.percentage || 0} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progress?.percentage || 0)}%</span>
                  {progress?.estimatedTimeRemaining && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatTimeRemaining(progress.estimatedTimeRemaining)}
                    </span>
                  )}
                </div>
              </div>

              {progress?.currentOperation && (
                <div className="flex items-center gap-2 text-sm">
                  <Sparkle size={16} className="text-primary animate-pulse" weight="fill" />
                  <span className="text-muted-foreground truncate">
                    {progress.currentOperation}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle size={16} className="text-green-500" weight="fill" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Exitosos</span>
                    <span className="text-sm font-semibold text-green-600">
                      {progress?.successful || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Warning size={16} className="text-red-500" weight="fill" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Fallidos</span>
                    <span className="text-sm font-semibold text-red-600">
                      {progress?.failed || 0}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Ocultar' : 'Mostrar'} Detalles
              </Button>

              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2"
                >
                  <Alert>
                    <FileText size={16} />
                    <AlertDescription className="text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Lote actual:</span>
                          <span className="font-medium">
                            {progress?.currentBatch} / {progress?.totalBatches}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Procesados:</span>
                          <span className="font-medium">{progress?.processed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pendientes:</span>
                          <span className="font-medium">
                            {(progress?.total || 0) - (progress?.processed || 0)}
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface BatchResultsSummaryProps {
  results: BatchResult<any>
  title?: string
  onClose?: () => void
}

export function BatchResultsSummary({
  results,
  title = 'Resultados del Procesamiento',
  onClose
}: BatchResultsSummaryProps) {
  const successRate = (results.stats.successCount / results.stats.totalProcessed) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Procesados {results.stats.totalProcessed} elementos en{' '}
              {(results.stats.totalTime / 1000).toFixed(2)}s
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tasa de Éxito</span>
            <span className="font-semibold">{successRate.toFixed(1)}%</span>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 rounded-lg bg-primary/10">
            <FileText size={24} className="text-primary mb-1" weight="duotone" />
            <span className="text-2xl font-bold">{results.stats.totalProcessed}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/10">
            <CheckCircle size={24} className="text-green-500 mb-1" weight="fill" />
            <span className="text-2xl font-bold text-green-600">
              {results.stats.successCount}
            </span>
            <span className="text-xs text-muted-foreground">Exitosos</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-red-500/10">
            <Warning size={24} className="text-red-500 mb-1" weight="fill" />
            <span className="text-2xl font-bold text-red-600">
              {results.stats.failureCount}
            </span>
            <span className="text-xs text-muted-foreground">Fallidos</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-2 rounded bg-muted/50">
            <span className="text-muted-foreground">Tiempo total:</span>
            <span className="font-medium">
              {formatTimeRemaining(results.stats.totalTime)}
            </span>
          </div>
          <div className="flex justify-between p-2 rounded bg-muted/50">
            <span className="text-muted-foreground">Promedio/ítem:</span>
            <span className="font-medium">
              {results.stats.averageTimePerItem.toFixed(0)}ms
            </span>
          </div>
        </div>

        {results.failed.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Warning size={16} className="text-red-500" />
              Errores Detectados ({results.failed.length})
            </h4>
            <ScrollArea className="h-32 rounded-lg border">
              <div className="p-2 space-y-1">
                {results.failed.map((failure, idx) => (
                  <Alert key={idx} variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">
                      <div className="font-medium mb-1">
                        {failure.item?.name || failure.item?.fileName || `Item ${idx + 1}`}
                      </div>
                      <div className="text-muted-foreground">
                        {failure.error.message}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
