# Building Type Templates Feature

## Overview

The Building Type Templates feature provides comprehensive templates and guidance for different building typologies, covering residential, commercial, industrial, and educational buildings. Each template includes specific requirements, regulatory focus, typical spaces, technical considerations, and documentation needs.

## Building Categories

### 1. Residential (Residencial)
- **Vivienda Unifamiliar** (Single-family housing)
- **Vivienda Colectiva** (Collective housing)
- **Vivienda Plurifamiliar** (Multi-family housing)
- **Rehabilitación** (Renovation)
- **Ampliación** (Extension)

### 2. Commercial (Comercial)
- **Edificio de Oficinas** (Office building)
- **Centro Comercial** (Shopping mall)
- **Local Comercial** (Commercial premises)
- **Hotel** (Hotel)
- **Restaurante/Cafetería** (Restaurant/Café)

### 3. Industrial (Industrial)
- **Nave Industrial** (Industrial warehouse)
- **Almacén Logístico** (Logistics warehouse)
- **Taller Industrial** (Industrial workshop)
- **Centro de Producción** (Production facility)
- **Parking Industrial** (Industrial parking)

### 4. Educational (Educativo)
- **Colegio** (Primary school)
- **Instituto** (Secondary school)
- **Universidad** (University)
- **Centro de Formación** (Training center)
- **Guardería** (Nursery/Kindergarten)

## Features

### Project Dialog Integration

When creating or editing a project, users can now:

1. **Select Building Type**: Choose from 20+ building typologies organized by category
2. **Automatic Use Assignment**: The system suggests the appropriate building use based on the selected type
3. **Surface Definition**: Specify the built surface area in square meters
4. **Template Information Display**: View relevant requirements and regulations directly in the dialog

The building type selector is organized into collapsible category groups for easy navigation:
- RESIDENCIAL
- COMERCIAL
- INDUSTRIAL
- EDUCATIVO

### Building Type Information Panel

Each building type includes a comprehensive information panel with:

1. **Description**: Clear explanation of the building typology
2. **Specific Requirements**: Mandatory requirements specific to this building type
3. **Regulatory Focus**: Key regulations and codes that apply (CTE, RIPCI, etc.)
4. **Typical Spaces**: Common spaces found in this building type
5. **Technical Considerations**: Important technical aspects to consider
6. **Documentation Needs**: Required documentation and reports

### Project Card Enhancement

Project cards now display:
- Building type badge with icon
- Built surface area (when specified)
- Color-coded visual indicators

### Project Detail Integration

The project detail view includes:
- **Building Type Info Card**: Comprehensive information panel on the overview tab
- **Category Badge**: Visual indicator with category-specific color coding
- **Surface Information**: Display of built surface area
- **Scrollable Details**: Organized sections for requirements, regulations, spaces, and technical considerations

### Building Type Library

A dedicated library browser accessible from the main header that allows users to:

1. **Browse All Templates**: View all 20+ building typologies
2. **Filter by Category**: Filter by residential, commercial, industrial, or educational
3. **Search**: Text search across template names and descriptions
4. **Detailed View**: Select a template to view complete information including:
   - All specific requirements
   - Regulatory references with badges
   - Typical spaces
   - Technical considerations
   - Documentation checklist

The library provides a side-by-side layout:
- Left panel: Template list with search and category filters
- Right panel: Detailed information for selected template

## Template Structure

Each building type template includes:

```typescript
{
  type: BuildingType
  name: string
  description: string
  category: 'residencial' | 'comercial' | 'industrial' | 'educativo' | 'otro'
  defaultUse: BuildingUse
  specificRequirements: string[]      // 4-8 specific requirements
  regulatoryFocus: string[]           // Key regulations
  typicalSpaces: string[]             // 6-15 typical spaces
  technicalConsiderations: string[]   // 6-15 technical aspects
  documentationNeeds: string[]        // 5-10 required documents
}
```

## Use Cases

### 1. New Project Creation
**Scenario**: Architect is starting a new hotel project

**Flow**:
1. Click "Nuevo Proyecto"
2. Fill in basic information (title, location, client)
3. Select building type: "Hotel"
4. System auto-selects use: "Hotelero"
5. Enter surface: 3500 m²
6. View template info showing:
   - Tourism license requirement
   - Star classification system
   - Fire protection requirements
   - Kitchen requirements (if restaurant included)
7. Create project with this information stored

**Benefit**: Architect immediately sees key requirements and regulations to consider

### 2. Project Documentation Planning
**Scenario**: Architect needs to understand documentation requirements for an industrial warehouse

**Flow**:
1. Open Building Type Library from header
2. Filter by "Industrial" category
3. Select "Almacén Logístico"
4. Review documentation section showing:
   - Activity license
   - Fire protection project (RIPCI)
   - Structural calculations
   - Industrial flooring study
   - Power electrical installations
   - Energy certification
   - Self-protection plan

**Benefit**: Complete checklist of required documentation upfront

### 3. Compliance Planning
**Scenario**: Architect starting an educational building needs to understand requirements

**Flow**:
1. Create project, select "Colegio"
2. View building type information showing:
   - Surface/student ratios
   - Universal accessibility requirements
   - Evacuation and self-protection plan
   - Dimensioned playground
   - Sports facilities
   - School cafeteria (if applicable)
3. See regulatory focus: CTE DB-SI, DB-SUA, Regional education regulations, DB-HR

**Benefit**: Clear understanding of specific educational building requirements

### 4. Technical Specification Review
**Scenario**: Team member needs to understand technical requirements for office building

**Flow**:
1. Open project detail
2. View Building Type Info card on overview tab
3. Review technical considerations:
   - HVAC system
   - Technical false ceilings
   - Technical floor in server rooms
   - LED lighting with presence control
   - Structured telecommunications network
   - Access control
   - Fire detection system
   - Interior distribution flexibility

**Benefit**: Quick reference for technical specifications without leaving project context

## Commercial Building Templates

### Office Building (Edificio de Oficinas)
**Key Features**:
- Administrative use with flexible open-plan spaces
- Centralized HVAC system
- Fire detection and suppression systems
- Universal accessibility mandatory
- Energy certification required
- Telecommunications infrastructure

**Typical Spaces**: Open space, individual offices, meeting rooms, reception, common areas, differentiated restrooms, archive, server room, parking

**Regulatory Focus**: CTE DB-SI, DB-SUA, DB-HE, RITE, REBT

### Shopping Center (Centro Comercial)
**Key Features**:
- Complex with multiple retail establishments
- Activity license and self-protection plan required
- Advanced fire suppression systems
- Complex evacuation and signaling
- Total accessibility
- Public address and alarm systems
- Capacity control

**Typical Spaces**: Retail units, food court, circulation corridors, central plazas, public restrooms, loading/unloading areas, technical rooms, parking, waste area

**Regulatory Focus**: CTE DB-SI, DB-SUA, Commercial sector regulations, Self-protection plan

### Hotel
**Key Features**:
- Tourist accommodation establishment
- Tourism license and star classification
- Industrial kitchen (if restaurant included)
- Self-protection plan
- PMR-accessible rooms
- Individual room climate control
- Fire detection and suppression

**Typical Spaces**: Rooms, reception/lobby, restaurant/dining room, industrial kitchen, bar/cafeteria, multipurpose rooms, spa/gym (optional), laundry, storage, service areas, parking

**Regulatory Focus**: CTE DB-SI, DB-HR, Regional tourism regulations, Hospitality regulations

### Restaurant/Café
**Key Features**:
- Dining establishment
- Opening license and activity project
- Kitchen with smoke extraction
- Cold room
- Ventilation system
- Compliance with health regulations
- Differentiated restrooms

**Typical Spaces**: Dining room, kitchen, preparation area, cold rooms, storage, public restrooms, staff restroom, bar area, terrace (if applicable)

**Regulatory Focus**: CTE DB-HS, Health regulations, Municipal ordinances, Hospitality regulations

## Industrial Building Templates

### Industrial Warehouse (Nave Industrial)
**Key Features**:
- Industrial activity, production or storage building
- Industrial activity license
- Environmental impact assessment (depending on activity)
- Fire protection by sectors
- Smoke evacuation and ventilation
- Structural resistance for specific loads
- Access for heavy vehicles
- RIPCI compliance

**Typical Spaces**: Production/workshop area, storage area, loading/unloading area, offices, changing rooms and restrooms, machine room, waste area, heavy vehicle parking

**Regulatory Focus**: CTE DB-SI, RIPCI, Environmental regulations, Industrial sector regulations

### Logistics Warehouse (Almacén Logístico)
**Key Features**:
- Goods storage and distribution building
- Fire resistance according to storage height
- Automatic suppression systems (sprinklers)
- Enhanced emergency lighting
- Evacuation route signaling
- Access control
- Warehouse management system (WMS)

**Typical Spaces**: High-bay storage, loading/unloading docks, picking area, order preparation area, administrative offices, changing rooms, battery charging area (forklifts), trailer parking, waste and returns area

**Regulatory Focus**: CTE DB-SI, RIPCI, Storage regulations, PRL

### Production Facility (Centro de Producción)
**Key Features**:
- Complex for industrial manufacturing and production
- Integrated environmental authorization (AAI)
- Activity license
- Environmental impact assessment
- Industrial emergency plan
- Special installations according to process
- Environmental protection (emissions, discharges)

**Typical Spaces**: Production lines, raw materials area, finished product area, control room, quality laboratory, maintenance, offices, changing rooms and services, WWTP (if applicable), electrical substation

**Regulatory Focus**: Environmental regulations, CTE DB-SI, Industrial sector regulations, PRL

## Educational Building Templates

### Primary School (Colegio)
**Key Features**:
- Early childhood and primary education center
- Compliance with regional education regulations
- Surface/student ratios
- Universal accessibility
- Evacuation and self-protection plan
- Dimensioned playground
- Sports facilities
- School cafeteria (if applicable)
- Energy certification

**Typical Spaces**: Early childhood classrooms, primary classrooms, library, computer room, gym/multipurpose room, cafeteria, kitchen, administration and management, staff room, age-appropriate restrooms, playground, sports court, concierge, infirmary

**Regulatory Focus**: CTE DB-SI, DB-SUA, Regional education regulations, DB-HR

### Secondary School (Instituto)
**Key Features**:
- Secondary education center
- Compliance with regional education regulations
- Specific laboratories (physics, chemistry, biology)
- Workshops (technology)
- Complete sports facilities
- Library/media center
- Universal accessibility
- Self-protection plan

**Typical Spaces**: Standard classrooms, computer rooms, scientific laboratories, technology workshops, music rooms, art/drawing rooms, library/media center, gymnasium, changing rooms, sports courts, auditorium, cafeteria, administration, staff room, departments, guidance office

**Regulatory Focus**: CTE DB-SI, DB-SUA, Education regulations, DB-HR

### University
**Key Features**:
- Higher education and research center
- University regulations
- Research facilities
- University library
- Lecture halls and seminar rooms
- Specialized laboratories
- Universal accessibility
- High energy efficiency
- Sustainability certification (LEED, BREEAM)

**Typical Spaces**: Lecture halls, seminar rooms, research laboratories, library/media center, study rooms, graduation hall, auditorium, faculty offices, departments, administration and services, cafeteria/restaurant, sports facilities, university residence (if applicable), data center/CPD, parking

**Regulatory Focus**: Complete CTE, University regulations, Sustainability, Accessibility

### Nursery/Kindergarten (Guardería)
**Key Features**:
- Early childhood education center (0-3 years)
- Specific 0-3 years regulations
- Very strict surface/child ratios
- Nursing area
- Diaper changing area
- Kitchen/pantry
- Outdoor playground
- Non-toxic materials
- Extreme safety

**Typical Spaces**: Age-based classrooms (0-1, 1-2, 2-3 years), nursing room, changing area, nap room, kitchen/pantry, dining room, playground, management, adapted restrooms, reception/entrance, infirmary

**Regulatory Focus**: Early childhood education regulations, CTE DB-SI, Health regulations, Child safety

## Data Model

### Project Type Extension

The `Project` interface has been extended with:

```typescript
interface Project {
  // ... existing fields
  buildingType?: BuildingType
  buildingUse?: BuildingUse
  buildingSurface?: number
}
```

### Building Type Enumeration

```typescript
type BuildingType = 
  | 'vivienda-unifamiliar'
  | 'vivienda-colectiva'
  | 'vivienda-plurifamiliar'
  | 'rehabilitacion'
  | 'ampliacion'
  | 'edificio-oficinas'
  | 'centro-comercial'
  | 'local-comercial'
  | 'hotel'
  | 'restaurante'
  | 'nave-industrial'
  | 'almacen-logistico'
  | 'taller-industrial'
  | 'centro-produccion'
  | 'parking-industrial'
  | 'colegio'
  | 'instituto'
  | 'universidad'
  | 'centro-formacion'
  | 'guarderia'
```

### Building Use Extension

```typescript
type BuildingUse = 
  | 'residencial-vivienda'
  | 'residencial-publico'
  | 'administrativo'
  | 'sanitario'
  | 'docente'
  | 'comercial'
  | 'aparcamiento'
  | 'hotelero'
  | 'restauracion'
  | 'industrial'
  | 'logistico'
  | 'deportivo'
  | 'cultural'
  | 'religioso'
```

## Components

### BuildingTypeInfo
Displays comprehensive building type information in project detail view.

**Props**:
- `buildingType: BuildingType`
- `buildingSurface?: number`

**Features**:
- Category badge with color coding
- Surface display
- Scrollable sections for requirements, regulations, technical considerations
- Spaces display with badges
- Documentation checklist

### BuildingTypeLibrary
Standalone library browser for exploring all building type templates.

**Features**:
- Search functionality
- Category filtering
- Side-by-side layout
- Detailed template view
- Responsive design

### ProjectDialog Enhancement
Extended with building type selection fields.

**New Fields**:
- Building type selector (organized by category)
- Building use selector
- Surface input (numeric, m²)
- Template info card (shown when type selected)

## UI/UX Considerations

### Color Coding
Each category has a distinct color scheme:
- **Residential**: Blue (#3b82f6)
- **Commercial**: Green (#22c55e)
- **Industrial**: Orange (#f97316)
- **Educational**: Purple (#a855f7)

### Progressive Disclosure
Building type selection is optional but recommended. Template information is shown contextually when a type is selected.

### Accessibility
- Clear labels and descriptions
- Keyboard navigation support
- Screen reader friendly structure
- High contrast badges

## Future Enhancements

### Potential Additions
1. **More Building Types**: 
   - Healthcare facilities (hospitals, clinics)
   - Religious buildings (churches, temples)
   - Sports facilities (gyms, stadiums)
   - Cultural buildings (museums, theaters)

2. **Template Customization**:
   - Allow users to create custom templates
   - Modify existing templates
   - Share templates between projects

3. **AI Integration**:
   - Suggest building type based on project description
   - Generate compliance checklists automatically
   - Recommend documentation based on project characteristics

4. **Regional Variations**:
   - Templates adapted by autonomous community
   - Municipal-specific requirements
   - Local code variations

5. **Integration with Other Modules**:
   - Auto-populate compliance checklists based on building type
   - Suggest budget items based on typical spaces
   - Generate document templates pre-filled with building-specific content

## Technical Implementation

### File Structure
```
src/
├── lib/
│   ├── types.ts                          # Extended with building types
│   └── building-type-templates.ts        # Template definitions
├── components/
│   ├── ProjectDialog.tsx                 # Enhanced with building type selection
│   ├── ProjectCard.tsx                   # Shows building type badge
│   ├── ProjectDetail.tsx                 # Integrates BuildingTypeInfo
│   ├── BuildingTypeInfo.tsx             # Information panel component
│   └── BuildingTypeLibrary.tsx          # Library browser
```

### Data Storage
Building type information is stored as part of the project object in the KV store:
- Key: `projects`
- Value: `Project[]` (including buildingType, buildingUse, buildingSurface)

## Conclusion

The Building Type Templates feature significantly enhances AFO CORE MANAGER by providing architects with comprehensive, typology-specific guidance directly within their workflow. This reduces the need for external references, improves project setup accuracy, and ensures that critical requirements and regulations are considered from the project's inception.

The feature is designed to be extensible, allowing for future additions of more building types, regional variations, and deeper integration with other application modules like compliance checking and document generation.
