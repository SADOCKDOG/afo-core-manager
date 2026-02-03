import { ImportedFile, ImportAnalysis } from './project-import'
import { Document } from './types'

export interface BatchProcessingOptions {
  batchSize: number
  delayBetweenBatches: number
  maxConcurrent: number
  onProgress?: (progress: BatchProgress) => void
  onBatchComplete?: (batchNumber: number, results: any[]) => void
  onError?: (error: Error, item: any) => void
}

export interface BatchProgress {
  total: number
  processed: number
  successful: number
  failed: number
  currentBatch: number
  totalBatches: number
  percentage: number
  estimatedTimeRemaining?: number
  currentOperation?: string
}

export interface BatchResult<T> {
  successful: T[]
  failed: Array<{ item: any; error: Error }>
  stats: {
    totalProcessed: number
    successCount: number
    failureCount: number
    totalTime: number
    averageTimePerItem: number
  }
}

export class BatchProcessor {
  private startTime: number = 0
  private processedCount: number = 0

  async processBatch<T, R>(
    items: T[],
    processFn: (item: T, index: number) => Promise<R>,
    options: Partial<BatchProcessingOptions> = {}
  ): Promise<BatchResult<R>> {
    const {
      batchSize = 10,
      delayBetweenBatches = 100,
      maxConcurrent = 3,
      onProgress,
      onBatchComplete,
      onError
    } = options

    this.startTime = Date.now()
    this.processedCount = 0

    const successful: R[] = []
    const failed: Array<{ item: T; error: Error }> = []
    const totalBatches = Math.ceil(items.length / batchSize)

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize
      const end = Math.min(start + batchSize, items.length)
      const batch = items.slice(start, end)

      const batchResults = await this.processSingleBatch(
        batch,
        processFn,
        start,
        maxConcurrent,
        onError
      )

      successful.push(...batchResults.successful)
      failed.push(...batchResults.failed)
      this.processedCount += batch.length

      if (onProgress) {
        const elapsed = Date.now() - this.startTime
        const avgTimePerItem = elapsed / this.processedCount
        const remaining = items.length - this.processedCount
        const estimatedTimeRemaining = avgTimePerItem * remaining

        onProgress({
          total: items.length,
          processed: this.processedCount,
          successful: successful.length,
          failed: failed.length,
          currentBatch: batchIndex + 1,
          totalBatches,
          percentage: (this.processedCount / items.length) * 100,
          estimatedTimeRemaining
        })
      }

      if (onBatchComplete) {
        onBatchComplete(batchIndex + 1, batchResults.successful)
      }

      if (batchIndex < totalBatches - 1 && delayBetweenBatches > 0) {
        await this.delay(delayBetweenBatches)
      }
    }

    const totalTime = Date.now() - this.startTime

    return {
      successful,
      failed,
      stats: {
        totalProcessed: items.length,
        successCount: successful.length,
        failureCount: failed.length,
        totalTime,
        averageTimePerItem: totalTime / items.length
      }
    }
  }

  private async processSingleBatch<T, R>(
    batch: T[],
    processFn: (item: T, index: number) => Promise<R>,
    startIndex: number,
    maxConcurrent: number,
    onError?: (error: Error, item: T) => void
  ): Promise<{ successful: R[]; failed: Array<{ item: T; error: Error }> }> {
    const successful: R[] = []
    const failed: Array<{ item: T; error: Error }> = []

    const chunks = this.chunkArray(batch, maxConcurrent)

    for (const chunk of chunks) {
      const promises = chunk.map(async (item, idx) => {
        try {
          const result = await processFn(item, startIndex + idx)
          return { success: true as const, result, item }
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error))
          if (onError) {
            onError(err, item)
          }
          return { success: false as const, error: err, item }
        }
      })

      const results = await Promise.all(promises)

      for (const result of results) {
        if (result.success) {
          successful.push(result.result)
        } else {
          failed.push({ item: result.item, error: result.error })
        }
      }
    }

    return { successful, failed }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export async function processFilesInBatches(
  files: File[],
  options: Partial<BatchProcessingOptions> = {}
): Promise<BatchResult<{ file: File; data: string | null }>> {
  const processor = new BatchProcessor()

  return processor.processBatch(
    files,
    async (file, index) => {
      if (options.onProgress) {
        options.onProgress({
          ...options.onProgress.length ? {} as any : {} as any,
          currentOperation: `Procesando: ${file.name}`
        } as BatchProgress)
      }

      try {
        const data = await readFileAsDataURL(file)
        return { file, data }
      } catch (error) {
        throw new Error(`Error al leer archivo ${file.name}: ${error}`)
      }
    },
    options
  )
}

export async function processDocumentsInBatches(
  files: ImportedFile[],
  projectId: string,
  options: Partial<BatchProcessingOptions> = {}
): Promise<BatchResult<Document>> {
  const processor = new BatchProcessor()

  return processor.processBatch(
    files,
    async (file, index) => {
      if (options.onProgress) {
        const currentProgress = options.onProgress as any
        if (currentProgress.currentOperation !== undefined) {
          currentProgress.currentOperation = `Generando documento: ${file.name}`
        }
      }

      const doc: Document = {
        id: `doc-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: file.suggestedType,
        folder: file.suggestedFolder,
        currentVersion: 'P01',
        versions: [
          {
            id: `v-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            version: 'P01',
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: Date.now(),
            uploadedBy: 'import',
            status: 'draft',
            notes: `Importado automáticamente con confianza ${file.confidence}`,
            fileData: file.fileData
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        metadata: {
          format: file.extension,
          suggestedFolder: file.suggestedFolder,
          importedFrom: file.path
        }
      }

      await new Promise(resolve => setTimeout(resolve, 10))

      return doc
    },
    options
  )
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      resolve(reader.result as string)
    }
    
    reader.onerror = () => {
      reject(new Error(`Error al leer el archivo: ${file.name}`))
    }
    
    reader.readAsDataURL(file)
  })
}

export async function analyzeFilesInBatches(
  files: File[],
  options: Partial<BatchProcessingOptions> = {}
): Promise<BatchResult<ImportedFile>> {
  const processor = new BatchProcessor()

  return processor.processBatch(
    files,
    async (file, index) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || ''
      const path = (file as any).webkitRelativePath || file.name
      const folderPath = path.substring(0, path.lastIndexOf('/'))

      let fileData: string | undefined
      
      if (file.size < 10 * 1024 * 1024) {
        try {
          fileData = await readFileAsDataURL(file)
        } catch (error) {
          console.warn(`No se pudo leer el contenido de ${file.name}`)
        }
      }

      const { analyzeFileName, suggestFolderForDocument } = await import('./project-import')
      const analysis = analyzeFileName(file.name, folderPath)

      const importedFile: ImportedFile = {
        fileName: file.name,
        name: file.name,
        path: path,
        size: file.size,
        extension,
        suggestedType: analysis.type,
        suggestedFolder: '',
        confidence: analysis.confidence,
        file: file,
        fileData
      }

      return importedFile
    },
    {
      ...options,
      batchSize: options.batchSize || 20,
      maxConcurrent: options.maxConcurrent || 5
    }
  )
}

export function formatTimeRemaining(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export function calculateTotalSize(files: File[]): number {
  return files.reduce((total, file) => total + file.size, 0)
}
