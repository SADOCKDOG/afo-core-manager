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

## Edge Case Handling

- **Empty States**: Dashboard shows helpful onboarding message with "Create First Project" CTA when no projects exist
- **Validation Errors**: Form fields highlight specific issues with inline error messages (e.g., invalid NIF format, phase percentages don't total correctly)
- **Duplicate Prevention**: Warn user when creating stakeholder with existing NIF/CIF, offer to use existing record
- **Data Loss Prevention**: Auto-save draft project data, warn before navigating away from unsaved forms
- **Long Content**: Project names and descriptions gracefully truncate with tooltips, tables paginate or scroll

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
