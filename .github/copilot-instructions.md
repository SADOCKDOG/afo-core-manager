# AFO Core Manager - AI Agent Instructions

## Project Overview

**AFO Core Manager** is a professional project management application for autonomous architects in Spain, built with React + TypeScript + Vite, using GitHub Spark framework for persistence and state management. The application centralizes architectural project workflows, client management, regulatory compliance, and document organization specific to Spanish building codes (CTE, RITE, REBT).

**Target Users**: Spanish architects managing multiple projects with complex regulatory requirements  
**Domain**: Architecture/Construction project management for Spain  
**Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS 4, GitHub Spark, shadcn/ui, Radix UI

## Architecture & Key Patterns

### State Management with GitHub Spark
- **All persistent state uses `useKV<T>()` hook** from `@github/spark/hooks` - this is Spark's key-value storage
- Store data like: `const [projects, setProjects] = useKV<Project[]>('projects', [])`
- Keys are strings (e.g., `'projects'`, `'stakeholders'`, `'compliance-checks-${projectId}'`)
- Data persists automatically across sessions - no explicit save needed
- **Never use localStorage directly** - always use useKV for persistence

### Component Structure
- **Functional components only** with React 19 hooks
- Export pattern: `export function ComponentName({ props }: ComponentNameProps) {`
- Props interfaces defined above component, named `ComponentNameProps`
- Components in `src/components/` are self-contained feature modules
- UI primitives in `src/components/ui/` from shadcn/ui (accordion, button, dialog, etc.)

### Type System
- All types centralized in `src/lib/types.ts` (552 lines)
- Core types: `Project`, `Stakeholder`, `Document`, `ComplianceCheck`, `Budget`, `Invoice`
- Spanish architectural phases: `'estudio-previo' | 'anteproyecto' | 'basico' | 'ejecucion' | 'direccion-obra'`
- Status types: `ProjectStatus`, `PhaseStatus`, `DocumentStatus`
- **Always import types from** `@/lib/types`

### Path Aliases
- Use `@/` for all imports within `src/`: `import { Project } from '@/lib/types'`
- Configured in `tsconfig.json` and `vite.config.ts`

### Spanish-First Domain
- All UI text, enums, and data in Spanish (e.g., `'Memoria Básico'`, `'Dirección de Obra'`)
- Regulatory codes: CTE (Código Técnico de la Edificación), RITE (Reglamento de Instalaciones Térmicas), REBT (Reglamento Electrotécnico)
- Document naming follows ISO19650-2: `PROYECTO_DISCIPLINA_DESCRIPCION_VERSION.ext`
- Version numbering: `P01` (shared), `P01.01` (draft), `C01` (approved)

## Critical Workflows

### Building & Running
```bash
npm run dev          # Start dev server on port 5000 (Vite default for Spark)
npm run build        # TypeScript compile + Vite build
npm run kill         # Kill process on port 5000 (fuser -k 5000/tcp)
npm run preview      # Preview production build
```

### Creating New Features
1. **Define types first** in `src/lib/types.ts` if needed
2. **Create utility functions** in `src/lib/` (e.g., `document-utils.ts`, `compliance-data.ts`)
3. **Build component** in `src/components/` with useKV for state
4. **Integrate into App.tsx** - main app file manages routing/navigation
5. **Use existing UI components** from `src/components/ui/` - don't recreate primitives

### Document Management Pattern
- Documents have versions: `DocumentVersion[]` array in `Document.versions`
- Version generation logic in `src/lib/document-utils.ts`: `generateVersionNumber()`, `getNextVersion()`
- Folder structures: `'by-type'` (Planos, Memorias, etc.) or `'screaming-architecture'` (by phase)
- File uploads tracked with metadata: `{ discipline, description, format, application }`

### Compliance System Architecture
- National requirements in `src/lib/compliance-data.ts`: 40+ requirements from CTE/RITE/REBT
- Municipal requirements in `src/components/MunicipalComplianceManager.tsx`: PGOU, local ordinances
- Checklist generation: `ComplianceGeneratorDialog` filters requirements by building parameters
- Storage: `useKV<Record<string, ComplianceChecklist>>('compliance-checklists', {})`
- Each project has its own checklist keyed by project ID

## Project-Specific Conventions

### Component Patterns
- **Dialog components** for modals: `<Dialog>` from Radix UI wrapped in `src/components/ui/dialog.tsx`
- **Form handling**: react-hook-form + zod for validation
- **Toasts**: `toast.success()`, `toast.error()` from 'sonner'
- **Icons**: Phosphor Icons (`@phosphor-icons/react`) - use `weight="duotone"` for visual consistency
- **Animations**: Framer Motion for page transitions and cards

### Data Patterns
- **IDs**: Use `Date.now().toString()` or `crypto.randomUUID()` for unique IDs
- **Timestamps**: Store as `number` (milliseconds), format with `date-fns`
- **Relationships**: Store IDs, not nested objects (e.g., `stakeholders: string[]` in Project, not full objects)
- **Lookups**: Filter arrays in components: `stakeholders.filter(s => project.stakeholders.includes(s.id))`

### Regulatory Data
- Predefined regulatory codes in `src/lib/regulatory-data.ts`: `REGULATORY_CODES`, `COMMON_QUERIES`
- AI interpretation function: `interpretRegulatoryCode()` in `src/lib/ai-regulatory.ts`
- Compliance requirements: `RESIDENTIAL_COMPLIANCE_REQUIREMENTS` in `src/lib/compliance-data.ts`
- Always cite exact article references (e.g., "CTE DB-SE-AE 3.1", "RITE IT 1.2.4.2")

### Email Service
- Email configuration and sending in `src/lib/email-service.ts`
- Supports SendGrid and AWS SES providers
- Config stored with useKV: `useEmailConfig()` hook
- Email logs tracked: `useKV<EmailLog[]>('email-logs', [])`
- Schedule system for automated compliance reports

## Integration Points

### GitHub Spark Framework
- Import from `@github/spark/hooks`: `useKV`, `useChat`, `useAI`
- Vite plugin: `@github/spark/spark-vite-plugin` in `vite.config.ts`
- Icon proxy: `createIconImportProxy()` for Phosphor icons optimization
- **Do not remove Spark plugins** - they're required for persistence

### External Services
- **AI Features**: Uses AI interpretation for regulatory queries and document generation
- **Email**: SendGrid or AWS SES for compliance report distribution
- **BC3 Files**: Budget import/export with `src/lib/bc3-parser.ts` (Spanish construction standard)

### UI Library Integration
- **shadcn/ui**: Pre-built components in `src/components/ui/` - use as-is, don't modify
- **Radix UI**: Unstyled primitives (Dialog, Dropdown, etc.) - styled with Tailwind
- **Tailwind CSS 4**: Uses new `@tailwindcss/vite` plugin, config in `tailwind.config.js`
- **Theme**: Custom theme variables in `src/styles/theme.css`

## Common Pitfalls to Avoid

1. **Don't use localStorage** - use `useKV()` instead
2. **Don't modify UI components** in `src/components/ui/` - they're from shadcn/ui
3. **Don't hardcode regulatory data** - use centralized data files in `src/lib/`
4. **Don't mix English/Spanish** - keep all domain terms in Spanish
5. **Don't create new state management** - use Spark's useKV consistently
6. **Don't ignore version control** - documents must follow ISO19650-2 naming
7. **Don't forget project ID** - many useKV keys are scoped: `compliance-checks-${projectId}`

## Testing & Validation

- **No formal test suite yet** - validate manually in dev mode
- **Type checking**: Run `tsc -b --noCheck` before build
- **Linting**: ESLint configured with React hooks plugin
- **Document validation**: Version numbering must follow `P##`, `P##.##`, `C##` format
- **Compliance**: All requirements must have valid regulatory references

## Key Files Reference

- **Main App**: [src/App.tsx](src/App.tsx) - routing, navigation, main state
- **Types**: [src/lib/types.ts](src/lib/types.ts) - all TypeScript interfaces
- **Compliance**: [src/lib/compliance-data.ts](src/lib/compliance-data.ts) - 40+ national requirements
- **Documents**: [src/lib/document-utils.ts](src/lib/document-utils.ts) - version logic, naming
- **Regulatory**: [src/lib/regulatory-data.ts](src/lib/regulatory-data.ts) - CTE/RITE/REBT codes
- **Email**: [src/lib/email-service.ts](src/lib/email-service.ts) - SendGrid/SES integration
- **Project Spec**: [PRD.md](PRD.md) - full product requirements (247 lines)

## When Making Changes

1. **Read types first** - understand data structures in `src/lib/types.ts`
2. **Check existing utils** - don't reimplement logic that exists in `src/lib/`
3. **Follow naming patterns** - component files match export names
4. **Use Spanish terminology** - maintain domain language consistency
5. **Preserve Spark integration** - don't break useKV patterns
6. **Reference PRD** - understand feature requirements in [PRD.md](PRD.md)
