# 🏗️ AFO CORE MANAGER - Executive Summary

**AFO CORE MAN

## 🎯 Vision & Value Proposition

- M

## 🎯 Vision & Value Proposition

### Target User
**Independent architects and small architectural studios in Spain** struggling with:
- Managing multiple concurrent projects
- Complex regulatory compliance (CTE, RITE, REBT, urban planning)
- Document management and professional board processes (COAM, COACM)
- Financial control (budgets, invoicing, payment tracking)

## ✅ What's Been Built (1
### 🏢 Module 1: Project & Client Management (85% Complete)

- **Dashboard**
  - Filtering by status (All/Acti
  - Smooth animations with Framer Motion

  -

  - Full project editing capabilities

  - Centralized database of clients, architects, technician
  - Professional data: license num

  - Tab navigation: Overvi
  - Phase statu
  - Quick edit functionality
#### Pending (15%):
- Kanban task view
- Task checklists with assignments


**Status:** ✅ **Fully Functional**
#### Implemented Features:
**Automated Folder Structure**
- **Model 1: By File Type** - Folde
- Selection dialog with preview

- Auto-format: `Project-Discipline-Descr


- Professional versioning system:
  - `C01`, `C02`, `C03`... → Shared/Approved versio
- Complete revision history per document


  - Dates (creation, last
- Sector-specific metadata:
  - Document type (Drawing, Report, Calculation, e
  - Folder location
- Metadata editing with validati
**Advanced Search & Filterin

  - Discipline
- Multiple simultaneo
  - By status (Dra
  - By folder (per chosen 
- Real-time result counter


- P

- Document download


  - Construction Report

  - Energy Efficiency Certific
  - Final Work Certificate
- Pre-filled with project data (location, client, architect)
- Generated in seconds
**AI Content Generation**
- Intelligent prompts with p

- Direct insertion into docu
#### Pending (15%):
- Digital signature invalidation warnings
- Advanced drawing preview
- Integrated digital signa

### 📚 Module 3: Regulatory 


- Chat interface for natural language queries
- Automatic current project context
- Example frequent queries:
  - "Stair dimensioning per CTE"

- JSON mode for structu

- Automatic regulatory check
  - **CTE (Technical Building Code)
    - DB-SI: Fire safety
    - DB-HS: Health (humidi
    - DB-HE: Energy saving
    - IT 1.1.4.1.2: Operating temperatures
    - IT 1.2.4.1: Generator efficiency
  - **REBT (Electri
    - ITC-BT-23: Overvolt
    - RD 105/2008: Waste managemen

  - 5 building types (single-fa
  - Optional surface a
- Intelligen

- Checklist vi
  - By priority (
- Expandable cards per requireme
  - Color-coded priority badge
  - Notes field for evidence
- Overall and per-category progres
  - Completion percentage
- Automatic calculatio
- CSV export for audits
**Customizable Municipa

  - Aesthetic conditions
  - Open spaces and green areas
  - Municipal accessibility
  - Waste management
  - Noise and pollution
  - Municipal certifications
- PDF PGOU import with AI:
  - Automatic requi
  - Municipal checklist gene

  - Cartagena: 6 specific requirements
- Combination of national + municipal re
**Parametric Queries**
- Results with exact re
- Recent query history
#### Pending (30%):
- Structured navigation by docu
- Semantic full-text search
  - Ca coefficients per pro
  - Automatic urban planni
- Regulation version comp
---
### 💰 Module 4: Budgets & Invoicing (50% Comple


- Hierarchical structure 
  - Main chapters: Earthworks, Fou
  - Updated reference prices
  - By item code
  - By chapter
- Add items to budget with:
  - Editable unit price

  - Organize items 
  - Overall budget total calculation
  - Chapter breakdown
  - Inline editing of quantities and p

- **Import from BC3/FIEBDC 
  - Complete hierarchical stru

  -

  - Results view with code and price
  - Automatic budget integration

- Compatible format with P

**Management Interface**
- Visual grouping by chapters
- Quick actions per item (edit, delete)
- Empty states with call-to-action
**Invoicing Module (Started in Iteration 17)**
- Basic interface structure

- "Permits" tab in project view
- ⚠️ Functionality in developm
#### Critical Pending (50%):
**Budgets - Advanced F
- Indirect and auxiliary costs
- Analysis of budgeted vs executed dev

- Detailed measurements linked to 

- Fee calculation per professional board
- Professional invoice generator:
  - Consecutive numbering per 
  - Studio logo and data
- Payment management:
  - Invoice tracking (issued/collected/pending)
  - Early payment incentives
- Corrective invoices and 

- Time tracking (timer per project/task)
- Per diem and mileage

- Financial dashboard per project
- Key KPIs (billing, profitability, col


**Status:** 🔴 **Initiated**
#### Implemented Features:
- Basic UI structure prepared
#### Critical Pending (95%):
- COAM/COACM commission communicati
- Automatic document validation
- Professional board fee calculation
- Requirement reasons panel
- ICIO and fee calculation
- Legal archiving and project preservation
---

### Core Technologies
- **Build Tool:** Vite 7.2.6
- **UI Components:** shadcn/ui v4 
- **Icons:** Phosphor Icons 2.1.1
- **Forms:** React Hook Form 7.67.0 + Zod validation


- Headings: Space Grotesk (600
- Code: IBM Plex Mono (400-500)
**Color Palette (OKLCH Dark 
--background: oklch(0.1
--primary: oklch(0.45 0.12 250)     
--accent: oklch(0.65 0.
--border: oklch(0.28 0.02

- Border radius: `0.5rem`
- Smooth animations with Framer Motion
- Mobile-first responsi



- ✅ Project Management: **
- ✅ Regulatory Com
- 🔴 Invoicing: **10%**


- ✅ TypeScr
- ✅ Custom hooks: **2** (us
- ✅ ESLint warnings: **0**

- ✅ Initial load time: 
- ✅ Responsive design: 
- ✅ Toast notif



- Robust version control compa
- Multi-criteria search and filtering
- 8+ professional templates with
### 2. Unique Regulatory Knowledge
- Complete coverage of
- AI assistant for natural language

- 3,000+ construction items
- Integration with online database


- Professional OKLCH d
- Immediate visual feedback on all action
### 5. Robust Data Persistence
- Functional updates to
- State synchronized b

## ⚠️ Known Limitat
### Current Challenges
   - Professional invoicing (only 10% implemented)
   - These are key competitive di
2. **Lack of External Integ
   - No accounting integration (Sa

   - No workflow automation engine
   - No deadline reminders
### Identified Technical Debt
- ⚠️ No internal API documentation






   - Invoice generator wit

2. **Financial Control:**
   - Reimbursable expense registry
   - Consolidated financial reports
**Phase 2: Competitive Differentiation**
   - COAM/COACM commission communication
   - File status tracking

   - License fil
   - Deadline and 
---
## 💡 Value Delive
### For the Independent Arc
1. ✅ **Time savings in d
   - Professional ISO n
   - **Estimate: 2-3 hours/proj
2. ✅ **Regulatory ris
   - Exact references to C
   - **Estimate: 50% reductio
3. ✅ **Budget acceleration:**
   - Standard BC3 import
   - **Estimate: 1-2 h
4. ✅ **Information ce
   - Reusable stakeholders
   - **Estimate: 30min/day saved in searche
### Estimated ROI

- **Client satisfaction:*
---
## 📁 Key File Structure
```
├── src/
│   ├── index.css    
│   │   ├── ProjectCard.tsx        
│   │   ├── ProjectDetail.tsx            # 
│   │   ├── ClientManager.tsx 
│   │   ├── BillingManager.tsx        
│   │   ├── Budget
│   │   ├── DocumentManager.tsx     
│   │   ├── BulkDocumentU
│   │   ├── DocumentSearch.tsx  

│   │   ├── Do
│   │   ├── AIRegulatoryAssistant.tsx   
│   │   ├── ComplianceChecklistView.tsx  # Compl
│   │   ├── ComplianceReportGenerator.tsx 
│   │   ├── MunicipalC

│   │   ├── OnlineDataba
│   │   ├── VisaManager.tsx    
│   │   ├── ProjectImportDial
│   │   ├── BulkProjectExportDialog.tsx  # Mu
│   │   ├── EmailLogsDialog.tsx        
│   │   ├── DocumentUtiliti
│   ├── lib/

│   │   ├── budget-prices.ts             # 3,0
│   │   ├── invoice-utils.ts    
│   │   ├── email-service.t
│   │   ├── ai-regulatory.ts     

│   │   ├── document-templates.ts        # Document templates
│   │   └── utils.ts           
│       └── use-mobile.ts  
├── RESUMEN_COMPLETO.md          

├── COMPLIANCE_CHECKLIST.md 

├── EMAIL_SERVICE_DOCUMENTATION
├── DOCUMENT_MANAGEMENT.md             
├── FACTURACION_AUTOMATICA.md 
└── package.json                         # npm dependencies




✅ **Document Management**: Professional-gr
⚠️ **Budgets**: Solid foundation, needs re

### Next Critical Phase
1. 💳 **Complete invoicing** (commercial viability)



**Project status:** 🟢 In active dev
**Final goal:** Become the de facto standa
---
*Document generated by AFO COR













































































































































































































































































































































































