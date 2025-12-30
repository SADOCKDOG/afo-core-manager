import { useState } from 'react'
import { CaretRight, CaretDown, Folder, FolderOpen, FileText } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ImportedFile } from '@/lib/project-import'
import { DOCUMENT_TYPE_LABELS } from '@/lib/types'

interface FolderNode {
  name: string
  path: string
  type: 'folder' | 'file'
  children: FolderNode[]
  file?: ImportedFile
}

interface FolderTreeProps {
  files: ImportedFile[]
  className?: string
}

function buildTree(files: ImportedFile[]): FolderNode {
  const root: FolderNode = {
    name: 'root',
    path: '',
    type: 'folder',
    children: []
  }

  files.forEach(file => {
    const parts = file.path.split('/').filter(p => p)
    let current = root

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1
      const path = parts.slice(0, index + 1).join('/')

      let child = current.children.find(c => c.name === part)

      if (!child) {
        child = {
          name: part,
          path,
          type: isLastPart ? 'file' : 'folder',
          children: [],
          file: isLastPart ? file : undefined
        }
        current.children.push(child)
      }

      current = child
    })
  })

  return root
}

function TreeNode({ node, level = 0 }: { node: FolderNode; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  if (node.type === 'file' && node.file) {
    return (
      <div
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded-md transition-colors"
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      >
        <FileText size={14} weight="duotone" className="text-muted-foreground flex-shrink-0" />
        <span className="text-sm truncate flex-1">{node.name}</span>
        <Badge variant="outline" className="text-xs flex-shrink-0">
          {DOCUMENT_TYPE_LABELS[node.file.suggestedType]}
        </Badge>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {(node.file.size / 1024).toFixed(0)} KB
        </span>
      </div>
    )
  }

  const hasChildren = node.children.length > 0
  const fileCount = countFiles(node)

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer",
          level === 0 && "font-medium"
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <CaretDown size={14} weight="bold" className="flex-shrink-0" />
          ) : (
            <CaretRight size={14} weight="bold" className="flex-shrink-0" />
          )
        ) : (
          <div className="w-3.5" />
        )}
        {isExpanded ? (
          <FolderOpen size={16} weight="duotone" className="text-primary flex-shrink-0" />
        ) : (
          <Folder size={16} weight="duotone" className="text-primary flex-shrink-0" />
        )}
        <span className="text-sm truncate flex-1">{node.name}</span>
        {fileCount > 0 && (
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {fileCount}
          </Badge>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.children
            .sort((a, b) => {
              if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
              return a.name.localeCompare(b.name)
            })
            .map((child, index) => (
              <TreeNode key={`${child.path}-${index}`} node={child} level={level + 1} />
            ))}
        </div>
      )}
    </div>
  )
}

function countFiles(node: FolderNode): number {
  if (node.type === 'file') return 1
  return node.children.reduce((sum, child) => sum + countFiles(child), 0)
}

export function FolderTree({ files, className }: FolderTreeProps) {
  const tree = buildTree(files)

  return (
    <div className={cn("space-y-0.5", className)}>
      {tree.children.length > 0 ? (
        tree.children
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
            return a.name.localeCompare(b.name)
          })
          .map((child, index) => (
            <TreeNode key={`${child.path}-${index}`} node={child} level={0} />
          ))
      ) : (
        <div className="text-sm text-muted-foreground text-center py-8">
          No hay archivos para mostrar
        </div>
      )}
    </div>
  )
}
