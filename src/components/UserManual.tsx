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
  FileDoc
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
      description: 'AFO CORE MANAGER es una plataforma integral diseñada específicamente para arquitectos autónomos en España. Centraliza la gestión de proyectos, documentación técnica, cumplimiento normativo, presupuestos y trámites administrativos en una sola aplicación.',
      features: [
        'Gestión completa del ciclo de vida de proyectos',
        'Control documental con versionado ISO 19650-2',
        'Asistente de cumplimiento normativo con IA',
        'Facturación automática por fases',
        'Flujos de aprobación y firma digital',
        'Integración con servicios de firma cualificada',
        'Gestión de clientes y presupuestos',
        'Sistema de visados digitales'
      ],
      tips: [
        'Explora cada módulo desde el menú de navegación superior',
        'Usa el Dashboard para tener una visión general de tu negocio',
        'Configura tu email antes de enviar documentos'
      ]
    }
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Buildings,
    category: 'general',
    content: {
      description: 'El Dashboard proporciona una vista panorámica de tu estudio con métricas clave y acceso rápido a las funciones principales.',
      features: [
        'Resumen de proyectos activos vs archivados',
        'Estado financiero: facturas pagadas, pendientes y vencidas',
        'Próximos hitos y fechas importantes',
        'Presupuestos aprobados vs pendientes',
        'Acceso rápido a crear proyectos y facturas'
      ],
      steps: [
        {
          title: 'Visualizar métricas',
          description: 'Las tarjetas superiores muestran totales de proyectos, clientes, ingresos y documentos'
        },
        {
          title: 'Navegar a secciones',
          description: 'Haz clic en cualquier tarjeta para ir directamente al módulo correspondiente'
        },
        {
          title: 'Revisar alertas',
          description: 'El Dashboard destaca facturas vencidas y hitos próximos'
        }
      ]
    }
  },
  {
    id: 'projects',
    title: 'Gestión de Proyectos',
    icon: Buildings,
    category: 'projects',
    content: {
      description: 'El módulo de proyectos permite crear, organizar y supervisar todos los trabajos de tu estudio arquitectónico.',
      steps: [
        {
          title: 'Crear un proyecto',
          description: 'Haz clic en "Nuevo Proyecto" y completa el formulario con título, ubicación y descripción',
          note: 'El sistema genera automáticamente una estructura de carpetas profesional'
        },
        {
          title: 'Definir fases contratadas',
          description: 'Añade las fases del proyecto (estudio previo, básico, ejecución) con porcentajes de facturación'
        },
        {
          title: 'Asignar intervinientes',
          description: 'Selecciona arquitectos, ingenieros y otros profesionales de tu base de datos'
        },
        {
          title: 'Vincular cliente y presupuesto',
          description: 'Asocia el proyecto con un cliente existente y crea el presupuesto'
        },
        {
          title: 'Actualizar estados',
          description: 'Marca las fases como pendientes, en progreso o completadas. Al completar una fase, se genera automáticamente una factura'
        }
      ],
      features: [
        'Vista de tarjetas con filtros (Todos/Activos/Archivados)',
        'Búsqueda y organización de proyectos',
        'Estructura de carpetas automática',
        'Seguimiento de progreso por fases',
        'Generación de facturas automática al completar fases',
        'Importación/exportación de proyectos'
      ],
      tips: [
        'Usa la vista de calendario para ver todos los hitos de proyectos',
        'Archiva proyectos completados para mantener tu lista limpia',
        'Exporta proyectos regularmente como backup'
      ]
    }
  },
  {
    id: 'documents',
    title: 'Gestión Documental',
    icon: FileText,
    category: 'documents',
    content: {
      description: 'Sistema profesional de gestión de documentos con control de versiones según ISO 19650-2 y nomenclatura automática.',
      features: [
        'Versionado automático (P01, P02 para trabajo, C01, C02 para compartidos)',
        'Nomenclatura profesional: Proyecto-Disciplina-Descripción',
        '10 disciplinas: ARQ, EST, INS, ELE, CLI, PCI, URB, MED, CAL, SEG',
        'Búsqueda en tiempo real con múltiples filtros',
        'Subida individual y masiva drag-and-drop',
        'Generación de documentos con IA',
        'Vista previa mejorada con fuente legible',
        'Exportación a PDF optimizada para impresión'
      ],
      steps: [
        {
          title: 'Subir documentos',
          description: 'Usa "Subir Documento" para añadir archivos individuales o arrastra múltiples archivos a la zona de subida masiva'
        },
        {
          title: 'Organizar en carpetas',
          description: 'El sistema crea automáticamente carpetas por disciplina o puedes crear tu estructura personalizada'
        },
        {
          title: 'Buscar y filtrar',
          description: 'Usa la búsqueda en tiempo real y los filtros por disciplina, tipo, estado y carpeta'
        },
        {
          title: 'Controlar versiones',
          description: 'Sube nuevas versiones del mismo documento. El sistema incrementa automáticamente P01→P02 o C01→C02'
        },
        {
          title: 'Generar documentos con IA',
          description: 'Usa las plantillas predefinidas y la IA para generar memorias, informes y documentos técnicos',
          note: 'El contenido se pre-rellena con datos del proyecto'
        },
        {
          title: 'Exportar a PDF',
          description: 'Usa las utilidades PDF para exportar, fusionar y comprimir documentos para impresión profesional'
        }
      ],
      tips: [
        'Usa el buscador para encontrar documentos rápidamente',
        'Mantén un control de versiones estricto para trazabilidad',
        'Exporta PDFs optimizados antes de enviar a clientes o administraciones'
      ],
      warnings: [
        'No subas archivos con información sensible sin cifrar',
        'Verifica las versiones antes de compartir documentos oficiales'
      ]
    }
  },
  {
    id: 'compliance',
    title: 'Cumplimiento Normativo',
    icon: Clipboard,
    category: 'documents',
    content: {
      description: 'Sistema único de asistencia normativa con IA y checklists automáticos de CTE, RITE y REBT.',
      features: [
        'Asistente IA con consultas en lenguaje natural',
        'Base de conocimiento: CTE, RITE, REBT actualizado',
        'Checklist de 40+ requisitos específicos por tipología',
        'Generador automático de informes de cumplimiento',
        'Referencias exactas a normativas',
        'Filtrado inteligente según tipo de edificio'
      ],
      steps: [
        {
          title: 'Consultar al Asistente IA',
          description: 'Abre el Asistente Regulatorio desde Herramientas y pregunta sobre normativas en lenguaje natural',
          note: 'Ej: "¿Qué dice el CTE sobre ventilación en dormitorios?"'
        },
        {
          title: 'Usar el Checklist',
          description: 'En la pestaña Cumplimiento del proyecto, revisa automáticamente todos los requisitos aplicables'
        },
        {
          title: 'Generar informes',
          description: 'Crea informes de cumplimiento profesionales automáticamente con estado de cada requisito'
        },
        {
          title: 'Enviar por email',
          description: 'Envía los informes directamente a clientes o colegiados desde la aplicación'
        }
      ],
      tips: [
        'Consulta el Asistente IA durante las fases de diseño',
        'Completa el checklist en cada fase para evitar problemas',
        'Genera informes periódicos para documentar el cumplimiento'
      ]
    }
  },
  {
    id: 'clients',
    title: 'Gestión de Clientes',
    icon: UsersThree,
    category: 'business',
    content: {
      description: 'Base de datos centralizada de clientes con información completa para facturación y comunicación.',
      steps: [
        {
          title: 'Crear cliente',
          description: 'Accede desde Herramientas > Clientes y añade nombre/razón social, NIF, dirección y contacto'
        },
        {
          title: 'Gestionar información fiscal',
          description: 'Completa datos de facturación: dirección, forma de pago, banco'
        },
        {
          title: 'Vincular proyectos',
          description: 'Al crear un proyecto, selecciona el cliente correspondiente'
        },
        {
          title: 'Ver historial',
          description: 'Consulta todos los proyectos y facturas asociados a cada cliente'
        }
      ],
      features: [
        'Clientes particulares y empresas',
        'Datos fiscales completos para facturación',
        'Historial de proyectos y facturas',
        'Búsqueda y filtrado rápido'
      ]
    }
  },
  {
    id: 'invoicing',
    title: 'Facturación',
    icon: Receipt,
    category: 'business',
    content: {
      description: 'Sistema completo de facturación con generación automática por fases, emisión y seguimiento de pagos.',
      features: [
        'Facturación automática al completar fases',
        'Creación manual de facturas',
        'Estados: Borrador, Emitida, Pagada, Vencida',
        'Cálculo automático de IVA y retenciones',
        'Numeración correlativa automática',
        'Vista previa y exportación a PDF',
        'Envío por email',
        'Registros de vencimientos'
      ],
      steps: [
        {
          title: 'Facturación automática',
          description: 'Al marcar una fase como completada, el sistema sugiere crear una factura con el importe calculado según el presupuesto',
          note: 'Puedes editar los datos antes de confirmar'
        },
        {
          title: 'Crear factura manual',
          description: 'Desde el Gestor de Facturas, crea facturas de forma manual para conceptos no vinculados a fases'
        },
        {
          title: 'Gestionar estados',
          description: 'Marca facturas como Emitidas (al enviarlas) y Pagadas (al cobrarlas)'
        },
        {
          title: 'Exportar y enviar',
          description: 'Genera PDFs profesionales y envíalos directamente por email'
        }
      ],
      tips: [
        'Configura el email antes de enviar facturas',
        'Revisa facturas vencidas desde el Dashboard',
        'Usa borradores para preparar facturas con antelación'
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
      description: 'Integración con servicios de firma electrónica cualificada (Cl@ve, ViafirmaPro) para validez legal de documentos.',
      features: [
        'Firma electrónica cualificada según eIDAS',
        'Integración con Cl@ve (Administración)',
        'Integración con ViafirmaPro',
        'Gestión de proveedores de firma',
        'Seguimiento de solicitudes de firma',
        'Validación de firmas',
        'Almacenamiento de certificados firmados'
      ],
      steps: [
        {
          title: 'Configurar proveedor',
          description: 'Desde Herramientas > Proveedores de Firma, añade tus credenciales de Cl@ve o ViafirmaPro',
          note: 'Se requieren credenciales de acceso al servicio de firma'
        },
        {
          title: 'Solicitar firma',
          description: 'Selecciona un documento y crea una solicitud de firma especificando firmantes'
        },
        {
          title: 'Enviar notificaciones',
          description: 'Los firmantes reciben emails con instrucciones y enlaces seguros'
        },
        {
          title: 'Monitorear estado',
          description: 'Sigue el progreso de cada firma desde el visor de solicitudes'
        },
        {
          title: 'Descargar documento firmado',
          description: 'Una vez todas las firmas completadas, descarga el PDF con certificado digital'
        }
      ],
      warnings: [
        'Las firmas cualificadas tienen validez legal como firma manuscrita',
        'Asegúrate de que los firmantes tengan certificado digital válido',
        'Conserva los documentos firmados como evidencia legal'
      ],
      tips: [
        'Usa firma cualificada para documentos oficiales (proyectos visados, contratos)',
        'Combina flujos de aprobación + firma para procesos completos'
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
    id: 'tips',
    title: 'Consejos y Buenas Prácticas',
    icon: Lightbulb,
    category: 'general',
    content: {
      description: 'Recomendaciones para aprovechar al máximo AFO CORE MANAGER y mantener tu trabajo organizado.',
      tips: [
        '🔐 Configura el email SMTP con una contraseña de aplicación, no tu contraseña principal',
        '💾 Exporta proyectos semanalmente como backup de seguridad',
        '📋 Completa el checklist de cumplimiento en cada fase del proyecto',
        '🏷️ Usa nombres descriptivos en documentos para facilitar búsquedas',
        '📊 Revisa el Dashboard diariamente para estar al tanto de facturas vencidas',
        '✅ Marca las fases completadas inmediatamente para activar facturación automática',
        '📄 Genera informes de cumplimiento periódicamente para documentación',
        '🔄 Usa control de versiones estricto (P01, P02) para trazabilidad',
        '👥 Mantén actualizada tu base de datos de intervinientes',
        '📧 Configura plantillas de email para agilizar comunicaciones',
        '🎯 Vincula siempre presupuesto aprobado al proyecto para automatización',
        '🔖 Usa las plantillas de flujo de aprobación para procesos recurrentes',
        '⚡ Combina flujos de aprobación + firma cualificada para entregables oficiales',
        '📚 Consulta el Asistente IA durante el diseño para verificar normativa',
        '🗂️ Organiza documentos en carpetas por disciplina desde el inicio'
      ]
    }
  }
]

export function UserManual({ trigger }: UserManualProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')

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

  const exportToMarkdown = () => {
    let markdown = `# Manual de Usuario - AFO CORE MANAGER\n\n`
    markdown += `**Gestión Integral Arquitectónica**\n\n`
    markdown += `Versión 1.0\n\n`
    markdown += `---\n\n`

    categories.forEach(category => {
      const categorySections = manualSections.filter(s => s.category === category.id)
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

    toast.success('Manual exportado a Markdown', {
      description: 'El archivo se ha descargado correctamente'
    })
  }

  const exportToPDF = () => {
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
      const categorySections = manualSections.filter(s => s.category === category.id)
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

    toast.success('Manual exportado a PDF', {
      description: 'El archivo se ha descargado correctamente'
    })
  }

  return (
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
                <DropdownMenuItem onClick={exportToPDF}>
                  <FilePdf size={18} weight="duotone" className="mr-2 text-red-500" />
                  Exportar a PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToMarkdown}>
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
  )
}
