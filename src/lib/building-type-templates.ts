import { BuildingType, BuildingUse } from './types'

export interface BuildingTypeTemplate {
  type: BuildingType
  name: string
  description: string
  category: 'residencial' | 'comercial' | 'industrial' | 'educativo' | 'otro'
  defaultUse: BuildingUse
  specificRequirements: string[]
  regulatoryFocus: string[]
  typicalSpaces: string[]
  technicalConsiderations: string[]
  documentationNeeds: string[]
}

export const BUILDING_TYPE_TEMPLATES: BuildingTypeTemplate[] = [
  {
    type: 'vivienda-unifamiliar',
    name: 'Vivienda Unifamiliar',
    description: 'Edificación destinada a una única unidad de vivienda',
    category: 'residencial',
    defaultUse: 'residencial-vivienda',
    specificRequirements: [
      'Cumplimiento DB-HE (Ahorro de energía)',
      'Calificación energética obligatoria',
      'Estudio geotécnico si procede',
      'Justificación de accesibilidad'
    ],
    regulatoryFocus: ['CTE DB-HE', 'CTE DB-HS', 'CTE DB-SI', 'LOE'],
    typicalSpaces: [
      'Dormitorios',
      'Salón-comedor',
      'Cocina',
      'Baños',
      'Espacios de circulación',
      'Almacenamiento'
    ],
    technicalConsiderations: [
      'Sistema de calefacción/climatización',
      'Aislamiento térmico y acústico',
      'Ventilación natural y mecánica',
      'Instalación eléctrica e iluminación',
      'Fontanería y saneamiento'
    ],
    documentationNeeds: [
      'Memoria descriptiva y constructiva',
      'Planos de distribución y alzados',
      'Planos de instalaciones',
      'Estudio de estructuras',
      'Presupuesto y mediciones'
    ]
  },
  {
    type: 'edificio-oficinas',
    name: 'Edificio de Oficinas',
    description: 'Edificación destinada a uso administrativo y de oficinas',
    category: 'comercial',
    defaultUse: 'administrativo',
    specificRequirements: [
      'Accesibilidad universal obligatoria',
      'Instalación de climatización centralizada',
      'Sistema de detección y extinción de incendios',
      'Evacuación y señalización de emergencia',
      'Certificación energética',
      'Instalación de telecomunicaciones'
    ],
    regulatoryFocus: ['CTE DB-SI', 'CTE DB-SUA', 'CTE DB-HE', 'RITE', 'REBT'],
    typicalSpaces: [
      'Espacios de trabajo abiertos (open space)',
      'Despachos individuales',
      'Salas de reuniones',
      'Recepción y área de espera',
      'Zonas comunes (cafetería, break rooms)',
      'Aseos diferenciados',
      'Archivo y almacenamiento',
      'Sala de servidores/CPD',
      'Aparcamiento (si procede)'
    ],
    technicalConsiderations: [
      'Sistema HVAC (climatización)',
      'Falsos techos técnicos registrables',
      'Suelo técnico en zonas CPD',
      'Iluminación LED con control de presencia',
      'Red estructurada de telecomunicaciones',
      'Control de accesos',
      'Sistema de detección de incendios',
      'Flexibilidad en distribución interior'
    ],
    documentationNeeds: [
      'Memoria de uso administrativo',
      'Planos de distribución flexible',
      'Proyecto de instalaciones (climatización, electricidad, telecomunicaciones)',
      'Plan de evacuación y seguridad',
      'Estudio acústico',
      'Certificado energético',
      'Proyecto de actividad'
    ]
  },
  {
    type: 'centro-comercial',
    name: 'Centro Comercial',
    description: 'Complejo comercial con múltiples establecimientos',
    category: 'comercial',
    defaultUse: 'comercial',
    specificRequirements: [
      'Licencia de actividad',
      'Plan de autoprotección',
      'Sistemas avanzados de extinción de incendios',
      'Evacuación y señalización compleja',
      'Accesibilidad total',
      'Sistemas de megafonía y alarma',
      'Control de aforos'
    ],
    regulatoryFocus: ['CTE DB-SI', 'CTE DB-SUA', 'Normativa sectorial comercial', 'Plan de Autoprotección'],
    typicalSpaces: [
      'Locales comerciales',
      'Zona de restauración',
      'Pasillos y zonas de circulación',
      'Plazas centrales',
      'Aseos públicos',
      'Zonas de carga y descarga',
      'Locales técnicos',
      'Parking subterráneo/exterior',
      'Zona de residuos'
    ],
    technicalConsiderations: [
      'Sectores de incendio bien definidos',
      'Sistema BMS (Building Management System)',
      'Climatización por zonas',
      'Iluminación natural y artificial',
      'Extracción de humos',
      'Sistemas de seguridad y videovigilancia',
      'Red de hidrantes',
      'Instalaciones de ventilación forzada'
    ],
    documentationNeeds: [
      'Memoria de uso comercial',
      'Plan de autoprotección',
      'Proyecto de actividad múltiple',
      'Planos de evacuación',
      'Proyecto contra incendios',
      'Estudio de tráfico y accesos',
      'Plan de gestión de residuos'
    ]
  },
  {
    type: 'local-comercial',
    name: 'Local Comercial',
    description: 'Local individual destinado a actividad comercial o de servicios',
    category: 'comercial',
    defaultUse: 'comercial',
    specificRequirements: [
      'Licencia de actividad',
      'Proyecto de actividad',
      'Cumplimiento normativa específica según actividad',
      'Accesibilidad',
      'Extracción de humos (si procede)'
    ],
    regulatoryFocus: ['CTE DB-SI', 'CTE DB-SUA', 'Ordenanzas municipales', 'Normativa sectorial'],
    typicalSpaces: [
      'Zona de atención al público',
      'Zona de exposición',
      'Almacén',
      'Aseo',
      'Zona de empleados',
      'Escaparate'
    ],
    technicalConsiderations: [
      'Iluminación comercial',
      'Climatización adecuada',
      'Seguridad (alarmas, cámaras)',
      'Adaptación a normativa específica',
      'Accesibilidad PMR'
    ],
    documentationNeeds: [
      'Proyecto de actividad',
      'Planos de distribución',
      'Memoria técnica',
      'Instalaciones eléctricas',
      'Justificación normativa'
    ]
  },
  {
    type: 'hotel',
    name: 'Hotel',
    description: 'Establecimiento de alojamiento turístico',
    category: 'comercial',
    defaultUse: 'hotelero',
    specificRequirements: [
      'Licencia turística',
      'Clasificación por estrellas',
      'Cocina industrial (si tiene restaurante)',
      'Plan de autoprotección',
      'Accesibilidad PMR en habitaciones',
      'Sistema de climatización individual por habitación',
      'Detección y extinción de incendios'
    ],
    regulatoryFocus: ['CTE DB-SI', 'CTE DB-HR', 'Normativa turística autonómica', 'Reglamento hostelería'],
    typicalSpaces: [
      'Habitaciones',
      'Recepción y lobby',
      'Restaurante/comedor',
      'Cocina industrial',
      'Bar/cafetería',
      'Salas polivalentes',
      'Zona de spa/gimnasio (opcional)',
      'Lavandería',
      'Almacenes',
      'Zonas de servicio',
      'Parking'
    ],
    technicalConsiderations: [
      'Insonorización entre habitaciones',
      'Climatización individual',
      'Sistema de control de accesos con tarjetas',
      'Red wifi en todo el edificio',
      'Sistema de gestión hotelera (PMS)',
      'Instalaciones contra incendios',
      'ACS centralizado',
      'Extracción en cocinas'
    ],
    documentationNeeds: [
      'Memoria de uso hotelero',
      'Proyecto de actividad',
      'Plan de autoprotección',
      'Proyecto de cocina industrial',
      'Estudio acústico',
      'Certificación energética',
      'Planos de evacuación'
    ]
  },
  {
    type: 'restaurante',
    name: 'Restaurante/Cafetería',
    description: 'Local destinado a servicios de restauración',
    category: 'comercial',
    defaultUse: 'restauracion',
    specificRequirements: [
      'Licencia de apertura',
      'Proyecto de actividad',
      'Cocina con extracción de humos',
      'Cámara frigorífica',
      'Sistema de ventilación',
      'Cumplimiento normativa sanitaria',
      'Aseos diferenciados'
    ],
    regulatoryFocus: ['CTE DB-HS', 'Normativa sanitaria', 'Ordenanzas municipales', 'Reglamento hostelería'],
    typicalSpaces: [
      'Comedor/sala',
      'Cocina',
      'Zona de preparación',
      'Cámaras frigoríficas',
      'Almacén',
      'Aseos públicos',
      'Aseo de personal',
      'Zona de bar',
      'Terraza (si procede)'
    ],
    technicalConsiderations: [
      'Extracción de humos certificada',
      'Ventilación forzada',
      'Instalación frigorífica',
      'Pavimentos antideslizantes',
      'Revestimientos lavables',
      'Sistema contra incendios',
      'Climatización adecuada'
    ],
    documentationNeeds: [
      'Proyecto de actividad',
      'Proyecto de extracción de humos',
      'Memoria sanitaria',
      'Planos de distribución',
      'Instalaciones específicas'
    ]
  },
  {
    type: 'nave-industrial',
    name: 'Nave Industrial',
    description: 'Edificación para actividad industrial, producción o almacenaje',
    category: 'industrial',
    defaultUse: 'industrial',
    specificRequirements: [
      'Licencia de actividad industrial',
      'Evaluación de impacto ambiental (según actividad)',
      'Instalaciones contra incendios según sectores',
      'Evacuación de humos y ventilación',
      'Resistencia estructural para cargas específicas',
      'Accesos para vehículos pesados',
      'Cumplimiento RIPCI'
    ],
    regulatoryFocus: ['CTE DB-SI', 'RIPCI', 'Normativa ambiental', 'Normativa sectorial industrial'],
    typicalSpaces: [
      'Zona de producción/taller',
      'Zona de almacenamiento',
      'Zona de carga y descarga',
      'Oficinas',
      'Vestuarios y aseos',
      'Sala de máquinas',
      'Zona de residuos',
      'Aparcamiento de vehículos pesados'
    ],
    technicalConsiderations: [
      'Estructura metálica o prefabricada',
      'Gran altura libre',
      'Iluminación natural cenital',
      'Pavimento industrial reforzado',
      'Instalación eléctrica de potencia',
      'Puente grúa (si procede)',
      'Ventilación natural y forzada',
      'Sistema de detección y extinción automática',
      'Red de hidrantes',
      'Foso de carga/descarga'
    ],
    documentationNeeds: [
      'Memoria de actividad industrial',
      'Proyecto de actividad',
      'Cálculo de estructuras',
      'Instalaciones contra incendios',
      'Estudio de impacto ambiental',
      'Proyecto de instalaciones industriales',
      'Plan de prevención de riesgos laborales'
    ]
  },
  {
    type: 'almacen-logistico',
    name: 'Almacén Logístico',
    description: 'Edificación destinada a almacenamiento y distribución de mercancías',
    category: 'industrial',
    defaultUse: 'logistico',
    specificRequirements: [
      'Licencia de actividad',
      'Resistencia al fuego según altura de almacenamiento',
      'Sistemas automáticos de extinción (rociadores)',
      'Iluminación de emergencia reforzada',
      'Señalización de vías de evacuación',
      'Control de accesos',
      'Sistema de gestión de almacén (WMS)'
    ],
    regulatoryFocus: ['CTE DB-SI', 'RIPCI', 'Normativa de almacenamiento', 'PRL'],
    typicalSpaces: [
      'Zona de almacenamiento en altura',
      'Muelles de carga/descarga',
      'Zona de picking',
      'Zona de preparación de pedidos',
      'Oficinas administrativas',
      'Vestuarios',
      'Zona de baterías (carretillas)',
      'Parking de tráileres',
      'Zona de residuos y devoluciones'
    ],
    technicalConsiderations: [
      'Estructura para estanterías en altura',
      'Pavimento súper plano (tolerancias estrictas)',
      'Sistema de rociadores automáticos',
      'Detección precoz de incendios',
      'Iluminación LED de alta eficiencia',
      'Muelles niveladores',
      'Portones seccionales rápidos',
      'Sistema de gestión energética',
      'Instalación fotovoltaica (recomendada)',
      'Red de fibra óptica'
    ],
    documentationNeeds: [
      'Memoria de uso logístico',
      'Proyecto contra incendios (RIPCI)',
      'Cálculo estructural (cargas en estanterías)',
      'Estudio de pavimento industrial',
      'Instalaciones eléctricas de potencia',
      'Certificación energética',
      'Plan de autoprotección'
    ]
  },
  {
    type: 'taller-industrial',
    name: 'Taller Industrial',
    description: 'Instalación para trabajos de fabricación, reparación o mantenimiento',
    category: 'industrial',
    defaultUse: 'industrial',
    specificRequirements: [
      'Licencia de actividad',
      'Proyecto de actividad específico',
      'Instalaciones de seguridad',
      'Extracción de humos y gases',
      'Protección acústica',
      'Plan de prevención de riesgos'
    ],
    regulatoryFocus: ['CTE DB-SI', 'Normativa PRL', 'Normativa ambiental', 'Reglamento industrial'],
    typicalSpaces: [
      'Zona de trabajo/taller',
      'Zona de máquinas',
      'Almacén de materiales',
      'Almacén de producto terminado',
      'Oficina técnica',
      'Vestuarios',
      'Zona de residuos'
    ],
    technicalConsiderations: [
      'Instalación eléctrica trifásica',
      'Puntos de alimentación para maquinaria',
      'Extracción localizada',
      'Aire comprimido',
      'Protección contra incendios',
      'Insonorización'
    ],
    documentationNeeds: [
      'Proyecto de actividad',
      'Instalaciones industriales',
      'Estudio acústico',
      'Plan de gestión ambiental',
      'Memoria de seguridad'
    ]
  },
  {
    type: 'centro-produccion',
    name: 'Centro de Producción',
    description: 'Complejo para fabricación y producción industrial',
    category: 'industrial',
    defaultUse: 'industrial',
    specificRequirements: [
      'Autorización ambiental integrada (AAI)',
      'Licencia de actividad',
      'Evaluación de impacto ambiental',
      'Plan de emergencia industrial',
      'Instalaciones especiales según proceso',
      'Protección ambiental (emisiones, vertidos)'
    ],
    regulatoryFocus: ['Normativa ambiental', 'CTE DB-SI', 'Normativa industrial sectorial', 'PRL'],
    typicalSpaces: [
      'Líneas de producción',
      'Zona de materias primas',
      'Zona de producto acabado',
      'Sala de control',
      'Laboratorio de calidad',
      'Mantenimiento',
      'Oficinas',
      'Vestuarios y servicios',
      'EDAR (si procede)',
      'Subestación eléctrica'
    ],
    technicalConsiderations: [
      'Instalaciones de proceso específicas',
      'Suministro eléctrico de alta potencia',
      'Agua de proceso',
      'Tratamiento de efluentes',
      'Control de emisiones',
      'Automatización y control',
      'Sistemas de seguridad',
      'Redundancia en servicios críticos'
    ],
    documentationNeeds: [
      'Proyecto de actividad industrial',
      'Estudio de impacto ambiental',
      'Proyecto de instalaciones de proceso',
      'Plan de autoprotección',
      'Proyecto de depuradora (si procede)',
      'Memoria de PRL',
      'Auditoría energética'
    ]
  },
  {
    type: 'colegio',
    name: 'Colegio',
    description: 'Centro de educación infantil y primaria',
    category: 'educativo',
    defaultUse: 'docente',
    specificRequirements: [
      'Cumplimiento normativa educativa autonómica',
      'Ratios superficie/alumno',
      'Accesibilidad universal',
      'Evacuación y plan de autoprotección',
      'Patio de recreo dimensionado',
      'Instalaciones deportivas',
      'Comedor escolar (si procede)',
      'Certificación energética'
    ],
    regulatoryFocus: ['CTE DB-SI', 'CTE DB-SUA', 'Normativa educativa autonómica', 'CTE DB-HR'],
    typicalSpaces: [
      'Aulas de infantil',
      'Aulas de primaria',
      'Biblioteca',
      'Sala de informática',
      'Gimnasio/sala polivalente',
      'Comedor',
      'Cocina',
      'Administración y dirección',
      'Sala de profesores',
      'Aseos por edades',
      'Patio de recreo',
      'Pista polideportiva',
      'Conserjería',
      'Enfermería'
    ],
    technicalConsiderations: [
      'Protección acústica entre aulas',
      'Iluminación natural optimizada',
      'Climatización por zonas',
      'Ventilación adecuada (renovación de aire)',
      'Materiales resistentes y fácil limpieza',
      'Colores y señalización pedagógica',
      'Sistema de megafonía',
      'Control de accesos',
      'Videovigilancia en exteriores',
      'Mobiliario adaptado a edades'
    ],
    documentationNeeds: [
      'Memoria de uso docente',
      'Justificación normativa educativa',
      'Plan de autoprotección',
      'Estudio acústico',
      'Certificación energética',
      'Planos de evacuación',
      'Proyecto de actividad (comedor)',
      'Estudio de soleamiento'
    ]
  },
  {
    type: 'instituto',
    name: 'Instituto',
    description: 'Centro de educación secundaria',
    category: 'educativo',
    defaultUse: 'docente',
    specificRequirements: [
      'Cumplimiento normativa educativa autonómica',
      'Laboratorios específicos (física, química, biología)',
      'Talleres (tecnología)',
      'Instalaciones deportivas completas',
      'Biblioteca/mediateca',
      'Accesibilidad universal',
      'Plan de autoprotección'
    ],
    regulatoryFocus: ['CTE DB-SI', 'CTE DB-SUA', 'Normativa educativa', 'CTE DB-HR'],
    typicalSpaces: [
      'Aulas estándar',
      'Aulas de informática',
      'Laboratorios científicos',
      'Talleres de tecnología',
      'Aulas de música',
      'Aulas de dibujo/plástica',
      'Biblioteca/mediateca',
      'Gimnasio',
      'Vestuarios',
      'Pistas deportivas',
      'Salón de actos',
      'Cafetería',
      'Administración',
      'Sala de profesores',
      'Departamentos',
      'Orientación'
    ],
    technicalConsiderations: [
      'Laboratorios con extracción forzada',
      'Instalaciones específicas en talleres',
      'Insonorización reforzada (música)',
      'Red de datos de alta capacidad',
      'Climatización diferenciada',
      'Iluminación específica según uso',
      'Sistema de megafonía y alarma',
      'Control de accesos'
    ],
    documentationNeeds: [
      'Memoria de uso docente',
      'Proyecto de laboratorios',
      'Proyecto de talleres',
      'Plan de autoprotección',
      'Estudio acústico',
      'Instalaciones especiales',
      'Certificación energética'
    ]
  },
  {
    type: 'universidad',
    name: 'Universidad',
    description: 'Centro de educación superior y investigación',
    category: 'educativo',
    defaultUse: 'docente',
    specificRequirements: [
      'Normativa universitaria',
      'Instalaciones de investigación',
      'Biblioteca universitaria',
      'Aulas magna y seminarios',
      'Laboratorios especializados',
      'Accesibilidad universal',
      'Eficiencia energética alta',
      'Certificación sostenible (LEED, BREEAM)'
    ],
    regulatoryFocus: ['CTE completo', 'Normativa universitaria', 'Sostenibilidad', 'Accesibilidad'],
    typicalSpaces: [
      'Aulas magistrales',
      'Aulas de seminario',
      'Laboratorios de investigación',
      'Biblioteca/mediateca',
      'Salas de estudio',
      'Sala de grados',
      'Aula magna',
      'Despachos profesores',
      'Departamentos',
      'Administración y servicios',
      'Cafetería/restaurante',
      'Instalaciones deportivas',
      'Residencia universitaria (si procede)',
      'Centro de datos/CPD',
      'Aparcamiento'
    ],
    technicalConsiderations: [
      'Flexibilidad y modularidad',
      'Tecnología audiovisual avanzada',
      'Red de fibra óptica',
      'Laboratorios de alto nivel',
      'Sistema BMS integrado',
      'Climatización eficiente',
      'Iluminación LED inteligente',
      'Instalación fotovoltaica',
      'Recogida neumática de residuos',
      'Sistema de gestión universitaria'
    ],
    documentationNeeds: [
      'Memoria de uso docente superior',
      'Proyectos de instalaciones complejas',
      'Plan de autoprotección',
      'Certificación sostenible',
      'Proyectos de investigación (laboratorios)',
      'Estudio de accesibilidad',
      'Plan de gestión energética',
      'Auditoría ambiental'
    ]
  },
  {
    type: 'centro-formacion',
    name: 'Centro de Formación',
    description: 'Centro para formación profesional o continua',
    category: 'educativo',
    defaultUse: 'docente',
    specificRequirements: [
      'Normativa educativa de FP',
      'Talleres específicos por especialidad',
      'Equipamiento técnico',
      'Aulas polivalentes',
      'Accesibilidad'
    ],
    regulatoryFocus: ['CTE DB-SI', 'CTE DB-SUA', 'Normativa FP', 'PRL'],
    typicalSpaces: [
      'Aulas teóricas',
      'Talleres prácticos',
      'Laboratorios',
      'Aulas de informática',
      'Biblioteca/recursos',
      'Administración',
      'Sala de profesores',
      'Aseos',
      'Cafetería',
      'Conserjería'
    ],
    technicalConsiderations: [
      'Instalaciones específicas según especialidad',
      'Equipamiento técnico avanzado',
      'Ventilación en talleres',
      'Instalaciones de seguridad',
      'Red de datos',
      'Climatización'
    ],
    documentationNeeds: [
      'Memoria de uso docente',
      'Proyecto de talleres',
      'Instalaciones específicas',
      'Plan de autoprotección',
      'Certificación energética'
    ]
  },
  {
    type: 'guarderia',
    name: 'Guardería',
    description: 'Centro de educación infantil 0-3 años',
    category: 'educativo',
    defaultUse: 'docente',
    specificRequirements: [
      'Normativa específica 0-3 años',
      'Ratios superficie/niño muy estrictas',
      'Zona de lactancia',
      'Zona de cambio de pañales',
      'Cocina/office',
      'Patio exterior',
      'Materiales no tóxicos',
      'Seguridad extrema'
    ],
    regulatoryFocus: ['Normativa educativa infantil', 'CTE DB-SI', 'Normativa sanitaria', 'Seguridad infantil'],
    typicalSpaces: [
      'Aulas por edades (0-1, 1-2, 2-3 años)',
      'Sala de lactancia',
      'Zona de cambio',
      'Sala de siesta',
      'Cocina/office',
      'Comedor',
      'Patio de juegos',
      'Dirección',
      'Aseos adaptados',
      'Recepción/entrada',
      'Enfermería'
    ],
    technicalConsiderations: [
      'Protecciones en instalaciones eléctricas',
      'Climatización saludable',
      'Ventilación continua',
      'Materiales lavables y no tóxicos',
      'Suelos antideslizantes y amortiguadores',
      'Iluminación cálida y natural',
      'Control de temperatura estricto',
      'Agua caliente controlada',
      'Esquinas redondeadas',
      'Puertas con seguridad anti-pillado'
    ],
    documentationNeeds: [
      'Memoria de uso guardería',
      'Justificación normativa 0-3 años',
      'Proyecto de actividad',
      'Certificación de materiales',
      'Estudio de seguridad infantil',
      'Plan de emergencia',
      'Certificación energética'
    ]
  }
]

export function getBuildingTypeTemplate(type: BuildingType): BuildingTypeTemplate | undefined {
  return BUILDING_TYPE_TEMPLATES.find(t => t.type === type)
}

export function getBuildingTypesByCategory(category: 'residencial' | 'comercial' | 'industrial' | 'educativo' | 'otro') {
  return BUILDING_TYPE_TEMPLATES.filter(t => t.category === category)
}

export function getDocumentationChecklist(type: BuildingType): string[] {
  const template = getBuildingTypeTemplate(type)
  return template?.documentationNeeds || []
}
