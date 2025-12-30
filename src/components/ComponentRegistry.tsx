import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Cube,
  MagnifyingGlass,
  Package,
  FolderOpen,
  FileCode,
  Download,
} from '@phosphor-icons/react'
import { jsPDF } from 'jspdf'

interface ComponentInfo {
  name: string
  category: 'Business' | 'UI' | 'Manager' | 'Dialog' | 'Utility' | 'Form'
  description: string
  props?: string[]
  dependencies?: string[]
  features?: string[]
  relatedComponents?: string[]
  hooks?: string[]
  apis?: string[]
  complexity: 'Low' | 'Medium' | 'High'
  status: 'Stable' | 'Beta' | 'Experimental'
}

const COMPONENTS: ComponentInfo[] = [
  {
    name: 'Dashboard',
    category: 'Business',
    description: 'Main dashboard view showing project metrics, revenue, client statistics, and recent activity.',
    props: ['projects', 'clients', 'invoices', 'budgets', 'milestones', 'onNavigate'],
    features: [
      'Metric cards with total counts and trends',
      'Revenue tracking with monthly comparison',
      'Recent projects list with progress bars',
      'Project distribution by status (pie chart)',
      'Pending invoices overview',
      'Quick navigation to detailed views',
      'Empty state guidance for new users'
    ],
    dependencies: ['Card', 'Button', 'ScrollArea', 'Badge'],
    relatedComponents: ['ProjectCard', 'InvoiceManager'],
    hooks: ['useMemo'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectCard',
    category: 'Business',
    description: 'Display card for individual projects showing title, location, status, progress, and phases.',
    props: ['project', 'onClick', 'index'],
    features: [
      'Visual progress bar showing phase completion',
      'Status badge (Active/Archived)',
      'Phase indicators',
      'Location display',
      'Hover animations with elevation',
      'Click to navigate to project detail'
    ],
    dependencies: ['Card', 'Badge', 'motion (framer-motion)'],
    relatedComponents: ['ProjectDetail', 'ProjectDialog'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ProjectDetail',
    category: 'Business',
    description: 'Comprehensive project detail view with tabs for overview, documents, compliance, budget, milestones, and visa management.',
    props: ['project', 'stakeholders', 'onBack', 'onEdit', 'onUpdatePhaseStatus', 'onProjectUpdate'],
    features: [
      'Multi-tab interface (Overview, Documents, Compliance, Budget, Milestones, Visa)',
      'Phase management with status updates',
      'Stakeholder display',
      'Document management integration',
      'Compliance checklist integration',
      'Budget tracking',
      'Milestone timeline',
      'Visa workflow integration'
    ],
    dependencies: ['Tabs', 'Card', 'Button', 'Badge', 'DocumentManager', 'ComplianceChecker', 'BudgetManager'],
    relatedComponents: ['ProjectCard', 'DocumentManager', 'ComplianceChecker', 'VisaManager', 'BudgetManager', 'MilestoneDialog'],
    hooks: ['useState', 'useKV'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectDialog',
    category: 'Dialog',
    description: 'Dialog for creating and editing projects with multi-step wizard flow.',
    props: ['open', 'onOpenChange', 'onSave', 'project'],
    features: [
      'Multi-step wizard (Basic Info, Phases, Stakeholders, Folder Structure)',
      'Phase selection with percentage validation',
      'Stakeholder assignment',
      'Folder structure template selection',
      'Form validation',
      'Draft saving',
      'Edit mode support'
    ],
    dependencies: ['Dialog', 'Form', 'Input', 'Select', 'Checkbox', 'Button', 'Tabs'],
    relatedComponents: ['Project', 'StakeholderDialog', 'FolderStructureDialog'],
    hooks: ['useState', 'useForm (react-hook-form)'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentManager',
    category: 'Manager',
    description: 'Complete document management system with upload, version control, search, filtering, and bulk operations.',
    props: ['projectId', 'folderStructure', 'onStructureChange'],
    features: [
      'Document upload with metadata',
      'Version control system',
      'Multi-criteria search and filtering',
      'Folder structure navigation',
      'Bulk document upload',
      'Document preview',
      'Template library integration',
      'AI-powered document generation',
      'CSV export',
      'Document validation'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Table', 'Badge', 'ScrollArea'],
    relatedComponents: ['DocumentUploadDialog', 'BulkDocumentUpload', 'DocumentTemplateLibrary', 'DocumentPreview', 'DocumentSearch'],
    hooks: ['useKV', 'useState', 'useMemo'],
    apis: ['spark.llm'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentTemplateLibrary',
    category: 'Manager',
    description: 'Library of professional document templates with AI-powered content generation and auto-fill from project data.',
    props: ['projectId'],
    features: [
      'Template categories (Memorias, Planos, Administrativo, Presupuestos, Cálculos)',
      'Template search and filtering',
      'Form-based template customization',
      'AI content generation for sections',
      'Auto-fill from project data',
      'Smart field suggestions',
      'Preview before generation',
      'Automatic download',
      'ISO19650-2 naming compliance'
    ],
    dependencies: ['Dialog', 'Tabs', 'Card', 'Input', 'Textarea', 'Button', 'Select', 'Badge'],
    relatedComponents: ['AIContentGenerator', 'DocumentManager', 'DocumentTemplateWithAI'],
    hooks: ['useKV', 'useState'],
    apis: ['spark.llm', 'spark.llmPrompt'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'AIContentGenerator',
    category: 'Utility',
    description: 'AI-powered content generation dialog for creating custom document sections with context awareness.',
    props: ['open', 'onOpenChange', 'onGenerate', 'projectContext', 'sectionTitle'],
    features: [
      'Context-aware AI generation',
      'Tone selection (Formal, Descriptivo, Conciso, Normativo)',
      'Length control (Breve, Media, Detallada)',
      'Content regeneration',
      'Copy to clipboard',
      'Loading states',
      'Error handling with retry'
    ],
    dependencies: ['Dialog', 'Textarea', 'Select', 'Button', 'RadioGroup'],
    relatedComponents: ['DocumentTemplateLibrary', 'DocumentTemplateWithAI'],
    hooks: ['useState'],
    apis: ['spark.llm', 'spark.llmPrompt'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ComplianceChecker',
    category: 'Business',
    description: 'Comprehensive compliance checklist system with automated generation and municipal requirements integration.',
    props: ['projectId'],
    features: [
      'Automated checklist generation based on building parameters',
      '40+ national regulatory requirements',
      'Municipal requirements integration',
      'Requirement categorization (12+ categories)',
      'Status tracking (Cumple, No Cumple, Pendiente, N/A)',
      'Priority levels (High, Medium, Low)',
      'Notes and evidence attachment',
      'Real-time search and filtering',
      'Progress calculation',
      'CSV export'
    ],
    dependencies: ['Card', 'Button', 'Badge', 'Textarea', 'Input', 'Tabs', 'Select'],
    relatedComponents: ['MunicipalComplianceManager', 'ComplianceGeneratorDialog', 'ComplianceChecklistView'],
    hooks: ['useKV', 'useState', 'useMemo'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'MunicipalComplianceManager',
    category: 'Manager',
    description: 'Manager for creating and applying municipality-specific compliance requirements to projects.',
    props: [],
    features: [
      'Municipality database with Spanish provinces',
      'Custom requirement creation',
      'Requirement categorization',
      'Pre-loaded examples (Madrid, Barcelona, Cartagena)',
      'Search and filter municipalities',
      'Apply to new or existing checklists',
      'Duplicate detection',
      'PGOU and ordinance citation support',
      'Visual municipality badges'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Table', 'Badge', 'Tabs'],
    relatedComponents: ['ComplianceChecker', 'ComplianceGeneratorDialog'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BudgetManager',
    category: 'Manager',
    description: 'Construction budget management with BC3 integration and hierarchical budget structure.',
    props: ['projectId'],
    features: [
      'Hierarchical budget structure (Chapters, Units, Resources)',
      'BC3 file import and export',
      'Integrated price database',
      'Price database search',
      'GG, BI, IVA calculations',
      'Budget status tracking (Draft, Approved, Rejected)',
      'Total calculations (PEM, PEC, PEM + GG + BI)',
      'Budget approval workflow'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Table', 'Select', 'Card'],
    relatedComponents: ['BC3ImportDialog', 'PriceDatabaseDialog', 'BudgetItemDialog'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'InvoiceManager',
    category: 'Manager',
    description: 'Complete invoicing system with automatic generation from phase completion and PDF export.',
    props: [],
    features: [
      'Invoice creation and editing',
      'Client integration',
      'Line item management',
      'Tax calculations (IVA)',
      'Invoice status (Draft, Issued, Paid, Overdue, Cancelled)',
      'Automatic invoice generation on phase completion',
      'PDF export with professional formatting',
      'Invoice number generation',
      'Payment tracking',
      'Invoice search and filtering'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Table', 'Select', 'Badge', 'DatePicker'],
    relatedComponents: ['InvoiceDialog', 'AutoInvoiceConfirmDialog', 'ClientManager'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ClientManager',
    category: 'Manager',
    description: 'Client database management with detailed profiles and project association.',
    props: [],
    features: [
      'Client creation and editing',
      'Legal and individual client support',
      'NIF/CIF validation',
      'Contact information management',
      'Address management',
      'Payment terms tracking',
      'Project association',
      'Client search and filtering',
      'Client statistics'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Table', 'Select', 'RadioGroup'],
    relatedComponents: ['ClientDialog', 'InvoiceManager', 'BillingManager'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BillingManager',
    category: 'Manager',
    description: 'Billing configuration and invoice generation settings manager.',
    props: [],
    features: [
      'Default tax rates configuration',
      'Invoice numbering series',
      'Payment terms defaults',
      'Company billing information',
      'Invoice template customization',
      'Auto-invoice settings'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Select', 'Switch'],
    relatedComponents: ['InvoiceManager'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'StakeholderDialog',
    category: 'Dialog',
    description: 'Dialog for creating and editing project stakeholders (promoters, architects, technicians).',
    props: ['open', 'onOpenChange', 'onSave', 'stakeholder'],
    features: [
      'Stakeholder type selection',
      'NIF/CIF validation',
      'Contact information fields',
      'Professional credentials (collegiate number, qualification)',
      'Form validation',
      'Edit mode support'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Form'],
    relatedComponents: ['ProjectDialog', 'ProjectDetail'],
    hooks: ['useState', 'useForm'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'VisaManager',
    category: 'Manager',
    description: 'Professional college visa (visado colegial) application and tracking system.',
    props: [],
    features: [
      'Visa application creation',
      'College selection (COAM, COACM, COAG, Other)',
      'Phase-specific document requirements',
      'Document validation (size, format, type)',
      'Requirements checklist',
      'Fee calculation by college',
      'Status workflow (Draft → Submitted → Under Review → Approved/Rejected)',
      'Application number generation',
      'Rejection reason tracking',
      'Document resubmission'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Table', 'Badge', 'Checkbox'],
    relatedComponents: ['VisaApplicationDialog', 'ProjectDetail'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ApprovalFlowManager',
    category: 'Manager',
    description: 'Document approval workflow system with digital signatures and templates.',
    props: [],
    features: [
      'Approval flow creation',
      'Flow types (Sequential, Parallel, Unanimous)',
      'Multi-step workflows',
      'Approver assignment from stakeholder registry',
      'Template management',
      'Flow status tracking',
      'Progress visualization',
      'Audit trail',
      'Digital signature integration',
      'Qualified signature support'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Table', 'Badge', 'Tabs'],
    relatedComponents: ['CreateApprovalFlowDialog', 'ApprovalFlowList', 'ApprovalFlowTemplateManager', 'DigitalSignaturePad', 'QualifiedSignatureDialog'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureProviderManager',
    category: 'Manager',
    description: 'Configuration manager for qualified electronic signature providers (Cl@ve, ViafirmaPro).',
    props: [],
    features: [
      'Provider configuration (Cl@ve, ViafirmaPro)',
      'Authentication settings',
      'API credential management',
      'Test/Production mode toggle',
      'Provider status monitoring',
      'Configuration validation',
      'Security settings'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Select', 'Switch', 'Tabs'],
    relatedComponents: ['QualifiedSignatureDialog', 'ApprovalFlowManager'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureRequestViewer',
    category: 'Business',
    description: 'Dashboard for viewing and managing qualified signature requests.',
    props: [],
    features: [
      'Signature request list',
      'Status filtering',
      'Request details view',
      'Signature metadata display',
      'Certificate information',
      'Audit trail viewing',
      'Request expiry tracking',
      'Error log viewing'
    ],
    dependencies: ['Dialog', 'Table', 'Badge', 'Button', 'ScrollArea'],
    relatedComponents: ['QualifiedSignatureDialog', 'ApprovalFlowManager'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'DigitalSignaturePad',
    category: 'Utility',
    description: 'Simple digital signature capture interface with draw and type options.',
    props: ['onSign', 'onCancel'],
    features: [
      'Canvas-based signature drawing',
      'Typed signature option',
      'Clear and redo functionality',
      'Signature preview',
      'Automatic metadata capture (timestamp, IP, user agent)',
      'Legal terms acceptance'
    ],
    dependencies: ['Dialog', 'Button', 'Input', 'Checkbox'],
    relatedComponents: ['ApprovalFlowManager', 'QualifiedSignatureDialog'],
    hooks: ['useState', 'useRef'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureDialog',
    category: 'Dialog',
    description: 'Dialog for creating qualified electronic signatures with provider integration.',
    props: ['open', 'onOpenChange', 'onSign', 'documentId', 'documentTitle'],
    features: [
      'Provider selection (Cl@ve, ViafirmaPro)',
      'Signature level selection (Simple, Advanced, Qualified)',
      'Cl@ve authentication methods (PIN, Permanente, DNI-e, Certificate)',
      'OTP verification',
      'Certificate selection',
      'SAML authentication flow',
      'Signature metadata capture',
      'Legal validity badges'
    ],
    dependencies: ['Dialog', 'Select', 'RadioGroup', 'Button', 'Input', 'Badge'],
    relatedComponents: ['QualifiedSignatureProviderManager', 'ApprovalFlowManager', 'DigitalSignaturePad'],
    hooks: ['useState'],
    apis: ['qualified-signature-service'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectCalendar',
    category: 'Business',
    description: 'Calendar view of projects with milestone tracking and timeline visualization.',
    props: ['projects'],
    features: [
      'Monthly calendar view',
      'Project milestone display',
      'Date navigation',
      'Event filtering',
      'Day/Week/Month views',
      'Project phase timeline',
      'Milestone creation',
      'Due date tracking'
    ],
    dependencies: ['Calendar', 'Button', 'Badge', 'Card'],
    relatedComponents: ['MilestoneDialog', 'ProjectDetail'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'MilestoneDialog',
    category: 'Dialog',
    description: 'Dialog for creating and editing project milestones with dates and descriptions.',
    props: ['open', 'onOpenChange', 'onSave', 'projectId', 'milestone'],
    features: [
      'Milestone title and description',
      'Date selection',
      'Status tracking',
      'Project association',
      'Form validation'
    ],
    dependencies: ['Dialog', 'Input', 'Textarea', 'DatePicker', 'Button', 'Select'],
    relatedComponents: ['ProjectCalendar', 'ProjectDetail'],
    hooks: ['useState', 'useForm'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'AIRegulatoryAssistant',
    category: 'Utility',
    description: 'AI-powered assistant for regulatory queries and code interpretation.',
    props: [],
    features: [
      'Natural language regulatory queries',
      'Code interpretation',
      'Regulation search',
      'Context-aware responses',
      'Citation references',
      'Query history',
      'Spanish building code expertise'
    ],
    dependencies: ['Dialog', 'Textarea', 'Button', 'ScrollArea', 'Card'],
    relatedComponents: ['ComplianceChecker', 'MunicipalComplianceManager'],
    hooks: ['useState'],
    apis: ['spark.llm', 'spark.llmPrompt'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BoardPermitWorkflow',
    category: 'Manager',
    description: 'Workflow manager for municipal building permit applications and tracking.',
    props: [],
    features: [
      'Permit application creation',
      'Municipal requirements checklist',
      'Document submission tracking',
      'Status workflow',
      'Review comments',
      'Approval tracking',
      'Fee calculation',
      'Timeline tracking'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Table', 'Badge', 'Checkbox'],
    relatedComponents: ['MunicipalComplianceManager', 'DocumentManager'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'EmailConfigDialog',
    category: 'Dialog',
    description: 'Email service configuration dialog for SMTP settings and email sending.',
    props: ['open', 'onOpenChange'],
    features: [
      'SMTP server configuration',
      'Authentication settings',
      'Test email sending',
      'Configuration validation',
      'Secure credential storage'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Switch'],
    relatedComponents: ['EmailLogsDialog'],
    hooks: ['useKV', 'useState'],
    apis: ['email-service'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'EmailLogsDialog',
    category: 'Dialog',
    description: 'Email sending history and delivery status viewer.',
    props: ['open', 'onOpenChange'],
    features: [
      'Email history list',
      'Delivery status tracking',
      'Error log viewing',
      'Search and filter',
      'Email content preview',
      'Resend functionality'
    ],
    dependencies: ['Dialog', 'Table', 'Badge', 'Button', 'ScrollArea'],
    relatedComponents: ['EmailConfigDialog'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ProjectImportDialog',
    category: 'Dialog',
    description: 'Single project import from folder structure with document scanning.',
    props: ['open', 'onOpenChange', 'onImportComplete'],
    features: [
      'Folder structure scanning',
      'Document detection and categorization',
      'Metadata extraction',
      'Preview before import',
      'Import validation',
      'Progress tracking'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Progress', 'ScrollArea'],
    relatedComponents: ['BulkProjectImportDialog', 'DocumentManager'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectImportDialog',
    category: 'Dialog',
    description: 'Bulk project import from multiple folders with batch processing.',
    props: ['open', 'onOpenChange', 'onImportComplete'],
    features: [
      'Multi-folder scanning',
      'Batch document detection',
      'Parallel processing',
      'Import queue management',
      'Error handling per project',
      'Progress visualization',
      'Import summary report'
    ],
    dependencies: ['Dialog', 'Button', 'Progress', 'Table', 'ScrollArea'],
    relatedComponents: ['ProjectImportDialog', 'BulkProjectExportDialog'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectExportDialog',
    category: 'Dialog',
    description: 'Bulk project export to folder structure with document packaging.',
    props: ['open', 'onOpenChange'],
    features: [
      'Multi-project selection',
      'Export format options',
      'Document packaging',
      'Metadata export',
      'ZIP archive creation',
      'Progress tracking',
      'Export summary'
    ],
    dependencies: ['Dialog', 'Checkbox', 'Button', 'Progress', 'Select'],
    relatedComponents: ['BulkProjectImportDialog', 'ProjectExportDialog'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'UserManual',
    category: 'Business',
    description: 'Comprehensive user manual with all modules, functions, and usage instructions.',
    props: [],
    features: [
      'Complete module documentation',
      'Step-by-step guides',
      'Search functionality',
      'Table of contents navigation',
      'Visual examples',
      'PDF export',
      'Markdown export',
      'Printable format',
      'Searchable content',
      'Visual guides integration'
    ],
    dependencies: ['Dialog', 'ScrollArea', 'Button', 'Input', 'Tabs', 'Card'],
    relatedComponents: ['DeveloperManual', 'VisualGuideViewer'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DeveloperManual',
    category: 'Business',
    description: 'Technical documentation for developers including architecture, APIs, and code structure.',
    props: [],
    features: [
      'Architecture diagrams',
      'Component documentation',
      'API reference',
      'Code examples',
      'Module structure',
      'Data flow diagrams',
      'Integration guides',
      'PDF export',
      'Markdown export',
      'Code snippets downloadable'
    ],
    dependencies: ['Dialog', 'ScrollArea', 'Button', 'Tabs', 'Card', 'Code'],
    relatedComponents: ['UserManual', 'ArchitectureDiagrams'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ArchitectureDiagrams',
    category: 'Utility',
    description: 'Visual architecture and flow diagrams for system components and data flow.',
    props: [],
    features: [
      'Component relationship diagrams',
      'Data flow visualizations',
      'Module architecture',
      'Integration points',
      'API flow charts',
      'State management diagrams',
      'Export as SVG/PNG',
      'Interactive navigation'
    ],
    dependencies: ['Dialog', 'Button', 'Tabs'],
    relatedComponents: ['DeveloperManual'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'VisualGuideViewer',
    category: 'Utility',
    description: 'Step-by-step visual guide viewer with screenshots and annotations.',
    props: ['guideId'],
    features: [
      'Step-by-step navigation',
      'Screenshot display',
      'Annotations and highlights',
      'Progress tracking',
      'Guide categories',
      'Search guides',
      'Export to PDF'
    ],
    dependencies: ['Dialog', 'Button', 'Card', 'Badge', 'Progress'],
    relatedComponents: ['UserManual'],
    hooks: ['useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ComplianceReportGenerator',
    category: 'Utility',
    description: 'Generate comprehensive compliance reports from checklist data.',
    props: ['projectId', 'checklistData'],
    features: [
      'Professional PDF report generation',
      'Compliance status summary',
      'Requirement details with status',
      'Non-compliance highlights',
      'Regulatory reference citations',
      'Custom branding',
      'Export formats (PDF, DOCX)'
    ],
    dependencies: ['Button', 'Select'],
    relatedComponents: ['ComplianceChecker', 'ComplianceReportEmailDialog'],
    hooks: ['useState'],
    apis: ['pdf-export'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentGeneratorHub',
    category: 'Business',
    description: 'Central hub for all document generation features and templates.',
    props: [],
    features: [
      'Template library access',
      'Recent documents',
      'AI generation tools',
      'Quick actions',
      'Document statistics',
      'Template favorites'
    ],
    dependencies: ['Dialog', 'Card', 'Button', 'Tabs'],
    relatedComponents: ['DocumentTemplateLibrary', 'AIContentGenerator'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'OnlineDatabaseBrowser',
    category: 'Utility',
    description: 'Browser for online construction price databases and code references.',
    props: [],
    features: [
      'Database source selection',
      'Price search',
      'Code search',
      'Result filtering',
      'Price comparison',
      'Add to budget',
      'Historical price tracking'
    ],
    dependencies: ['Dialog', 'Input', 'Table', 'Button', 'Select'],
    relatedComponents: ['BudgetManager', 'PriceDatabaseDialog'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'PGOUImporter',
    category: 'Utility',
    description: 'Import and parse municipal PGOU (Plan General de Ordenación Urbana) documents.',
    props: [],
    features: [
      'PDF upload and parsing',
      'Regulation extraction',
      'Zone classification',
      'Parameter extraction',
      'Auto-categorization',
      'Municipality association'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Progress'],
    relatedComponents: ['MunicipalComplianceManager'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  }
]

const UTILITY_MODULES = [
  {
    name: 'types.ts',
    description: 'TypeScript type definitions for all data models',
    exports: ['Project', 'Stakeholder', 'Invoice', 'Client', 'Budget', 'Document', 'ComplianceCheck', 'VisaApplication', 'ApprovalFlow', 'Milestone']
  },
  {
    name: 'utils.ts',
    description: 'General utility functions and helpers',
    exports: ['cn', 'formatDate', 'formatCurrency', 'generateId']
  },
  {
    name: 'email-service.ts',
    description: 'Email sending service with SMTP configuration',
    exports: ['sendEmail', 'useEmailConfig', 'EmailConfig']
  },
  {
    name: 'pdf-export.ts',
    description: 'PDF document generation and export utilities',
    exports: ['exportToPDF', 'generateInvoicePDF', 'generateReportPDF']
  },
  {
    name: 'project-export.ts',
    description: 'Project export functionality with ZIP packaging',
    exports: ['exportProject', 'exportProjects', 'packageDocuments']
  },
  {
    name: 'project-import.ts',
    description: 'Project import from folder structures',
    exports: ['importProject', 'scanFolder', 'detectDocuments']
  },
  {
    name: 'document-utils.ts',
    description: 'Document handling utilities',
    exports: ['generateDocumentName', 'extractMetadata', 'validateDocument']
  },
  {
    name: 'invoice-utils.ts',
    description: 'Invoice calculation and generation utilities',
    exports: ['calculateInvoiceTotal', 'generatePhaseCompletionInvoice', 'formatInvoiceNumber']
  },
  {
    name: 'budget-utils.ts',
    description: 'Budget calculation utilities',
    exports: ['calculateBudgetTotal', 'calculateGG', 'calculateBI', 'calculateIVA']
  },
  {
    name: 'bc3-parser.ts',
    description: 'BC3 file format parser and generator',
    exports: ['parseBC3', 'generateBC3', 'BC3Data']
  },
  {
    name: 'compliance-data.ts',
    description: 'Compliance requirement database and rules',
    exports: ['COMPLIANCE_REQUIREMENTS', 'generateChecklist', 'filterRequirements']
  },
  {
    name: 'municipal-compliance.ts',
    description: 'Municipal compliance data and utilities',
    exports: ['MUNICIPALITIES', 'getMunicipalRequirements', 'applyMunicipalRequirements']
  },
  {
    name: 'regulatory-data.ts',
    description: 'Spanish building code reference database',
    exports: ['CTE_REFERENCES', 'RITE_REFERENCES', 'REBT_REFERENCES', 'searchRegulation']
  },
  {
    name: 'visa-utils.ts',
    description: 'Professional visa utilities and calculations',
    exports: ['calculateVisaFee', 'validateVisaDocuments', 'VISA_REQUIREMENTS']
  },
  {
    name: 'visa-validation.ts',
    description: 'Visa document validation rules',
    exports: ['validateDocumentSize', 'validateDocumentFormat', 'checkRequirements']
  },
  {
    name: 'document-templates.ts',
    description: 'Document template definitions and content',
    exports: ['DOCUMENT_TEMPLATES', 'getTemplate', 'fillTemplate']
  },
  {
    name: 'approval-types.ts',
    description: 'Approval flow type definitions',
    exports: ['ApprovalFlow', 'ApprovalStep', 'FlowType', 'ApprovalStatus']
  },
  {
    name: 'approval-utils.ts',
    description: 'Approval workflow utilities',
    exports: ['validateFlowProgress', 'canApprove', 'isFlowComplete']
  },
  {
    name: 'qualified-signature-types.ts',
    description: 'Qualified signature type definitions',
    exports: ['SignatureProvider', 'SignatureLevel', 'SignatureRequest', 'SignatureMetadata']
  },
  {
    name: 'qualified-signature-service.ts',
    description: 'Qualified electronic signature service integration',
    exports: ['createSignatureRequest', 'verifySignature', 'getProviderConfig']
  },
  {
    name: 'visual-guides-data.ts',
    description: 'Visual guide content and structure',
    exports: ['VISUAL_GUIDES', 'getGuide', 'searchGuides']
  },
  {
    name: 'visual-guide-export.ts',
    description: 'Visual guide export utilities',
    exports: ['exportGuideToPDF', 'exportGuideToMarkdown']
  },
  {
    name: 'budget-prices.ts',
    description: 'Construction price database',
    exports: ['PRICE_DATABASE', 'searchPrices', 'getPriceByCode']
  },
  {
    name: 'ai-regulatory.ts',
    description: 'AI regulatory assistant integration',
    exports: ['queryRegulation', 'interpretCode', 'generateResponse']
  }
]

export function ComponentRegistry() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null)

  const filteredComponents = useMemo(() => {
    return COMPONENTS.filter(component => {
      const matchesSearch = 
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const categories = ['all', ...Array.from(new Set(COMPONENTS.map(c => c.category)))]

  const exportToMarkdown = () => {
    let markdown = '# AFO CORE MANAGER - Component Registry\n\n'
    markdown += '## Complete Component Documentation\n\n'
    markdown += `Total Components: ${COMPONENTS.length}\n\n`
    markdown += `Generated: ${new Date().toLocaleString('es-ES')}\n\n`
    markdown += '---\n\n'

    const categoryGroups = COMPONENTS.reduce((acc, component) => {
      if (!acc[component.category]) acc[component.category] = []
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(categoryGroups).forEach(([category, components]) => {
      markdown += `## ${category} Components\n\n`
      components.forEach(component => {
        markdown += `### ${component.name}\n\n`
        markdown += `**Description:** ${component.description}\n\n`
        markdown += `**Status:** ${component.status} | **Complexity:** ${component.complexity}\n\n`
        
        if (component.props && component.props.length > 0) {
          markdown += '**Props:**\n'
          component.props.forEach(prop => markdown += `- ${prop}\n`)
          markdown += '\n'
        }

        if (component.features && component.features.length > 0) {
          markdown += '**Features:**\n'
          component.features.forEach(feature => markdown += `- ${feature}\n`)
          markdown += '\n'
        }

        if (component.dependencies && component.dependencies.length > 0) {
          markdown += '**Dependencies:** ' + component.dependencies.join(', ') + '\n\n'
        }

        if (component.relatedComponents && component.relatedComponents.length > 0) {
          markdown += '**Related Components:** ' + component.relatedComponents.join(', ') + '\n\n'
        }

        if (component.hooks && component.hooks.length > 0) {
          markdown += '**Hooks Used:** ' + component.hooks.join(', ') + '\n\n'
        }

        if (component.apis && component.apis.length > 0) {
          markdown += '**APIs Used:** ' + component.apis.join(', ') + '\n\n'
        }

        markdown += '---\n\n'
      })
    })

    markdown += '## Utility Modules\n\n'
    UTILITY_MODULES.forEach(module => {
      markdown += `### ${module.name}\n\n`
      markdown += `${module.description}\n\n`
      markdown += '**Exports:** ' + module.exports.join(', ') + '\n\n'
      markdown += '---\n\n'
    })

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AFO-CORE-Component-Registry-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    let yPos = margin

    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      if (yPos > pageHeight - margin) {
        doc.addPage()
        yPos = margin
      }
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
      doc.text(lines, margin, yPos)
      yPos += lines.length * fontSize * 0.5
    }

    addText('AFO CORE MANAGER', 20, true)
    yPos += 5
    addText('Component Registry - Complete Documentation', 14, true)
    yPos += 5
    addText(`Total Components: ${COMPONENTS.length}`, 10)
    addText(`Generated: ${new Date().toLocaleString('es-ES')}`, 10)
    yPos += 10

    const categoryGroups = COMPONENTS.reduce((acc, component) => {
      if (!acc[component.category]) acc[component.category] = []
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(categoryGroups).forEach(([category, components]) => {
      if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = margin
      }
      addText(`${category} Components`, 14, true)
      yPos += 5

      components.forEach(component => {
        if (yPos > pageHeight - 100) {
          doc.addPage()
          yPos = margin
        }
        addText(component.name, 12, true)
        yPos += 2
        addText(component.description, 9)
        addText(`Status: ${component.status} | Complexity: ${component.complexity}`, 8)
        
        if (component.features && component.features.length > 0) {
          addText(`Features: ${component.features.length} total`, 8, true)
        }
        yPos += 5
      })
    })

    doc.addPage()
    yPos = margin
    addText('Utility Modules', 14, true)
    yPos += 5

    UTILITY_MODULES.forEach(module => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = margin
      }
      addText(module.name, 11, true)
      yPos += 2
      addText(module.description, 9)
      yPos += 5
    })

    doc.save(`AFO-CORE-Component-Registry-${Date.now()}.pdf`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Package size={18} weight="duotone" />
          Registro de Componentes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Cube size={32} weight="duotone" className="text-primary" />
            Registro Completo de Componentes
          </DialogTitle>
          <DialogDescription>
            Documentación completa de todos los componentes, módulos y utilidades integrados en AFO CORE MANAGER
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar componentes por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToMarkdown} className="gap-2">
              <FileCode size={16} />
              Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF} className="gap-2">
              <Download size={16} />
              PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-7 w-full">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === 'all' ? 'Todos' : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4 pr-4">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map(component => (
                    <Card 
                      key={component.name}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedComponent(component)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-3">
                              {component.name}
                              <Badge variant={component.status === 'Stable' ? 'default' : 'secondary'}>
                                {component.status}
                              </Badge>
                              <Badge variant="outline">{component.complexity}</Badge>
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {component.description}
                            </CardDescription>
                          </div>
                          <Badge>{component.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {component.features && component.features.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Características principales:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {component.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx}>• {feature}</li>
                              ))}
                              {component.features.length > 3 && (
                                <li className="text-primary">+ {component.features.length - 3} más...</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                    <p className="text-muted-foreground">No se encontraron componentes</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {selectedComponent && (
          <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedComponent.name}
                  <Badge variant={selectedComponent.status === 'Stable' ? 'default' : 'secondary'}>
                    {selectedComponent.status}
                  </Badge>
                  <Badge variant="outline">{selectedComponent.complexity}</Badge>
                </DialogTitle>
                <DialogDescription>{selectedComponent.description}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-6 pr-4">
                  {selectedComponent.props && selectedComponent.props.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Props:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.props.map(prop => (
                          <Badge key={prop} variant="secondary">{prop}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.features && selectedComponent.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Características:</h4>
                      <ul className="space-y-1 text-sm">
                        {selectedComponent.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedComponent.dependencies && selectedComponent.dependencies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Dependencias:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.dependencies.map(dep => (
                          <Badge key={dep} variant="outline">{dep}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.relatedComponents && selectedComponent.relatedComponents.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Componentes Relacionados:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.relatedComponents.map(comp => (
                          <Badge key={comp} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => {
                              const related = COMPONENTS.find(c => c.name === comp)
                              if (related) setSelectedComponent(related)
                            }}
                          >
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.hooks && selectedComponent.hooks.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Hooks Utilizados:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.hooks.map(hook => (
                          <Badge key={hook} variant="outline">{hook}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.apis && selectedComponent.apis.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">APIs Utilizadas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.apis.map(api => (
                          <Badge key={api} variant="default">{api}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}

        <Separator />

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FolderOpen size={18} weight="duotone" />
            Resumen del Sistema
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Componentes</p>
              <p className="text-2xl font-bold text-primary">{COMPONENTS.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Módulos Utilidad</p>
              <p className="text-2xl font-bold text-accent">{UTILITY_MODULES.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Componentes Estables</p>
              <p className="text-2xl font-bold text-green-500">
                {COMPONENTS.filter(c => c.status === 'Stable').length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Alta Complejidad</p>
              <p className="text-2xl font-bold text-orange-500">
                {COMPONENTS.filter(c => c.complexity === 'High').length}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
