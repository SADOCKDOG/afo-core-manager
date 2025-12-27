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
- **Functionality**: Visual overview of all active projects with status, progress, and key dates
- **Purpose**: Provide at-a-glance understanding of studio workload and priorities
- **Trigger**: Application launch or navigation to "Projects" section
- **Progression**: Open app → See dashboard with project cards → Filter by status/phase → Click project → View detailed project information
- **Success criteria**: Dashboard loads instantly, projects are clearly organized, status is immediately visible

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

### Automated Compliance Checklist Generator with Municipal Requirements
- **Functionality**: Generate comprehensive compliance checklists for residential building projects with 40+ regulatory requirements from CTE, RITE, REBT, urbanismo, and municipality-specific requirements customized by building type, use, location, and characteristics
- **Purpose**: Systematically verify regulatory compliance throughout the project lifecycle, including local municipal ordinances and regional regulations, reducing risk of code violations and ensuring all critical requirements are documented and met
- **Trigger**: User navigates to "Cumplimiento Normativo" tab in project detail → clicks "Generar Checklist Automático"
- **Progression**: Open compliance tab → Click generate button → Configure building parameters (type, use, surface, height, climate zone, municipality) → Select municipality for local requirements (optional) → System generates customized checklist with applicable national and municipal requirements → View requirements organized by category (Seguridad Estructural, Incendio, Accesibilidad, Salubridad, Ahorro Energía, Urbanismo Local, etc.) → Review each requirement with regulatory reference → Mark status (Cumple, No Cumple, Pendiente, N/A) → Add notes and evidence for each check → Filter by category, priority, or status → Search requirements → Track overall completion percentage → Export checklist to CSV for documentation
- **Success criteria**: Checklist includes 40+ specific national requirements plus municipal requirements when selected; requirements filtered intelligently based on building parameters and location; all 12 regulatory categories represented plus municipal categories; visual progress tracking with percentage completion; status changes update immediately; notes persist with each requirement; export generates complete CSV with all data; search and filters work across all requirements; priority badges distinguish high/medium/low requirements; regulatory references follow exact CTE/RITE/REBT article notation and municipal ordinance citations

### Municipal Compliance Requirements Manager
- **Functionality**: Create, manage, and apply municipality-specific compliance requirements for projects located in different Spanish municipalities and regions, with pre-loaded examples for major cities (Madrid, Barcelona, Cartagena)
- **Purpose**: Extend the compliance system to include local ordinances, PGOU requirements, heritage protection rules, and municipal-specific building codes that vary by location, ensuring complete regulatory coverage beyond national codes
- **Trigger**: User clicks "Normativa Municipal" button from dashboard or compliance checklist view
- **Progression**: Open municipal manager → Browse existing municipalities (search by name/province, filter by province) → Select municipality to view its requirements → View requirements organized by local categories (Urbanismo Local, Protección Patrimonio, Ordenanzas Municipales, Estética y Composición, Aparcamiento, etc.) → Create new municipality (enter name, province, autonomous community) → Add custom requirements to municipality (category, requirement text, regulatory reference, priority, notes) → Edit or delete existing requirements → Apply municipality to project during checklist generation → Municipal requirements automatically included in compliance checklist with proper categorization and references
- **Success criteria**: 3+ example municipalities pre-loaded (Madrid, Barcelona, Cartagena) with realistic requirements; create new municipalities for any Spanish province/autonomous community; add unlimited custom requirements per municipality; requirements include proper PGOU/ordinance citations; municipality selection integrated into checklist generator; municipal requirements merge seamlessly with national requirements in generated checklists; search municipalities by name or province; requirements organized by 10+ municipal categories; support for effective/expiry dates on requirements; notes field for implementation guidance; requirements filterable by building type and use; persistent storage of all municipalities and requirements

## Edge Case Handling

- **Empty States**: Dashboard shows helpful onboarding message with "Create First Project" CTA when no projects exist; document manager guides user through folder structure setup before first upload
- **Validation Errors**: Form fields highlight specific issues with inline error messages (e.g., invalid NIF format, phase percentages don't total correctly)
- **Duplicate Prevention**: Warn user when creating stakeholder with existing NIF/CIF, offer to use existing record
- **Data Loss Prevention**: Auto-save draft project data, warn before navigating away from unsaved forms
- **Long Content**: Project names and descriptions gracefully truncate with tooltips, tables paginate or scroll
- **Search with No Results**: Clear empty state message explaining no documents match current filters, with option to clear filters
- **Filter Combinations**: All filters work together (AND logic), real-time count shows how many documents match current criteria
- **Bulk Upload Errors**: Individual files that fail validation show error messages inline; valid files can proceed while invalid files are highlighted; users can remove invalid files before uploading
- **Large File Handling**: Visual progress indicators for each file during bulk upload; system gracefully handles mixed success/failure states in batch uploads
- **Drag-and-Drop States**: Clear visual feedback when dragging files over drop zone (highlighted border, background color change); supports both drag-and-drop and traditional file picker
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

## Design Direction

The design should evoke **authority, precision, and modernism** - reflecting the architectural profession itself. Think clean lines, structured layouts, and a sophisticated color palette that feels technical yet approachable. The interface should feel like a tool built by architects, for architects - respecting the craft while embracing contemporary digital design.

## Color Selection

A technical, professional palette with warm architectural accents inspired by materials and technical drawings.

- **Primary Color**: Deep Architectural Blue `oklch(0.35 0.08 250)` - Conveys trust, professionalism, and technical expertise, reminiscent of blueprint blue
- **Secondary Colors**: 
  - Warm Concrete Gray `oklch(0.65 0.01 70)` - Supporting backgrounds and dividers, evoking building materials
  - Slate Dark `oklch(0.25 0.02 250)` - Text and strong contrast elements
- **Accent Color**: Terracotta Accent `oklch(0.65 0.15 40)` - Attention for CTAs and important status indicators, warm material reference
- **Foreground/Background Pairings**:
  - Background (Soft White `oklch(0.98 0 0)`): Slate Dark text `oklch(0.25 0.02 250)` - Ratio 12.8:1 ✓
  - Primary (Architectural Blue `oklch(0.35 0.08 250)`): White text `oklch(1 0 0)` - Ratio 8.2:1 ✓
  - Accent (Terracotta `oklch(0.65 0.15 40)`): Slate Dark text `oklch(0.25 0.02 250)` - Ratio 4.9:1 ✓
  - Muted (Light Gray `oklch(0.95 0.005 70)`): Medium Gray text `oklch(0.55 0.01 250)` - Ratio 5.1:1 ✓

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

Animations should feel **precise and purposeful** - like the movement of drafting tools or the satisfying click of a mechanical pencil. Use subtle, snappy transitions that reinforce actions without distracting. Key moments:

- **Project Creation**: Smooth slide-in of the form modal with backdrop blur (300ms ease-out)
- **Phase Completion**: Satisfying check animation with subtle spring physics when marking phases complete
- **Dashboard Loading**: Skeleton screens that transform into content, cards fade-up sequentially with 50ms stagger
- **Hover States**: Micro-elevation change on cards (subtle shadow transition 200ms)
- **Status Changes**: Color transition with gentle pulse to draw attention to state changes

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
- Buttons: Rest with subtle shadow → Hover with elevation increase → Active with pressed effect → Disabled with 50% opacity
- Cards: Rest flat → Hover elevated with border accent → Selected with persistent accent border
- Inputs: Default with light border → Focus with primary color ring → Error with red accent and message → Success with green check
- Badges: Color-coded by status (Pending: gray, In Progress: blue, Completed: green, Archived: muted)

**Icon Selection**:
- Projects: Folder, Buildings
- Add/Create: Plus, PlusCircle
- Stakeholders: Users, UserCircle, Briefcase
- Phases: CheckCircle, Circle, Clock
- Documents: File, FileText, FolderOpen
- Search: MagnifyingGlass
- Settings: Gear
- Regulations: BookOpen, Scales

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
