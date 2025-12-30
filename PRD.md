# AFO CORE MANAGER - MVP Prototype

A professional project management application designed specifically for autonomous architects in Spain, centralizing project workflows, client management, and regulatory compliance.

**Experience Qualities**:
1. **Professional** - The interface must convey expertise and reliability, reflecting the serious nature of architectural practice
2. **Efficient** - Every interaction should minimize clicks and automate repetitive tasks, respecting the architect's valuable time
3. **Trustworthy** - Clear information hierarchy and validation feedback to ensure confidence in critical project data

**Complexity Level**: Light Application (multiple features with basic state)
This MVP focuses on core project management functionality with client tracking, phase management, and document organization - essential features that demonstrate value immediately while serving as a foundation for the full vision of a complex multi-module system.

## Essential Features

### Project Creation & Management
- **Functionality**: Create and track architectural projects with client details, contracted phases, and key metadata
- **Purpose**: Centralize all project information in one authoritative location
- **Trigger**: User clicks "New Project" from dashboard
- **Progression**: Click New Project → Enter project details → Define contracted phases with percentages → Add stakeholders (Promotor, Architects, Other Technicians) → Save → View in dashboard
- **Success criteria**: Projects persist between sessions, all metadata is captured, phase percentages validate to logical totals

### Project Dashboard with Multiple Views
- **Functionality**: Visual overview of all active projects with status, progress, and key dates. Comprehensive main dashboard showing key metrics, recent activity, project distribution, and pending items across all modules
- **Purpose**: Provide at-a-glance understanding of studio workload, priorities, and business health with actionable insights
- **Trigger**: Application launch or navigation to "Dashboard" section
- **Progression**: Open app → See comprehensive dashboard with metric cards (active projects, total clients, revenue, completed phases) → View recent projects list with progress → Review project distribution by status → Check pending invoices → Click metric cards or items to navigate to detailed views
- **Success criteria**: Dashboard loads instantly with smooth animations, all metrics calculate accurately, recent projects show real-time progress, distribution charts reflect current data, navigation links work correctly, empty states guide users appropriately

### Stakeholder Management
- **Functionality**: Maintain a registry of clients, promoters, architects, and technical collaborators with reusable profiles
- **Purpose**: Eliminate redundant data entry and maintain consistent contact information across projects
- **Trigger**: Adding stakeholders during project creation or from stakeholder registry
- **Progression**: Select stakeholder type → Enter required fields (NIF/CIF, name, contact) → Save to registry → Assign to project
- **Success criteria**: Stakeholder data persists, can be reused across multiple projects, validation ensures required fields

### Phase & Milestone Tracking
- **Functionality**: Define project phases (Estudio Previo, Anteproyecto, Básico, Ejecución, Dirección de Obra) with participation percentages and status
- **Purpose**: Track contractual deliverables and billing milestones aligned with Spanish architectural practice
- **Trigger**: During project setup or editing existing project
- **Progression**: Select contracted phases → Assign percentage to each → Mark phases as pending/in progress/completed → System tracks overall project progress
- **Success criteria**: Phase completion updates project status, percentages are validated, visual progress indicator reflects current state

### Regulatory Reference Quick Access
- **Functionality**: Searchable database of key Spanish building regulations (CTE, RITE, REBT references)
- **Purpose**: Instant access to critical regulatory information without leaving the application
- **Trigger**: User searches for regulation or technical parameter
- **Progression**: Enter search term (e.g., "escaleras contrahuella") → View filtered results → Click result → See regulation excerpt with reference
- **Success criteria**: Search returns relevant results within 1 second, references are accurate and clearly cited

### Document Management with Automated Organization
- **Functionality**: Organize project documents with automated folder structures, version control, and comprehensive search/filtering
- **Purpose**: Maintain ISO19650-2 compliant document organization with instant retrieval and metadata tracking
- **Trigger**: User navigates to Documents tab in project detail view
- **Progression**: Select folder structure type → Upload documents with metadata (discipline, type, description) → Version documents automatically → Search/filter by metadata, discipline, status, or folder → View version history
- **Success criteria**: Documents persist with complete metadata, version numbering follows standard (P01, P02, C01), search returns relevant results instantly, filters narrow results effectively

### Advanced Document Search & Filtering
- **Functionality**: Multi-criteria search across document name, description, discipline, and metadata with visual filter management
- **Purpose**: Enable rapid document retrieval in large project repositories through intelligent filtering
- **Trigger**: User enters search query or opens filter panel in document manager
- **Progression**: Enter search text → Apply filters (type, status, discipline, folder) → View active filter badges → Clear individual or all filters → See result count update in real-time
- **Success criteria**: Search responds instantly as user types, filters combine logically (AND operation), active filters display as removable badges, empty states provide clear guidance

### Bulk Document Upload with Drag-and-Drop
- **Functionality**: Upload multiple documents simultaneously with drag-and-drop interface, default metadata configuration, and real-time progress tracking
- **Purpose**: Dramatically accelerate document import for projects with extensive documentation, reducing tedious one-by-one uploads
- **Trigger**: User clicks "Subida Masiva" button in document manager
- **Progression**: Open bulk upload dialog → Configure default type, folder, and discipline → Drag files into drop zone or click to select → Review file list with individual file metadata → Adjust individual file settings if needed → Initiate upload → View upload progress with success/error indicators → Receive confirmation toast
- **Success criteria**: Supports multiple file types (PDF, DWG, DXF, DOC, DOCX, JPG, PNG, XLS, XLSX), validates file names automatically, shows clear upload progress per file, handles errors gracefully with specific error messages, allows removal of files before upload, applies default settings to all files with ability to override per file

### Document Templates for Architectural Deliverables
- **Functionality**: Pre-configured document templates for common architectural deliverables (memorias, pliego de condiciones, certificados, mediciones) with customizable fields and automatic content generation
- **Purpose**: Accelerate document creation by providing standardized, CTE-compliant templates that maintain professional consistency and reduce repetitive writing
- **Trigger**: User clicks "Plantillas" button in document manager
- **Progression**: Open template library → Browse by category (Memorias, Planos, Administrativo, Presupuestos, Cálculos) or search → Select template → Fill required fields (promotor, arquitecto, ubicación, etc.) → Preview document structure → Confirm → System generates document with populated fields and downloads automatically → Document added to project with metadata
- **Success criteria**: 8+ professional templates covering essential deliverables (Memoria Básico, Memoria Ejecución, Justificación CTE-HE, Pliego Condiciones, Mediciones y Presupuesto, Gestión Residuos, Carátula Planos, Certificado Final), all fields properly replaced with user input, generated documents follow ISO19650-2 naming, documents automatically added to correct folder structure, instant download of generated content

### AI-Powered Document Content Generation
- **Functionality**: Advanced AI content generation for customizing individual sections of document templates with professionally-written, context-aware, normative-compliant content
- **Purpose**: Enable architects to generate high-quality, technically precise content for complex document sections using AI, incorporating project context and regulatory references automatically
- **Trigger**: User selects template → clicks "Generar con IA" button on any document section
- **Progression**: Select document template → Fill required fields → For any section, click "Generar con IA" → AI generator dialog opens with section context → User describes content requirements → Select tone (Formal, Descriptivo, Conciso, Normativo) and length (Breve, Media, Detallada) → AI generates content using project context (title, location, phase) → Review generated content → Regenerate if needed → Copy or apply to section → Repeat for other sections as needed → Generate final document with AI-customized sections
- **Success criteria**: AI generates architecturally sound, technically precise Spanish text with appropriate terminology; incorporates project context seamlessly; includes relevant normative references (CTE, RITE, etc.); respects selected tone and length preferences; allows regeneration and editing; generated sections integrate perfectly with template structure; clear visual distinction between default template content and AI-generated content; supports generating content for multiple sections independently

### AI-Powered Template Auto-Fill from Project Data
- **Functionality**: Intelligent auto-completion of document template fields using existing project data and AI-powered smart fill for missing fields
- **Purpose**: Dramatically reduce manual data entry by automatically extracting relevant information from project context (title, location, stakeholders, phases, description) and using AI to intelligently suggest professional values for fields that cannot be auto-filled
- **Trigger**: User selects document template from within a project context
- **Progression**: Open template library from project → Select template → System automatically extracts and fills fields from project data (promotor name/NIF from stakeholder registry, arquitecto details with collegiate number, project title, location, surface area from description) → Toast notification shows count of auto-filled fields → Review auto-filled fields (marked with lightning icon and accent border) → Click "Completar con IA" button for remaining empty fields → AI analyzes project context and generates professional suggestions for missing fields (zona climática based on location, constructor placeholder text, escala defaults) → Review and adjust AI-suggested values → Complete template with mix of auto-filled, AI-suggested, and manually-entered data
- **Success criteria**: Automatically fills 40-70% of template fields from structured project data without user intervention; correctly maps stakeholder types (promotor, arquitecto) to appropriate template fields; extracts numeric values (surface area) from unstructured description text using regex; AI smart fill generates contextually appropriate, professionally-formatted Spanish text for technical fields; AI respects architectural conventions (e.g., "[Por determinar]" placeholders for future decisions); visual indicators clearly distinguish auto-filled vs. AI-suggested vs. manually-entered fields; works gracefully when project has incomplete data (no errors, just fewer auto-fills); informative toast notifications explain what was auto-filled and what remains; empty fields can still be completed manually if AI suggestions not desired; feature only available when templates opened from project context (helpful notice shown otherwise)

### Automated Compliance Checklist Generator with Municipal Requirements
- **Functionality**: Generate comprehensive compliance checklists for residential building projects with 40+ regulatory requirements from CTE, RITE, REBT, urbanismo, and municipality-specific requirements customized by building type, use, location, and characteristics
- **Purpose**: Systematically verify regulatory compliance throughout the project lifecycle, including local municipal ordinances and regional regulations, reducing risk of code violations and ensuring all critical requirements are documented and met
- **Trigger**: User navigates to "Cumplimiento Normativo" tab in project detail → clicks "Generar Checklist Automático"
- **Progression**: Open compliance tab → Click generate button → Configure building parameters (type, use, surface, height, climate zone, municipality) → Select municipality for local requirements (optional) → System generates customized checklist with applicable national and municipal requirements → View requirements organized by category (Seguridad Estructural, Incendio, Accesibilidad, Salubridad, Ahorro Energía, Urbanismo Local, etc.) → Review each requirement with regulatory reference → Mark status (Cumple, No Cumple, Pendiente, N/A) → Add notes and evidence for each check → Filter by category, priority, or status → Search requirements → Track overall completion percentage → Export checklist to CSV for documentation
- **Success criteria**: Checklist includes 40+ specific national requirements plus municipal requirements when selected; requirements filtered intelligently based on building parameters and location; all 12 regulatory categories represented plus municipal categories; visual progress tracking with percentage completion; status changes update immediately; notes persist with each requirement; export generates complete CSV with all data; search and filters work across all requirements; priority badges distinguish high/medium/low requirements; regulatory references follow exact CTE/RITE/REBT article notation and municipal ordinance citations

### Municipal Compliance Requirements Manager
- **Functionality**: Create, manage, and apply municipality-specific compliance requirements for projects located in different Spanish municipalities and regions, with pre-loaded examples for major cities (Madrid, Barcelona, Cartagena). Municipal requirements can be applied during initial checklist generation or added to existing checklists at any time.
- **Purpose**: Extend the compliance system to include local ordinances, PGOU requirements, heritage protection rules, and municipal-specific building codes that vary by location, ensuring complete regulatory coverage beyond national codes. Allow architects to add municipal requirements to projects even after initial checklist creation.
- **Trigger**: User clicks "Normativa Municipal" button from dashboard or compliance checklist view
- **Progression**: Open municipal manager → Browse existing municipalities (search by name/province, filter by province) → Select municipality to view its requirements → View requirements organized by local categories (Urbanismo Local, Protección Patrimonio, Ordenanzas Municipales, Estética y Composición, Aparcamiento, etc.) → Create new municipality (enter name, province, autonomous community) → Add custom requirements to municipality (category, requirement text, regulatory reference, priority, notes) → Edit or delete existing requirements → **Apply municipality during initial checklist generation OR add to existing checklist** → Municipal requirements automatically merged into compliance checklist with proper categorization and references → Visual indicator shows applied municipality with count of municipal requirements → Municipal requirements display with distinctive "Municipal" badge for easy identification
- **Success criteria**: 3+ example municipalities pre-loaded (Madrid, Barcelona, Cartagena) with realistic requirements; create new municipalities for any Spanish province/autonomous community; add unlimited custom requirements per municipality; requirements include proper PGOU/ordinance citations; municipality selection integrated into checklist generator; **municipal requirements can be added to existing checklists without duplication**; **system detects and prevents duplicate requirements when applying to existing checklist**; **detailed toast notification shows breakdown of added requirements by category**; municipal requirements merge seamlessly with national requirements in generated checklists; search municipalities by name or province; requirements organized by 10+ municipal categories; **visual badge identifies municipal requirements in checklist view**; **progress card displays applied municipality name and count of municipal requirements**; support for effective/expiry dates on requirements; notes field for implementation guidance; requirements filterable by building type and use; persistent storage of all municipalities and requirements; **municipality information stored in checklist metadata**

### Budget Management with BC3 Integration
- **Functionality**: Create construction budgets (PEM) with integrated price database, BC3 import/export, and hierarchical budget structure with chapters, units, and resources
- **Purpose**: Enable accurate cost estimation and budget tracking using standardized construction databases, facilitating integration with cost estimation software
- **Trigger**: User clicks "Gestión de Presupuestos" from project detail view
- **Progression**: Create budget → Define chapters and units → Add resources (materials, labor, machinery) from price database → Import prices from external BC3 files or online databases → Calculate totals with GG, BI, IVA → Export to BC3 format
- **Success criteria**: Budget calculations are accurate, BC3 files import/export successfully, price database is searchable, hierarchical structure is maintained, percentage calculations (GG, BI, IVA) are correct

### COAM/COACM Visa Processing Workflow with Document Validation
- **Functionality**: Comprehensive workflow for submitting project documentation for professional college visa (visado colegial) with automated validation, requirement tracking, and status management
- **Purpose**: Streamline the complex administrative process of obtaining mandatory professional college approval for architectural projects in Spain, reducing submission errors and expediting approval
- **Trigger**: User clicks "Gestión de Visados" from dashboard or "Gestión de Visados" button in project detail view
- **Progression**: Create visa application → Select professional college (COAM/COACM/COAG/Other) → Choose project phases to visa (Estudio Previo, Anteproyecto, Básico, Ejecución, Dirección de Obra) → System generates required documents list based on phases → Upload documents with automatic type detection → System validates each document (file size max 80MB, format PDF/DWG/DXF, naming conventions) → Assign document types (Memoria Descriptiva, Planos Arquitectónicos, Presupuesto, etc.) → Complete requirements checklist (architect credentials, promoter data, location, signatures) → Review completeness percentage and missing items → View estimated visa fee based on college and phases → Save as draft or submit application → System assigns application number → Track status through workflow (Draft → Submitted → Under Review → Required → Pending Payment → Pending Pickup → Approved/Rejected) → View rejection reasons if required → Edit and resubmit as needed
- **Success criteria**: Application enforces phase-specific document requirements (Básico requires 8 documents, Ejecución requires 11 documents); validates file size limit (80MB per file); detects document type from filename intelligently; prevents submission with missing required documents or unmet requirements; calculates realistic visa fees (COAM base 150€ + 0.3% PEM, COACM base 120€ + 0.25% PEM); generates unique application numbers per college (COAM/2025/12345 format); tracks complete status lifecycle with visual indicators; displays validation errors inline per document; shows completion progress with percentage; requirements checklist covers all mandatory items (collegiate status, promoter data, location, digital signatures); supports draft saving for incomplete applications; provides detailed rejection reasons for required applications; allows document replacement and resubmission

### Approval Flows and Digital Signature
- **Functionality**: Complete workflow system for document approvals with digital signatures, supporting sequential, parallel, and unanimous approval processes with reusable templates and audit trails
- **Purpose**: Streamline document review and approval processes with legally valid digital signatures, ensuring proper authorization before document finalization while maintaining complete traceability
- **Trigger**: User clicks "Aprobaciones y Firmas" from Tools menu
- **Progression**: Create approval flow → Select project and document → Choose flow type (Sequential/Parallel/Unanimous) → Define approval steps with required approvers from stakeholder registry → Set required approvals per step → Add optional deadline and notes → Save or use template → Approvers receive flow → Review document details → Approve with digital signature (draw or type signature) → Accept legal terms → Sign with timestamp and hash → Or reject with detailed reason → Track progress in real-time with visual indicators → View signatures and audit trail → Complete flow when all steps approved → Export signed document certificate
- **Success criteria**: Flow types behave correctly (sequential requires order, parallel allows simultaneous, unanimous requires all); signature pad captures drawn signatures as PNG with anti-aliasing; typed signatures render in 5 professional fonts; all signatures include timestamp, IP, user agent, and document hash; legal terms acceptance required before signing; rejection requires mandatory reason; approval progress shows percentage and step completion; active approvers can see pending actions; completed flows show duration and all signatures; audit log captures every action with full metadata; templates can be created, edited, duplicated, and applied to new flows; templates support role-based approvers; overdue flows show visual warning; cancelled flows preserve history; signature images stored securely; flows integrate with document manager; dashboard shows active/completed/rejected flow counts; flows support unlimited steps and approvers; email notifications sent on key events (future); flows persist across sessions

## Edge Case Handling

- **Empty States**: Dashboard shows helpful onboarding message with "Create First Project" CTA when no projects exist; document manager guides user through folder structure setup before first upload
- **Validation Errors**: Form fields highlight specific issues with inline error messages (e.g., invalid NIF format, phase percentages don't total correctly)
- **Duplicate Prevention**: Warn user when creating stakeholder with existing NIF/CIF, offer to use existing record; **municipal requirements check for duplicates by regulatory reference before adding to existing checklist**
- **Data Loss Prevention**: Auto-save draft project data, warn before navigating away from unsaved forms
- **Long Content**: Project names and descriptions gracefully truncate with tooltips, tables paginate or scroll
- **Search with No Results**: Clear empty state message explaining no documents match current filters, with option to clear filters
- **Filter Combinations**: All filters work together (AND logic), real-time count shows how many documents match current criteria
- **Bulk Upload Errors**: Individual files that fail validation show error messages inline; valid files can proceed while invalid files are highlighted; users can remove invalid files before uploading
- **Large File Handling**: Visual progress indicators for each file during bulk upload; system gracefully handles mixed success/failure states in batch uploads
- **Drag-and-Drop States**: Clear visual feedback when dragging files over drop zone (highlighted border, background color change); supports both drag-and-drop and traditional file picker
- **Municipal Requirements Without Checklist**: Attempting to apply municipal requirements before generating base checklist shows clear error message guiding user to generate checklist first
- **Already Applied Municipal Requirements**: If municipality requirements are already applied to checklist, system shows informative message with count of existing requirements instead of duplicating
- **No Applicable Municipal Requirements**: When municipality has no requirements matching project building type/use, system shows informative message explaining why no requirements were added
- **Template Selection**: Template library organized by category with visual cards showing section count and discipline; AI badge indicates AI-generation capability; search functionality filters templates in real-time; selected template shows expandable section preview with placeholder fields highlighted
- **Template Form**: Required fields clearly marked with asterisks; form validates all required fields before allowing document generation; field labels use clear Spanish architectural terminology (Promotor, Arquitecto, Zona Climática)
- **Generated Documents**: Plain text format with clear section headers; all placeholder fields [CAMPO] replaced with user input; AI-generated sections seamlessly integrated; automatic download initiates immediately; document added to project with complete metadata noting AI-generated sections
- **AI Generation States**: Loading state with animated sparkle icon during content generation; error handling with retry option if generation fails; empty state prompting user to describe content needs; regeneration preserves current settings but creates new content; copy-to-clipboard for generated content
- **AI Content Management**: Visual badges indicate which sections have AI-generated content; ability to restore default template content for any section; expanded sections show editable textarea with generated content; collapsible sections to manage complex documents; section count badges show number of AI-customized sections
- **AI Context Integration**: Project context (title, location, description, phase) automatically provided to AI; context displayed clearly in generator dialog; AI uses context to personalize generated content; missing context handled gracefully with generic but professional content
- **Compliance Checklist Generation**: Building parameter form validates required fields (type and use) before generation; optional parameters enhance requirement specificity; generated checklist displays total requirement count in toast notification; empty state with clear call-to-action when no checklist exists
- **Compliance Check Status**: Four distinct status buttons with visual states (Cumple/green, No Cumple/red, Pendiente/orange, N/A/gray); status changes reflected immediately in category progress and overall completion; expanded check view with textarea for notes; smooth expand/collapse animation
- **Compliance Filtering**: Real-time search across requirement text, category, and regulatory reference; category tabs show completion ratio (completed/total); priority filter (all/high/medium/low) and status filter (all/pending/compliant/non-compliant) work independently; filter combinations update result count instantly; empty state when no matches with clear reset option
- **Compliance Progress**: Overall completion percentage calculated from compliant + not-applicable checks; visual progress bar at top of checklist; per-category completion shown in tab labels; completion updates in real-time as status changes
- **Compliance Export**: CSV export includes all fields (category, requirement, reference, status, priority, notes); filename based on project title; success toast confirms export; handles special characters in notes field properly
- **Visa Document Validation**: Files exceeding 80MB show clear error with split suggestion; invalid formats (non-PDF/DWG/DXF) rejected with format guidance; duplicate document types warn user; missing required documents prevent submission with clear list of missing items
- **Visa Status Transitions**: Only valid status transitions allowed (can't skip from Draft to Approved); status change confirmations prevent accidental updates; rejection requires entering at least one reason
- **Visa Fee Calculation**: Missing PEM shows estimated fee with "pending budget" note; fee updates automatically when budget is added; college-specific formulas applied correctly
- **Incomplete Visa Submission**: Submit button disabled when validation fails; tooltip explains specific blocking issues (missing documents, unmet requirements, validation errors); clear visual indicators (red badges, warning icons) highlight incomplete sections
- **Visa Without Project**: Global visa manager accessible from dashboard works without project context; project dropdown allows association after creation; warning shown if creating visa without project link

## Design Direction

The design should evoke **authority, precision, and technical sophistication** - reflecting the architectural profession itself with a modern dark theme that feels **contemporary, vibrant, and professional**. The interface combines deep, rich backgrounds with vivid accent colors creating a dynamic, energetic experience while maintaining excellent readability. Think premium technical tools with personality - clean lines, structured layouts, and a sophisticated dark color palette enhanced by brighter, more saturated accent colors that pop against the dark canvas and reduce eye strain during long work sessions. The interface should feel like a next-generation tool built by architects, for architects.

## Color Selection

A professional dark theme with enhanced technical blue accents and vibrant architectural highlights, designed for extended use, visual impact, and modern aesthetics.

- **Primary Color**: Enhanced Technical Blue `oklch(0.52 0.18 250)` - A more vibrant, saturated blue that maintains technical expertise while adding visual energy against dark backgrounds
- **Secondary Colors**: 
  - Rich Slate Background `oklch(0.13 0.015 250)` - Deeper main background for maximum contrast and modern feel
  - Elevated Card Surface `oklch(0.17 0.018 250)` - Distinct card elevation with better separation
  - Refined Muted Surface `oklch(0.21 0.018 250)` - For secondary backgrounds with clearer hierarchy
- **Accent Color**: Vibrant Terracotta `oklch(0.68 0.19 40)` - Brighter, more saturated warm accent for CTAs and important actions, creating striking contrast against the cool technical palette
- **Foreground/Background Pairings**:
  - Background (Rich Slate `oklch(0.13 0.015 250)`): Bright text `oklch(0.96 0.008 70)` - Ratio 15.8:1 ✓
  - Primary (Enhanced Blue `oklch(0.52 0.18 250)`): Light text `oklch(0.99 0.003 70)` - Ratio 8.2:1 ✓
  - Accent (Vibrant Terracotta `oklch(0.68 0.19 40)`): Dark Slate text `oklch(0.13 0.015 250)` - Ratio 13.1:1 ✓
  - Card (Elevated Surface `oklch(0.17 0.018 250)`): Bright text `oklch(0.96 0.008 70)` - Ratio 14.3:1 ✓
  - Muted text `oklch(0.58 0.012 250)` on Background: Ratio 5.8:1 ✓

## Font Selection

Typography should balance technical precision with contemporary professionalism - clean, highly legible, with distinct geometric character.

- **Primary Font**: **Space Grotesk** - A geometric sans-serif with technical precision and modern personality, perfect for headings and UI elements
- **Secondary Font**: **IBM Plex Sans** - Engineered for clarity and extended reading, ideal for data tables and body content

**Typographic Hierarchy**:
- H1 (Page Titles): Space Grotesk Bold / 32px / tight tracking (-0.02em)
- H2 (Section Headers): Space Grotesk SemiBold / 24px / normal tracking
- H3 (Card Titles): Space Grotesk Medium / 18px / normal tracking
- Body (General Text): IBM Plex Sans Regular / 15px / relaxed leading (1.6)
- Small (Metadata/Labels): IBM Plex Sans Regular / 13px / uppercase / letter-spacing 0.05em
- Data (Tables/Numbers): IBM Plex Mono Regular / 14px / tabular figures

## Animations

Animations should feel **precise, purposeful, and technically refined** - like the satisfying movement of precision drafting tools or the smooth operation of mechanical instruments. Use subtle, confident transitions that reinforce actions and hierarchy without distracting from content. The dark theme enhances the perception of depth and layering through strategic use of shadows and elevation changes. Key moments:

- **Project Creation**: Smooth slide-in of form modal with subtle backdrop blur and elevation shadow (300ms ease-out)
- **Phase Completion**: Satisfying check animation with subtle glow effect and spring physics when marking phases complete
- **Dashboard Loading**: Skeleton screens with shimmer effect that transform into content, cards fade-up sequentially with 50ms stagger
- **Hover States**: Elevation change on cards with enhanced shadow depth and subtle border glow (200ms transition)
- **Status Changes**: Smooth color transition with gentle pulse and subtle glow to draw attention to state changes
- **Element Focus**: Subtle ring glow effect in primary color for focused interactive elements
- **Card Interactions**: Micro-lift effect (translateY) combined with shadow depth increase on hover

## Component Selection

**Components**:
- **Dialog**: Project creation and editing forms in centered modal dialogs with backdrop
- **Card**: Primary container for project display on dashboard - elevated surface with hover states
- **Form**: Structured form components with labels, validation, and clear field groupings
- **Tabs**: Switch between different views (All Projects / Active / Archived)
- **Table**: Stakeholder lists and phase management with sortable columns
- **Badge**: Visual status indicators for project phases and overall project status
- **Button**: Primary (solid terracotta) for main actions, Secondary (outline) for supporting actions, Ghost for tertiary
- **Input / Textarea**: Clean fields with floating labels, validation states
- **Select / Combobox**: Dropdowns for predefined options (project types, phases, stakeholder types)
- **Separator**: Subtle dividers to create visual sections without heavy borders
- **Scroll Area**: Graceful scrolling in contained areas like stakeholder lists

**Customizations**:
- Custom Project Card component with integrated progress bar and phase indicators
- Stakeholder Registry card with role-specific color coding
- Phase Timeline visualization (custom component) showing contracted phases and completion status
- Quick Action toolbar with frequently-used operations

**States**:
- Buttons: Rest with subtle shadow → Hover with elevation increase and glow → Active with pressed effect and reduced shadow → Disabled with 40% opacity
- Cards: Rest with medium shadow → Hover elevated with enhanced shadow and primary border glow → Selected with persistent primary border and glow
- Inputs: Default with subtle border → Focus with primary color ring glow → Error with destructive accent and message → Success with green check and subtle glow
- Badges: Color-coded by status with appropriate contrast (Pending: muted, In Progress: primary, Completed: success green, Archived: muted gray)

**Icon Selection**:
- Projects: Folder, Buildings
- Add/Create: Plus, PlusCircle
- Stakeholders: Users, UserCircle, Briefcase
- Phases: CheckCircle, Circle, Clock
- Documents: File, FileText, FolderOpen, Upload
- Search: MagnifyingGlass
- Settings: Gear
- Regulations: BookOpen, Scales
- Visa/Administrative: Stamp, PaperPlaneTilt (submit), Certificate
- Status: CheckCircle (approved), WarningCircle (required/error), Clock (pending)

**Spacing**:
- Card padding: p-6 (24px)
- Form field gaps: gap-4 (16px)
- Section spacing: space-y-8 (32px)
- Dashboard grid: gap-6 (24px)
- Inline elements: gap-2 (8px)
- Page margins: px-8 py-6

**Mobile**:
- Dashboard grid: 3 columns desktop → 2 columns tablet → 1 column mobile
- Dialogs: Full-screen on mobile using Drawer component instead of Dialog
- Tables: Horizontal scroll with sticky first column on mobile
- Navigation: Collapsible sidebar on mobile with hamburger menu
- Form fields: Full width on mobile, optimized touch targets (min 44px)
- Typography: Reduce heading sizes by 20% on mobile while maintaining hierarchy
