# Quick Reference: Compliance Checklist Feature

## Access the Feature
1. Open any project in AFO CORE MANAGER
2. Navigate to the **"Cumplimiento Normativo"** tab
3. Click **"Generar Checklist Automático"**

## Required Information
- **Tipo de Edificación** (Building Type) - Choose one:
  - Vivienda Unifamiliar
  - Vivienda Colectiva
  - Edificio Plurifamiliar
  - Rehabilitación
  - Ampliación

- **Uso del Edificio** (Building Use) - Choose one:
  - Residencial Vivienda (most common)
  - Residencial Público
  - Administrativo
  - Sanitario
  - Docente
  - Comercial
  - Aparcamiento

## Optional Enhancements
- **Superficie Construida (m²)**: For parking and fire sector calculations
- **Altura de Edificación (m)**: For structural fire resistance requirements
- **Zona Climática**: For energy efficiency requirements (DB-HE)

## Using the Checklist

### Mark Compliance Status
Click on any requirement to expand it, then select:
- ✅ **Cumple** (green) = Compliant
- ❌ **No Cumple** (red) = Non-compliant  
- ⏱️ **Pendiente** (orange) = Pending verification
- ⊗ **N/A** (gray) = Not applicable to this project

### Add Documentation
Use the **"Notas y Observaciones"** field to:
- Document evidence location
- Note specific calculations or references
- Record verification dates
- Identify responsible parties

### Navigate Requirements
- **Search bar**: Find specific requirements quickly
- **Category tabs**: Filter by regulatory domain (12 categories)
- **Priority filter**: Focus on High/Medium/Low priority items
- **Status filter**: Review Pending/Compliant/Non-compliant items

### Track Progress
- **Overall percentage** shows total compliance
- **Progress bar** provides visual representation
- **Category tabs** show completion per domain (e.g., "8/12")

### Export Results
Click **"Exportar CSV"** to download complete checklist with:
- All requirements and categories
- Status of each check
- Priority levels
- Notes and observations
- Regulatory references

## Common Requirements by Category

### Seguridad Estructural (Structural)
- Verification of permanent and variable loads
- Application of safety coefficients
- Structural action calculations (2 kN/m² residential)

### Seguridad en caso de Incendio (Fire)
- Fire compartmentation (≤2,500 m² sectors)
- Structural fire resistance (R60 for buildings <15m)
- Material reaction to fire (floors C-s2,d0; walls/ceilings B-s1,d0)
- Evacuation routes (<25m distance)
- Smoke detectors in dwellings
- Fire extinguishers (1 every 15m)

### Accesibilidad (Accessibility - SUA)
- Maximum unprotected height differences (60cm)
- Stair dimensions (tread ≥22cm, riser ≤20cm, width ≥1m)
- Railing/parapet heights (≥90cm, ≥110cm if >6m drop)
- Anti-slip flooring
- Accessible itinerary from entrance
- Accessible parking (1 per 33 spaces)

### Salubridad (Health - HS)
- Ground humidity protection (type C2+)
- Ventilation in bedrooms (5 l/s·person)
- Bathroom ventilation (15 l/s extraction)
- Separate drainage systems (wastewater and rainwater)
- Hot water sizing (28 L/day·person)

### Ahorro de Energía (Energy - HE)
- Energy demand limitation by climate zone
- Maximum thermal transmittance by zone
- Solar contribution to hot water (30-70%)
- Energy certification (RD 390/2021)

### Instalaciones Térmicas (RITE)
- Operative temperature (21-23°C winter, 23-25°C summer)
- Indoor air quality (IDA 2 for residential)
- Generator efficiency minimums
- Heat recovery in ventilation (≥75%)

### Instalaciones Eléctricas (REBT)
- Minimum electrification (5,750 W @ 230V)
- Differential protection (≤30mA)
- Independent circuits (5+)
- Surge protection (Category II)

### Urbanismo (Urban Planning)
- Setback compliance per PGOU
- Maximum buildability
- Maximum height
- Maximum plot occupation
- Parking provision (1 space / 100m²)

## Tips for Efficient Use

1. **Start with High Priority**: Filter by "Alta" priority to address critical requirements first

2. **Work by Category**: Complete one regulatory domain at a time for focus

3. **Mark N/A Early**: Identify non-applicable requirements to accurately track completion

4. **Document as You Go**: Add notes during verification, not after

5. **Export Regularly**: Save CSV backups as you make progress

6. **Use Search**: Find specific requirements (e.g., "escaleras", "ventilación", "incendio")

7. **Review References**: Click requirement to see exact regulatory article

## Regulatory Reference Format

All requirements include precise citations:
- **CTE format**: "CTE DB-SI 1.2" = Código Técnico, Documento Básico Seguridad Incendio, Section 1.2
- **RITE format**: "RITE IT 1.1.4.2.2" = Instrucción Técnica, section hierarchy
- **REBT format**: "REBT ITC-BT-25" = Instrucción Técnica Complementaria de Baja Tensión #25
- **PGOU**: "PGOU Normas Urbanísticas" = Plan General de Ordenación Urbana

## Support

For detailed information about each requirement:
1. Expand the requirement card
2. Note the regulatory reference (e.g., "CTE DB-SUA 1.3.2")
3. Consult that specific section in the regulatory document
4. Use the AI Regulatory Assistant for code interpretation

## Data Persistence

Your checklist is automatically saved as you work:
- Status changes save instantly
- Notes auto-save on blur
- Progress calculates in real-time
- Data persists between sessions
- Export creates permanent record
