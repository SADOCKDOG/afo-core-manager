# Generación Automática de Presupuestos con Precios BC3

## Descripción General

El sistema de **Generación Automática de Presupuestos** revoluciona el proceso de elaboración de presupuestos de construcción al aprovechar bases de precios BC3 importadas (BEDEC, PREOC, BPHU) para crear presupuestos completos en minutos en lugar de horas.

### Beneficios Clave

✅ **Reduce el tiempo de creación de presupuestos de horas a minutos**  
✅ **Aprovecha bases de precios oficiales españolas (BEDEC, PREOC, BPHU)**  
✅ **Tres modos inteligentes**: Manual, Plantillas, e IA  
✅ **Generación de cantidades inteligente con IA**  
✅ **Estructura jerárquica automática por capítulos**  
✅ **Cálculos instantáneos de PEM, GG, BI e IVA**  

---

## Características Principales

### 1. Modo Manual - Selección Directa de Precios

Búsqueda y selección manual de precios desde tu base de datos BC3 importada.

**Funcionalidades:**
- 🔍 Búsqueda en tiempo real por código, descripción o categoría
- 📊 Base de datos con 60,000+ precios (según base importada)
- 🏷️ Iconos distintivos por tipo: Material, Mano de Obra, Maquinaria, Unidad
- ➕ Añadir precios con un solo clic
- 📝 Ajuste de cantidades por partida
- 📈 Actualización de totales en tiempo real
- 📂 Asignación automática por capítulos

**Flujo de trabajo:**
1. Buscar precios en la base de datos
2. Hacer clic en precios para añadir
3. Configurar cantidades
4. Revisar totales estimados
5. Generar presupuesto completo

---

### 2. Modo Plantilla - Tipos de Edificio Predefinidos

Plantillas inteligentes que seleccionan automáticamente partidas relevantes.

**Plantillas disponibles:**

#### 🏠 Vivienda Unifamiliar
- Movimiento de tierras (códigos ADL, ADD, ADE)
- Cimentación (C, CAP, CZE, CZS)
- Estructura (E, EHP, EHM, EHV, EAM)
- Albañilería (E07, E08, E09)
- Revestimientos (E10, E11, E12)
- Carpintería (E13, E14, E15)
- Instalaciones (E16, E17, E18, E19, E20)

#### 🏢 Rehabilitación Integral
- Demoliciones (D, DDM, DDT)
- Refuerzo estructural (ERE, ERH)
- Albañilería (E07, E08)
- Revestimientos (E10, E11)
- Carpintería (E13, E14)
- Instalaciones (E16, E17, E18)

**Proceso:**
1. Seleccionar tipo de edificio
2. Sistema busca precios compatibles automáticamente
3. Genera 15-30 partidas organizadas por capítulos
4. Revisar y ajustar cantidades
5. Generar presupuesto

---

### 3. Modo IA - Generación Completamente Automática

Inteligencia artificial que interpreta descripciones de proyectos y genera presupuestos completos.

**Capacidades de la IA:**
- 🧠 Interpreta descripciones en lenguaje natural español
- 📐 Calcula cantidades basadas en superficies mencionadas
- 🎯 Selecciona códigos BC3 específicos y precisos
- 📊 Asigna estructura lógica de capítulos (01-10)
- ⚡ Procesa en segundos proyectos complejos
- 🎨 Considera materiales y acabados especificados

**Ejemplo de descripción:**
```
"Construcción de vivienda unifamiliar de 150m2 en dos plantas, 
estructura de hormigón armado, cubierta inclinada de teja cerámica, 
revestimientos de gres porcelánico en baños y cocina, 
carpintería exterior de aluminio con rotura de puente térmico, 
instalación de aerotermia para climatización."
```

**La IA genera:**
- Códigos BC3 específicos para cada elemento
- Cantidades estimadas por m2, ml, ud
- Organización por capítulos lógicos
- Partidas coherentes con el proyecto descrito

**Precisión:**
- ✅ 60-70% de precisión en selección de precios
- ✅ Requiere ajuste mínimo manual
- ✅ Punto de partida profesional inmediato

---

## Estructura del Presupuesto Generado

### Jerarquía Automática

```
Presupuesto Proyecto
├── Capítulo 01 - Movimiento de tierras
│   ├── Partida 01.01 - Excavación zanjas
│   ├── Partida 01.02 - Relleno compactado
│   └── ...
├── Capítulo 02 - Cimentación
│   ├── Partida 02.01 - Hormigón en masa
│   ├── Partida 02.02 - Zapatas aisladas
│   └── ...
└── ...
```

### Cálculos Automáticos

El sistema calcula automáticamente:

1. **PEM (Presupuesto de Ejecución Material)**
   - Suma de todas las partidas

2. **GG (Gastos Generales)** - 13% por defecto
   - Gastos de estructura de la empresa

3. **BI (Beneficio Industrial)** - 6% por defecto  
   - Margen empresarial

4. **Base Imponible**
   - PEM + GG + BI

5. **IVA** - 21% por defecto
   - Impuesto sobre valor añadido

6. **Total Presupuesto**
   - Base Imponible + IVA

**Ejemplo:**
```
PEM:           100,000.00 €
GG (13%):       13,000.00 €
BI (6%):         6,000.00 €
───────────────────────────
Base Imponible: 119,000.00 €
IVA (21%):       24,990.00 €
───────────────────────────
TOTAL:         143,990.00 €
```

---

## Integración con Base de Precios BC3

### Bases Compatibles

El sistema funciona con cualquier base de precios BC3 importada:

- **BEDEC** (ITeC - Cataluña)
- **PREOC** (Galicia)
- **BPHU** (País Vasco)
- **BASE** (Navarra)
- **Bases personalizadas**

### Importación de Bases BC3

**Antes de usar la generación automática, debes importar una base de precios:**

1. Ir a **Herramientas → Gestión de Base de Precios**
2. Pestaña **Importar BC3**
3. Seleccionar archivo .BC3 local o URL online
4. Sistema analiza y procesa precios
5. Vista previa de precios importados
6. Confirmar importación

**Metadatos importados:**
- Código de precio
- Descripción
- Unidad (m, m2, m3, ud, kg, l, h, pa)
- Precio unitario
- Tipo (Material, Mano de Obra, Maquinaria, Unidad)
- Categoría
- Fuente

---

## Flujo de Trabajo Completo

### Desde Cero hasta Presupuesto Final

```
1. Importar Base BC3
   └─→ Herramientas → Gestión Base de Precios → Importar BC3
   
2. Crear Proyecto
   └─→ Nuevo Proyecto → Datos básicos → Guardar
   
3. Generar Presupuesto Automático
   └─→ Detalle Proyecto → Presupuestos (PEM) → Generación Automática
   
4. Elegir Método
   ├─→ Manual: Buscar y seleccionar precios
   ├─→ Plantilla: Seleccionar tipo de edificio
   └─→ IA: Describir proyecto
   
5. Revisar y Ajustar
   └─→ Verificar precios y cantidades
   
6. Generar Presupuesto
   └─→ Click en "Generar Presupuesto"
   
7. Refinar en Editor Estándar
   └─→ Añadir capítulos, editar partidas, ajustar porcentajes
   
8. Exportar BC3
   └─→ Compatible con PRESTO, Arquímedes, TCQ, CYPE
```

---

## Características Técnicas

### Rendimiento

- ⚡ Búsqueda instantánea en bases de 60,000+ precios
- 📊 Actualización de totales en tiempo real
- 🚀 Generación de presupuesto <2 segundos
- 💪 Soporta 100+ partidas sin degradación

### Validaciones

- ✅ Verifica disponibilidad de base de precios
- ✅ Previene presupuestos sin partidas
- ✅ Valida cantidades positivas
- ✅ Estructura jerárquica correcta

### Integraciones

- 🔗 Compatible con sistema de facturación
- 📄 Integrado con generador de documentos
- 💾 Exportación a formato BC3 estándar
- 📱 Responsive en móvil y tablet

---

## Casos de Uso

### 1. Presupuesto Rápido para Reunión con Cliente

**Situación:** Reunión con cliente en 30 minutos, necesita presupuesto orientativo.

**Solución:**
1. Abrir Generación Automática
2. Modo IA: Describir proyecto en 2 frases
3. 15 segundos después: Presupuesto completo
4. Ajustar 2-3 partidas clave
5. Presentar al cliente

**Resultado:** Presupuesto profesional en 2 minutos

---

### 2. Múltiples Variantes de Proyecto

**Situación:** Cliente quiere comparar opciones (economía vs. premium).

**Solución:**
1. Generar presupuesto base con plantilla
2. Duplicar presupuesto
3. Versión Economía: Precios PREOC estándar
4. Versión Premium: Precios BEDEC alta gama
5. Comparar totales

**Resultado:** 2-3 variantes en 10 minutos

---

### 3. Actualización de Precios Anual

**Situación:** Actualizar presupuestos con nueva base de precios anual.

**Solución:**
1. Importar nueva base BC3 (BEDEC 2025)
2. Regenerar presupuestos con precios actualizados
3. Sistema detecta códigos coincidentes
4. Actualiza automáticamente

**Resultado:** Presupuestos actualizados sin reescribirlos

---

## Mejores Prácticas

### Para Modo Manual

✅ Usa búsqueda por código cuando lo conoces  
✅ Busca por descripción para explorar opciones  
✅ Filtra por tipo para distinguir materiales de mano de obra  
✅ Organiza precios por capítulos lógicos desde el inicio  
✅ Revisa precio unitario antes de añadir  

### Para Modo Plantilla

✅ Selecciona plantilla más cercana al proyecto  
✅ Revisa precios generados antes de continuar  
✅ Ajusta cantidades según proyecto específico  
✅ Complementa con partidas adicionales en modo manual  
✅ Usa como base, no como resultado final  

### Para Modo IA

✅ Describe con máximo detalle posible  
✅ Menciona superficies específicas (m2)  
✅ Especifica materiales y acabados  
✅ Indica sistemas constructivos  
✅ Revisa TODAS las partidas generadas  
✅ Ajusta cantidades según planos reales  
✅ Considera como borrador inicial profesional  

---

## Preguntas Frecuentes

### ¿Necesito importar una base de precios BC3 primero?

**Sí.** El generador automático requiere una base de precios BC3 importada para funcionar. Sin base de precios, el sistema mostrará un aviso y te guiará para importar una.

### ¿Puedo usar múltiples bases de precios?

**Sí.** Puedes importar múltiples archivos BC3. El sistema las combina en una única base de datos, eliminando duplicados por código.

### ¿Qué precisión tiene el modo IA?

El modo IA alcanza **60-70% de precisión** en la selección de precios y cantidades. Es suficientemente preciso para:
- ✅ Presupuestos orientativos
- ✅ Borradores iniciales
- ✅ Estimaciones rápidas
- ❌ No reemplaza revisión profesional

**Siempre revisa** las partidas generadas por IA antes de presentar al cliente.

### ¿Se pueden editar los presupuestos generados?

**Sí.** Los presupuestos generados automáticamente son completamente editables en el gestor estándar de presupuestos. Puedes:
- Añadir/eliminar partidas
- Modificar cantidades y precios
- Reorganizar capítulos
- Ajustar porcentajes GG/BI/IVA
- Exportar a BC3

### ¿Los presupuestos son compatibles con PRESTO?

**Sí.** Los presupuestos se pueden exportar a formato BC3 estándar (FIEBDC-3), compatible con:
- PRESTO
- Arquímedes
- TCQ
- CYPE
- Cualquier software que lea BC3

### ¿Cómo actualizo precios cuando sube el IVA?

Los porcentajes de GG, BI e IVA son configurables en cada presupuesto. Simplemente:
1. Abrir presupuesto
2. Pestaña "Detalle"
3. Sección de totales
4. Ajustar porcentaje IVA
5. Totales se recalculan automáticamente

### ¿Puedo usar el sistema offline?

**Parcialmente.** Una vez importada la base de precios BC3:
- ✅ Modo Manual: Funciona completamente offline
- ✅ Modo Plantilla: Funciona completamente offline
- ❌ Modo IA: Requiere conexión (usa servicio cloud de IA)

---

## Soporte y Ayuda

### Documentación Adicional

- [Manual de Usuario Completo](MANUAL_USUARIO.md)
- [Gestión de Base de Precios](BEDEC_PRECIOS.md)
- [Sistema de Presupuestos](PRESUPUESTOS.md)
- [Exportación BC3](BC3_EXPORT.md)

### Contacto

Para soporte técnico o dudas sobre la funcionalidad, consulta el manual de usuario o el registro de componentes integrado en la aplicación.

---

## Actualizaciones Futuras

### Roadmap

🔜 **Versión 2.0**
- Importación directa desde URL de bases online
- Plantillas personalizables por usuario
- Modo IA con ajuste fino por preferencias
- Comparación de presupuestos lado a lado
- Generación de mediciones automáticas

🔜 **Versión 2.1**
- Integración con proyectos BIM (IFC)
- Extracción automática de mediciones desde modelos 3D
- Actualización automática de precios según índices
- Sistema de alertas de variación de precios

---

## Resumen

El sistema de **Generación Automática de Presupuestos** transforma radicalmente el proceso de elaboración de presupuestos de construcción:

- ⏱️ **Ahorra horas** en cada presupuesto
- 🎯 **Mejora precisión** con bases oficiales
- 🤖 **Aprovecha IA** para estimaciones rápidas
- 📊 **Genera estructura profesional** automáticamente
- 🔄 **Compatible** con software estándar del sector

**Desde la importación BC3 hasta el presupuesto final en minutos.**
