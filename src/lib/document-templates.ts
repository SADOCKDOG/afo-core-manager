import { DocumentTemplate } from './types'

export const ARCHITECTURAL_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'memoria-basico',
    name: 'Memoria de Proyecto Básico',
    description: 'Plantilla completa para Memoria de Proyecto Básico según CTE',
    category: 'memoria',
    type: 'memoria',
    discipline: 'Arquitectura',
    folder: '02_Memorias',
    requiredFields: ['promotor', 'arquitecto', 'ubicacion', 'superficie'],
    sections: [
      {
        id: 'identificacion',
        title: '1. IDENTIFICACIÓN Y OBJETO DEL PROYECTO',
        content: `1.1. PROMOTOR
Nombre/Razón Social: [NOMBRE_PROMOTOR]
NIF/CIF: [NIF_PROMOTOR]
Dirección: [DIRECCION_PROMOTOR]

1.2. ARQUITECTO
Nombre: [NOMBRE_ARQUITECTO]
Razón Social: [RAZON_SOCIAL_ARQUITECTO]
NIF: [NIF_ARQUITECTO]
Nº Colegiado: [COLEGIADO]
Colegio: [COLEGIO_PROFESIONAL]
Dirección: [DIRECCION_ARQUITECTO]
Email: [EMAIL_ARQUITECTO]
Teléfono: [TELEFONO_ARQUITECTO]

1.3. OBJETO DEL PROYECTO
[DESCRIPCION_ACTUACION]

1.4. EMPLAZAMIENTO
Dirección: [DIRECCION_OBRA]
Referencia Catastral: [REF_CATASTRAL]
Clasificación del suelo: [CLASIFICACION]
Calificación urbanística: [CALIFICACION]`,
        order: 1,
        required: true
      },
      {
        id: 'antecedentes',
        title: '2. ANTECEDENTES Y CONDICIONANTES DE PARTIDA',
        content: `2.1. DESCRIPCIÓN DEL SOLAR
Superficie de parcela: [SUPERFICIE_PARCELA] m²
Linderos: [LINDEROS]
Topografía: [TOPOGRAFIA]

2.2. NORMATIVA URBANÍSTICA APLICABLE
Plan General: [PLAN_GENERAL]
Zona de ordenanza: [ZONA]
Parámetros urbanísticos aplicables:
  - Edificabilidad: [EDIFICABILIDAD]
  - Ocupación: [OCUPACION]
  - Altura máxima: [ALTURA_MAX]
  - Retranqueos: [RETRANQUEOS]

2.3. SERVICIOS URBANÍSTICOS
Abastecimiento de agua: [AGUA]
Saneamiento: [SANEAMIENTO]
Suministro eléctrico: [ELECTRICO]
Acceso rodado: [ACCESO]`,
        order: 2,
        required: true
      },
      {
        id: 'descripcion',
        title: '3. DESCRIPCIÓN DEL PROYECTO',
        content: `3.1. DESCRIPCIÓN GENERAL
[DESCRIPCION_GENERAL]

3.2. PROGRAMA DE NECESIDADES
[PROGRAMA]

3.3. SUPERFICIES
Superficie construida total: [SUP_CONSTRUIDA] m²
Superficie útil total: [SUP_UTIL] m²
Distribución por plantas:
  [DISTRIBUCION_PLANTAS]

3.4. DISTRIBUCIÓN Y USO DE LOS ESPACIOS
[DISTRIBUCION]`,
        order: 3,
        required: true
      },
      {
        id: 'cumplimiento-cte',
        title: '4. CUMPLIMIENTO DEL CTE Y OTRAS NORMATIVAS',
        content: `4.1. DB SE - SEGURIDAD ESTRUCTURAL
[JUSTIFICACION_SE]

4.2. DB SI - SEGURIDAD EN CASO DE INCENDIO
[JUSTIFICACION_SI]

4.3. DB SUA - SEGURIDAD DE UTILIZACIÓN Y ACCESIBILIDAD
[JUSTIFICACION_SUA]

4.4. DB HS - SALUBRIDAD
[JUSTIFICACION_HS]

4.5. DB HE - AHORRO DE ENERGÍA
[JUSTIFICACION_HE]

4.6. DB HR - PROTECCIÓN FRENTE AL RUIDO
[JUSTIFICACION_HR]`,
        order: 4,
        required: true
      },
      {
        id: 'prestaciones',
        title: '5. PRESTACIONES DEL EDIFICIO',
        content: `5.1. REQUISITOS BÁSICOS
Según Art. 3 de la LOE y Parte I del CTE

5.2. LIMITACIONES DE USO
[LIMITACIONES]

5.3. CONDICIONES DE MANTENIMIENTO
[MANTENIMIENTO]`,
        order: 5,
        required: false
      }
    ]
  },
  {
    id: 'memoria-ejecucion',
    name: 'Memoria de Proyecto de Ejecución',
    description: 'Plantilla completa para Memoria de Proyecto de Ejecución',
    category: 'memoria',
    type: 'memoria',
    discipline: 'Arquitectura',
    folder: '02_Memorias',
    requiredFields: ['promotor', 'arquitecto', 'ubicacion', 'superficie', 'constructor'],
    sections: [
      {
        id: 'memoria-descriptiva',
        title: '1. MEMORIA DESCRIPTIVA',
        content: `1.1. AGENTES
Promotor: [PROMOTOR]
Proyectista: [PROYECTISTA]
Dirección Facultativa: [DIRECCION_FACULTATIVA]
Constructor: [CONSTRUCTOR]

1.2. INFORMACIÓN PREVIA
Antecedentes y condicionantes de partida
Datos del emplazamiento
Entorno físico
Normativa urbanística

1.3. DESCRIPCIÓN DEL PROYECTO
Descripción general del edificio
Programa de necesidades
Uso característico y otros usos previstos
Relación con el entorno

1.4. PRESTACIONES DEL EDIFICIO
Por requisitos básicos y en relación con las exigencias básicas del CTE`,
        order: 1,
        required: true
      },
      {
        id: 'memoria-constructiva',
        title: '2. MEMORIA CONSTRUCTIVA',
        content: `2.1. SUSTENTACIÓN DEL EDIFICIO
Estudio geotécnico
Características del terreno
Cimentación

2.2. SISTEMA ESTRUCTURAL
Estructura de cimentación
Estructura portante
Estructura horizontal

2.3. SISTEMA ENVOLVENTE
Fachadas
Cubiertas
Suelos en contacto con el terreno

2.4. SISTEMA DE COMPARTIMENTACIÓN
Elementos de compartimentación interior vertical
Elementos de compartimentación interior horizontal

2.5. SISTEMAS DE ACABADOS
Exteriores
Interiores

2.6. SISTEMAS DE ACONDICIONAMIENTO E INSTALACIONES
Fontanería
Evacuación de aguas
Climatización
Electricidad
Iluminación
Telecomunicaciones
Protección contra incendios`,
        order: 2,
        required: true
      },
      {
        id: 'cumplimiento-cte-detallado',
        title: '3. CUMPLIMIENTO DEL CTE',
        content: `3.1. SEGURIDAD ESTRUCTURAL (DB-SE)
DB-SE-AE: Acciones en la edificación
DB-SE-C: Cimientos
DB-SE-A: Acero
DB-SE-F: Fábrica
DB-SE-M: Madera

3.2. SEGURIDAD EN CASO DE INCENDIO (DB-SI)
SI 1: Propagación interior
SI 2: Propagación exterior
SI 3: Evacuación de ocupantes
SI 4: Instalaciones de protección contra incendios
SI 5: Intervención de bomberos
SI 6: Resistencia al fuego de la estructura

3.3. SEGURIDAD DE UTILIZACIÓN Y ACCESIBILIDAD (DB-SUA)
SUA 1: Seguridad frente al riesgo de caídas
SUA 2: Seguridad frente al riesgo de impacto o atrapamiento
SUA 3: Seguridad frente al riesgo de aprisionamiento en recintos
SUA 4: Seguridad frente al riesgo causado por iluminación inadecuada
SUA 5: Seguridad frente al riesgo causado por situaciones de alta ocupación
SUA 6: Seguridad frente al riesgo de ahogamiento
SUA 7: Seguridad frente al riesgo causado por vehículos en movimiento
SUA 8: Seguridad frente al riesgo causado por la acción del rayo
SUA 9: Accesibilidad

3.4. SALUBRIDAD (DB-HS)
HS 1: Protección frente a la humedad
HS 2: Recogida y evacuación de residuos
HS 3: Calidad del aire interior
HS 4: Suministro de agua
HS 5: Evacuación de aguas

3.5. PROTECCIÓN FRENTE AL RUIDO (DB-HR)

3.6. AHORRO DE ENERGÍA Y AISLAMIENTO TÉRMICO (DB-HE)
HE 0: Limitación del consumo energético
HE 1: Condiciones para el control de la demanda energética
HE 2: Condiciones de las instalaciones térmicas
HE 3: Condiciones de las instalaciones de iluminación
HE 4: Contribución mínima de energía renovable
HE 5: Generación mínima de energía eléctrica`,
        order: 3,
        required: true
      },
      {
        id: 'anejos',
        title: '4. ANEJOS A LA MEMORIA',
        content: `4.1. INFORMACIÓN GEOTÉCNICA
4.2. CÁLCULO DE LA ESTRUCTURA
4.3. PROTECCIÓN CONTRA INCENDIOS
4.4. INSTALACIONES DEL EDIFICIO
4.5. EFICIENCIA ENERGÉTICA
4.6. ESTUDIO DE GESTIÓN DE RESIDUOS
4.7. PLAN DE CONTROL DE CALIDAD
4.8. ESTUDIO DE SEGURIDAD Y SALUD`,
        order: 4,
        required: true
      }
    ]
  },
  {
    id: 'justificacion-cte-he',
    name: 'Justificación DB-HE Ahorro de Energía',
    description: 'Documento de justificación del cumplimiento del DB-HE del CTE',
    category: 'calculo',
    type: 'memoria',
    discipline: 'Instalaciones',
    folder: '07_Instalaciones',
    requiredFields: ['zona_climatica', 'superficie_util', 'uso'],
    sections: [
      {
        id: 'caracterizacion',
        title: '1. CARACTERIZACIÓN Y CUANTIFICACIÓN DE LAS EXIGENCIAS',
        content: `1.1. ÁMBITO DE APLICACIÓN
Edificio de nueva construcción
Superficie útil: [SUPERFICIE_UTIL] m²
Uso del edificio: [USO_EDIFICIO]
Zona climática: [ZONA_CLIMATICA]

1.2. PROCEDIMIENTO DE VERIFICACIÓN
Opción general: Programa de cálculo reconocido`,
        order: 1,
        required: true
      },
      {
        id: 'he0',
        title: '2. HE 0 - LIMITACIÓN DEL CONSUMO ENERGÉTICO',
        content: `2.1. CONSUMO ENERGÉTICO DE ENERGÍA PRIMARIA NO RENOVABLE
Valor calculado: [CEP_NR] kWh/m²·año
Valor límite: [CEP_NR_LIMITE] kWh/m²·año
Cumplimiento: [CUMPLE_HE0]

2.2. JUSTIFICACIÓN
[JUSTIFICACION_HE0]`,
        order: 2,
        required: true
      },
      {
        id: 'he1',
        title: '3. HE 1 - CONDICIONES PARA EL CONTROL DE LA DEMANDA ENERGÉTICA',
        content: `3.1. CARACTERÍSTICAS DE LA ENVOLVENTE TÉRMICA
Transmitancia térmica límite de muros: U ≤ [U_MUROS] W/m²K
Transmitancia térmica límite de cubiertas: U ≤ [U_CUBIERTAS] W/m²K
Transmitancia térmica límite de suelos: U ≤ [U_SUELOS] W/m²K
Transmitancia térmica límite de huecos: U ≤ [U_HUECOS] W/m²K

3.2. DEMANDA ENERGÉTICA
Demanda calefacción: [DEM_CAL] kWh/m²·año (Límite: [DEM_CAL_LIM])
Demanda refrigeración: [DEM_REF] kWh/m²·año (Límite: [DEM_REF_LIM])
Cumplimiento: [CUMPLE_HE1]

3.3. CONDENSACIONES
Verificación de condensaciones intersticiales
Verificación de condensaciones superficiales`,
        order: 3,
        required: true
      },
      {
        id: 'he4',
        title: '4. HE 4 - CONTRIBUCIÓN MÍNIMA DE ENERGÍA RENOVABLE',
        content: `4.1. CONTRIBUCIÓN SOLAR PARA ACS
Demanda ACS: [DEMANDA_ACS] kWh/año
Contribución solar mínima: [CONTRIB_SOLAR_MIN] %
Contribución solar proyectada: [CONTRIB_SOLAR] %
Sistema propuesto: [SISTEMA_SOLAR]
Superficie captación: [SUP_CAPTADORES] m²

4.2. JUSTIFICACIÓN DEL CUMPLIMIENTO
[JUSTIFICACION_HE4]`,
        order: 4,
        required: true
      },
      {
        id: 'calificacion',
        title: '5. CALIFICACIÓN ENERGÉTICA',
        content: `5.1. RESULTADO DE LA CALIFICACIÓN
Emisiones CO₂: [EMISIONES] kgCO₂/m²·año
Consumo Energía Primaria No Renovable: [CONSUMO_EP_NR] kWh/m²·año
Consumo Energía Primaria Total: [CONSUMO_EP_TOTAL] kWh/m²·año
Demanda calefacción: [DEMANDA_CAL] kWh/m²·año
Demanda refrigeración: [DEMANDA_REF] kWh/m²·año

Calificación global: [LETRA_CALIFICACION]

5.2. ANEXO: CERTIFICADO ENERGÉTICO
[Incluir certificado energético del edificio]`,
        order: 5,
        required: true
      }
    ]
  },
  {
    id: 'pliego-condiciones',
    name: 'Pliego de Condiciones',
    description: 'Pliego de condiciones técnicas particulares',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['promotor', 'arquitecto'],
    sections: [
      {
        id: 'condiciones-generales',
        title: '1. CONDICIONES GENERALES',
        content: `1.1. OBJETO DEL PLIEGO
El presente Pliego de Condiciones tiene por objeto establecer las condiciones técnicas particulares que han de cumplir las unidades de obra para la ejecución del proyecto.

1.2. DOCUMENTOS DEL PROYECTO
La documentación del proyecto comprende:
- Memoria descriptiva y constructiva
- Planos
- Pliego de condiciones
- Mediciones y presupuesto
- Estudio de Seguridad y Salud

1.3. COMPATIBILIDAD Y RELACIÓN ENTRE DOCUMENTOS
En caso de contradicción o simple complemento de unos con otros, el orden de prelación será:
1. Planos
2. Pliego de condiciones
3. Presupuesto
4. Memoria`,
        order: 1,
        required: true
      },
      {
        id: 'condiciones-facultativas',
        title: '2. CONDICIONES FACULTATIVAS',
        content: `2.1. AGENTES DE LA EDIFICACIÓN
Promotor
Proyectista
Director de obra
Director de ejecución de obra
Constructor
Suministradores de productos
Entidades y laboratorios de control de calidad

2.2. OBLIGACIONES Y DERECHOS DEL CONSTRUCTOR
Verificación del replanteo
Oficina en la obra
Representación del Constructor
Presencia del Constructor
Trabajos no estipulados
Reclamaciones contra las órdenes de la Dirección Facultativa
Faltas de personal

2.3. DIRECCIÓN FACULTATIVA
Obligaciones de la Dirección Facultativa
Libro de Órdenes y Asistencias
Modificaciones del proyecto
Recepciones`,
        order: 2,
        required: true
      },
      {
        id: 'condiciones-economicas',
        title: '3. CONDICIONES ECONÓMICAS',
        content: `3.1. PRINCIPIO GENERAL
Todos los agentes que intervienen en el proceso de la edificación tienen derecho a percibir puntualmente las cantidades devengadas por su correcta actuación.

3.2. FIANZAS Y GARANTÍAS
Fianza en metálico
Retención en concepto de garantía

3.3. PRECIOS
Precio de ejecución material (PEM)
Precio de contrata

3.4. REVISIÓN DE PRECIOS
[CONDICIONES_REVISION]

3.5. VALORACIÓN Y ABONO DE LOS TRABAJOS
Certificaciones mensuales
Abono de trabajos
Mejoras y modificaciones de obra`,
        order: 3,
        required: true
      },
      {
        id: 'condiciones-tecnicas',
        title: '4. CONDICIONES TÉCNICAS',
        content: `4.1. CONDICIONES GENERALES
Todos los trabajos se ejecutarán con estricta sujeción al proyecto, a las modificaciones debidamente autorizadas y a las órdenes e instrucciones de la Dirección Facultativa.

4.2. MATERIALES
Control de calidad de los materiales
Ensayos y análisis de materiales
Almacenamiento

4.3. EJECUCIÓN DE LAS OBRAS
Replanteos
Movimiento de tierras
Cimentaciones
Estructuras
Albañilería
Cubiertas
Revestimientos
Carpintería
Instalaciones

4.4. CONTROL DE CALIDAD
Plan de control de calidad
Ensayos obligatorios
Libro de control`,
        order: 4,
        required: true
      },
      {
        id: 'prescripciones-materiales',
        title: '5. PRESCRIPCIONES SOBRE MATERIALES',
        content: `5.1. PRODUCTOS DE HORMIGÓN
Hormigones: [TIPO_HORMIGON]
Aceros de armar: [TIPO_ACERO]
Control de calidad

5.2. MATERIALES DE ALBAÑILERÍA
Ladrillos cerámicos
Bloques de hormigón
Morteros

5.3. MATERIALES AISLANTES
Aislamiento térmico: [AISLAMIENTO_TERMICO]
Aislamiento acústico: [AISLAMIENTO_ACUSTICO]

5.4. MATERIALES DE REVESTIMIENTO
Enfoscados y revocos
Alicatados
Solados
Pinturas

5.5. CARPINTERÍA
Carpintería de madera
Carpintería metálica
Carpintería de PVC
Vidrios`,
        order: 5,
        required: true
      }
    ]
  },
  {
    id: 'mediciones-presupuesto',
    name: 'Mediciones y Presupuesto',
    description: 'Documento de mediciones y presupuesto de proyecto',
    category: 'presupuesto',
    type: 'presupuesto',
    folder: '03_Presupuestos',
    requiredFields: ['proyecto'],
    sections: [
      {
        id: 'mediciones',
        title: '1. MEDICIONES',
        content: `1.1. ACONDICIONAMIENTO DEL TERRENO
  1.1.1. Demoliciones y derribos
  1.1.2. Movimiento de tierras
  1.1.3. Red de saneamiento horizontal

1.2. CIMENTACIÓN
  1.2.1. Excavaciones
  1.2.2. Hormigón de limpieza
  1.2.3. Zapatas
  1.2.4. Vigas de atado

1.3. ESTRUCTURA
  1.3.1. Pilares
  1.3.2. Vigas
  1.3.3. Forjados

1.4. ALBAÑILERÍA
  1.4.1. Fachadas
  1.4.2. Tabiquería interior
  1.4.3. Revestimientos

1.5. CUBIERTAS E IMPERMEABILIZACIONES
  1.5.1. Cubierta plana
  1.5.2. Impermeabilizaciones

1.6. INSTALACIONES
  1.6.1. Fontanería y ACS
  1.6.2. Saneamiento
  1.6.3. Electricidad
  1.6.4. Climatización`,
        order: 1,
        required: true
      },
      {
        id: 'cuadro-precios-1',
        title: '2. CUADRO DE PRECIOS Nº 1',
        content: `Precios de ejecución material de cada unidad de obra, expresados en letra y cifra.

[CUADRO_PRECIOS_1]`,
        order: 2,
        required: true
      },
      {
        id: 'cuadro-precios-2',
        title: '3. CUADRO DE PRECIOS Nº 2',
        content: `Descomposición de cada precio unitario en mano de obra, materiales y maquinaria.

[CUADRO_PRECIOS_2]`,
        order: 3,
        required: true
      },
      {
        id: 'presupuesto',
        title: '4. PRESUPUESTO',
        content: `4.1. RESUMEN POR CAPÍTULOS

CAPÍTULO 1: Acondicionamiento del terreno ... [IMPORTE_CAP1] €
CAPÍTULO 2: Cimentación .................... [IMPORTE_CAP2] €
CAPÍTULO 3: Estructura ..................... [IMPORTE_CAP3] €
CAPÍTULO 4: Albañilería .................... [IMPORTE_CAP4] €
CAPÍTULO 5: Cubiertas ...................... [IMPORTE_CAP5] €
CAPÍTULO 6: Instalaciones .................. [IMPORTE_CAP6] €
CAPÍTULO 7: Carpintería .................... [IMPORTE_CAP7] €
CAPÍTULO 8: Revestimientos y acabados ...... [IMPORTE_CAP8] €
CAPÍTULO 9: Urbanización ................... [IMPORTE_CAP9] €
CAPÍTULO 10: Seguridad y Salud ............. [IMPORTE_CAP10] €
CAPÍTULO 11: Gestión de residuos ........... [IMPORTE_CAP11] €
CAPÍTULO 12: Control de calidad ............ [IMPORTE_CAP12] €

PRESUPUESTO DE EJECUCIÓN MATERIAL (PEM) .... [PEM] €

13% Gastos Generales ....................... [GG] €
6% Beneficio Industrial .................... [BI] €

SUMA ....................................... [SUMA] €
21% I.V.A. ................................. [IVA] €

PRESUPUESTO DE EJECUCIÓN POR CONTRATA ...... [PEC] €

Asciende el presupuesto de ejecución por contrata a la cantidad de:
[IMPORTE_LETRA] EUROS`,
        order: 4,
        required: true
      }
    ]
  },
  {
    id: 'estudio-gestion-residuos',
    name: 'Estudio de Gestión de Residuos',
    description: 'Estudio de gestión de residuos de construcción y demolición',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['promotor', 'ubicacion'],
    sections: [
      {
        id: 'contenido',
        title: '1. CONTENIDO DEL DOCUMENTO',
        content: `El presente Estudio de Gestión de Residuos de Construcción y Demolición se redacta en cumplimiento del Real Decreto 105/2008, de 1 de febrero, por el que se regula la producción y gestión de los residuos de construcción y demolición.`,
        order: 1,
        required: true
      },
      {
        id: 'estimacion',
        title: '2. ESTIMACIÓN DE LA CANTIDAD DE RESIDUOS',
        content: `2.1. ESTIMACIÓN DE RESIDUOS DE CONSTRUCCIÓN

Según el Código Europeo de Residuos (Orden MAM/304/2002):

RCD NIVEL I: TIERRAS Y PÉTROS DE LA EXCAVACIÓN
17 05 04 Tierras y piedras ..................... [TIERRAS] t

RCD NIVEL II: RCD DE NATURALEZA NO PÉTREA
17 02 01 Madera ................................ [MADERA] t
17 02 02 Vidrio ................................ [VIDRIO] t
17 02 03 Plástico .............................. [PLASTICO] t
17 04 07 Metales mezclados ..................... [METALES] t
17 06 04 Materiales de aislamiento ............. [AISLAMIENTO] t

RCD NIVEL II: RCD DE NATURALEZA PÉTREA
17 01 01 Hormigón .............................. [HORMIGON] t
17 01 02 Ladrillos ............................. [LADRILLO] t
17 01 03 Tejas y materiales cerámicos .......... [CERAMICOS] t

TOTAL ESTIMACIÓN: [TOTAL_RESIDUOS] t`,
        order: 2,
        required: true
      },
      {
        id: 'medidas-prevencion',
        title: '3. MEDIDAS DE PREVENCIÓN',
        content: `3.1. ALTERNATIVAS DE PROYECTO
[ALTERNATIVAS_PROYECTO]

3.2. PREVENCIÓN EN OBRA
- Optimización del replanteo de obra
- Correcta planificación de compras
- Adecuado acopio de materiales
- Planificación de la gestión de residuos

3.3. REUTILIZACIÓN Y VALORIZACIÓN
[MEDIDAS_REUTILIZACION]`,
        order: 3,
        required: true
      },
      {
        id: 'operaciones',
        title: '4. OPERACIONES DE GESTIÓN',
        content: `4.1. SEPARACIÓN DE RESIDUOS
Conforme al artículo 5.5 del RD 105/2008, se realizará la separación en las siguientes fracciones:
- Hormigón
- Ladrillos, tejas y cerámicos
- Metales
- Madera
- Vidrio
- Plástico
- Papel y cartón

4.2. DESTINO PREVISTO
Gestor autorizado: [GESTOR]
Dirección: [DIRECCION_GESTOR]
Nº autorización: [AUTORIZACION]

4.3. PLANO DE INSTALACIONES
Contenedores para separación selectiva ubicados en: [UBICACION_CONTENEDORES]`,
        order: 4,
        required: true
      },
      {
        id: 'presupuesto-residuos',
        title: '5. PRESUPUESTO',
        content: `5.1. COSTE PREVISTO DE LA GESTIÓN

Alquiler de contenedores .................. [ALQUILER] €
Transporte a vertedero autorizado ......... [TRANSPORTE] €
Canon de vertido .......................... [CANON] €

TOTAL GESTIÓN DE RESIDUOS ................. [TOTAL_GESTION] €

El presupuesto de gestión de residuos asciende a:
[IMPORTE_LETRA] EUROS`,
        order: 5,
        required: true
      }
    ]
  },
  {
    id: 'caratula-plano',
    name: 'Carátula de Plano',
    description: 'Plantilla de información para carátulas de planos arquitectónicos',
    category: 'planos',
    type: 'plano',
    discipline: 'Arquitectura',
    folder: '01_Planos',
    requiredFields: ['proyecto', 'arquitecto', 'escala'],
    sections: [
      {
        id: 'informacion-basica',
        title: 'INFORMACIÓN DE CARÁTULA',
        content: `DATOS DEL PROYECTO:
Proyecto: [NOMBRE_PROYECTO]
Situación: [DIRECCION]
Promotor: [PROMOTOR]

EQUIPO TÉCNICO:
Arquitecto: [ARQUITECTO]
Nº Colegiado: [COLEGIADO]
Colaboradores: [COLABORADORES]

DATOS DEL PLANO:
Título: [TITULO_PLANO]
Contenido: [DESCRIPCION_CONTENIDO]
Escala: [ESCALA]
Formato: [FORMATO]
Fecha: [FECHA]
Nº Plano: [NUMERO_PLANO]
Revisión: [REVISION]`,
        order: 1,
        required: true
      }
    ]
  },
  {
    id: 'certificado-final-obra',
    name: 'Certificado Final de Obra',
    description: 'Certificado de finalización de obra',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['promotor', 'direccion_obra', 'arquitecto', 'constructor'],
    sections: [
      {
        id: 'certificado',
        title: 'CERTIFICADO FINAL DE OBRA',
        content: `D./Dª [NOMBRE_ARQUITECTO], colegiado nº [NUM_COLEGIADO] del [COLEGIO_PROFESIONAL], como Director de Obra del proyecto "[NOMBRE_PROYECTO]", situado en [DIRECCION_OBRA], promovido por [PROMOTOR], con NIF [NIF_PROMOTOR],

CERTIFICA:

Que las obras correspondientes al proyecto de referencia han sido ejecutadas bajo mi dirección facultativa.

Que dichas obras han sido realizadas de acuerdo con el proyecto visado por el [COLEGIO_PROFESIONAL] en fecha [FECHA_VISADO] con el número de expediente [NUM_EXPEDIENTE].

Que las obras se han ejecutado conforme al Código Técnico de la Edificación y demás normativa de aplicación.

Que el constructor ha sido la empresa [CONSTRUCTOR], con CIF [CIF_CONSTRUCTOR].

Que la fecha de finalización efectiva de las obras ha sido el día [FECHA_FIN].

Que se ha expedido el correspondiente Certificado de Eficiencia Energética del edificio terminado.

Y para que conste y surta los efectos oportunos, expido el presente certificado en [LUGAR], a [FECHA].

Fdo.: [NOMBRE_ARQUITECTO]
      [COLEGIADO]`,
        order: 1,
        required: true
      }
    ]
  },
  {
    id: 'acta-replanteo',
    name: 'Acta de Replanteo',
    description: 'Acta de comprobación del replanteo previo al inicio de la obra',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['promotor', 'direccion_obra', 'arquitecto', 'constructor'],
    sections: [
      {
        id: 'acta',
        title: 'ACTA DE COMPROBACIÓN DEL REPLANTEO',
        content: `En [LUGAR], a [FECHA]

REUNIDOS:

D./Dª [NOMBRE_PROMOTOR], con NIF [NIF_PROMOTOR], en representación de [PROMOTOR], en su calidad de PROMOTOR.

D./Dª [NOMBRE_ARQUITECTO], con NIF [NIF_ARQUITECTO], Colegiado nº [NUM_COLEGIADO] del [COLEGIO], actuando como ARQUITECTO DIRECTOR DE OBRA.

D./Dª [NOMBRE_APAREJADOR], con NIF [NIF_APAREJADOR], Colegiado nº [NUM_COLEGIADO_AP], actuando como ARQUITECTO TÉCNICO DIRECTOR DE EJECUCIÓN DE OBRA.

D./Dª [NOMBRE_CONSTRUCTOR], con NIF [NIF_CONSTRUCTOR], en representación de [CONSTRUCTOR], con CIF [CIF_CONSTRUCTOR], como CONSTRUCTOR.

OBJETO:

Dar cumplimiento a lo establecido en el artículo 12.3.a) de la Ley 38/1999 de Ordenación de la Edificación, procediendo a la comprobación del replanteo de las obras del proyecto "[NOMBRE_PROYECTO]", situadas en [DIRECCION_OBRA].

DOCUMENTACIÓN TÉCNICA:

El proyecto ha sido redactado por [PROYECTISTA] y visado por el [COLEGIO] con fecha [FECHA_VISADO], expediente nº [NUM_EXPEDIENTE].

COMPROBACIONES REALIZADAS:

1. Se ha comprobado la realidad geométrica de la obra proyectada y la disponibilidad de los terrenos necesarios para su normal ejecución.

2. Se ha verificado que las características del suelo son las adecuadas y compatibles con las previstas en el proyecto, conforme al estudio geotécnico [REFERENCIA_GEOTECNICO].

3. Se han comprobado las alineaciones y rasantes señaladas en el proyecto, así como los elementos de replanteo necesarios para su correcta ejecución.

4. Se ha verificado la idoneidad de los accesos, puntos de acometida de servicios y espacios para acopio de materiales.

RESULTADO:

Realizadas las comprobaciones anteriores, los reunidos declaran que:
☐ El replanteo es CONFORME y se autoriza el inicio de las obras
☐ El replanteo NO ES CONFORME y es necesario subsanar: [DEFICIENCIAS]

Y para que conste, firman la presente acta todos los comparecientes.

[FIRMAS]`,
        order: 1,
        required: true
      }
    ]
  },
  {
    id: 'libro-ordenes',
    name: 'Libro de Órdenes y Asistencias',
    description: 'Plantilla para registro de órdenes y asistencias en obra',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['proyecto', 'direccion_obra'],
    sections: [
      {
        id: 'orden',
        title: 'ASIENTO DE LIBRO DE ÓRDENES',
        content: `PROYECTO: [NOMBRE_PROYECTO]
SITUACIÓN: [DIRECCION_OBRA]

Orden nº: [NUMERO_ORDEN]
Fecha: [FECHA]
Firmante: [NOMBRE_FIRMANTE]
Cargo: [CARGO]

DESCRIPCIÓN DE LA ORDEN:

[DESCRIPCION_ORDEN]

UNIDAD DE OBRA AFECTADA:
[UNIDAD_OBRA]

PLAZO DE EJECUCIÓN:
[PLAZO]

OBSERVACIONES:
[OBSERVACIONES]

Fdo.: [NOMBRE_FIRMANTE]`,
        order: 1,
        required: true
      }
    ]
  },
  {
    id: 'certificacion-obra',
    name: 'Certificación de Obra',
    description: 'Certificación mensual de obra ejecutada',
    category: 'presupuesto',
    type: 'presupuesto',
    folder: '03_Presupuestos',
    requiredFields: ['promotor', 'proyecto', 'arquitecto'],
    sections: [
      {
        id: 'certificacion',
        title: 'CERTIFICACIÓN DE OBRA',
        content: `CERTIFICACIÓN Nº [NUM_CERTIFICACION]

PROYECTO: [NOMBRE_PROYECTO]
SITUACIÓN: [DIRECCION_OBRA]
PROMOTOR: [PROMOTOR]
CONSTRUCTOR: [CONSTRUCTOR]

El que suscribe, [NOMBRE_ARQUITECTO], Arquitecto Director de Obra,

CERTIFICA:

Que en las obras de referencia se han ejecutado durante el periodo comprendido entre [FECHA_INICIO] y [FECHA_FIN], las siguientes unidades de obra:

RELACIÓN VALORADA:

[RELACION_VALORADA]

RESUMEN:

Certificación anterior ................. [CERT_ANTERIOR] €
Obra ejecutada en este periodo .......... [OBRA_PERIODO] €
TOTAL OBRA EJECUTADA .................... [TOTAL_EJECUTADA] €
Porcentaje sobre PEM .................... [PORCENTAJE] %

PRESUPUESTO EJECUCIÓN MATERIAL (PEM) .... [PEM_PERIODO] €
13% Gastos Generales .................... [GG] €
6% Beneficio Industrial ................. [BI] €
SUMA ........................................ [SUMA] €
21% I.V.A. .................................. [IVA] €
TOTAL A CERTIFICAR .......................... [TOTAL] €

Y para que conste y surta los efectos oportunos, expido la presente certificación en [LUGAR], a [FECHA].

Fdo.: [NOMBRE_ARQUITECTO]
      Arquitecto Director de Obra`,
        order: 1,
        required: true
      }
    ]
  },
  {
    id: 'licencia-primera-ocupacion',
    name: 'Solicitud de Licencia de Primera Ocupación',
    description: 'Documento para solicitar la licencia de primera ocupación',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['promotor', 'direccion_obra', 'arquitecto'],
    sections: [
      {
        id: 'solicitud',
        title: 'SOLICITUD DE LICENCIA DE PRIMERA OCUPACIÓN',
        content: `AL AYUNTAMIENTO DE [MUNICIPIO]

D./Dª [NOMBRE_PROMOTOR], con DNI/NIE/CIF [NIF_PROMOTOR], con domicilio a efectos de notificaciones en [DOMICILIO_NOTIFICACIONES], teléfono [TELEFONO] y correo electrónico [EMAIL],

EXPONE:

Que siendo propietario/a del inmueble sito en [DIRECCION_OBRA], con referencia catastral [REF_CATASTRAL], sobre el que se han ejecutado obras de [TIPO_OBRA] al amparo de la licencia municipal de obras nº [NUM_LICENCIA] de fecha [FECHA_LICENCIA].

Que las citadas obras han finalizado y cuentan con el correspondiente Certificado Final de Obra expedido por la Dirección Facultativa con fecha [FECHA_CFO].

Que se adjunta la siguiente documentación:

1. Certificado Final de Obra
2. Certificado de Eficiencia Energética
3. Certificado de instalaciones (electricidad, fontanería, gas, etc.)
4. Libro del Edificio
5. Licencia de obras
6. Proyecto visado
7. Justificante de pago del ICIO
8. [OTROS_DOCUMENTOS]

Por todo ello, SOLICITA:

Que se sirva conceder LICENCIA DE PRIMERA OCUPACIÓN para el inmueble descrito.

En [LUGAR], a [FECHA]

Fdo.: [NOMBRE_PROMOTOR]`,
        order: 1,
        required: true
      }
    ]
  },
  {
    id: 'memoria-calidad',
    name: 'Memoria de Control de Calidad',
    description: 'Memoria del control de calidad de la obra',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['proyecto', 'direccion_obra'],
    sections: [
      {
        id: 'plan-control',
        title: '1. PLAN DE CONTROL DE CALIDAD',
        content: `1.1. OBJETO

El presente documento tiene por objeto establecer el Plan de Control de Calidad de las obras correspondientes al proyecto "[NOMBRE_PROYECTO]", de conformidad con el Código Técnico de la Edificación y el Decreto 462/1971 sobre normas de edificación.

1.2. AGENTES INTERVINIENTES

Promotor: [PROMOTOR]
Dirección Facultativa: [DIRECCION_FACULTATIVA]
Constructor: [CONSTRUCTOR]
Entidad de Control: [ENTIDAD_CONTROL]

1.3. ÁMBITO DE APLICACIÓN

Control de recepción en obra de productos
Control de ejecución de la obra
Control de la obra terminada`,
        order: 1,
        required: true
      },
      {
        id: 'control-materiales',
        title: '2. CONTROL DE MATERIALES',
        content: `2.1. CONTROL DEL HORMIGÓN

Nivel de control: [NIVEL_CONTROL]
Cantidad de hormigón: [CANTIDAD_HORMIGON] m³
Número de lotes: [NUM_LOTES]
Ensayos a realizar: [ENSAYOS_HORMIGON]

2.2. CONTROL DEL ACERO

Tipo de acero: [TIPO_ACERO]
Cantidad: [CANTIDAD_ACERO] kg
Ensayos a realizar: [ENSAYOS_ACERO]

2.3. CONTROL DE OTROS MATERIALES

[OTROS_MATERIALES]`,
        order: 2,
        required: true
      },
      {
        id: 'control-ejecucion',
        title: '3. CONTROL DE EJECUCIÓN',
        content: `3.1. CIMENTACIÓN

Comprobación de replanteo
Control de excavación
Control de hormigonado
Ensayos de recepción

3.2. ESTRUCTURA

Control de armaduras
Control de hormigonado
Control dimensional
Ensayos de información

3.3. CERRAMIENTOS E INSTALACIONES

[CONTROLES_CERRAMIENTOS]`,
        order: 3,
        required: true
      },
      {
        id: 'resultados',
        title: '4. RESULTADOS Y CONCLUSIONES',
        content: `4.1. RESUMEN DE ENSAYOS REALIZADOS

[TABLA_ENSAYOS]

4.2. INCIDENCIAS Y CORRECCIONES

[INCIDENCIAS]

4.3. CONCLUSIÓN

Los materiales empleados y la ejecución de las obras cumplen con las especificaciones del proyecto y la normativa vigente.

En [LUGAR], a [FECHA]

Fdo.: [NOMBRE_DIRECTOR_OBRA]
      Director de Obra`,
        order: 4,
        required: true
      }
    ]
  },
  {
    id: 'declaracion-conformidad-obra',
    name: 'Declaración de Conformidad de la Obra',
    description: 'Declaración de conformidad de obra ejecutada',
    category: 'administrativo',
    type: 'administrativo',
    folder: '05_Administrativo',
    requiredFields: ['promotor', 'proyecto', 'arquitecto', 'constructor'],
    sections: [
      {
        id: 'declaracion',
        title: 'DECLARACIÓN DE CONFORMIDAD',
        content: `D./Dª [NOMBRE_PROMOTOR], con NIF [NIF_PROMOTOR], como PROMOTOR de las obras "[NOMBRE_PROYECTO]", situadas en [DIRECCION_OBRA],

DECLARA:

Que las obras referenciadas han sido ejecutadas por [CONSTRUCTOR], CIF [CIF_CONSTRUCTOR], bajo la dirección facultativa de:

- Director de Obra: [DIRECTOR_OBRA]
- Director de Ejecución: [DIRECTOR_EJECUCION]

Que las obras se han ejecutado conforme al proyecto técnico visado por el [COLEGIO_PROFESIONAL] el [FECHA_VISADO], expediente nº [NUM_EXPEDIENTE].

Que se ha respetado el Código Técnico de la Edificación y el resto de normativa de aplicación.

Que se ha seguido el Plan de Control de Calidad establecido.

Que se dispone del Certificado Final de Obra expedido por la Dirección Facultativa.

Que se han efectuado las pruebas de servicio de las instalaciones con resultado satisfactorio.

Que se han subsanado todas las deficiencias detectadas durante la ejecución.

Y para que conste, firma la presente declaración en [LUGAR], a [FECHA].

Fdo.: [NOMBRE_PROMOTOR]`,
        order: 1,
        required: true
      }
    ]
  },
  {
    id: 'informe-patologia',
    name: 'Informe de Patologías',
    description: 'Informe técnico sobre patologías detectadas en edificación',
    category: 'memoria',
    type: 'memoria',
    discipline: 'Arquitectura',
    folder: '02_Memorias',
    requiredFields: ['ubicacion', 'arquitecto'],
    sections: [
      {
        id: 'datos-generales',
        title: '1. DATOS GENERALES',
        content: `1.1. OBJETO DEL INFORME

Análisis de las patologías detectadas en el inmueble sito en [DIRECCION].

1.2. PROPIEDAD

Propietario: [PROPIETARIO]
NIF: [NIF_PROPIETARIO]

1.3. TÉCNICO REDACTOR

Arquitecto: [NOMBRE_ARQUITECTO]
Nº Colegiado: [NUM_COLEGIADO]
Colegio: [COLEGIO_PROFESIONAL]

1.4. FECHA DE INSPECCIÓN

[FECHA_INSPECCION]`,
        order: 1,
        required: true
      },
      {
        id: 'descripcion-inmueble',
        title: '2. DESCRIPCIÓN DEL INMUEBLE',
        content: `2.1. CARACTERÍSTICAS GENERALES

Tipología: [TIPOLOGIA]
Año de construcción: [ANNO_CONSTRUCCION]
Superficie construida: [SUPERFICIE] m²
Número de plantas: [NUM_PLANTAS]

2.2. SISTEMA CONSTRUCTIVO

Cimentación: [CIMENTACION]
Estructura: [ESTRUCTURA]
Fachadas: [FACHADAS]
Cubierta: [CUBIERTA]`,
        order: 2,
        required: true
      },
      {
        id: 'patologias-detectadas',
        title: '3. PATOLOGÍAS DETECTADAS',
        content: `3.1. LESIONES EN ESTRUCTURA

[DESCRIPCION_LESIONES_ESTRUCTURA]

Gravedad: ☐ Leve  ☐ Moderada  ☐ Grave  ☐ Muy grave

3.2. LESIONES EN FACHADAS

[DESCRIPCION_LESIONES_FACHADAS]

Gravedad: ☐ Leve  ☐ Moderada  ☐ Grave  ☐ Muy grave

3.3. LESIONES EN CUBIERTAS

[DESCRIPCION_LESIONES_CUBIERTAS]

Gravedad: ☐ Leve  ☐ Moderada  ☐ Grave  ☐ Muy grave

3.4. HUMEDADES

Tipo: ☐ Filtración  ☐ Capilaridad  ☐ Condensación  ☐ Accidental
Ubicación: [UBICACION_HUMEDADES]
Descripción: [DESCRIPCION_HUMEDADES]

3.5. OTRAS LESIONES

[OTRAS_LESIONES]`,
        order: 3,
        required: true
      },
      {
        id: 'causas',
        title: '4. ANÁLISIS DE CAUSAS',
        content: `4.1. CAUSAS FÍSICAS

[CAUSAS_FISICAS]

4.2. CAUSAS MECÁNICAS

[CAUSAS_MECANICAS]

4.3. CAUSAS QUÍMICAS

[CAUSAS_QUIMICAS]

4.4. DEFECTOS DE PROYECTO O EJECUCIÓN

[DEFECTOS]`,
        order: 4,
        required: true
      },
      {
        id: 'recomendaciones',
        title: '5. RECOMENDACIONES Y PROPUESTA DE INTERVENCIÓN',
        content: `5.1. MEDIDAS URGENTES

[MEDIDAS_URGENTES]

5.2. INTERVENCIONES A CORTO PLAZO

[INTERVENCIONES_CORTO]

5.3. INTERVENCIONES A MEDIO PLAZO

[INTERVENCIONES_MEDIO]

5.4. PRESUPUESTO ESTIMADO

[PRESUPUESTO_ESTIMADO]`,
        order: 5,
        required: true
      },
      {
        id: 'conclusion',
        title: '6. CONCLUSIONES',
        content: `[CONCLUSIONES]

En [LUGAR], a [FECHA]

Fdo.: [NOMBRE_ARQUITECTO]
      Arquitecto Colegiado nº [NUM_COLEGIADO]`,
        order: 6,
        required: true
      }
    ]
  }
]

export function getTemplatesByCategory(category: string): DocumentTemplate[] {
  if (category === 'all') return ARCHITECTURAL_TEMPLATES
  return ARCHITECTURAL_TEMPLATES.filter(t => t.category === category)
}

export function getTemplateById(id: string): DocumentTemplate | undefined {
  return ARCHITECTURAL_TEMPLATES.find(t => t.id === id)
}
