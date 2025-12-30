import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Question,
  Book,
  Buildings,
  FileText,
  Clipboard,
  Receipt,
  UsersThree,
  Bank,
  Stamp,
  CalendarBlank,
  MagnifyingGlass,
  Download,
  Upload,
  Sparkle,
  CheckCircle,
  Warning,
  Info,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Lightbulb,
  ShieldCheck,
  FolderOpen,
  PaperPlaneTilt,
  Gear,
  FilePdf,
  FileDoc,
  X
} from '@phosphor-icons/react'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

interface UserManualProps {
  trigger?: React.ReactNode
}

interface ManualSection {
  id: string
  title: string
  icon: React.ComponentType<any>
  category: string
  content: {
    description: string
    features?: string[]
    steps?: { title: string; description: string; note?: string }[]
    tips?: string[]
    warnings?: string[]
  }
}

const manualSections: ManualSection[] = [
  {
    id: 'intro',
    title: 'Introducción',
    icon: Book,
    category: 'general',
    content: {
      description: 'AFO CORE MANAGER es una plataforma integral diseñada específicamente para arquitectos autónomos en España. Centraliza la gestión de proyectos, documentación técnica, cumplimiento normativo, presupuestos y trámites administrativos en una sola aplicación. Esta herramienta ha sido desarrollada pensando en las necesidades reales del ejercicio profesional de la arquitectura, integrando desde la gestión administrativa básica hasta funcionalidades avanzadas de inteligencia artificial para asistencia normativa.',
      features: [
        'Gestión completa del ciclo de vida de proyectos arquitectónicos desde concepción hasta entrega',
        'Control documental profesional con versionado según ISO 19650-2 (nomenclatura P01, P02, C01, C02)',
        'Asistente de cumplimiento normativo con IA especializada en CTE, RITE y REBT',
        'Sistema de facturación automática vinculada al progreso de fases del proyecto',
        'Flujos de aprobación personalizables para revisión y validación de documentos técnicos',
        'Integración con servicios de firma electrónica cualificada (Cl@ve, ViafirmaPro) con validez legal',
        'Gestión centralizada de clientes con datos fiscales completos para facturación',
        'Sistema completo de presupuestos con importación de archivos BC3 estándar',
        'Base de datos reutilizable de intervinientes profesionales (arquitectos, ingenieros, aparejadores)',
        'Sistema de visados digitales con seguimiento de estados y documentación requerida',
        'Gestión de trámites municipales (licencias, permisos, primera ocupación)',
        'Calendario integrado con hitos de proyecto y fechas importantes',
        'Herramientas de importación/exportación para migración y backup de datos',
        'Biblioteca de plantillas de documentos técnicos con generación automática mediante IA',
        'Sistema de envío de emails con plantillas personalizables y registro de comunicaciones'
      ],
      steps: [
        {
          title: 'Primer uso: Configuración inicial',
          description: 'Al iniciar por primera vez, configura tu información de email desde Herramientas > Configurar Email. Esto permitirá enviar facturas, documentos e informes directamente desde la aplicación.',
          note: 'Recomendamos usar una contraseña de aplicación específica en lugar de tu contraseña principal para mayor seguridad'
        },
        {
          title: 'Crear tu primer proyecto',
          description: 'Navega a la sección Proyectos y crea tu primer proyecto con título descriptivo, ubicación completa y descripción breve. El sistema generará automáticamente una estructura de carpetas profesional.',
          note: 'La estructura de carpetas sigue estándares profesionales con organización por disciplinas (ARQ, EST, INS, etc.)'
        },
        {
          title: 'Añadir intervinientes y clientes',
          description: 'Desde el menú Herramientas, registra a los profesionales con los que colaboras habitualmente (ingenieros, aparejadores, etc.) y tus clientes con datos completos de facturación.'
        },
        {
          title: 'Explorar el Dashboard',
          description: 'Utiliza el Dashboard como punto central para supervisar todos tus proyectos activos, facturas pendientes, próximos hitos y métricas clave de tu estudio.'
        }
      ],
      tips: [
        'Dedica 30 minutos iniciales a explorar cada módulo del menú superior para familiarizarte con todas las funcionalidades',
        'Usa el Dashboard como página de inicio diaria para revisar el estado general de tu estudio',
        'Configura tu email SMTP antes de enviar documentos o facturas a clientes',
        'Crea plantillas de flujo de aprobación y documentos para procesos recurrentes',
        'Exporta tus proyectos regularmente como medida de backup y seguridad'
      ],
      warnings: [
        'Esta aplicación almacena datos localmente en tu navegador. Realiza copias de seguridad exportando proyectos periódicamente',
        'No compartas credenciales de email SMTP con terceros',
        'Los documentos con firma cualificada tienen validez legal equivalente a firma manuscrita'
      ]
    }
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Buildings,
    category: 'general',
    content: {
      description: 'El Dashboard es el centro neurálgico de AFO CORE MANAGER, proporcionando una vista panorámica de tu estudio con métricas clave actualizadas en tiempo real. Diseñado para iniciar tu jornada laboral, te permite evaluar rápidamente el estado de tu negocio, identificar prioridades y acceder a las funciones que necesitas con un solo clic.',
      features: [
        'Resumen visual de proyectos activos vs archivados con indicadores de progreso',
        'Estado financiero detallado: facturas pagadas, pendientes, vencidas y total de ingresos',
        'Lista de próximos hitos de proyectos ordenados cronológicamente',
        'Estado de presupuestos (aprobados, enviados, pendientes y rechazados)',
        'Contador de documentos totales gestionados en la plataforma',
        'Indicadores de facturas vencidas con alertas visuales en rojo',
        'Acceso rápido a crear nuevos proyectos y facturas mediante botones destacados',
        'Navegación directa a módulos específicos haciendo clic en cada tarjeta métrica',
        'Vista de hitos próximos en los siguientes 30 días para planificación',
        'Resumen de clientes activos con información de contacto rápida'
      ],
      steps: [
        {
          title: 'Revisar métricas principales',
          description: 'Al abrir la aplicación, las tarjetas superiores muestran totales actualizados de proyectos, clientes, ingresos acumulados y documentos gestionados. Estos números proporcionan una fotografía instantánea de tu estudio.',
          note: 'Los ingresos mostrados incluyen solo facturas emitidas y pagadas, no borradores'
        },
        {
          title: 'Identificar alertas críticas',
          description: 'El Dashboard resalta en rojo las facturas vencidas y en amarillo los hitos próximos. Presta atención especial a estos indicadores para evitar problemas de cobro o retrasos en entregas.',
          note: 'Las facturas se marcan como vencidas automáticamente al superar su fecha de vencimiento'
        },
        {
          title: 'Navegar a módulos específicos',
          description: 'Haz clic en cualquier tarjeta de métrica (proyectos, clientes, facturas) para ir directamente a esa sección. Por ejemplo, al hacer clic en "Facturas Pendientes" te llevará al gestor de facturas con un filtro aplicado.',
          note: 'Esta navegación contextual te ahorra tiempo al llevar directamente a la información relevante'
        },
        {
          title: 'Revisar próximos hitos',
          description: 'La sección de hitos muestra eventos importantes de los próximos 30 días como entregas de fases, presentaciones de licencias, o fechas de cobro esperadas. Úsala para planificar tu semana.',
          note: 'Los hitos se generan automáticamente de las fechas establecidas en cada proyecto'
        },
        {
          title: 'Acceder a acciones rápidas',
          description: 'Los botones de acción rápida te permiten crear un nuevo proyecto o factura sin navegar a otros menús. Ideal para capturar información cuando surge una nueva oportunidad.'
        }
      ],
      tips: [
        'Convierte el Dashboard en tu página de inicio diaria para revisar el estado general en 30 segundos',
        'Presta atención especial a facturas vencidas cada lunes para gestionar cobros',
        'Usa los hitos próximos como checklist semanal de entregas importantes',
        'Si una métrica te parece incorrecta, haz clic en ella para ver el detalle y verificar',
        'Exporta proyectos cuando veas el contador de documentos crecer significativamente'
      ],
      warnings: [
        'Las métricas financieras no incluyen impuestos ni retenciones en los totales principales',
        'Los hitos solo aparecen si has configurado fechas en las fases de los proyectos'
      ]
    }
  },
  {
    id: 'projects',
    title: 'Gestión de Proyectos',
    icon: Buildings,
    category: 'projects',
    content: {
      description: 'El módulo de proyectos es el corazón operativo de AFO CORE MANAGER, diseñado para gestionar todo el ciclo de vida de tus trabajos arquitectónicos desde la concepción inicial hasta la entrega final. Permite organizar proyectos con estructura profesional, controlar fases de desarrollo, vincular documentación técnica, gestionar equipos de trabajo y automatizar la facturación según el progreso. Cada proyecto se convierte en un contenedor integral de toda la información relacionada: documentos, presupuestos, hitos, intervinientes, licencias y facturación.',
      features: [
        'Vista de tarjetas visual con información destacada de cada proyecto (título, ubicación, estado, progreso)',
        'Sistema de filtros avanzado: Todos, Activos, Archivados con contadores en tiempo real',
        'Búsqueda instantánea por nombre, ubicación o cualquier campo del proyecto',
        'Estructura de carpetas automática generada según estándares profesionales de documentación',
        'Gestión de fases personalizables (Estudio Previo, Anteproyecto, Básico, Ejecución, Dirección de Obra)',
        'Porcentajes de facturación configurables por fase según contrato',
        'Seguimiento de progreso visual con indicadores de estado (Pendiente, En Progreso, Completada)',
        'Generación automática de facturas al completar cada fase con cálculo según presupuesto aprobado',
        'Vinculación con clientes para datos de facturación automática',
        'Asignación de intervinientes profesionales con roles específicos',
        'Gestión de presupuestos vinculados con importación BC3',
        'Sistema de hitos y fechas clave para planificación temporal',
        'Registro de cumplimiento normativo integrado (checklist CTE, RITE, REBT)',
        'Importación de proyectos desde carpetas existentes con análisis de documentos',
        'Exportación completa con estructura de carpetas y metadatos',
        'Calendario integrado mostrando todos los hitos del proyecto'
      ],
      steps: [
        {
          title: 'Crear un proyecto nuevo',
          description: 'Haz clic en "Nuevo Proyecto" en la barra superior. Completa el formulario con: Título descriptivo (ej: "Vivienda Unifamiliar - Calle Mayor 15"), Ubicación completa (calle, número, municipio, provincia), Descripción breve del proyecto, Estado inicial (Activo recomendado).',
          note: 'El sistema genera automáticamente una estructura de carpetas profesional con nomenclatura estándar: 00_PROYECTO, 01_ARQ, 02_EST, etc.'
        },
        {
          title: 'Definir fases contratadas',
          description: 'En la sección "Fases del Proyecto", añade cada fase contratada con el cliente. Para cada fase especifica: Nombre (Estudio Previo, Básico, Ejecución, etc.), Porcentaje de facturación (ej: Básico 30%, Ejecución 50%, Dirección 20%), Fecha estimada de finalización. Los porcentajes deben sumar 100% del honorario total.',
          note: 'Los porcentajes de facturación se basan en el PEM (Presupuesto de Ejecución Material) del proyecto'
        },
        {
          title: 'Asignar intervinientes profesionales',
          description: 'Selecciona de tu base de datos los profesionales que participan: Arquitecto autor, Arquitecto técnico, Ingeniero de estructuras, Ingeniero de instalaciones, etc. Si no existen en tu base, créalos primero desde Herramientas > Intervinientes.',
          note: 'Los intervinientes aparecerán automáticamente en documentos generados y podrán ser asignados como revisores en flujos de aprobación'
        },
        {
          title: 'Vincular cliente',
          description: 'Asocia el proyecto con un cliente existente. Esto permite: Auto-rellenar datos de facturación, Generar facturas automáticamente al completar fases, Llevar historial de proyectos por cliente. Si es un cliente nuevo, créalo desde Herramientas > Clientes con todos los datos fiscales.',
          note: 'Es imprescindible vincular un cliente para la facturación automática'
        },
        {
          title: 'Crear presupuesto',
          description: 'Accede a la pestaña "Presupuestos" del proyecto y crea un nuevo presupuesto. Puedes: Importar un archivo BC3 desde Presto, Usar la base de datos de precios de construcción, Añadir partidas manualmente. Una vez aprobado por el cliente, marca el presupuesto como "Aprobado" para activar la facturación automática.',
          note: 'El PEM del presupuesto se usa para calcular el importe de cada factura de fase'
        },
        {
          title: 'Gestionar documentos',
          description: 'En la pestaña "Documentos", sube toda la documentación técnica del proyecto. El sistema mantendrá: Control de versiones automático (P01, P02, C01, C02), Organización por carpetas y disciplinas, Búsqueda avanzada por nombre, tipo, disciplina, Estados de revisión y aprobación.',
          note: 'Usa la nomenclatura estándar: Proyecto-Disciplina-Descripción (ej: VIV001-ARQ-PlantaBaja)'
        },
        {
          title: 'Actualizar estados de fases',
          description: 'Conforme avances en el proyecto, actualiza el estado de cada fase: Pendiente (no iniciada), En Progreso (trabajando activamente), Completada (entregada al cliente). Al marcar una fase como Completada, el sistema te preguntará si deseas generar automáticamente la factura correspondiente.',
          note: 'La facturación automática calcula el importe como: PEM × Porcentaje de Fase × (Honorarios ÷ 100)'
        },
        {
          title: 'Revisar cumplimiento normativo',
          description: 'Usa la pestaña "Cumplimiento" para verificar que el proyecto cumple con CTE, RITE y REBT. El checklist automático muestra más de 40 requisitos específicos según la tipología del edificio. Genera informes de cumplimiento para documentar el proceso.',
          note: 'Completa el checklist en cada fase para tener trazabilidad del cumplimiento normativo'
        },
        {
          title: 'Gestionar trámites administrativos',
          description: 'Desde la pestaña "Licencias", gestiona todos los trámites municipales: Licencia de obra mayor/menor, Primera ocupación, Cambio de uso, Licencia de actividad. Marca estados y adjunta documentación presentada.'
        },
        {
          title: 'Archivar proyecto completado',
          description: 'Cuando finalices totalmente el proyecto (todas las fases, facturas pagadas, licencias concedidas), cámbialo a estado "Archivado". Los proyectos archivados no aparecen en la vista activa pero se conservan para consulta histórica.',
          note: 'Exporta el proyecto antes de archivar como medida de backup'
        }
      ],
      tips: [
        'Define todas las fases contratadas al crear el proyecto para tener control completo del alcance',
        'Actualiza los estados de fase regularmente para que la facturación automática funcione correctamente',
        'Usa descripciones claras en los títulos de proyecto para búsquedas futuras (incluye ubicación)',
        'Vincula siempre el presupuesto aprobado antes de completar la primera fase',
        'Utiliza la vista de calendario para visualizar todos los hitos de proyectos simultáneamente',
        'Archiva proyectos finalizados al final de cada año fiscal para mantener limpia la vista activa',
        'Exporta proyectos grandes regularmente como medida de seguridad',
        'Aprovecha la importación de BC3 para presupuestos complejos con muchas partidas',
        'Completa el checklist de cumplimiento progresivamente en cada fase',
        'Usa la estructura de carpetas generada automáticamente para mantener organización consistente'
      ],
      warnings: [
        'No elimines proyectos con facturas emitidas, archívalos para mantener el histórico fiscal',
        'Los porcentajes de facturación por fase deben sumar 100% para facturar el importe total',
        'Marca las fases como completadas solo cuando realmente hayas entregado al cliente',
        'El cálculo de honorarios automático requiere presupuesto aprobado vinculado al proyecto'
      ]
    }
  },
  {
    id: 'documents',
    title: 'Gestión Documental',
    icon: FileText,
    category: 'documents',
    content: {
      description: 'El sistema de gestión documental de AFO CORE MANAGER implementa las mejores prácticas de la industria según la norma ISO 19650-2 (gestión de información en fase de desarrollo de activos). Proporciona control exhaustivo de versiones, nomenclatura profesional estandarizada, organización por disciplinas técnicas, búsqueda avanzada y herramientas de generación automática de documentación técnica mediante inteligencia artificial. Cada documento se rastrea con metadatos completos incluyendo autor, fecha, versión, estado de revisión y aprobación.',
      features: [
        'Versionado automático según ISO 19650-2: P01, P02, P03... para documentos de trabajo (Work In Progress), C01, C02, C03... para documentos compartidos con cliente/equipo',
        'Nomenclatura profesional estandarizada: [CódigoProyecto]-[Disciplina]-[Descripción]-[Versión] (ej: VIV001-ARQ-PlantaBaja-P01)',
        'Sistema de 10 disciplinas técnicas: ARQ (Arquitectura), EST (Estructuras), INS (Instalaciones generales), ELE (Instalaciones eléctricas), CLI (Climatización), PCI (Protección contra incendios), URB (Urbanización), MED (Mediciones), CAL (Cálculos), SEG (Seguridad y Salud)',
        'Búsqueda en tiempo real con índice completo de texto, nombre, disciplina, carpeta y metadatos',
        'Filtros múltiples combinables: por disciplina, tipo de archivo, estado de revisión, carpeta contenedora',
        'Subida individual con formulario detallado de metadatos',
        'Subida masiva mediante drag-and-drop con procesamiento batch de múltiples archivos',
        'Sistema de carpetas jerárquico ilimitado con navegación tipo explorador',
        'Generación inteligente de documentos técnicos usando plantillas + IA especializada',
        'Vista previa optimizada con fuente de 12pt para legibilidad en pantalla',
        'Exportación a PDF con optimización para impresión (300dpi, compresión inteligente)',
        'Fusión de múltiples PDFs en un solo documento para entregas',
        'Compresión de PDFs manteniendo calidad para envíos por email',
        'Validación automática de documentos según checklist de disciplina',
        'Marcas de agua configurables para documentos en revisión',
        'Registro de histórico de cambios y descargas por documento'
      ],
      steps: [
        {
          title: 'Subir documento individual',
          description: 'Haz clic en "Subir Documento" y completa el formulario: Nombre descriptivo (ej: "Planta Baja"), Disciplina (selecciona ARQ, EST, INS, etc.), Tipo de documento (Plano, Memoria, Cálculo, Informe), Versión inicial (P01 para trabajo, C01 para compartir), Carpeta destino (opcional), Descripción adicional, Archivo a subir. El sistema genera automáticamente el nombre completo con nomenclatura profesional.',
          note: 'La nomenclatura completa se genera como: [Proyecto]-[Disciplina]-[Nombre]-[Versión]'
        },
        {
          title: 'Subida masiva drag-and-drop',
          description: 'Para múltiples archivos, usa la zona de "Subida Masiva". Arrastra todos los archivos PDF, DWG, Excel, etc. que necesites. El sistema los procesa en lote: Analiza el nombre para extraer disciplina si es posible, Asigna versión P01 por defecto, Los organiza en carpetas según disciplina, Genera nomenclatura estándar. Puedes editar metadatos de cada uno después.',
          note: 'Soporta formatos: PDF, DWG, DOC/DOCX, XLS/XLSX, JPG/PNG, IFC'
        },
        {
          title: 'Organizar en estructura de carpetas',
          description: 'El sistema crea automáticamente carpetas por disciplina (01_ARQ, 02_EST, etc.) siguiendo estándares profesionales. Puedes crear subcarpetas personalizadas: Por fase (Básico, Ejecución), Por especialidad (Cimentación, Estructura Metálica), Por ubicación (Bloque A, Bloque B). Arrastra y suelta documentos entre carpetas.',
          note: 'La estructura de carpetas se exporta completa al descargar el proyecto'
        },
        {
          title: 'Buscar y filtrar documentos',
          description: 'Usa el buscador en tiempo real escribiendo cualquier texto (busca en nombre, descripción, disciplina). Combina con filtros: Por disciplina (ARQ, EST, etc.), Por tipo (Plano, Memoria, etc.), Por estado (Borrador, En Revisión, Aprobado), Por carpeta. Los resultados se actualizan instantáneamente conforme escribes.',
          note: 'La búsqueda es sensible a acentos pero no a mayúsculas'
        },
        {
          title: 'Control de versiones progresivo',
          description: 'Para subir una nueva versión de un documento existente: Busca el documento original, Haz clic en "Nueva Versión", Sube el archivo actualizado. El sistema incrementa automáticamente la versión: P01 → P02 → P03 (trabajo) o C01 → C02 → C03 (compartido). Mantiene histórico de todas las versiones anteriores para trazabilidad.',
          note: 'Puedes cambiar de P a C cuando el documento esté listo para compartir'
        },
        {
          title: 'Generar documentos con IA',
          description: 'Desde "Herramientas > Plantillas de Documentos": Selecciona tipo (Memoria descriptiva, Anexo de cálculo, Pliego de condiciones, Estudio de seguridad, etc.), El sistema pre-rellena con datos del proyecto (ubicación, cliente, intervinientes), Personaliza las secciones o genera contenido automático con IA, Revisa y edita el contenido generado, Guarda como documento del proyecto.',
          note: 'La IA genera contenido técnico coherente pero siempre debe revisarse profesionalmente'
        },
        {
          title: 'Exportar documentos a PDF optimizado',
          description: 'Usa "Utilidades PDF" para: Exportar documento a PDF de alta calidad (300dpi, perfil de color CMYK para impresión), Fusionar múltiples PDFs en orden para crear el documento completo del proyecto, Comprimir PDFs grandes manteniendo legibilidad para envío por email, Añadir marcas de agua a documentos en revisión. Los PDFs exportados están optimizados para impresión profesional.',
          note: 'La compresión reduce hasta 70% el tamaño manteniendo calidad visual'
        },
        {
          title: 'Validar documentación por disciplina',
          description: 'Cada disciplina tiene un checklist de documentos mínimos requeridos. El sistema te avisa si faltan: ARQ: Memoria, Planos plantas/alzados/secciones, EST: Cálculo estructural, Planos de estructura, INS: Memoria de instalaciones, Esquemas unifilares. Usa estos checklists como guía de entrega.',
          note: 'Los checklists se basan en requisitos típicos del CTE y LOE'
        },
        {
          title: 'Compartir documentos con flujos de aprobación',
          description: 'Para documentos que requieren revisión formal: Selecciona el documento, Crea un flujo de aprobación (ver sección de Flujos), Asigna revisores (arquitecto senior, ingeniero, cliente), Los revisores reciben notificación por email, Pueden aprobar, rechazar o solicitar cambios, El documento cambia de versión P a C tras aprobación final.',
          note: 'Los flujos de aprobación quedan registrados como evidencia de revisión'
        },
        {
          title: 'Exportar proyecto completo',
          description: 'Para backup o entrega final, exporta todo el proyecto con documentos: "Herramientas > Exportar Proyectos", Selecciona el proyecto, Elige incluir estructura de carpetas completa, Descarga archivo ZIP con: Carpetas organizadas por disciplina, Todos los documentos en última versión, Archivo JSON con metadatos del proyecto. Guarda estos exports como backup mensual.',
          note: 'El export preserva la nomenclatura y organización completa'
        }
      ],
      tips: [
        'Establece un estándar de nomenclatura al inicio del proyecto y aplícalo consistentemente',
        'Usa versiones P para trabajo interno y C solo cuando vayas a compartir oficialmente',
        'Mantén máximo 5-6 versiones P antes de compartir como C01 para no saturar el control',
        'Aprovecha el buscador escribiendo palabras clave en lugar de navegar carpetas',
        'Genera el índice de documentación del proyecto exportando la lista completa',
        'Usa las utilidades PDF para crear documentos únicos profesionales para cada entrega',
        'Aplica marcas de agua a documentos C que aún están en revisión de cliente',
        'Exporta proyectos completos mensualmente como medida de backup',
        'Valida documentación con el checklist antes de cada entrega de fase',
        'Usa la generación con IA como borrador inicial, luego personaliza con criterio profesional'
      ],
      warnings: [
        'No subas información sensible de clientes sin cifrar en los documentos',
        'Verifica siempre el número de versión antes de enviar documentos oficiales al cliente',
        'Los documentos generados con IA deben revisarse por el arquitecto responsable',
        'Las versiones anteriores se mantienen en histórico pero solo la última es la oficial',
        'Los archivos PDF comprimidos pueden perder algo de calidad si se comprimen excesivamente'
      ]
    }
  },
  {
    id: 'compliance',
    title: 'Cumplimiento Normativo',
    icon: Clipboard,
    category: 'documents',
    content: {
      description: 'El módulo de cumplimiento normativo integra inteligencia artificial especializada entrenada en la normativa técnica española actual (CTE 2019 actualizado, RITE, REBT) para asistir en la verificación del cumplimiento de requisitos legales. Incluye un asistente conversacional que responde consultas en lenguaje natural con referencias exactas a artículos normativos, checklists dinámicos de más de 40 requisitos específicos que se adaptan según la tipología edificatoria, y generador automático de informes de justificación de cumplimiento listos para incorporar al proyecto.',
      features: [
        'Asistente IA conversacional con comprensión de lenguaje natural técnico',
        'Base de conocimiento actualizada: CTE DB-SI, DB-SUA, DB-HS, DB-HE, DB-HR (última versión 2019), RITE (Real Decreto 1027/2007 actualizado), REBT (Real Decreto 842/2002)',
        'Checklist inteligente de 40+ requisitos CTE organizados por Documentos Básicos',
        'Filtrado automático de requisitos según tipología: Residencial, Oficinas, Comercial, Industrial, Docente, Hospitalario',
        'Generador de informes de cumplimiento con estructura profesional y referencias normativas',
        'Sistema de justificación por requisito con posibilidad de adjuntar cálculos y planos',
        'Referencias exactas a artículos, apartados y tablas de normativa',
        'Consulta de parámetros técnicos (resistencias al fuego, aislamientos, instalaciones)',
        'Búsqueda por palabras clave en toda la base normativa',
        'Historial de consultas realizadas para consulta posterior',
        'Exportación de informes en PDF con formato técnico profesional',
        'Envío directo de informes por email a clientes o colegios profesionales'
      ],
      steps: [
        {
          title: 'Consultar al Asistente IA Regulatorio',
          description: 'Abre "Herramientas > Asistente Regulatorio IA". Formula tu consulta en lenguaje natural técnico, por ejemplo: "¿Cuál es la altura mínima de paso en viviendas según CTE?", "Resistencia al fuego requerida para estructura en edificio de 4 plantas", "Requisitos de ventilación en dormitorios según DB-HS3". El asistente analiza la consulta y responde con: La respuesta técnica exacta, Referencias a artículos y apartados específicos, Valores numéricos si aplican, Consideraciones adicionales importantes.',
          note: 'La IA está entrenada específicamente en normativa española, no generalista'
        },
        {
          title: 'Revisar Checklist de Cumplimiento del Proyecto',
          description: 'En la vista de detalle del proyecto, accede a la pestaña "Cumplimiento". El sistema muestra automáticamente un checklist de más de 40 requisitos organizados por Documentos Básicos: DB-SI (Seguridad en caso de incendio), DB-SUA (Seguridad de utilización y accesibilidad), DB-HS (Salubridad), DB-HE (Ahorro de energía), DB-HR (Protección frente al ruido). Marca cada requisito como: Cumple, No Aplica, Pendiente Verificar. Añade observaciones y adjunta documentación justificativa.',
          note: 'El checklist se filtra automáticamente según el uso del edificio configurado'
        },
        {
          title: 'Justificar Cumplimiento por Requisito',
          description: 'Para cada requisito del checklist, puedes: Ver la descripción técnica completa del requisito, Consultar la referencia normativa exacta (artículo y apartado), Marcar como cumplido y añadir justificación escrita, Adjuntar documentos de cálculo o planos que lo justifiquen, Indicar si no aplica al proyecto concreto y por qué. Esta justificación quedará documentada en el informe final.',
          note: 'Documenta especialmente bien los requisitos críticos de seguridad y accesibilidad'
        },
        {
          title: 'Generar Informe de Cumplimiento',
          description: 'Una vez completado el checklist (o parcialmente para revisión intermedia), genera el informe automático desde el botón "Generar Informe". El sistema crea un documento PDF profesional con: Portada con datos del proyecto, Tabla resumen de cumplimiento, Justificación detallada por cada Documento Básico, Referencias normativas completas, Anexos con cálculos adjuntos. El informe está listo para incorporar a la memoria del proyecto.',
          note: 'Genera informes parciales en cada fase para tener trazabilidad progresiva'
        },
        {
          title: 'Consultar Normativa Urbanística PGOU',
          description: 'Desde "Herramientas > Licencias Municipales > Consulta PGOU", accede a información urbanística del municipio del proyecto: Parámetros urbanísticos (edificabilidad, ocupación, altura), Uso permitido en la parcela, Normativa específica municipal. Esto complementa el cumplimiento del CTE con requisitos locales.',
          note: 'La información PGOU debe verificarse siempre con el ayuntamiento'
        },
        {
          title: 'Enviar Informe por Email',
          description: 'Los informes generados pueden enviarse directamente: "Enviar por Email" en la vista del informe, Elige destinatario (cliente, colegio, compañero), Añade mensaje personalizado, El PDF del informe se adjunta automáticamente. Queda registro del envío en "Herramientas > Registro de Emails".',
          note: 'Asegúrate de tener configurado el email SMTP antes de enviar'
        },
        {
          title: 'Actualizar Checklist en Cada Fase',
          description: 'El cumplimiento normativo debe verificarse progresivamente: Fase de Básico: requisitos generales y parámetros principales, Fase de Ejecución: detalles constructivos y especificaciones, Fase de Obra: verificación de ejecución real. Actualiza el checklist y regenera informes en cada hito para documentar la evolución.',
          note: 'Los informes parciales son evidencia de diligencia profesional'
        }
      ],
      tips: [
        'Consulta el Asistente IA durante el diseño inicial para evitar problemas después',
        'Formula preguntas específicas con datos del proyecto (altura, uso, superficie) para respuestas precisas',
        'Completa el checklist progresivamente en cada fase, no todo al final',
        'Genera informes intermedios para revisiones de colegio o cliente',
        'Documenta con observaciones por qué ciertos requisitos no aplican a tu proyecto específico',
        'Usa el historial de consultas como base de conocimiento propia para proyectos similares',
        'Adjunta cálculos y planos específicos a cada requisito para justificación robusta',
        'Verifica siempre las respuestas del IA con el texto legal original en caso de duda',
        'El cumplimiento del CTE debe complementarse con normativa urbanística local',
        'Conserva los informes de cada fase como evidencia de cumplimiento para inspecciones'
      ],
      warnings: [
        'El Asistente IA es una herramienta de apoyo, no sustituye el criterio profesional del arquitecto',
        'Verifica información crítica de seguridad con el texto normativo original',
        'La responsabilidad del cumplimiento recae en el arquitecto firmante, no en la herramienta',
        'Las normativas se actualizan periódicamente, verifica que usas la versión vigente',
        'Algunos ayuntamientos tienen ordenanzas específicas que complementan el CTE'
      ]
    }
  },
  {
    id: 'clients',
    title: 'Gestión de Clientes',
    icon: UsersThree,
    category: 'business',
    content: {
      description: 'La base de datos de clientes centraliza toda la información comercial y fiscal necesaria para la gestión de proyectos y facturación. Permite diferenciar entre clientes particulares y empresas con campos específicos para cada tipo, mantener históricos completos de relaciones comerciales, y generar facturas automáticas con datos correctos. Esta información se reutiliza automáticamente en proyectos, presupuestos y facturas evitando duplicar datos.',
      features: [
        'Diferenciación entre clientes particulares (personas físicas) y empresas (personas jurídicas)',
        'Datos de identificación: Nombre/Razón Social, NIF/CIF validado, Dirección completa con municipio y CP',
        'Información de contacto: Email, teléfono móvil, teléfono fijo, persona de contacto',
        'Datos bancarios opcionales: IBAN para recibos domiciliados',
        'Datos fiscales: Dirección de facturación si difiere de la principal, Forma de pago preferida (transferencia, efectivo, recibo)',
        'Observaciones y notas sobre particularidades del cliente',
        'Histórico automático: lista de proyectos asociados, facturas emitidas y estado de pagos',
        'Búsqueda avanzada por nombre, NIF, proyecto asociado',
        'Exportación de datos de clientes para análisis o migración',
        'Importación masiva desde CSV para migrar desde otros sistemas'
      ],
      steps: [
        {
          title: 'Crear cliente particular',
          description: 'Desde "Herramientas > Gestión de Clientes > Añadir Cliente": Tipo: Particular, Nombre completo, NIF/DNI con letra, Dirección completa (calle, número, CP, municipio, provincia), Email de contacto, Teléfono. Opcionalmente: Forma de pago preferida, IBAN si es domiciliación, Observaciones sobre preferencias o particularidades.',
          note: 'El email es crucial para envío automático de presupuestos y facturas'
        },
        {
          title: 'Crear cliente empresa',
          description: 'Para empresas: Tipo: Empresa, Razón Social completa, CIF con letra de validación, Dirección fiscal, Persona de contacto en la empresa (técnico, administrador), Email corporativo y teléfono, Departamento responsable si aplica.',
          note: 'Usa el nombre de la persona de contacto en "Nombre" para trato personalizado'
        },
        {
          title: 'Completar datos de facturación',
          description: 'Asegúrate de completar: Dirección de facturación (si difiere de dirección principal para empresas con múltiples sedes), Forma de pago predeterminada (se pre-seleccionará en facturas), Plazo de pago habitual (30, 60 días), IBAN si hay domiciliación bancaria pactada.',
          note: 'Estos datos se copian automáticamente a cada factura nueva'
        },
        {
          title: 'Vincular a proyectos',
          description: 'Al crear un nuevo proyecto: En el campo "Cliente", selecciona de la lista desplegable, Si es un cliente nuevo, créalo directamente desde el diálogo del proyecto, La vinculación permite: Ver todos los proyectos del cliente desde su ficha, Generar facturas automáticas con sus datos, Llevar estadísticas de facturación por cliente.',
          note: 'Un cliente puede tener múltiples proyectos simultáneos'
        },
        {
          title: 'Consultar histórico comercial',
          description: 'En la vista detalle de cada cliente: Pestaña "Proyectos": lista de todos los proyectos activos y archivados, Pestaña "Facturas": todas las facturas emitidas con estados y importes, Métricas resumen: ingresos totales, saldo pendiente, proyectos completados. Esto te permite evaluar la relación comercial completa.',
          note: 'Útil para decisiones comerciales (nuevas ofertas, descuentos, prioridades)'
        },
        {
          title: 'Editar y actualizar datos',
          description: 'Los datos de clientes son editables en cualquier momento: Haz clic en el cliente, "Editar Datos", Modifica cualquier campo, Guarda cambios. Los proyectos y facturas existentes mantienen los datos originales pero las nuevas usan los datos actualizados.',
          note: 'Si cambias dirección fiscal, actualiza facturas futuras manualmente si es necesario'
        },
        {
          title: 'Archivar o eliminar clientes',
          description: 'Para clientes con los que ya no trabajas: Archivar: mantiene histórico pero oculta en listas activas, Eliminar: solo si no tiene proyectos ni facturas asociados, Fusionar: combina duplicados manteniendo todo el histórico.',
          note: 'Por cuestiones fiscales, no elimines clientes con facturas emitidas'
        }
      ],
      tips: [
        'Crea clientes con datos completos desde el inicio para evitar errores en facturas',
        'Usa el campo "Observaciones" para notas importantes (ej: "Requiere 3 copias impresas")',
        'Mantén emails actualizados para comunicaciones automáticas efectivas',
        'Revisa el histórico de clientes antes de preparar nuevas propuestas comerciales',
        'Para grandes promotoras, crea un cliente por cada delegación/proyecto si facturan separado',
        'Valida NIF/CIF online antes de guardar para evitar problemas con Hacienda',
        'Actualiza formas de pago si un cliente cambia sus preferencias',
        'Exporta la lista de clientes trimestralmente como backup',
        'Usa la búsqueda por NIF para evitar crear clientes duplicados',
        'Documenta en observaciones cualquier acuerdo especial de honorarios o plazos'
      ],
      warnings: [
        'Los datos de clientes son sensibles (RGPD), protege el acceso a la aplicación',
        'No compartas datos bancarios de clientes con terceros',
        'Verifica siempre NIF/CIF en facturas para evitar rechazos de Hacienda',
        'No elimines clientes con facturas emitidas por obligaciones fiscales',
        'Conserva datos de clientes mínimo 5 años por requerimientos legales'
      ]
    }
  },
  {
    id: 'invoicing',
    title: 'Facturación',
    icon: Receipt,
    category: 'business',
    content: {
      description: 'El sistema de facturación automatiza el proceso completo desde la generación hasta el cobro, vinculando las facturas con proyectos y fases para control exhaustivo. Permite facturación automática al completar hitos de proyecto o creación manual para otros conceptos. Incluye cálculo automático de IVA y retenciones IRPF según normativa, numeración correlativa sin huecos, gestión de estados con alertas de vencimiento, exportación a PDF profesional y envío directo por email con registro completo de comunicaciones.',
      features: [
        'Facturación automática vinculada al progreso de fases de proyecto con cálculo de honorarios',
        'Creación manual de facturas para conceptos adicionales (consultas, mediciones, modificados)',
        'Sistema de estados completo: Borrador (preparación), Emitida (enviada a cliente), Pagada (cobrada), Vencida (plazo superado sin cobro)',
        'Cálculo automático de IVA 21% sobre base imponible',
        'Aplicación de retenciones IRPF (7% arquitectos, 15% inicio actividad) configurable',
        'Numeración correlativa automática por año fiscal (2024/001, 2024/002...)',
        'Plantilla de factura profesional con datos fiscales completos',
        'Vista previa antes de emitir para verificación',
        'Exportación a PDF de alta calidad con logo y formato corporativo',
        'Envío por email con plantilla personalizable y PDF adjunto automático',
        'Gestión de fechas: fecha emisión, fecha vencimiento (30/60 días configurable)',
        'Histórico completo de facturas con filtros por estado, cliente, proyecto, fecha',
        'Alertas visuales de facturas vencidas en Dashboard y listados',
        'Cálculo de totales: facturado, cobrado, pendiente cobro',
        'Vinculación con proyectos para trazabilidad completa',
        'Registro de pagos parciales para facturas a plazos'
      ],
      steps: [
        {
          title: 'Facturación automática al completar fase',
          description: 'Cuando marcas una fase de proyecto como "Completada", el sistema detecta automáticamente que debe generarse una factura. Abre un diálogo de confirmación mostrando: Cliente del proyecto, Fase completada (ej: "Proyecto Básico 30%"), Cálculo del importe: PEM × Porcentaje de Fase × (Honorarios % ÷ 100), Base imponible, IVA 21%, Retención IRPF 7%, Total a cobrar. Puedes: Revisar y ajustar los importes, Modificar concepto o descripción, Cambiar fecha de vencimiento, Confirmar y crear como Borrador o Emitida directamente.',
          note: 'El cálculo requiere tener un presupuesto aprobado vinculado al proyecto'
        },
        {
          title: 'Crear factura manual',
          description: 'Para facturar conceptos no vinculados a fases (consultoría puntual, medición adicional, modificado no presupuestado): "Herramientas > Gestión de Facturas > Nueva Factura", Selecciona cliente (se autocompletan datos fiscales), Opcionalmente vincula a proyecto para histórico, Rellena: Concepto detallado de la factura, Base imponible (honorarios sin IVA), Fecha emisión, Fecha vencimiento (calcula automático +30 días). El sistema calcula automáticamente: IVA 21% sobre base, Retención 7% sobre base, Total a cobrar.',
          note: 'Para facturas de múltiples conceptos, separa líneas con saltos de párrafo'
        },
        {
          title: 'Gestionar estados del ciclo de vida',
          description: 'Cada factura pasa por estados: BORRADOR → EMITIDA → PAGADA. Borrador: factura creada pero no enviada, permite edición completa. Emitida: factura enviada al cliente, solo permite marcar como pagada. Pagada: cobro recibido, factura cerrada. Vencida: se marca automáticamente si pasa fecha vencimiento sin estar Pagada. Cambiar estados: Emitir: cuando envíes al cliente (genera PDF final con número). Marcar Pagada: al recibir transferencia/cheque (indica fecha de cobro).',
          note: 'Las facturas Emitidas no son editables por trazabilidad fiscal'
        },
        {
          title: 'Configurar retenciones IRPF',
          description: 'Por defecto se aplica 7% retención (estándar arquitectos colegiados). Si es tu primer año de actividad, puedes aplicar 15%: Al crear factura, marca "Inicio de actividad (15%)", El cálculo se ajusta automáticamente. En los 3 primeros años de actividad profesional se aplica 7%, luego vuelve a 15% según normativa.',
          note: 'Verifica tu situación fiscal específica con tu asesor'
        },
        {
          title: 'Generar PDF profesional',
          description: 'Para cada factura: Vista Previa: muestra el PDF sin guardar, Exportar PDF: descarga archivo con formato: Factura-[Número]-[Cliente].pdf. El PDF incluye: Cabecera con tus datos fiscales (arquitecto colegiado), Datos del cliente, Número y fecha de factura, Concepto detallado vinculado a proyecto, Desglose: Base, IVA, Retención, Total, Código QR con hash de verificación (opcional).',
          note: 'Personaliza la plantilla de factura con tu logo desde Configuración'
        },
        {
          title: 'Enviar factura por email',
          description: 'Con email SMTP configurado: Haz clic en "Enviar por Email" en la factura, El sistema pre-rellena: Destinatario: email del cliente, Asunto: "Factura [Número] - [Proyecto]", Cuerpo: plantilla profesional personalizable, Adjunto: PDF de la factura automáticamente. Personaliza el mensaje si es necesario, Enviar. Registro: queda histórico en "Registro de Emails" con fecha y estado de entrega.',
          note: 'Marca la factura como Emitida tras enviar para control del estado'
        },
        {
          title: 'Controlar vencimientos y cobros',
          description: 'El Dashboard y listado de facturas destacan visualmente: Facturas vencidas (fecha superada sin pagar): en rojo, Facturas próximas a vencer (<7 días): en amarillo, Facturas pendientes de cobro: contador en Dashboard. Flujo de cobro: Ver facturas vencidas desde Dashboard → Contactar al cliente para recordatorio → Marcar como Pagada al recibir transferencia → Indicar fecha real de cobro. Histórico: conserva registro completo de emisión y cobro.',
          note: 'Exporta informe de facturas vencidas mensualmente para gestión de tesorería'
        },
        {
          title: 'Gestionar pagos parciales o a plazos',
          description: 'Para grandes honorarios fraccionados: Crea varias facturas por el mismo proyecto vinculando fases diferentes, O indica en concepto "Pago 1 de 3 de Proyecto Básico", Marca cada fracción como Pagada conforme cobres. Alternativa: una factura grande con anotación de fechas de cobro parcial en observaciones.',
          note: 'Documenta acuerdos de pago fraccionado en el contrato del proyecto'
        },
        {
          title: 'Exportar histórico fiscal',
          description: 'Al cierre de ejercicio fiscal: "Exportar Facturas" con filtro por año fiscal, Descarga CSV/Excel con: Todas las facturas emitidas, Bases imponibles totales, IVA repercutido total, Retenciones practicadas, Estado de cobro de cada una. Entrega a tu asesor fiscal para declaraciones trimestrales y anual.',
          note: 'Exporta trimestralmente para IVA e IRPF además del cierre anual'
        }
      ],
      tips: [
        'Configura el email SMTP antes de emitir tu primera factura para envío automático',
        'Revisa facturas vencidas cada lunes para gestión proactiva de cobros',
        'Usa borradores para preparar facturas con días de antelación a la emisión',
        'Vincula siempre las facturas al proyecto correspondiente para trazabilidad',
        'Numera facturas sin huecos (la numeración automática garantiza esto)',
        'Conserva PDFs de todas las facturas emitidas mínimo 5 años (obligación fiscal)',
        'Marca como Pagada el mismo día que recibes el cobro para control de tesorería',
        'Usa el campo concepto para detallar exactamente qué se está facturando',
        'Exporta listados trimestralmente para tu asesor fiscal (IVA, IRPF)',
        'Personaliza la plantilla de email de envío para tono profesional y corporativo',
        'Para grandes facturas, envía email adicional de cortesía avisando del envío',
        'Genera factura inmediatamente al completar fase para evitar olvidos',
        'Revisa que los datos fiscales del cliente sean correctos antes de emitir',
        'Guarda comprobantes de transferencias bancarias vinculados a cada factura pagada',
        'Usa la fecha de vencimiento para negociar plazos según liquidez del cliente'
      ],
      warnings: [
        'Las facturas emitidas no son editables ni eliminables por normativa fiscal',
        'La numeración debe ser correlativa sin huecos (el sistema lo garantiza)',
        'Conserva facturas y justificantes mínimo 5 años por inspecciones de Hacienda',
        'No emitas facturas sin tener configurados correctamente tus datos fiscales',
        'Los porcentajes de IVA y retención deben ser los legales vigentes (consulta asesor)',
        'No modifiques facturas ya enviadas al cliente, emite rectificativa si necesario',
        'Verifica que el NIF del cliente es correcto antes de emitir',
        'Las facturas a empresas requieren CIF correcto y razón social exacta',
        'Documenta siempre la causa de facturas rectificativas o anulaciones',
        'No uses la aplicación para facturas de otros profesionales o actividades'
      ]
    }
  },
  {
    id: 'budgets',
    title: 'Presupuestos',
    icon: Bank,
    category: 'business',
    content: {
      description: 'Gestión de presupuestos con base de datos de precios, importación BC3 y cálculo automático de honorarios.',
      features: [
        'Importación de archivos BC3 estándar',
        'Base de datos de precios de construcción',
        'Cálculo automático de PEM (Presupuesto de Ejecución Material)',
        'Generación de partidas por capítulos',
        'Estados: Borrador, Enviado, Aprobado, Rechazado',
        'Vinculación con proyectos',
        'Cálculo de honorarios según porcentajes'
      ],
      steps: [
        {
          title: 'Crear presupuesto',
          description: 'Desde la pestaña Presupuestos del proyecto, crea un nuevo presupuesto'
        },
        {
          title: 'Importar BC3 (opcional)',
          description: 'Si tienes un archivo BC3 de Presto u otro programa, impórtalo directamente'
        },
        {
          title: 'Añadir partidas',
          description: 'Usa la base de datos de precios o crea partidas personalizadas'
        },
        {
          title: 'Aprobar presupuesto',
          description: 'Marca como aprobado cuando el cliente acepte. Esto activa la facturación automática'
        }
      ],
      tips: [
        'Vincula el presupuesto al proyecto para facturación automática',
        'Usa la base de datos de precios para acelerar la creación'
      ]
    }
  },
  {
    id: 'visas',
    title: 'Visados',
    icon: Stamp,
    category: 'administrative',
    content: {
      description: 'Sistema de gestión de visados colegiales con seguimiento de solicitudes, documentación y estados.',
      features: [
        'Gestión de solicitudes de visado',
        'Checklist de documentación requerida',
        'Estados: Preparación, Solicitado, En revisión, Aprobado, Denegado',
        'Vinculación con proyectos',
        'Cálculo de tasas',
        'Seguimiento de tiempos'
      ],
      steps: [
        {
          title: 'Crear solicitud',
          description: 'Desde Herramientas > Visados, crea una nueva solicitud vinculada a un proyecto'
        },
        {
          title: 'Completar checklist',
          description: 'Verifica que tienes toda la documentación requerida'
        },
        {
          title: 'Enviar solicitud',
          description: 'Marca como solicitada cuando envíes al colegio'
        },
        {
          title: 'Actualizar estado',
          description: 'Mantén actualizado el estado según las respuestas del colegio'
        }
      ]
    }
  },
  {
    id: 'approvals',
    title: 'Flujos de Aprobación',
    icon: CheckCircle,
    category: 'documents',
    content: {
      description: 'Sistema de flujos de aprobación personalizables para revisión y firma de documentos con múltiples participantes.',
      features: [
        'Flujos secuenciales y paralelos',
        'Plantillas de flujo reutilizables',
        'Estados: Pendiente, En revisión, Aprobado, Rechazado',
        'Seguimiento de aprobadores',
        'Notificaciones por email',
        'Historial completo de decisiones',
        'Integración con firma digital'
      ],
      steps: [
        {
          title: 'Crear plantilla de flujo',
          description: 'Define un flujo reutilizable (ej: "Revisión Proyecto Básico") con los pasos y aprobadores',
          note: 'Los flujos pueden ser secuenciales (uno tras otro) o paralelos (simultáneos)'
        },
        {
          title: 'Iniciar flujo para documento',
          description: 'Selecciona un documento y aplica una plantilla de flujo'
        },
        {
          title: 'Seguimiento',
          description: 'Monitorea el estado de cada aprobación y recibe notificaciones'
        },
        {
          title: 'Gestionar excepciones',
          description: 'Si un aprobador rechaza, el flujo se detiene y puedes reiniciarlo tras corregir'
        }
      ],
      tips: [
        'Crea plantillas para flujos recurrentes (visados, entrega a clientes)',
        'Usa flujos paralelos cuando la aprobación sea independiente entre aprobadores'
      ]
    }
  },
  {
    id: 'signature',
    title: 'Firma Digital Cualificada',
    icon: ShieldCheck,
    category: 'documents',
    content: {
      description: 'La integración con servicios de firma electrónica cualificada permite firmar documentos con plena validez legal equivalente a la firma manuscrita según el Reglamento eIDAS (UE) 910/2014 y Ley 6/2020. El sistema conecta con plataformas certificadas como Cl@ve (Administración Pública) y ViafirmaPro (privado) para gestionar todo el ciclo: solicitud de firma, notificación a firmantes, seguimiento de estados, y descarga de documentos firmados con certificado digital incrustado que garantiza autenticidad, integridad y no repudio.',
      features: [
        'Firma electrónica cualificada según Reglamento eIDAS con validez legal plena',
        'Integración con Cl@ve (sistema de identificación de la Administración Pública española)',
        'Integración con ViafirmaPro y otros proveedores certificados',
        'Soporte de firma simple, avanzada y cualificada según nivel de seguridad requerido',
        'Gestión centralizada de proveedores de firma con credenciales cifradas',
        'Creación de solicitudes de firma para uno o múltiples firmantes secuenciales o paralelos',
        'Notificación automática por email a cada firmante con enlace seguro y código de verificación',
        'Seguimiento en tiempo real del estado de cada firma (Pendiente, Firmado, Rechazado)',
        'Validación automática de certificados digitales antes de firmar',
        'Almacenamiento seguro de documentos firmados con certificado digital incrustado',
        'Verificación de firma para comprobar autenticidad de documentos recibidos',
        'Histórico completo de solicitudes con fechas y acciones de cada participante',
        'Soporte para firma en cascada (secuencial): arquitecto → ingeniero → cliente',
        'Soporte para firma paralela: múltiples firmantes independientes simultáneos',
        'Recordatorios automáticos a firmantes pendientes',
        'Certificado de firma con detalles del firmante (nombre, NIF, fecha, hora exacta)'
      ],
      steps: [
        {
          title: 'Configurar proveedor de firma',
          description: 'Antes de poder solicitar firmas, configura el proveedor: "Herramientas > Proveedores de Firma Cualificada > Añadir Proveedor", Selecciona tipo: Cl@ve: requiere certificado digital en tarjeta/DNIe, URL del servicio de la administración, ViafirmaPro: requiere cuenta activa, API Key proporcionada por Viafirma, Secret Key para autenticación. Introduce credenciales (se almacenan cifradas), Prueba la conexión antes de guardar.',
          note: 'Las credenciales son sensibles, no las compartas. Para Cl@ve necesitas certificado digital de arquitecto colegiado.'
        },
        {
          title: 'Preparar documento para firma',
          description: 'El documento debe estar en formato PDF finalizado. No se pueden firmar borradores o documentos en edición. Verifica: Contenido completo y revisado, Nomenclatura y versión correctas (debe ser versión C compartida), Metadatos del documento correctos, Permisos de lectura para los firmantes.',
          note: 'Una vez iniciado el proceso de firma, el documento no puede modificarse'
        },
        {
          title: 'Crear solicitud de firma',
          description: 'Desde el documento: "Solicitar Firma Cualificada", Configurar solicitud: Tipo de firma: Simple (email), Avanzada (certificado), Cualificada (máxima seguridad). Modo: Secuencial (orden estricto), Paralelo (todos a la vez). Firmantes: Añadir cada firmante: Nombre completo, Email, NIF/CIF (para validación), Rol (Autor, Revisor, Aprobador, Cliente). Orden de firma (si secuencial): 1. Arquitecto autor, 2. Ingeniero/Coautor, 3. Cliente/Promotor. Mensaje personalizado para los firmantes, Fecha límite de firma (opcional).',
          note: 'En firma secuencial, cada firmante solo puede firmar tras el anterior'
        },
        {
          title: 'Enviar notificaciones a firmantes',
          description: 'Al crear la solicitud, el sistema envía automáticamente emails a: Primer firmante (si secuencial) o Todos (si paralelo). El email contiene: Identificación del documento, Enlace seguro al portal de firma, Código de verificación de un solo uso, Instrucciones paso a paso, Fecha límite si se configuró. Los firmantes acceden al portal con el enlace y su certificado digital.',
          note: 'Los enlaces de firma expiran tras 48 horas por seguridad'
        },
        {
          title: 'Monitorear estado de firmas',
          description: '"Herramientas > Solicitudes de Firma" muestra todas las solicitudes activas: Estado global: Pendiente, Parcial, Completada, Rechazada. Por cada firmante: Estado individual: No iniciado, Abierto (leyendo), Firmado, Rechazado. Fecha y hora de cada acción. Motivo si rechazó. Opciones: Reenviar notificación si no ha respondido, Cancelar solicitud si es necesario, Descargar documento parcialmente firmado.',
          note: 'Los firmantes reciben recordatorio automático a las 48h si no firman'
        },
        {
          title: 'Proceso de firma del firmante',
          description: 'Cuando un firmante recibe la notificación: Hace clic en el enlace seguro, Introduce código de verificación del email, Visualiza el PDF completo del documento, Si está conforme: Selecciona su certificado digital (DNIe, FNMT, empresa), Introduce PIN del certificado, Confirma firma. El sistema: Valida el certificado (vigencia, revocación), Incrusta la firma en el PDF, Registra fecha/hora con sello de tiempo, Notifica al siguiente firmante (si secuencial) o al solicitante (si todos completaron).',
          note: 'El firmante puede rechazar indicando motivo en lugar de firmar'
        },
        {
          title: 'Descargar documento firmado',
          description: 'Una vez todas las firmas completadas: La solicitud pasa a estado "Completada", Aparece botón "Descargar Documento Firmado", El PDF descargado contiene: Documento original intacto, Firmas digitales de todos los firmantes incrustadas, Certificados digitales completos, Sellos de tiempo de cada firma, Código de verificación de autenticidad. Este PDF es el documento oficial con validez legal plena.',
          note: 'Guarda este PDF firmado como el documento oficial del proyecto'
        },
        {
          title: 'Verificar autenticidad de documentos firmados',
          description: 'Para verificar un PDF firmado recibido: "Herramientas > Verificar Firma Digital", Sube el PDF firmado, El sistema comprueba: Validez de cada certificado (no caducado, no revocado), Integridad (documento no modificado tras firma), Datos de cada firmante (nombre, NIF, entidad emisora del certificado), Fecha y hora exacta de cada firma. Muestra resultado: Válido, Inválido, o Advertencias.',
          note: 'Adobe Acrobat y otros lectores PDF también muestran el estado de las firmas'
        },
        {
          title: 'Gestionar situaciones especiales',
          description: 'Rechazo de firma: Si un firmante rechaza, la solicitud se detiene. Revisa el motivo, Corrige el documento si es necesario, Crea nueva solicitud de firma. Expiración de solicitud: Si pasa la fecha límite sin completar, Reenvía recordatorio o Crea nueva solicitud con plazo extendido. Cambio de firmante: No es posible cambiar firmantes en solicitud activa, Cancela solicitud, Crea nueva con firmantes correctos.',
          note: 'Cada solicitud es inmutable una vez iniciada por trazabilidad legal'
        }
      ],
      tips: [
        'Usa firma cualificada solo para documentos oficiales (proyectos, contratos, actas)',
        'Para documentos internos de trabajo, usa flujos de aprobación sin firma cualificada',
        'Combina flujos de aprobación (revisión) + firma cualificada (oficial) para proceso completo',
        'Define orden de firma lógico: primero autores técnicos, último cliente/promotor',
        'Incluye instrucciones claras en el mensaje a firmantes sobre qué están firmando',
        'Verifica que los firmantes tienen certificado digital antes de enviar solicitud',
        'Para proyectos con múltiples técnicos, usa firma secuencial para control de orden',
        'Conserva documentos firmados mínimo 10 años como evidencia legal',
        'Haz backup de PDFs firmados en ubicación segura separada de la aplicación',
        'Para proyectos visados, primero firma interna y luego tramitación de visado oficial',
        'Usa el campo "Rol" en firmantes para claridad (Arquitecto, Ingeniero, Cliente)',
        'Si un firmante no tiene certificado, ofrece firma presencial tradicional en su lugar',
        'Documenta motivos de rechazo para mejorar documentos en futuras versiones',
        'Verifica siempre los PDFs firmados descargados antes de considerarlos oficiales',
        'Para contratos importantes, usa notificación fehaciente además de firma digital'
      ],
      warnings: [
        'Las firmas electrónicas cualificadas tienen VALIDEZ LEGAL PLENA equivalente a firma manuscrita',
        'Asegúrate de que firmantes tengan certificados digitales válidos y vigentes',
        'Conserva documentos firmados como evidencia legal mínimo 10 años',
        'No modifiques PDFs después de solicitar firma, invalida las firmas existentes',
        'Las credenciales de proveedores de firma son sensibles, protégelas adecuadamente',
        'Verifica identidad real de firmantes antes de incluirlos en solicitud',
        'Los certificados digitales caducan, verifica vigencia antes de solicitar firma',
        'No uses firma digital para documentos con información no definitiva o borrador',
        'La firma de un documento compromete legalmente al firmante con su contenido',
        'Los documentos firmados son evidencia legal admisible en procedimientos judiciales',
        'Cumple RGPD al solicitar firmas: informa uso de datos y obtén consentimiento',
        'No compartas enlaces de firma de otros firmantes, son personales e intransferibles',
        'Los rechazos de firma quedan registrados como evidencia de desacuerdo'
      ]
    }
  },
  {
    id: 'permits',
    title: 'Licencias y Permisos',
    icon: Clipboard,
    category: 'administrative',
    content: {
      description: 'Gestión de trámites administrativos municipales con seguimiento de licencias, permisos y documentación.',
      features: [
        'Tipos: Obra mayor, obra menor, primera ocupación, actividad, otros',
        'Estados: Preparación, Presentado, En tramitación, Aprobado, Denegado',
        'Checklist de documentación municipal',
        'Integración con normativa urbanística',
        'Generación de documentos administrativos',
        'Consulta de normativas PGOU'
      ],
      steps: [
        {
          title: 'Iniciar tramitación',
          description: 'Desde Herramientas > Licencias Municipales, crea la solicitud del tipo de permiso'
        },
        {
          title: 'Completar documentación',
          description: 'Verifica el checklist y prepara todos los documentos requeridos'
        },
        {
          title: 'Presentar telemáticamente',
          description: 'Usa los datos del municipio para presentar en sede electrónica'
        },
        {
          title: 'Seguimiento',
          description: 'Actualiza el estado según avance el expediente administrativo'
        }
      ]
    }
  },
  {
    id: 'calendar',
    title: 'Calendario',
    icon: CalendarBlank,
    category: 'general',
    content: {
      description: 'Vista de calendario con todos los hitos, fechas de entrega y eventos importantes de tus proyectos.',
      features: [
        'Vista mensual de todos los proyectos',
        'Hitos de proyecto destacados',
        'Fechas de vencimiento de facturas',
        'Código de colores por tipo de evento',
        'Navegación por meses'
      ],
      steps: [
        {
          title: 'Ver eventos',
          description: 'Accede desde el menú principal al Calendario'
        },
        {
          title: 'Filtrar',
          description: 'Los eventos se colorean según tipo: hitos, facturas, visados'
        }
      ]
    }
  },
  {
    id: 'import-export',
    title: 'Importación/Exportación',
    icon: FolderOpen,
    category: 'tools',
    content: {
      description: 'Herramientas de importación y exportación masiva para migración, backup y análisis de datos.',
      features: [
        'Importación de proyectos desde carpetas',
        'Importación múltiple batch',
        'Exportación de proyectos con documentos',
        'Exportación masiva en ZIP',
        'Preservación de estructura de carpetas',
        'Metadatos incluidos'
      ],
      steps: [
        {
          title: 'Importar proyecto individual',
          description: 'Usa Herramientas > Importar Proyecto y sigue el wizard de 3 pasos'
        },
        {
          title: 'Importación múltiple',
          description: 'Para migrar muchos proyectos, usa Importación Múltiple y selecciona varias carpetas'
        },
        {
          title: 'Exportar proyectos',
          description: 'Selecciona proyectos y expórtalos en formato ZIP con toda la documentación'
        }
      ],
      tips: [
        'Exporta proyectos regularmente como backup',
        'Usa importación múltiple para migrar desde otros sistemas'
      ]
    }
  },
  {
    id: 'email',
    title: 'Configuración de Email',
    icon: PaperPlaneTilt,
    category: 'tools',
    content: {
      description: 'Sistema de envío de emails para facturas, documentos e informes directamente desde la aplicación.',
      features: [
        'Configuración SMTP personalizada',
        'Plantillas de email personalizables',
        'Adjuntos automáticos de PDFs',
        'Registro de emails enviados',
        'Estados de entrega'
      ],
      steps: [
        {
          title: 'Configurar SMTP',
          description: 'Ve a Herramientas > Configurar Email e introduce tu servidor SMTP, usuario y contraseña',
          note: 'Puedes usar Gmail, Outlook u otro proveedor'
        },
        {
          title: 'Probar configuración',
          description: 'Envía un email de prueba para verificar que funciona'
        },
        {
          title: 'Enviar documentos',
          description: 'Desde cualquier documento o factura, usa el botón de envío por email'
        },
        {
          title: 'Revisar registros',
          description: 'Consulta el historial de emails enviados desde Registro de Emails'
        }
      ],
      warnings: [
        'No compartas tus credenciales SMTP',
        'Usa contraseñas de aplicación para mayor seguridad'
      ]
    }
  },
  {
    id: 'ai-features',
    title: 'Funciones de IA',
    icon: Sparkle,
    category: 'tools',
    content: {
      description: 'La aplicación integra inteligencia artificial en múltiples módulos para asistencia y automatización.',
      features: [
        'Asistente regulatorio (CTE, RITE, REBT)',
        'Generación de contenido de documentos',
        'Análisis de cumplimiento normativo',
        'Sugerencias de partidas presupuestarias',
        'Respuestas con referencias exactas'
      ],
      steps: [
        {
          title: 'Consultar normativas',
          description: 'Usa el Asistente IA Regulatorio para hacer preguntas en lenguaje natural'
        },
        {
          title: 'Generar documentos',
          description: 'Al crear documentos desde plantillas, la IA genera contenido contextual'
        },
        {
          title: 'Verificar cumplimiento',
          description: 'El checklist usa IA para filtrar requisitos aplicables según tu edificio'
        }
      ],
      tips: [
        'Sé específico en tus consultas para respuestas más precisas',
        'Revisa siempre el contenido generado por IA antes de usar oficialmente',
        'Las respuestas incluyen referencias normativas exactas'
      ]
    }
  },
  {
    id: 'stakeholders',
    title: 'Intervinientes',
    icon: UsersThree,
    category: 'business',
    content: {
      description: 'Base de datos centralizada de profesionales (arquitectos, ingenieros, aparejadores) reutilizable en proyectos.',
      features: [
        'Tipos: Arquitecto, Arquitecto técnico, Ingeniero, Promotor, Constructor',
        'Datos colegiales: número de colegiado, cualificación',
        'Datos de contacto completos',
        'Reutilización en múltiples proyectos'
      ],
      steps: [
        {
          title: 'Crear interviniente',
          description: 'Desde Herramientas > Intervinientes, añade el profesional con todos sus datos'
        },
        {
          title: 'Asignar a proyectos',
          description: 'Al crear o editar un proyecto, selecciona intervinientes de tu base de datos'
        },
        {
          title: 'Actualizar datos',
          description: 'Si cambias datos de un interviniente, se actualizan en todos los proyectos'
        }
      ]
    }
  },
  {
    id: 'templates',
    title: 'Plantillas de Documentos',
    icon: FileText,
    category: 'documents',
    content: {
      description: 'Biblioteca de plantillas profesionales personalizables para generación rápida de documentos técnicos.',
      features: [
        '8+ plantillas predefinidas: Memoria, Anexo cálculo, Pliego condiciones, Estudio seguridad, etc.',
        'Pre-rellenado con datos del proyecto',
        'Generación de contenido con IA',
        'Personalización de secciones',
        'Guardado de plantillas personalizadas'
      ],
      steps: [
        {
          title: 'Acceder a plantillas',
          description: 'Desde Herramientas > Plantillas de Documentos'
        },
        {
          title: 'Seleccionar plantilla',
          description: 'Elige una plantilla base según el documento que necesitas'
        },
        {
          title: 'Personalizar',
          description: 'Edita secciones, usa variables del proyecto y genera contenido con IA'
        },
        {
          title: 'Guardar',
          description: 'Guarda como plantilla personalizada para reutilizar en futuros proyectos'
        }
      ]
    }
  },
  {
    id: 'use-cases',
    title: 'Casos de Uso Prácticos',
    icon: Lightbulb,
    category: 'general',
    content: {
      description: 'Ejemplos reales de flujos de trabajo completos en AFO CORE MANAGER para situaciones típicas del ejercicio profesional. Estos casos ilustran cómo combinar múltiples módulos de la aplicación para gestionar proyectos desde el contacto inicial con el cliente hasta la entrega final y cobro.',
      steps: [
        {
          title: 'CASO 1: Proyecto de Vivienda Unifamiliar Completo',
          description: 'SITUACIÓN: Un particular te contacta para proyectar su vivienda unifamiliar de 180m². PROCESO: 1) Crear cliente en Herramientas > Clientes con datos completos (NIF, dirección, email). 2) Crear proyecto "Vivienda Unifamiliar - C/ Mayor 15" vinculando al cliente. 3) Configurar fases: Estudio Previo 10%, Básico 30%, Ejecución 40%, Dirección Obra 20%. 4) Añadir intervinientes: tú como arquitecto, ingeniero de estructuras. 5) Crear presupuesto estimado PEM 250.000€, calcular honorarios 6% = 15.000€. 6) En Documentos, generar memoria descriptiva con IA usando plantilla. 7) Subir planos conforme avanzas (nomenclatura ARQ-PlantaBaja-P01). 8) Completar checklist CTE en pestaña Cumplimiento. 9) Al terminar fase Básico, marcas completada → sistema genera factura automática 4.500€ (30% de 15.000€). 10) Envías factura por email al cliente. 11) Cliente aprueba, solicitas visado desde Herramientas > Visados. 12) Continúas con Proyecto Ejecución, repites ciclo de facturación por fase.',
          note: 'Este caso completo puede gestionarse enteramente desde AFO CORE sin herramientas externas'
        },
        {
          title: 'CASO 2: Modificado de Proyecto con Facturación Adicional',
          description: 'SITUACIÓN: Cliente de proyecto en ejecución solicita modificación importante (ampliación 30m²). PROCESO: 1) En el proyecto existente, añadir nueva fase "Modificado nº1 - Ampliación" con porcentaje adicional. 2) Crear nuevo presupuesto del modificado (solo el coste adicional). 3) Generar documentos del modificado (Memoria Modificado, Planos Reforma). 4) Usar control de versiones: Planos originales conservados, nuevas versiones P01, P02 del modificado. 5) Crear checklist de cumplimiento específico del modificado. 6) Al aprobar cliente, completar fase del modificado → factura automática del importe adicional. 7) Todo queda documentado en el mismo proyecto para trazabilidad completa.',
          note: 'Los modificados se gestionan como fases adicionales del proyecto original'
        },
        {
          title: 'CASO 3: Proyecto con Múltiples Técnicos y Flujo de Aprobación',
          description: 'SITUACIÓN: Edificio de oficinas con equipo técnico (arquitecto, ingeniero estructuras, ingeniero instalaciones, aparejador). PROCESO: 1) Crear proyecto y añadir todos los intervinientes desde tu base de datos. 2) Crear plantilla de flujo de aprobación "Revisión Documentación Oficial": Paso 1 Arquitecto (tú), Paso 2 Ingeniero Estructuras (revisa EST), Paso 3 Ingeniero Instalaciones (revisa INS), Paso 4 Aparejador (verificación general). 3) Al finalizar cada documento técnico (Memoria Estructuras, Cálculos), subirlo y aplicar el flujo. 4) Cada técnico recibe notificación, revisa documento, aprueba o solicita cambios. 5) Tras aprobaciones internas, crear solicitud de firma digital cualificada secuencial: Arquitecto → Ingeniero Estructuras → Ingeniero Instalaciones. 6) Documento final firmado por todos para tramitación de licencia municipal.',
          note: 'Los flujos de aprobación + firma digital profesionalizan la coordinación entre técnicos'
        },
        {
          title: 'CASO 4: Importación de Proyecto Existente y Organización',
          description: 'SITUACIÓN: Tienes un proyecto en marcha en carpetas de tu ordenador y quieres migrarlo a AFO CORE. PROCESO: 1) Herramientas > Importar Proyecto. 2) Seleccionar carpeta raíz del proyecto con todos los archivos. 3) El sistema analiza la estructura, detecta documentos (PDF, DWG, DOC). 4) Asignar nombre de proyecto, ubicación, cliente. 5) El wizard organiza documentos por disciplina automáticamente según nombres de archivo. 6) Revisar y ajustar organización en carpetas. 7) Confirmar importación → proyecto completo en AFO CORE con estructura profesional. 8) Complementar con datos adicionales: fases, presupuesto, intervinientes.',
          note: 'Usa importación múltiple para migrar varios proyectos a la vez desde otros sistemas'
        },
        {
          title: 'CASO 5: Gestión de Licencia Municipal con Documentación',
          description: 'SITUACIÓN: Proyecto básico aprobado, necesitas tramitar licencia de obra mayor. PROCESO: 1) En el proyecto, pestaña Licencias > Nueva Licencia Municipal. 2) Tipo: Obra Mayor. 3) El sistema genera checklist de documentación municipal requerida: Proyecto Básico firmado y visado, Estudio Geotécnico, Estudio Gestión Residuos, Estudio Seguridad y Salud, Ficha estadística. 4) Vas marcando cada documento conforme lo preparas y adjuntas. 5) Generar solicitud de licencia con datos del proyecto pre-rellenados. 6) Usar firma cualificada para firmar la solicitud. 7) Presentar telemáticamente en sede electrónica del ayuntamiento. 8) En AFO CORE, marcar estado "Presentado" con fecha y número de expediente. 9) Actualizar estado según avance tramitación (En Revisión, Requerimiento, Aprobado). 10) Al conceder licencia, adjuntar resolución municipal.',
          note: 'Toda la trazabilidad de trámites queda registrada para consultas futuras'
        },
        {
          title: 'CASO 6: Cierre de Ejercicio Fiscal',
          description: 'SITUACIÓN: Fin de año, necesitas preparar datos para tu asesor fiscal. PROCESO: 1) Dashboard > revisar métricas anuales (ingresos, facturas pendientes). 2) Gestión de Facturas > Filtrar por año fiscal 2024. 3) Verificar que todas las facturas emitidas están en estado correcto (Emitida o Pagada). 4) Exportar listado completo a CSV/Excel con: Número factura, Fecha emisión, Cliente, Base imponible, IVA repercutido, Retención IRPF, Total facturado, Estado de cobro. 5) Exportar facturas vencidas no cobradas para gestión de impagados. 6) Exportar proyectos completados en el año para histórico. 7) Entregar CSV al asesor para declaraciones trimestrales (303 IVA, 130 IRPF) y anual (Renta). 8) Archivar proyectos finalizados para comenzar año siguiente con vista limpia.',
          note: 'Mantén este proceso trimestral para facilitar declaraciones periódicas'
        }
      ],
      tips: [
        'Estudia estos casos para entender cómo combinar módulos de forma efectiva',
        'Adapta los flujos a tu forma de trabajo específica',
        'Crea tus propias plantillas de flujo basadas en estos ejemplos',
        'Documenta tu propio flujo de trabajo personalizado en observaciones',
        'Usa estos casos como formación para colaboradores del estudio'
      ]
    }
  },
  {
    id: 'troubleshooting',
    title: 'Solución de Problemas',
    icon: Warning,
    category: 'general',
    content: {
      description: 'Guía de resolución de problemas comunes y errores frecuentes en AFO CORE MANAGER. Incluye síntomas, causas y soluciones paso a paso.',
      steps: [
        {
          title: 'PROBLEMA: No se genera factura automática al completar fase',
          description: 'SÍNTOMAS: Marcas fase como completada pero no aparece diálogo de factura. CAUSAS POSIBLES: 1) No hay cliente vinculado al proyecto. 2) No hay presupuesto aprobado. 3) La fase no tiene porcentaje de facturación asignado. SOLUCIÓN: Verifica en el proyecto: Cliente vinculado (debe aparecer en datos del proyecto), Presupuestos (debe haber uno en estado Aprobado), Fases (cada fase debe tener % asignado y sumar 100%). Corrige los datos faltantes y vuelve a marcar la fase como completada.',
          note: 'La facturación automática requiere los tres elementos: cliente, presupuesto aprobado, y fase con porcentaje'
        },
        {
          title: 'PROBLEMA: Error al enviar email (facturas, documentos, informes)',
          description: 'SÍNTOMAS: Al intentar enviar email, aparece error "No se pudo enviar". CAUSAS: 1) Email SMTP no configurado. 2) Credenciales SMTP incorrectas. 3) Servidor SMTP bloqueando la aplicación. SOLUCIÓN: Herramientas > Configurar Email, verificar: Servidor SMTP correcto (ej: smtp.gmail.com), Puerto correcto (Gmail: 587 TLS), Usuario (email completo), Contraseña (usar contraseña de aplicación, no contraseña principal). Para Gmail: Generar contraseña de aplicación en Google Account > Security > App Passwords. Probar configuración con botón "Enviar Test". Si persiste, verificar que servidor no bloquea aplicaciones de terceros.',
          note: 'Usar siempre contraseñas de aplicación específicas, no contraseñas principales'
        },
        {
          title: 'PROBLEMA: Documentos no aparecen en búsqueda',
          description: 'SÍNTOMAS: Has subido documentos pero no se encuentran al buscar. CAUSAS: 1) Documentos en carpeta no visible en filtros activos. 2) Nombre de búsqueda no coincide exactamente. 3) Documento marcado como oculto o borrador. SOLUCIÓN: Limpiar todos los filtros (disciplina, tipo, estado), Buscar por partes del nombre (no texto completo), Verificar que estás en el proyecto correcto, Revisar carpetas con navegador de estructura. Si documento está oculto, cambiar estado a "Activo".',
          note: 'La búsqueda es sensible a acentos pero no mayúsculas'
        },
        {
          title: 'PROBLEMA: Flujo de aprobación bloqueado',
          description: 'SÍNTOMAS: Flujo de aprobación no avanza al siguiente aprobador. CAUSAS: 1) Aprobador actual no ha completado su revisión. 2) Aprobador rechazó documento. 3) Email de notificación no llegó al aprobador. SOLUCIÓN: Herramientas > Flujos de Aprobación > [Tu flujo], Ver estado detallado de cada aprobador. Si pendiente: reenviar notificación. Si rechazado: ver motivo, corregir documento, reiniciar flujo desde inicio. Si bloqueado técnicamente: cancelar flujo, crear nuevo con mismos aprobadores.',
          note: 'Los aprobadores deben hacer clic en el enlace del email y confirmar aprobación'
        },
        {
          title: 'PROBLEMA: Error en solicitud de firma digital',
          description: 'SÍNTOMAS: Solicitud de firma falla o firmante no puede firmar. CAUSAS: 1) Proveedor de firma no configurado correctamente. 2) Certificado digital del firmante caducado o revocado. 3) PDF del documento corrupto o protegido. SOLUCIÓN: Verificar configuración del proveedor (Cl@ve / ViafirmaPro), Confirmar que firmante tiene certificado digital válido y vigente, Verificar que PDF no tiene contraseña ni restricciones, Regenerar PDF del documento limpio, Crear nueva solicitud de firma. Contactar soporte del proveedor si persiste.',
          note: 'Los certificados digitales caducan anualmente, verificar vigencia'
        },
        {
          title: 'PROBLEMA: Presupuesto BC3 no se importa correctamente',
          description: 'SÍNTOMAS: Al importar BC3, faltan partidas o precios incorrectos. CAUSAS: 1) Archivo BC3 corrupto o versión no soportada. 2) Codificación de caracteres incorrecta (acentos). 3) Estructura del BC3 no estándar. SOLUCIÓN: Verificar que archivo BC3 es válido (abrir en Presto para comprobar), Exportar BC3 desde Presto con codificación UTF-8, Si faltan partidas, importar nuevamente o añadir manualmente las faltantes, Para BC3 complejos con muchas partidas, simplificar antes de importar.',
          note: 'AFO CORE soporta BC3 estándar, algunas personalizaciones de Presto pueden no importarse'
        },
        {
          title: 'PROBLEMA: Pérdida de datos o proyecto desaparecido',
          description: 'SÍNTOMAS: Proyecto o datos que existían ya no aparecen. CAUSAS: 1) Navegador limpió datos locales (cookies, cache). 2) Proyecto archivado (no eliminado). 3) Usar navegador diferente o modo incógnito. SOLUCIÓN PREVENTIVA: Exportar proyectos regularmente como backup ZIP, No usar modo incógnito del navegador, Usar siempre el mismo navegador. RECUPERACIÓN: Verificar filtros (Todos/Activos/Archivados), Buscar proyecto por nombre en buscador, Si usaste otro navegador, buscar ahí, Si perdiste datos sin backup, no hay recuperación (datos locales).',
          note: 'CRÍTICO: Exporta proyectos mensualmente como medida de seguridad'
        },
        {
          title: 'PROBLEMA: Checklist de cumplimiento CTE no muestra requisitos',
          description: 'SÍNTOMAS: Checklist aparece vacío o con muy pocos requisitos. CAUSAS: 1) No se configuró tipología del edificio en el proyecto. 2) Filtros de uso aplicados. SOLUCIÓN: Editar proyecto > Uso del edificio (Residencial, Oficinas, Comercial, etc.), Guardar cambios, Recargar pestaña de Cumplimiento. El checklist se filtra automáticamente según el uso. Si sigue vacío, contactar soporte.',
          note: 'El checklist CTE es dinámico según la tipología del edificio'
        }
      ],
      tips: [
        'Antes de reportar un error, verifica la configuración básica (email, cliente, presupuesto)',
        'Exporta proyectos antes de hacer cambios importantes por si necesitas revertir',
        'Usa siempre el mismo navegador para evitar problemas de sincronización',
        'Mantén backups regulares mediante exportación de proyectos',
        'Si un problema persiste, intenta reproducirlo en modo incógnito para aislar la causa'
      ]
    }
  },
  {
    id: 'faq',
    title: 'Preguntas Frecuentes (FAQ)',
    icon: Question,
    category: 'general',
    content: {
      description: 'Respuestas a las preguntas más comunes sobre AFO CORE MANAGER.',
      steps: [
        {
          title: '¿Dónde se almacenan mis datos?',
          description: 'Los datos se almacenan localmente en tu navegador usando tecnología IndexedDB. Esto significa: Tus datos NO se envían a servidores externos, Todo permanece en tu ordenador con máxima privacidad, Los datos persisten entre sesiones del navegador, Puedes trabajar offline sin conexión a internet (excepto funciones de email y firma digital).',
          note: 'IMPORTANTE: Haz backups regulares exportando proyectos porque datos locales pueden perderse si limpias cache del navegador'
        },
        {
          title: '¿Puedo usar AFO CORE en varios ordenadores?',
          description: 'Los datos son locales a cada navegador/ordenador. Para trabajar en múltiples equipos: OPCIÓN 1: Exporta proyectos desde un equipo e impórtalos en el otro (manual). OPCIÓN 2: Usa siempre el mismo ordenador/navegador. OPCIÓN 3: Exporta semanalmente y guarda ZIPs en cloud (Drive, Dropbox) accesible desde ambos equipos.',
          note: 'Actualmente no hay sincronización automática entre dispositivos'
        },
        {
          title: '¿Es legal usar firmas digitales generadas en AFO CORE?',
          description: 'SÍ, completamente legal. AFO CORE integra con servicios certificados (Cl@ve, ViafirmaPro) que cumplen: Reglamento eIDAS (UE) 910/2014, Ley 6/2020 de Servicios de Confianza española. Las firmas cualificadas tienen VALIDEZ LEGAL PLENA equivalente a firma manuscrita para: Contratos, Proyectos técnicos, Documentos administrativos, Actas. Son admisibles como prueba en procedimientos judiciales.',
          note: 'Conserva documentos firmados mínimo 10 años como evidencia legal'
        },
        {
          title: '¿Puedo facturar con AFO CORE cumpliendo normativa fiscal?',
          description: 'SÍ. El sistema de facturación cumple requisitos: Numeración correlativa sin huecos (automática), Datos fiscales completos (emisor y receptor), Fecha de emisión y vencimiento, Desglose: Base, IVA 21%, Retención IRPF 7%, Conservación de facturas emitidas (export PDF). El sistema NO presenta facturas automáticamente a Hacienda (eso lo hace tu asesor). Exporta listados trimestrales para tu asesor.',
          note: 'AFO CORE genera y gestiona facturas, tu asesor fiscal las presenta en declaraciones'
        },
        {
          title: '¿El Asistente IA de normativa es fiable?',
          description: 'El Asistente IA está entrenado específicamente en CTE, RITE y REBT actualizados. Es una herramienta de APOYO profesional, no sustitutiva. Fiabilidad: Proporciona referencias exactas a artículos normativos, Responde con información actualizada a 2019 (CTE), Útil para consultas rápidas y verificación. PERO: El arquitecto es responsable del cumplimiento, Verifica información crítica con normativa original, No sustituye tu criterio profesional. Úsalo como asistente, valida con normativa oficial.',
          note: 'Combinando IA + criterio profesional obtienes máxima eficiencia'
        },
        {
          title: '¿Puedo eliminar un proyecto o factura?',
          description: 'PROYECTOS: Puedes archivarlos (oculta de vista activa pero conserva histórico) o eliminarlos (solo si no tienen facturas). FACTURAS: Borradores SÍ se pueden eliminar. Emitidas y Pagadas NO por obligaciones fiscales (conservación 5 años). Si necesitas anular una factura emitida: emite factura rectificativa con importe negativo.',
          note: 'Nunca elimines facturas emitidas, solo archívalas o rectifícalas'
        },
        {
          title: '¿Cómo migro desde otro software de gestión?',
          description: 'AFO CORE no tiene importación directa desde otros software, pero puedes: PROYECTOS: Usa "Importar Proyecto" seleccionando carpeta con archivos del otro sistema. El sistema organiza documentos automáticamente. CLIENTES/FACTURAS: Exporta desde el otro software a CSV/Excel, Crea manualmente en AFO CORE (o importación por lotes futura). PRESUPUESTOS: Si tienes BC3, impórtalos directamente. Si no, crea manualmente.',
          note: 'La migración inicial toma tiempo pero luego todo es automático'
        },
        {
          title: '¿Hay límite de proyectos o documentos?',
          description: 'No hay límites artificiales impuestos por AFO CORE. El límite práctico es: Espacio de almacenamiento del navegador (típicamente 50MB - 500MB), Rendimiento según cantidad de datos (con 100+ proyectos puede ir más lento). RECOMENDACIÓN: Archiva proyectos antiguos regularmente, Exporta y elimina proyectos de hace +3 años si no son necesarios, Mantén activos solo proyectos en curso.',
          note: 'Para estudios grandes, mantén <50 proyectos activos simultáneos'
        },
        {
          title: '¿Puedo personalizar plantillas de documentos y facturas?',
          description: 'FACTURAS: Actualmente usan plantilla estándar profesional. Futura personalización con logo. DOCUMENTOS: Sí, puedes crear plantillas personalizadas en "Plantillas de Documentos", guardarlas y reutilizarlas. EMAIL: Las plantillas de email son personalizables en cada envío.',
          note: 'La personalización de facturas con logo está prevista en próximas versiones'
        },
        {
          title: '¿Qué pasa si cambio de navegador o actualizo?',
          description: 'CAMBIO DE NAVEGADOR: Datos no se transfieren automáticamente. Exporta proyectos antes e impórtalos en el nuevo navegador. ACTUALIZACIÓN DE NAVEGADOR: Datos se conservan normalmente. Por precaución, exporta antes de actualizaciones mayores. LIMPIEZA DE DATOS: Si limpias cookies/cache, puedes perder datos. Exporta regularmente como backup.',
          note: 'REGLA: Exporta proyectos mensualmente como medida de seguridad'
        }
      ],
      tips: [
        'Revisa estas FAQ antes de contactar soporte, muchas dudas se resuelven aquí',
        'Marca esta sección para consultas rápidas durante el uso diario',
        'Comparte FAQs con colaboradores de tu estudio para formación'
      ]
    }
  },
  {
    id: 'glossary',
    title: 'Glosario de Términos',
    icon: BookOpen,
    category: 'general',
    content: {
      description: 'Definiciones de términos técnicos y conceptos específicos usados en AFO CORE MANAGER.',
      features: [
        'BC3: Formato estándar de intercambio de presupuestos de construcción (FIEBDC-3). Utilizado por programas como Presto, Arquímedes. Permite importar presupuestos completos con partidas, precios y mediciones.',
        'Base Imponible: Importe de honorarios sin IVA. Sobre este se calcula el IVA 21% y la retención IRPF 7%.',
        'Certificado Digital: Documento electrónico que identifica a una persona o entidad en formato digital. Necesario para firma electrónica cualificada. Emitido por autoridades certificadas (FNMT, colegios profesionales).',
        'Checklist: Lista de verificación de requisitos normativos (CTE, RITE, REBT) que deben cumplirse según la tipología del edificio.',
        'Cl@ve: Sistema de identificación electrónica de la Administración Pública española. Permite acceder a servicios públicos y firmar documentos oficiales.',
        'CTE: Código Técnico de la Edificación. Normativa técnica española que establece requisitos de seguridad, habitabilidad y sostenibilidad. Dividido en Documentos Básicos (DB-SI, DB-SUA, DB-HS, DB-HE, DB-HR).',
        'Disciplina: Especialidad técnica de un documento (ARQ-Arquitectura, EST-Estructuras, INS-Instalaciones, ELE-Eléctricas, CLI-Climatización, PCI-Protección contra incendios, URB-Urbanización, MED-Mediciones, CAL-Cálculos, SEG-Seguridad).',
        'Fase de Proyecto: Etapa de desarrollo técnico. Típicas: Estudio Previo, Anteproyecto, Proyecto Básico, Proyecto de Ejecución, Dirección de Obra, Dirección de Ejecución.',
        'Flujo de Aprobación: Proceso formal de revisión y aprobación de documentos con múltiples participantes (aprobadores). Puede ser secuencial (uno tras otro) o paralelo (simultáneo).',
        'Firma Electrónica Cualificada: Nivel más alto de firma digital según eIDAS. Requiere certificado cualificado. Tiene validez legal equivalente a firma manuscrita. Usada para documentos oficiales.',
        'Interviniente: Profesional que participa en el proyecto (arquitecto, ingeniero, aparejador, promotor, constructor). Registrados en base de datos reutilizable.',
        'ISO 19650-2: Norma internacional de gestión de información en proyectos de construcción. Define nomenclatura y versionado de documentos (P01, P02, C01, C02).',
        'Nomenclatura: Sistema estandarizado de nombrar documentos: [Proyecto]-[Disciplina]-[Descripción]-[Versión]. Ejemplo: VIV001-ARQ-PlantaBaja-P01.',
        'PEM: Presupuesto de Ejecución Material. Coste directo de construcción sin IVA, beneficio industrial ni gastos generales. Base para calcular honorarios profesionales.',
        'PGOU: Plan General de Ordenación Urbana. Normativa urbanística municipal que regula edificabilidad, usos, alturas, ocupación en cada parcela.',
        'REBT: Reglamento Electrotécnico de Baja Tensión. Normativa de instalaciones eléctricas en edificios (Real Decreto 842/2002).',
        'Retención IRPF: Porcentaje que el cliente retiene de la factura como pago a cuenta del IRPF del profesional. Arquitectos: 7% estándar, 15% primeros 3 años de actividad.',
        'RITE: Reglamento de Instalaciones Térmicas en Edificios. Normativa de climatización, calefacción y agua caliente (Real Decreto 1027/2007).',
        'Versión P: Documento de trabajo interno (Work In Progress). P01, P02, P03... Incrementa con cada modificación. No se comparte oficialmente.',
        'Versión C: Documento compartido oficialmente con cliente, equipo o administración. C01, C02, C03... Requiere revisión previa antes de compartir.',
        'ViafirmaPro: Plataforma privada de firma electrónica cualificada. Alternativa a Cl@ve para firmas sin intervención de administración pública.',
        'Visado: Acto colegial de revisión y validación de proyectos técnicos. Obligatorio para proyectos según Ley de Ordenación de la Edificación (LOE). Tramitado en el colegio profesional.'
      ],
      tips: [
        'Consulta este glosario cuando encuentres términos técnicos desconocidos',
        'Los términos normativos (CTE, RITE, REBT) tienen significado legal específico',
        'La nomenclatura y versionado siguen estándares internacionales profesionales'
      ]
    }
  },
  {
    id: 'tips',
    title: 'Consejos y Buenas Prácticas',
    icon: Lightbulb,
    category: 'general',
    content: {
      description: 'Recomendaciones avanzadas y mejores prácticas para aprovechar al máximo AFO CORE MANAGER, mantener tu trabajo organizado y profesionalizar la gestión de tu estudio arquitectónico. Estos consejos se basan en el uso real por profesionales y optimizan tu flujo de trabajo diario.',
      tips: [
        '🔐 SEGURIDAD: Configura el email SMTP con una contraseña de aplicación específica (Google App Password), nunca uses tu contraseña principal de Gmail/Outlook para mayor seguridad',
        '💾 BACKUPS CRÍTICOS: Exporta todos tus proyectos activos el último día de cada mes como ZIP y guárdalos en cloud (Google Drive, Dropbox) o disco externo. Es tu única protección contra pérdida de datos',
        '📋 CUMPLIMIENTO PROGRESIVO: Completa el checklist de cumplimiento CTE en cada fase del proyecto (Básico, Ejecución), no todo al final. Esto documenta diligencia profesional',
        '🏷️ NOMENCLATURA CONSISTENTE: Establece desde el inicio un estándar de nombres de documentos y aplícalo religiosamente: [Proyecto]-[Disciplina]-[Descripción]-[Versión]',
        '📊 RUTINA MATINAL: Revisa el Dashboard cada mañana durante 2 minutos para identificar: facturas vencidas (cobrar), hitos próximos (preparar), tareas urgentes',
        '✅ FACTURACIÓN INMEDIATA: Marca las fases como completadas y genera la factura el mismo día que entregas al cliente, no esperes días o semanas',
        '📄 INFORMES PERIÓDICOS: Genera informes de cumplimiento normativo cada vez que completas una fase, no solo al final. Evidencia de trabajo diligente',
        '🔄 CONTROL DE VERSIONES ESTRICTO: Usa máximo 5-6 versiones P antes de compartir como C01. Si llegas a P10, algo va mal en tu proceso de revisión',
        '👥 BASE DE DATOS ACTUALIZADA: Mantén tu base de intervinientes y clientes actualizada. Cuando cambien email o teléfono, actualízalo inmediatamente',
        '📧 PLANTILLAS DE EMAIL: Personaliza las plantillas de email para facturas y documentos con tu tono profesional y firma corporativa',
        '🎯 PRESUPUESTO SIEMPRE VINCULADO: Vincula el presupuesto aprobado al proyecto ANTES de completar la primera fase para que funcione la facturación automática',
        '🔖 PLANTILLAS DE FLUJOS: Crea plantillas reutilizables de flujos de aprobación para tus procesos recurrentes (revisión proyecto básico, revisión ejecución, entrega final)',
        '⚡ FLUJOS + FIRMA: Combina flujos de aprobación (revisión técnica interna) + firma cualificada (oficialización) para procesos completos profesionales',
        '📚 CONSULTA IA TEMPRANA: Consulta el Asistente IA Regulatorio durante el diseño inicial del proyecto, no cuando ya tengas problemas. Prevención > Corrección',
        '🗂️ ORGANIZACIÓN DESDE EL INICIO: Usa la estructura de carpetas generada automáticamente y sigue las disciplinas estándar desde el primer documento subido',
        '💰 CONTROL DE TESORERÍA: Exporta listado de facturas pendientes de cobro semanalmente para gestión proactiva de impagados',
        '📝 OBSERVACIONES DETALLADAS: Usa el campo "Observaciones" en clientes y proyectos para documentar particularidades, acuerdos especiales, preferencias',
        '🔍 VERIFICACIÓN PRE-ENVÍO: Siempre genera vista previa de facturas y documentos antes de enviar al cliente. Verifica datos fiscales, importes, fechas',
        '📆 PLANIFICACIÓN TEMPORAL: Define fechas estimadas en todas las fases de proyectos para que el calendario muestre hitos y puedas planificar tu carga de trabajo',
        '🎨 PERSONALIZACIÓN CORPORATIVA: Personaliza plantillas de documentos con tu identidad corporativa (logo, colores, tipografías) para imagen profesional',
        '🔒 PRIVACIDAD RGPD: No subas información sensible de clientes (datos bancarios completos, documentación personal) sin necesidad real',
        '📤 EXPORTACIÓN SELECTIVA: Exporta solo los proyectos activos cuando hagas backup mensual. Los archivados expórtalos trimestralmente',
        '⏰ RECORDATORIOS MANUALES: Para facturas próximas a vencer (5 días antes), envía email de cortesía al cliente recordando el vencimiento',
        '🎓 FORMACIÓN CONTINUA: Revisa este manual completo al menos una vez al trimestre para descubrir funciones que no estabas aprovechando',
        '🔧 MANTENIMIENTO TRIMESTRAL: Cada 3 meses: limpia proyectos archivados antiguos, actualiza base de clientes/intervinientes, exporta datos para asesor fiscal',
        '📊 ANÁLISIS DE NEGOCIO: Usa las métricas del Dashboard para analizar: clientes más rentables, fases que generan más honorarios, tiempo medio por proyecto',
        '🚀 AUTOMATIZACIÓN MÁXIMA: Aprovecha todas las automatizaciones: facturación por fases, cálculo de honorarios, generación de informes, estructura de carpetas',
        '🤝 COLABORACIÓN: Para proyectos en equipo, establece convenciones de nomenclatura y flujos de aprobación compartidos con todos los técnicos',
        '📱 NAVEGADOR FIJO: Usa siempre el mismo navegador en el mismo ordenador para evitar problemas de sincronización de datos locales',
        '🎯 ENFOQUE POR PROYECTO: Cuando trabajes en un proyecto, completa todas sus tareas en AFO CORE (documentos, cumplimiento, facturación) antes de cambiar a otro'
      ],
      warnings: [
        'El mayor riesgo es la pérdida de datos por no hacer backups regulares',
        'Las facturas emitidas son inmutables por normativa fiscal, verifica antes de emitir',
        'Los documentos firmados digitalmente te comprometen legalmente, revisa contenido antes de firmar',
        'No compartas credenciales de email SMTP ni de proveedores de firma',
        'Mantén datos de clientes privados según RGPD, no los compartas con terceros'
      ]
    }
  }
]

export function UserManual({ trigger }: UserManualProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewFormat, setPreviewFormat] = useState<'pdf' | 'markdown'>('pdf')
  const [previewSearchQuery, setPreviewSearchQuery] = useState('')

  const categories = [
    { id: 'general', label: 'General', icon: Book },
    { id: 'projects', label: 'Proyectos', icon: Buildings },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'business', label: 'Negocio', icon: Bank },
    { id: 'administrative', label: 'Administrativo', icon: Clipboard },
    { id: 'tools', label: 'Herramientas', icon: Gear }
  ]

  const filteredSections = manualSections.filter(section => {
    const matchesCategory = activeTab === section.category
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getPreviewFilteredSections = () => {
    if (previewSearchQuery === '') return manualSections

    return manualSections.filter(section => {
      const titleMatch = section.title.toLowerCase().includes(previewSearchQuery.toLowerCase())
      const descMatch = section.content.description.toLowerCase().includes(previewSearchQuery.toLowerCase())
      const featuresMatch = section.content.features?.some(f => 
        f.toLowerCase().includes(previewSearchQuery.toLowerCase())
      )
      const stepsMatch = section.content.steps?.some(s => 
        s.title.toLowerCase().includes(previewSearchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(previewSearchQuery.toLowerCase())
      )
      const tipsMatch = section.content.tips?.some(t => 
        t.toLowerCase().includes(previewSearchQuery.toLowerCase())
      )
      
      return titleMatch || descMatch || featuresMatch || stepsMatch || tipsMatch
    })
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => 
      regex.test(part) 
        ? `<mark class="bg-accent text-accent-foreground px-1 rounded">${part}</mark>`
        : part
    ).join('')
  }

  const exportToMarkdown = () => {
    let markdown = `# Manual de Usuario - AFO CORE MANAGER\n\n`
    markdown += `**Gestión Integral Arquitectónica**\n\n`
    markdown += `Versión 1.0\n\n`
    markdown += `---\n\n`

    const sectionsToExport = getPreviewFilteredSections()

    categories.forEach(category => {
      const categorySections = sectionsToExport.filter(s => s.category === category.id)
      if (categorySections.length === 0) return

      markdown += `## ${category.label}\n\n`

      categorySections.forEach(section => {
        markdown += `### ${section.title}\n\n`
        markdown += `${section.content.description}\n\n`

        if (section.content.features && section.content.features.length > 0) {
          markdown += `#### Características\n\n`
          section.content.features.forEach(feature => {
            markdown += `- ${feature}\n`
          })
          markdown += `\n`
        }

        if (section.content.steps && section.content.steps.length > 0) {
          markdown += `#### Cómo usar\n\n`
          section.content.steps.forEach((step, idx) => {
            markdown += `${idx + 1}. **${step.title}**: ${step.description}`
            if (step.note) {
              markdown += ` *(${step.note})*`
            }
            markdown += `\n`
          })
          markdown += `\n`
        }

        if (section.content.tips && section.content.tips.length > 0) {
          markdown += `#### 💡 Consejos\n\n`
          section.content.tips.forEach(tip => {
            markdown += `- ${tip}\n`
          })
          markdown += `\n`
        }

        if (section.content.warnings && section.content.warnings.length > 0) {
          markdown += `#### ⚠️ Advertencias\n\n`
          section.content.warnings.forEach(warning => {
            markdown += `- ${warning}\n`
          })
          markdown += `\n`
        }

        markdown += `---\n\n`
      })
    })

    markdown += `\n## Información\n\n`
    markdown += `Este manual ha sido generado automáticamente desde AFO CORE MANAGER.\n`
    markdown += `Para más información, consulta el Asistente IA integrado en la aplicación.\n`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Manual-Usuario-AFO-CORE-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setPreviewDialogOpen(false)
    toast.success('Manual exportado a Markdown', {
      description: `Exportadas ${sectionsToExport.length} secciones`
    })
  }

  const exportToPDF = () => {
    const sectionsToExport = getPreviewFilteredSections()
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = margin

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
        return true
      }
      return false
    }

    const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', style)
      pdf.setTextColor(color[0], color[1], color[2])
      const lines = pdf.splitTextToSize(text, maxWidth)
      const lineHeight = fontSize * 0.4
      
      lines.forEach((line: string) => {
        addNewPageIfNeeded(lineHeight)
        pdf.text(line, margin, yPosition)
        yPosition += lineHeight
      })
    }

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.setTextColor(60, 80, 224)
    pdf.text('MANUAL DE USUARIO', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    pdf.setFontSize(18)
    pdf.text('AFO CORE MANAGER', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 8

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Gestión Integral Arquitectónica', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 6

    pdf.text(`Versión 1.0 - ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    categories.forEach((category, catIdx) => {
      const categorySections = sectionsToExport.filter(s => s.category === category.id)
      if (categorySections.length === 0) return

      if (catIdx > 0) {
        addNewPageIfNeeded(20)
        yPosition += 5
      }

      addText(category.label.toUpperCase(), 16, 'bold', [60, 80, 224])
      yPosition += 3

      categorySections.forEach(section => {
        addNewPageIfNeeded(20)
        yPosition += 4

        addText(section.title, 14, 'bold', [30, 30, 30])
        yPosition += 2

        addText(section.content.description, 10, 'normal', [60, 60, 60])
        yPosition += 4

        if (section.content.features && section.content.features.length > 0) {
          addText('Características:', 11, 'bold', [80, 80, 80])
          yPosition += 1
          section.content.features.forEach(feature => {
            addNewPageIfNeeded(8)
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(60, 60, 60)
            const bulletPoint = '• '
            const lines = pdf.splitTextToSize(feature, maxWidth - 5)
            lines.forEach((line: string, idx: number) => {
              pdf.text((idx === 0 ? bulletPoint : '  ') + line, margin + 3, yPosition)
              yPosition += 3.5
            })
          })
          yPosition += 2
        }

        if (section.content.steps && section.content.steps.length > 0) {
          addNewPageIfNeeded(10)
          addText('Cómo usar:', 11, 'bold', [80, 80, 80])
          yPosition += 1
          section.content.steps.forEach((step, idx) => {
            addNewPageIfNeeded(12)
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(60, 80, 224)
            pdf.text(`${idx + 1}.`, margin + 3, yPosition)
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(40, 40, 40)
            const titleLines = pdf.splitTextToSize(step.title, maxWidth - 8)
            pdf.text(titleLines[0], margin + 8, yPosition)
            yPosition += 4

            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(60, 60, 60)
            const descLines = pdf.splitTextToSize(step.description, maxWidth - 8)
            descLines.forEach((line: string) => {
              addNewPageIfNeeded(4)
              pdf.text(line, margin + 8, yPosition)
              yPosition += 3.5
            })

            if (step.note) {
              addNewPageIfNeeded(6)
              pdf.setFontSize(8)
              pdf.setTextColor(40, 100, 200)
              const noteLines = pdf.splitTextToSize(`Nota: ${step.note}`, maxWidth - 8)
              noteLines.forEach((line: string) => {
                pdf.text(line, margin + 8, yPosition)
                yPosition += 3
              })
            }
            yPosition += 2
          })
          yPosition += 2
        }

        if (section.content.tips && section.content.tips.length > 0) {
          addNewPageIfNeeded(10)
          addText('💡 Consejos:', 11, 'bold', [200, 150, 0])
          yPosition += 1
          section.content.tips.forEach(tip => {
            addNewPageIfNeeded(8)
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(120, 90, 0)
            const tipLines = pdf.splitTextToSize(`• ${tip}`, maxWidth - 5)
            tipLines.forEach((line: string) => {
              pdf.text(line, margin + 3, yPosition)
              yPosition += 3.5
            })
          })
          yPosition += 2
        }

        if (section.content.warnings && section.content.warnings.length > 0) {
          addNewPageIfNeeded(10)
          addText('⚠️ Advertencias:', 11, 'bold', [220, 100, 0])
          yPosition += 1
          section.content.warnings.forEach(warning => {
            addNewPageIfNeeded(8)
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(150, 60, 0)
            const warnLines = pdf.splitTextToSize(`• ${warning}`, maxWidth - 5)
            warnLines.forEach((line: string) => {
              pdf.text(line, margin + 3, yPosition)
              yPosition += 3.5
            })
          })
          yPosition += 2
        }

        pdf.setDrawColor(220, 220, 220)
        addNewPageIfNeeded(5)
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 5
      })
    })

    addNewPageIfNeeded(30)
    yPosition += 10
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Este manual ha sido generado automáticamente desde AFO CORE MANAGER.', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 5
    pdf.text('Para más información, consulta el Asistente IA integrado en la aplicación.', pageWidth / 2, yPosition, { align: 'center' })

    const totalPages = pdf.internal.pages.length - 1
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    pdf.save(`Manual-Usuario-AFO-CORE-${new Date().toISOString().split('T')[0]}.pdf`)

    setPreviewDialogOpen(false)
    toast.success('Manual exportado a PDF', {
      description: `Exportadas ${sectionsToExport.length} secciones`
    })
  }

  const handleExportClick = (format: 'pdf' | 'markdown') => {
    setPreviewFormat(format)
    setPreviewSearchQuery('')
    setPreviewDialogOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-2">
              <Question size={18} weight="duotone" />
              Ayuda
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <GraduationCap size={24} weight="duotone" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">Manual de Usuario</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Guía completa de AFO CORE MANAGER - Todos los módulos y funciones
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download size={18} weight="duotone" />
                    Exportar Manual
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExportClick('pdf')}>
                    <FilePdf size={18} weight="duotone" className="mr-2 text-red-500" />
                    Exportar a PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportClick('markdown')}>
                    <FileDoc size={18} weight="duotone" className="mr-2 text-blue-500" />
                    Exportar a Markdown
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Buscar en el manual..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b bg-muted/30 px-6">
                <TabsList className="h-12 bg-transparent">
                  {categories.map(cat => {
                    const Icon = cat.icon
                    return (
                      <TabsTrigger 
                        key={cat.id} 
                        value={cat.id}
                        className="gap-2 data-[state=active]:bg-background"
                      >
                        <Icon size={16} weight="duotone" />
                        {cat.label}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  {categories.map(cat => (
                    <TabsContent key={cat.id} value={cat.id} className="mt-0">
                      <div className="space-y-6">
                        {filteredSections.length === 0 ? (
                          <div className="text-center py-12">
                            <MagnifyingGlass size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No se encontraron resultados</p>
                          </div>
                        ) : (
                          filteredSections.map(section => {
                            const Icon = section.icon
                            return (
                              <Card key={section.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/30">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                      <Icon size={20} weight="duotone" />
                                    </div>
                                    <div>
                                      <CardTitle className="text-xl">{section.title}</CardTitle>
                                      <CardDescription className="mt-1">
                                        {section.content.description}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                  {section.content.features && (
                                    <div>
                                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <CheckCircle size={18} weight="duotone" className="text-primary" />
                                        Características
                                      </h4>
                                      <ul className="space-y-2">
                                        {section.content.features.map((feature, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-sm">
                                            <ArrowRight size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {section.content.steps && (
                                    <div>
                                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <BookOpen size={18} weight="duotone" className="text-primary" />
                                        Cómo usar
                                      </h4>
                                      <div className="space-y-4">
                                        {section.content.steps.map((step, idx) => (
                                          <div key={idx} className="flex gap-3">
                                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary font-semibold text-sm shrink-0">
                                              {idx + 1}
                                            </div>
                                            <div className="flex-1 pt-0.5">
                                              <p className="font-medium text-sm mb-1">{step.title}</p>
                                              <p className="text-sm text-muted-foreground">{step.description}</p>
                                              {step.note && (
                                                <div className="mt-2 flex items-start gap-2 text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 p-2 rounded">
                                                  <Info size={14} className="mt-0.5 shrink-0" />
                                                  <span>{step.note}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {section.content.tips && section.content.tips.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Lightbulb size={18} weight="duotone" className="text-amber-500" />
                                        Consejos
                                      </h4>
                                      <div className="space-y-2">
                                        {section.content.tips.map((tip, idx) => (
                                          <div key={idx} className="flex items-start gap-2 text-sm bg-amber-500/10 text-amber-700 dark:text-amber-300 p-3 rounded-lg">
                                            <Lightbulb size={16} className="mt-0.5 shrink-0" weight="fill" />
                                            <span>{tip}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {section.content.warnings && section.content.warnings.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Warning size={18} weight="duotone" className="text-orange-500" />
                                        Advertencias
                                      </h4>
                                      <div className="space-y-2">
                                        {section.content.warnings.map((warning, idx) => (
                                          <div key={idx} className="flex items-start gap-2 text-sm bg-orange-500/10 text-orange-700 dark:text-orange-300 p-3 rounded-lg">
                                            <Warning size={16} className="mt-0.5 shrink-0" weight="fill" />
                                            <span>{warning}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          </div>

          <div className="border-t bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">v1.0</Badge>
                <span>AFO CORE MANAGER</span>
              </div>
              <div className="flex items-center gap-2">
                <Info size={16} />
                <span>¿Necesitas más ayuda? Consulta el Asistente IA</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  {previewFormat === 'pdf' ? (
                    <FilePdf size={24} weight="duotone" />
                  ) : (
                    <FileDoc size={24} weight="duotone" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-2xl">Vista Previa de Exportación</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Busca y filtra el contenido antes de exportar a {previewFormat === 'pdf' ? 'PDF' : 'Markdown'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPreviewDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm"
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={previewFormat === 'pdf' ? exportToPDF : exportToMarkdown}
                >
                  <Download size={18} weight="bold" />
                  Descargar {previewFormat === 'pdf' ? 'PDF' : 'Markdown'}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Buscar para filtrar contenido a exportar..."
                value={previewSearchQuery}
                onChange={(e) => setPreviewSearchQuery(e.target.value)}
                className="pl-10"
              />
              {previewSearchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setPreviewSearchQuery('')}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="mb-6">
                <Badge variant="outline" className="text-sm">
                  {getPreviewFilteredSections().length} de {manualSections.length} secciones
                </Badge>
                {previewSearchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Filtrando por: "{previewSearchQuery}"
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {getPreviewFilteredSections().length === 0 ? (
                  <div className="text-center py-12">
                    <MagnifyingGlass size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No se encontraron secciones que coincidan con tu búsqueda</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setPreviewSearchQuery('')}
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                ) : (
                  categories.map(category => {
                    const categorySections = getPreviewFilteredSections().filter(s => s.category === category.id)
                    if (categorySections.length === 0) return null

                    return (
                      <div key={category.id}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                            {<category.icon size={18} weight="duotone" />}
                          </div>
                          <h3 className="text-lg font-bold">{category.label}</h3>
                          <Badge variant="secondary" className="ml-2">
                            {categorySections.length}
                          </Badge>
                        </div>
                        
                        <div className="space-y-4 ml-2 mb-8">
                          {categorySections.map(section => {
                            const Icon = section.icon
                            return (
                              <Card key={section.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/30 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                                      <Icon size={18} weight="duotone" />
                                    </div>
                                    <CardTitle className="text-base">{section.title}</CardTitle>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-4 pb-4">
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {section.content.description}
                                  </p>
                                  
                                  {section.content.features && section.content.features.length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        {section.content.features.length} característica(s)
                                      </p>
                                    </div>
                                  )}
                                  
                                  {section.content.steps && section.content.steps.length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        {section.content.steps.length} paso(s)
                                      </p>
                                    </div>
                                  )}
                                  
                                  {section.content.tips && section.content.tips.length > 0 && (
                                    <Badge variant="outline" className="text-xs mr-2">
                                      <Lightbulb size={12} className="mr-1" />
                                      {section.content.tips.length} consejo(s)
                                    </Badge>
                                  )}
                                  
                                  {section.content.warnings && section.content.warnings.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      <Warning size={12} className="mr-1" />
                                      {section.content.warnings.length} advertencia(s)
                                    </Badge>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="border-t bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Info size={16} />
                <span>
                  Se exportarán {getPreviewFilteredSections().length} secciones
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Formato: {previewFormat === 'pdf' ? 'PDF' : 'Markdown'}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
