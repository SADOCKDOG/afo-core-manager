export interface VisualGuideStep {
  title: string
  description: string
  screenshot?: {
    description: string
    highlights?: string[]
  }
  actions?: string[]
  tips?: string[]
  warnings?: string[]
  notes?: string[]
  relatedGuides?: string[]
}

export interface VisualGuide {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string
  tags: string[]
  steps: VisualGuideStep[]
}

export const visualGuidesData: VisualGuide[] = [
  {
    id: 'create-project',
    title: 'Crear un Nuevo Proyecto',
    description: 'Aprende a crear y configurar un nuevo proyecto arquitectónico desde cero',
    category: 'Gestión de Proyectos',
    difficulty: 'beginner',
    estimatedTime: '5 minutos',
    tags: ['Proyectos', 'Configuración', 'Básico'],
    steps: [
      {
        title: 'Acceder a la Vista de Proyectos',
        description: 'Navega a la sección de proyectos desde el menú principal',
        screenshot: {
          description: 'Menú principal con la opción "Proyectos" resaltada',
          highlights: ['Botón "Proyectos" en la barra de navegación']
        },
        actions: [
          'Haz clic en el botón "Proyectos" en la barra de navegación superior',
          'Verás la lista de todos tus proyectos existentes'
        ],
        tips: [
          'Puedes filtrar los proyectos por estado (Todos, Activos, Archivados)',
          'Usa el contador para ver rápidamente cuántos proyectos tienes'
        ]
      },
      {
        title: 'Abrir el Formulario de Nuevo Proyecto',
        description: 'Inicia el proceso de creación haciendo clic en el botón correspondiente',
        screenshot: {
          description: 'Botón "Nuevo Proyecto" destacado en la esquina superior derecha',
          highlights: ['Botón naranja "Nuevo Proyecto"']
        },
        actions: [
          'Haz clic en el botón "Nuevo Proyecto" ubicado en la parte superior derecha',
          'Se abrirá un cuadro de diálogo con el formulario de creación'
        ],
        tips: [
          'El formulario está organizado en pestañas para facilitar la navegación',
          'Puedes guardar el proyecto en cualquier momento'
        ]
      },
      {
        title: 'Completar Información Básica',
        description: 'Rellena los datos fundamentales del proyecto',
        screenshot: {
          description: 'Formulario con campos de título, ubicación y descripción',
          highlights: ['Campo "Título del Proyecto"', 'Campo "Ubicación"', 'Área de texto "Descripción"']
        },
        actions: [
          'Introduce un título descriptivo para el proyecto',
          'Especifica la ubicación completa (calle, ciudad, etc.)',
          'Añade una descripción opcional con detalles relevantes',
          'Selecciona el estado inicial (normalmente "Activo")'
        ],
        warnings: [
          'El título y la ubicación son campos obligatorios',
          'Usa nombres descriptivos para facilitar la búsqueda posterior'
        ],
        tips: [
          'Un buen título incluye el tipo de proyecto y el cliente',
          'La descripción puede incluir objetivos y características especiales'
        ]
      },
      {
        title: 'Configurar Fases del Proyecto',
        description: 'Define las etapas de desarrollo del proyecto',
        screenshot: {
          description: 'Pestaña "Fases" con selector de fases y porcentajes',
          highlights: ['Selector de fases', 'Campo de porcentaje', 'Botón "Añadir Fase"']
        },
        actions: [
          'Ve a la pestaña "Fases"',
          'Selecciona una fase del desplegable (Anteproyecto, Básico, Ejecución, etc.)',
          'Asigna un porcentaje de cobro para cada fase',
          'Haz clic en "Añadir Fase" para incluirla',
          'Repite el proceso para todas las fases necesarias'
        ],
        tips: [
          'Los porcentajes totales deben sumar 100% para facturación completa',
          'Puedes eliminar fases haciendo clic en el icono de papelera',
          'El orden de las fases puede ser importante para el seguimiento'
        ],
        notes: [
          'Las fases se usan para generar facturas automáticas al completarlas',
          'Puedes modificar las fases después de crear el proyecto'
        ]
      },
      {
        title: 'Asignar Intervinientes',
        description: 'Selecciona los profesionales que participarán en el proyecto',
        screenshot: {
          description: 'Pestaña "Intervinientes" con lista de profesionales disponibles',
          highlights: ['Lista de intervinientes', 'Checkboxes de selección']
        },
        actions: [
          'Ve a la pestaña "Intervinientes"',
          'Revisa la lista de intervinientes disponibles',
          'Marca los checkboxes de los profesionales que participarán',
          'Verifica que incluyes todos los roles necesarios (arquitecto, aparejador, etc.)'
        ],
        tips: [
          'Si no encuentras un interviniente, créalo desde "Herramientas > Intervinientes"',
          'Puedes asignar múltiples profesionales del mismo tipo',
          'Los datos de los intervinientes se incluirán en los documentos generados'
        ],
        notes: [
          'Los intervinientes deben estar previamente dados de alta en el sistema'
        ]
      },
      {
        title: 'Configurar Estructura de Carpetas',
        description: 'Define la organización de documentos del proyecto',
        screenshot: {
          description: 'Pestaña "Estructura de Carpetas" con selector de plantilla',
          highlights: ['Selector de plantilla', 'Vista previa de carpetas']
        },
        actions: [
          'Ve a la pestaña "Estructura de Carpetas"',
          'Selecciona una plantilla de carpetas (Proyecto Completo, Vivienda, Rehabilitación, etc.)',
          'Revisa la estructura generada en la vista previa',
          'Personaliza las carpetas si es necesario'
        ],
        tips: [
          'La plantilla "Proyecto Completo" incluye todas las carpetas habituales',
          'Puedes crear plantillas personalizadas desde "Herramientas > Documentos"',
          'La estructura ayuda a mantener organizados todos los archivos'
        ],
        notes: [
          'Cada carpeta puede contener subcarpetas y documentos',
          'La estructura se puede modificar después de crear el proyecto'
        ]
      },
      {
        title: 'Guardar y Verificar',
        description: 'Completa la creación del proyecto',
        screenshot: {
          description: 'Botón "Guardar Proyecto" en la parte inferior del formulario',
          highlights: ['Botón "Guardar Proyecto"']
        },
        actions: [
          'Revisa que todos los datos estén correctos',
          'Haz clic en "Guardar Proyecto" en la parte inferior',
          'Espera la confirmación de creación exitosa',
          'El nuevo proyecto aparecerá en la lista de proyectos'
        ],
        tips: [
          'Puedes editar cualquier dato después de guardar',
          'El proyecto se crea con estado "Activo" por defecto',
          'Recibirás una notificación verde de confirmación'
        ],
        notes: [
          'El proyecto queda disponible inmediatamente para trabajar',
          'Todos los datos se guardan de forma segura'
        ]
      }
    ]
  },
  {
    id: 'import-project',
    title: 'Importar Proyecto desde Estructura de Archivos',
    description: 'Importa proyectos existentes con su estructura de carpetas y documentos',
    category: 'Importación/Exportación',
    difficulty: 'intermediate',
    estimatedTime: '10 minutos',
    tags: ['Importación', 'Archivos', 'Proyectos', 'Organización'],
    steps: [
      {
        title: 'Acceder a la Herramienta de Importación',
        description: 'Abre el asistente de importación de proyectos',
        screenshot: {
          description: 'Menú "Herramientas" con la opción "Importar Proyecto" resaltada',
          highlights: ['Botón "Herramientas"', 'Opción "Importar Proyecto"']
        },
        actions: [
          'Haz clic en el menú "Herramientas" en la barra superior',
          'Selecciona "Importar Proyecto" del menú desplegable',
          'Se abrirá el asistente de importación paso a paso'
        ],
        tips: [
          'También existe la opción "Importación Múltiple" para varios proyectos a la vez',
          'El asistente te guiará por cada paso del proceso'
        ]
      },
      {
        title: 'Seleccionar Archivos o Carpeta',
        description: 'Elige los archivos que deseas importar',
        screenshot: {
          description: 'Área de arrastrar y soltar archivos con botón de selección',
          highlights: ['Zona de drop de archivos', 'Botón "Seleccionar archivos"']
        },
        actions: [
          'Arrastra archivos directamente a la zona indicada, O',
          'Haz clic en "Seleccionar archivos" para abrir el explorador',
          'Selecciona múltiples archivos manteniendo Ctrl/Cmd',
          'Confirma la selección'
        ],
        tips: [
          'Puedes importar archivos PDF, DWG, DOC, XLS y más',
          'El sistema detectará automáticamente la estructura de carpetas',
          'Los archivos se pueden organizar en el siguiente paso'
        ],
        warnings: [
          'Asegúrate de tener permisos para acceder a los archivos',
          'Archivos muy grandes pueden tardar más en procesarse'
        ]
      },
      {
        title: 'Revisar Estructura Detectada',
        description: 'Verifica y ajusta la organización de carpetas detectada',
        screenshot: {
          description: 'Árbol de carpetas con archivos organizados',
          highlights: ['Vista de árbol', 'Archivos agrupados por carpeta']
        },
        actions: [
          'Revisa la estructura de carpetas propuesta por el sistema',
          'Verifica que los archivos estén en las carpetas correctas',
          'Arrastra archivos entre carpetas si necesitas reorganizar',
          'Marca/desmarca archivos que quieras incluir o excluir'
        ],
        tips: [
          'El sistema intenta detectar carpetas basándose en los nombres de archivo',
          'Puedes crear nuevas carpetas con el botón correspondiente',
          'Los archivos sin carpeta se colocarán en "Otros"'
        ],
        notes: [
          'Esta organización afectará cómo se almacenan los documentos',
          'Una buena estructura facilita la búsqueda posterior'
        ]
      },
      {
        title: 'Introducir Datos del Proyecto',
        description: 'Completa la información básica del proyecto',
        screenshot: {
          description: 'Formulario con campos de título y ubicación',
          highlights: ['Campo "Título"', 'Campo "Ubicación"']
        },
        actions: [
          'Introduce un título descriptivo para el proyecto',
          'Especifica la ubicación del proyecto',
          'Añade observaciones opcionales si lo deseas'
        ],
        warnings: [
          'El título y la ubicación son obligatorios para continuar',
          'Usa nombres que permitan identificar fácilmente el proyecto'
        ]
      },
      {
        title: 'Completar Importación',
        description: 'Finaliza el proceso y crea el proyecto',
        screenshot: {
          description: 'Botón "Importar Proyecto" con resumen de archivos',
          highlights: ['Resumen de importación', 'Botón "Importar Proyecto"']
        },
        actions: [
          'Revisa el resumen: cantidad de archivos, carpetas, etc.',
          'Haz clic en "Importar Proyecto"',
          'Espera a que se procesen todos los archivos',
          'Verás una confirmación cuando termine'
        ],
        tips: [
          'El tiempo de importación depende del número y tamaño de archivos',
          'El proyecto queda disponible inmediatamente después',
          'Puedes seguir trabajando mientras se completa la importación'
        ],
        notes: [
          'Los archivos se copian, no se mueven de su ubicación original',
          'Todos los documentos quedan asociados al nuevo proyecto'
        ]
      }
    ]
  },
  {
    id: 'generate-invoice',
    title: 'Generar y Emitir Facturas',
    description: 'Crea facturas profesionales para tus proyectos y clientes',
    category: 'Facturación',
    difficulty: 'intermediate',
    estimatedTime: '8 minutos',
    tags: ['Facturas', 'Facturación', 'Cobros', 'Clientes'],
    steps: [
      {
        title: 'Abrir el Gestor de Facturas',
        description: 'Accede a la herramienta de gestión de facturas',
        screenshot: {
          description: 'Botón "Gestión de Facturas" en la barra superior',
          highlights: ['Botón con icono de factura']
        },
        actions: [
          'Haz clic en el botón "Gestión de Facturas" en la barra superior',
          'Se abrirá el panel de gestión de facturas',
          'Verás la lista de facturas existentes (si las hay)'
        ]
      },
      {
        title: 'Crear Nueva Factura',
        description: 'Inicia el formulario de nueva factura',
        screenshot: {
          description: 'Botón "Nueva Factura" en el gestor',
          highlights: ['Botón "Nueva Factura"']
        },
        actions: [
          'Haz clic en "Nueva Factura" en la parte superior del gestor',
          'Se abrirá el formulario de creación de factura',
          'El formulario incluye múltiples secciones organizadas'
        ]
      },
      {
        title: 'Seleccionar Proyecto y Cliente',
        description: 'Asocia la factura a un proyecto y cliente',
        screenshot: {
          description: 'Selectores de proyecto y cliente',
          highlights: ['Desplegable "Proyecto"', 'Datos del cliente autocompletados']
        },
        actions: [
          'Selecciona el proyecto del desplegable',
          'Los datos del cliente se cargarán automáticamente',
          'Verifica que la información del cliente sea correcta',
          'Si no hay cliente, asígnalo primero al proyecto'
        ],
        tips: [
          'El cliente debe estar previamente asociado al proyecto',
          'Los datos del cliente se toman del presupuesto aprobado si existe'
        ],
        notes: [
          'Puedes facturar sin proyecto, pero no se podrá hacer seguimiento automático'
        ]
      },
      {
        title: 'Completar Datos de Facturación',
        description: 'Introduce la información de la factura',
        screenshot: {
          description: 'Formulario con número, fecha y conceptos',
          highlights: ['Campo "Número de Factura"', 'Selector de fecha', 'Tabla de conceptos']
        },
        actions: [
          'El número de factura se genera automáticamente (puedes modificarlo)',
          'Selecciona la fecha de emisión',
          'Añade conceptos de facturación con descripción y importe',
          'Especifica la tasa de IVA aplicable',
          'Revisa los totales calculados automáticamente'
        ],
        tips: [
          'Los conceptos pueden ser fases del proyecto o servicios específicos',
          'El sistema calcula automáticamente base imponible, IVA y total',
          'Puedes añadir múltiples conceptos en una misma factura'
        ],
        warnings: [
          'Verifica que el número de factura no esté duplicado',
          'Asegúrate de que la tasa de IVA sea la correcta'
        ]
      },
      {
        title: 'Guardar como Borrador o Emitir',
        description: 'Decide el estado de la factura',
        screenshot: {
          description: 'Botones "Guardar Borrador" y "Emitir Factura"',
          highlights: ['Botón "Guardar Borrador"', 'Botón "Emitir Factura"']
        },
        actions: [
          'Opción 1: Guardar como borrador para terminarla después',
          'Opción 2: Emitir directamente si está completa',
          'Las facturas emitidas quedan registradas definitivamente',
          'Los borradores pueden editarse o eliminarse'
        ],
        tips: [
          'Usa borradores para facturas que necesitas revisar',
          'Las facturas emitidas no se pueden modificar (solo anular)',
          'Puedes convertir un borrador en factura emitida después'
        ],
        notes: [
          'Las facturas emitidas se cuentan para estadísticas e informes',
          'Los borradores no afectan a los totales de facturación'
        ]
      },
      {
        title: 'Exportar y Enviar',
        description: 'Genera el PDF de la factura',
        screenshot: {
          description: 'Botones de exportación en la factura creada',
          highlights: ['Botón "Exportar PDF"', 'Botón "Enviar por Email"']
        },
        actions: [
          'Localiza la factura en la lista',
          'Haz clic en "Exportar PDF" para descargar el documento',
          'El PDF incluye todos los datos y está listo para entregar',
          'Opcionalmente, usa "Enviar por Email" si tienes configurado el servicio'
        ],
        tips: [
          'El PDF se genera con un formato profesional',
          'Incluye logotipo si lo has configurado en tu perfil',
          'Puedes imprimir directamente desde el PDF'
        ],
        notes: [
          'El envío por email requiere configuración previa del servicio SMTP'
        ]
      }
    ]
  },
  {
    id: 'document-templates',
    title: 'Trabajar con Plantillas de Documentos',
    description: 'Crea y utiliza plantillas para generar documentos personalizados',
    category: 'Documentos',
    difficulty: 'intermediate',
    estimatedTime: '12 minutos',
    tags: ['Documentos', 'Plantillas', 'Generación', 'Personalización'],
    steps: [
      {
        title: 'Acceder a la Biblioteca de Plantillas',
        description: 'Abre el gestor de plantillas de documentos',
        screenshot: {
          description: 'Menú Herramientas con opción "Biblioteca de Plantillas"',
          highlights: ['Opción "Biblioteca de Plantillas"']
        },
        actions: [
          'Haz clic en "Herramientas" en la barra superior',
          'Selecciona "Biblioteca de Plantillas de Documentos"',
          'Se abrirá la biblioteca con plantillas disponibles'
        ]
      },
      {
        title: 'Explorar Plantillas Disponibles',
        description: 'Revisa las plantillas predefinidas del sistema',
        screenshot: {
          description: 'Grid de tarjetas con diferentes plantillas',
          highlights: ['Tarjetas de plantillas', 'Categorías']
        },
        actions: [
          'Explora las categorías de plantillas disponibles',
          'Lee las descripciones de cada plantilla',
          'Identifica cuál se ajusta a tu necesidad',
          'Verifica los campos de datos requeridos'
        ],
        tips: [
          'Las plantillas están organizadas por tipo de documento',
          'Cada plantilla muestra qué datos necesita del proyecto',
          'Puedes crear tus propias plantillas personalizadas'
        ]
      },
      {
        title: 'Crear Nueva Plantilla',
        description: 'Diseña una plantilla personalizada',
        screenshot: {
          description: 'Formulario de creación de plantilla',
          highlights: ['Editor de contenido', 'Selector de variables']
        },
        actions: [
          'Haz clic en "Nueva Plantilla"',
          'Introduce un nombre descriptivo',
          'Selecciona la categoría adecuada',
          'Escribe el contenido usando el editor',
          'Inserta variables dinámicas con doble corchete: {{nombreVariable}}',
          'Guarda la plantilla'
        ],
        tips: [
          'Variables disponibles: {{proyecto.titulo}}, {{proyecto.ubicacion}}, {{cliente.nombre}}, etc.',
          'Usa formato Markdown para estructura del documento',
          'Puedes incluir condicionales y bucles con sintaxis especial',
          'Previsualiza la plantilla antes de guardar'
        ],
        warnings: [
          'Verifica que los nombres de variables estén correctos',
          'Las variables inexistentes se mostrarán vacías en el documento final'
        ],
        notes: [
          'Las plantillas se pueden compartir y reutilizar en múltiples proyectos',
          'Soporta texto enriquecido, tablas y listas'
        ]
      },
      {
        title: 'Generar Documento desde Plantilla',
        description: 'Usa una plantilla para crear un documento real',
        screenshot: {
          description: 'Botón "Usar Plantilla" en una tarjeta',
          highlights: ['Botón "Usar Plantilla"', 'Selector de proyecto']
        },
        actions: [
          'Selecciona la plantilla que deseas usar',
          'Haz clic en "Usar Plantilla"',
          'Selecciona el proyecto al que aplicar la plantilla',
          'Revisa la vista previa con los datos del proyecto',
          'Ajusta cualquier valor si es necesario',
          'Genera el documento final'
        ],
        tips: [
          'La vista previa te permite verificar antes de generar',
          'Puedes modificar manualmente el contenido generado',
          'El documento se guarda en la carpeta correspondiente del proyecto'
        ]
      },
      {
        title: 'Exportar Documento Generado',
        description: 'Descarga el documento en diferentes formatos',
        screenshot: {
          description: 'Opciones de exportación de documento',
          highlights: ['Botón "Exportar PDF"', 'Botón "Exportar Word"']
        },
        actions: [
          'Abre el documento generado',
          'Selecciona el formato de exportación deseado',
          'Haz clic en el botón correspondiente (PDF, Word, etc.)',
          'El archivo se descargará a tu equipo',
          'Verifica que el formato sea el esperado'
        ],
        tips: [
          'PDF es ideal para documentos finales que no se modificarán',
          'Word permite hacer ajustes posteriores',
          'Markdown es útil para versionado y control de cambios'
        ],
        notes: [
          'Los documentos exportados mantienen el formato y estilo',
          'Puedes reimportar documentos modificados al sistema'
        ]
      }
    ]
  },
  {
    id: 'digital-signatures',
    title: 'Solicitar Firmas Electrónicas Cualificadas',
    description: 'Gestiona el proceso de firma digital de documentos con servicios certificados',
    category: 'Firmas Digitales',
    difficulty: 'advanced',
    estimatedTime: '15 minutos',
    tags: ['Firma Digital', 'Cl@ve', 'ViafirmaPro', 'Certificación', 'Legal'],
    steps: [
      {
        title: 'Configurar Proveedores de Firma',
        description: 'Conecta los servicios de firma electrónica',
        screenshot: {
          description: 'Panel de configuración de proveedores',
          highlights: ['Lista de proveedores', 'Botón "Configurar"']
        },
        actions: [
          'Ve a Herramientas > Gestión de Proveedores de Firma',
          'Selecciona el proveedor que deseas configurar (Cl@ve o ViafirmaPro)',
          'Introduce las credenciales API proporcionadas por el proveedor',
          'Guarda la configuración',
          'Verifica la conexión con el botón "Probar conexión"'
        ],
        warnings: [
          'Necesitas contratar el servicio con el proveedor antes de configurar',
          'Las credenciales son sensibles, mantenlas seguras',
          'Verifica que las URLs de los endpoints sean correctas'
        ],
        notes: [
          'Cl@ve es el sistema de firma de la Administración española',
          'ViafirmaPro es un servicio privado con más opciones de personalización'
        ]
      },
      {
        title: 'Preparar Documento para Firma',
        description: 'Selecciona y configura el documento a firmar',
        screenshot: {
          description: 'Gestor de documentos con opción de firma',
          highlights: ['Documento seleccionado', 'Botón "Solicitar Firma"']
        },
        actions: [
          'Navega al proyecto que contiene el documento',
          'Localiza el documento en el gestor de documentos',
          'Haz clic derecho o en opciones del documento',
          'Selecciona "Solicitar Firma Electrónica"',
          'Se abrirá el asistente de solicitud de firma'
        ],
        tips: [
          'El documento debe estar en formato PDF para firmar',
          'Si no está en PDF, expórtalo antes de solicitar firma',
          'Verifica que el contenido sea final, no se puede modificar después'
        ]
      },
      {
        title: 'Configurar Solicitud de Firma',
        description: 'Define quién debe firmar y cómo',
        screenshot: {
          description: 'Formulario de configuración de firma',
          highlights: ['Lista de firmantes', 'Opciones de firma']
        },
        actions: [
          'Selecciona el proveedor de firma a usar',
          'Añade los firmantes con su email y nombre',
          'Define el orden de firma (secuencial o paralela)',
          'Establece fecha límite para firmar (opcional)',
          'Añade un mensaje para los firmantes',
          'Configura opciones avanzadas si es necesario'
        ],
        tips: [
          'Firma secuencial: cada persona firma tras la anterior',
          'Firma paralela: todos pueden firmar simultáneamente',
          'El mensaje personalizado ayuda a los firmantes a entender el contexto',
          'Puedes requerir autenticación adicional para mayor seguridad'
        ],
        warnings: [
          'Asegúrate de que los emails sean correctos',
          'Los firmantes recibirán notificaciones por email',
          'Verifica los permisos y capacidad legal de los firmantes'
        ]
      },
      {
        title: 'Enviar Solicitud de Firma',
        description: 'Inicia el proceso de firma electrónica',
        screenshot: {
          description: 'Botón "Enviar Solicitud" con resumen',
          highlights: ['Resumen de solicitud', 'Botón "Enviar"']
        },
        actions: [
          'Revisa el resumen de la solicitud',
          'Verifica todos los datos: documento, firmantes, opciones',
          'Haz clic en "Enviar Solicitud de Firma"',
          'Confirma el envío en el diálogo',
          'Espera la confirmación del sistema'
        ],
        tips: [
          'Recibirás un ID de solicitud para hacer seguimiento',
          'Los firmantes recibirán inmediatamente el email con instrucciones',
          'Puedes ver el estado en tiempo real desde el sistema'
        ],
        notes: [
          'El proceso de firma puede tardar días dependiendo de los firmantes',
          'Se envían recordatorios automáticos si está configurado'
        ]
      },
      {
        title: 'Hacer Seguimiento de Firmas',
        description: 'Monitoriza el estado de las solicitudes',
        screenshot: {
          description: 'Panel de seguimiento de solicitudes de firma',
          highlights: ['Lista de solicitudes', 'Estado de cada firmante', 'Timeline']
        },
        actions: [
          'Ve a Herramientas > Ver Solicitudes de Firma',
          'Revisa la lista de solicitudes activas',
          'Haz clic en una solicitud para ver detalles',
          'Verifica qué firmantes han completado y quiénes faltan',
          'Envía recordatorios si es necesario'
        ],
        tips: [
          'Los estados pueden ser: Pendiente, En proceso, Firmado, Rechazado, Expirado',
          'Puedes cancelar una solicitud antes de que se complete',
          'El timeline muestra cada acción en orden cronológico'
        ]
      },
      {
        title: 'Descargar Documento Firmado',
        description: 'Obtén el documento con firmas certificadas',
        screenshot: {
          description: 'Botón de descarga en solicitud completada',
          highlights: ['Estado "Completado"', 'Botón "Descargar PDF Firmado"']
        },
        actions: [
          'Una vez completadas todas las firmas, el estado cambia a "Completado"',
          'Haz clic en "Descargar Documento Firmado"',
          'El PDF incluirá todas las firmas electrónicas cualificadas',
          'Verifica las firmas usando un visor de PDF con soporte de firmas digitales',
          'Guarda el documento en lugar seguro'
        ],
        tips: [
          'El documento firmado tiene validez legal equivalente a firma manuscrita',
          'Las firmas incluyen certificado digital y timestamp',
          'Puedes verificar la autenticidad en cualquier momento',
          'Conserva el documento original sin modificar'
        ],
        notes: [
          'El documento firmado se almacena también en el proyecto automáticamente',
          'Puedes volver a descargarlo en cualquier momento'
        ]
      }
    ]
  },
  {
    id: 'approval-workflows',
    title: 'Crear Flujos de Aprobación',
    description: 'Diseña procesos de revisión y aprobación de documentos',
    category: 'Aprobaciones',
    difficulty: 'advanced',
    estimatedTime: '20 minutos',
    tags: ['Aprobaciones', 'Workflow', 'Revisiones', 'Colaboración'],
    steps: [
      {
        title: 'Acceder al Gestor de Flujos',
        description: 'Abre la herramienta de gestión de flujos de aprobación',
        screenshot: {
          description: 'Menú con opción "Gestión de Flujos de Aprobación"',
          highlights: ['Opción del menú']
        },
        actions: [
          'Ve a Herramientas > Gestión de Flujos de Aprobación',
          'Se abrirá el panel de gestión',
          'Verás tus flujos existentes o una pantalla de inicio'
        ]
      },
      {
        title: 'Crear Nuevo Flujo',
        description: 'Inicia la creación de un flujo personalizado',
        screenshot: {
          description: 'Botón "Crear Nuevo Flujo"',
          highlights: ['Botón de creación']
        },
        actions: [
          'Haz clic en "Crear Nuevo Flujo"',
          'Introduce un nombre descriptivo para el flujo',
          'Añade una descripción que explique su propósito',
          'Selecciona el tipo de documentos al que aplicará'
        ],
        tips: [
          'Usa nombres claros como "Revisión de Planos de Ejecución"',
          'La descripción ayuda a otros usuarios a entender el flujo'
        ]
      },
      {
        title: 'Definir Etapas de Aprobación',
        description: 'Configura cada paso del proceso de revisión',
        screenshot: {
          description: 'Editor visual de etapas',
          highlights: ['Lista de etapas', 'Botón "Añadir Etapa"']
        },
        actions: [
          'Haz clic en "Añadir Etapa"',
          'Introduce un nombre para la etapa (ej: "Revisión Técnica")',
          'Asigna revisores para esta etapa',
          'Define si todos deben aprobar o solo uno',
          'Establece plazo límite para esta etapa (opcional)',
          'Repite para todas las etapas necesarias'
        ],
        tips: [
          'Ordena las etapas en secuencia lógica',
          'Puedes tener etapas en paralelo o secuenciales',
          'Asigna múltiples revisores para redundancia',
          'Los plazos ayudan a mantener el flujo en movimiento'
        ],
        notes: [
          'Cada etapa puede tener configuración de notificaciones',
          'Se pueden definir acciones automáticas al aprobar o rechazar'
        ]
      },
      {
        title: 'Configurar Reglas y Condiciones',
        description: 'Define comportamiento especial del flujo',
        screenshot: {
          description: 'Panel de reglas avanzadas',
          highlights: ['Condiciones', 'Acciones automáticas']
        },
        actions: [
          'Ve a la pestaña "Reglas Avanzadas"',
          'Define qué sucede si se rechaza en alguna etapa',
          'Configura escalado automático si hay retrasos',
          'Establece permisos de edición durante el flujo',
          'Configura notificaciones automáticas'
        ],
        tips: [
          'Puedes volver el documento a etapas anteriores si se rechaza',
          'El escalado notifica a supervisores si hay demora',
          'Bloquea la edición del documento durante revisión para integridad'
        ]
      },
      {
        title: 'Guardar y Activar Flujo',
        description: 'Finaliza la creación del flujo',
        screenshot: {
          description: 'Botones de guardar y activar',
          highlights: ['Botón "Guardar Flujo"', 'Switch "Activar"']
        },
        actions: [
          'Revisa toda la configuración del flujo',
          'Haz clic en "Guardar Flujo"',
          'Activa el flujo con el switch correspondiente',
          'El flujo queda disponible para usar en documentos'
        ],
        tips: [
          'Puedes guardar sin activar para terminar la configuración después',
          'Los flujos inactivos no aparecen para seleccionar',
          'Prueba el flujo con un documento de prueba primero'
        ]
      },
      {
        title: 'Aplicar Flujo a Documento',
        description: 'Inicia un proceso de aprobación',
        screenshot: {
          description: 'Menú contextual de documento con opción de flujo',
          highlights: ['Opción "Iniciar Flujo de Aprobación"']
        },
        actions: [
          'Selecciona un documento en el gestor',
          'Haz clic en "Iniciar Flujo de Aprobación"',
          'Selecciona el flujo a aplicar',
          'Añade comentarios iniciales si lo deseas',
          'Confirma el inicio del proceso'
        ],
        tips: [
          'Los revisores recibirán notificación inmediata',
          'El documento queda bloqueado para edición',
          'Puedes ver el progreso en tiempo real'
        ],
        notes: [
          'Solo usuarios autorizados pueden iniciar flujos',
          'El historial de aprobaciones se guarda permanentemente'
        ]
      },
      {
        title: 'Revisar y Aprobar Documentos',
        description: 'Proceso desde la perspectiva del revisor',
        screenshot: {
          description: 'Interfaz de revisión de documento',
          highlights: ['Documento a revisar', 'Botones Aprobar/Rechazar', 'Campo de comentarios']
        },
        actions: [
          'Abre la notificación de revisión pendiente',
          'Revisa el documento cuidadosamente',
          'Lee comentarios de etapas anteriores si las hay',
          'Añade tus propios comentarios',
          'Haz clic en "Aprobar" o "Rechazar"',
          'Confirma tu decisión'
        ],
        tips: [
          'Los comentarios son importantes para el seguimiento',
          'Puedes adjuntar archivos con observaciones',
          'Si rechazas, explica claramente los motivos',
          'Marca aspectos específicos del documento si es posible'
        ],
        notes: [
          'Tus acciones quedan registradas con timestamp',
          'No puedes cambiar tu decisión una vez confirmada',
          'Los demás revisores verán tus comentarios'
        ]
      }
    ]
  },
  {
    id: 'compliance-checker',
    title: 'Verificar Cumplimiento Normativo',
    description: 'Usa el asistente de IA para comprobar el cumplimiento de normativas',
    category: 'Normativa',
    difficulty: 'intermediate',
    estimatedTime: '10 minutos',
    tags: ['Normativa', 'CTE', 'IA', 'Compliance', 'Verificación'],
    steps: [
      {
        title: 'Acceder al Asistente Normativo',
        description: 'Abre la herramienta de verificación de normativas',
        screenshot: {
          description: 'Menú con opción "Asistente Normativo de IA"',
          highlights: ['Opción del menú']
        },
        actions: [
          'Ve a Herramientas > Asistente Normativo de IA',
          'Se abrirá el panel del asistente',
          'El asistente está listo para consultas'
        ]
      },
      {
        title: 'Introducir Datos del Proyecto',
        description: 'Proporciona información para el análisis',
        screenshot: {
          description: 'Formulario con datos del proyecto',
          highlights: ['Campos de tipo, ubicación, uso']
        },
        actions: [
          'Selecciona el proyecto si ya existe en el sistema',
          'O introduce manualmente los datos: tipo de edificio, ubicación, uso',
          'Añade características específicas relevantes',
          'Incluye superficie, altura, número de plantas si es aplicable'
        ],
        tips: [
          'Cuanto más específico seas, mejor será el análisis',
          'La ubicación afecta normativas locales aplicables',
          'Menciona usos mixtos si los hay'
        ]
      },
      {
        title: 'Realizar Consulta Normativa',
        description: 'Pregunta al asistente sobre normativas específicas',
        screenshot: {
          description: 'Campo de texto para consulta',
          highlights: ['Campo de pregunta', 'Botón "Consultar"']
        },
        actions: [
          'Escribe tu pregunta de forma clara',
          'Ejemplos: "¿Cumple CTE DB-SI para evacuación?", "Requisitos de accesibilidad"',
          'Haz clic en "Consultar"',
          'Espera la respuesta del asistente'
        ],
        tips: [
          'Sé específico en tus preguntas',
          'Puedes hacer preguntas de seguimiento',
          'El asistente conoce CTE, RITE, normativas autonómicas principales'
        ],
        notes: [
          'El asistente usa IA entrenada en normativa española',
          'Las respuestas son orientativas, verifica con la normativa oficial'
        ]
      },
      {
        title: 'Interpretar Resultados',
        description: 'Comprende la respuesta del asistente',
        screenshot: {
          description: 'Panel de respuesta con formato estructurado',
          highlights: ['Resultado del análisis', 'Referencias normativas']
        },
        actions: [
          'Lee la respuesta completa del asistente',
          'Revisa las referencias normativas citadas',
          'Verifica los cálculos o requerimientos indicados',
          'Anota puntos que requieran atención especial'
        ],
        tips: [
          'Las referencias incluyen sección exacta de la normativa',
          'Guarda respuestas importantes con el botón de guardar',
          'Puedes exportar el análisis completo a PDF'
        ]
      },
      {
        title: 'Generar Informe de Cumplimiento',
        description: 'Crea un documento formal del análisis',
        screenshot: {
          description: 'Botón "Generar Informe"',
          highlights: ['Opciones de informe']
        },
        actions: [
          'Haz clic en "Generar Informe de Cumplimiento"',
          'Selecciona qué consultas incluir',
          'Elige el formato (PDF, Word)',
          'Personaliza el contenido si es necesario',
          'Genera y descarga el informe'
        ],
        tips: [
          'El informe incluye todas las consultas y respuestas',
          'Se añaden referencias bibliográficas automáticamente',
          'Útil para adjuntar a memorias de proyectos'
        ],
        notes: [
          'Los informes son orientativos y no sustituyen a técnico competente',
          'Fecha y hora de generación se incluyen en el documento'
        ]
      }
    ]
  },
  {
    id: 'email-configuration',
    title: 'Configurar Servicio de Email',
    description: 'Configura el envío automático de emails desde la aplicación',
    category: 'Configuración',
    difficulty: 'intermediate',
    estimatedTime: '8 minutos',
    tags: ['Email', 'SMTP', 'Configuración', 'Notificaciones'],
    steps: [
      {
        title: 'Acceder a Configuración de Email',
        description: 'Abre el panel de configuración SMTP',
        screenshot: {
          description: 'Menú con opción "Configurar Email"',
          highlights: ['Opción del menú']
        },
        actions: [
          'Ve a Herramientas > Configurar Email',
          'Se abrirá el formulario de configuración SMTP'
        ]
      },
      {
        title: 'Introducir Datos del Servidor SMTP',
        description: 'Configura la conexión con tu proveedor de email',
        screenshot: {
          description: 'Formulario con campos SMTP',
          highlights: ['Campos de servidor, puerto, usuario, contraseña']
        },
        actions: [
          'Introduce el servidor SMTP (ej: smtp.gmail.com)',
          'Especifica el puerto (normalmente 587 para TLS o 465 para SSL)',
          'Selecciona el tipo de seguridad (TLS/SSL)',
          'Introduce tu usuario/email',
          'Introduce la contraseña o contraseña de aplicación',
          'Configura el email remitente que aparecerá'
        ],
        tips: [
          'Para Gmail: usa smtp.gmail.com, puerto 587, TLS',
          'Necesitas una contraseña de aplicación si tienes 2FA activado',
          'Para Outlook: smtp-mail.outlook.com, puerto 587',
          'Consulta la documentación de tu proveedor para configuración exacta'
        ],
        warnings: [
          'No uses tu contraseña personal, usa contraseñas de aplicación',
          'Algunos proveedores requieren habilitar acceso de aplicaciones menos seguras',
          'Las credenciales se almacenan de forma segura'
        ]
      },
      {
        title: 'Probar Conexión',
        description: 'Verifica que la configuración funcione',
        screenshot: {
          description: 'Botón "Probar Conexión"',
          highlights: ['Botón de prueba', 'Estado de conexión']
        },
        actions: [
          'Haz clic en "Probar Conexión"',
          'El sistema intentará conectar con el servidor SMTP',
          'Espera el resultado de la prueba',
          'Si hay error, revisa los datos introducidos'
        ],
        tips: [
          'La prueba envía un email de verificación',
          'Revisa tu bandeja de entrada para confirmar',
          'Verifica spam si no recibes el email de prueba'
        ]
      },
      {
        title: 'Guardar Configuración',
        description: 'Activa el servicio de email',
        screenshot: {
          description: 'Botón "Guardar Configuración"',
          highlights: ['Botón de guardar', 'Indicador de estado activo']
        },
        actions: [
          'Una vez la prueba sea exitosa, haz clic en "Guardar"',
          'La configuración queda activa',
          'Verás un indicador verde de servicio configurado'
        ],
        tips: [
          'Ahora puedes enviar facturas, notificaciones, etc. por email',
          'Puedes modificar la configuración en cualquier momento',
          'El historial de emails enviados está disponible en "Registro de Emails"'
        ]
      }
    ]
  }
]
