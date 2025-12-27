import { RegulatoryCode, RegulatoryReference } from './regulatory-data'

const REGULATORY_DATABASE = {
  'cte': {
    'DB-SUA': {
      '4.2.1': {
        title: 'Escaleras de uso general',
        content: `Características de las escaleras de uso general:
        
- Tramos:
  * La altura máxima que puede salvar un tramo es 3,20 m
  * El número mínimo de peldaños por tramo es 3
  * La anchura útil del tramo se determinará según las exigencias de evacuación y será, como mínimo, de 1,00 m

- Peldaños:
  * La huella medirá 28 cm como mínimo
  * La contrahuella medirá 13 cm como mínimo y 18,5 cm como máximo (20 cm en zonas de uso público)
  * La huella H y la contrahuella C cumplirán la relación: 54 cm ≤ 2C + H ≤ 70 cm
  
- Mesetas:
  * Entre tramos de una escalera con la misma dirección la meseta tendrá al menos la anchura de la escalera
  * Cuando haya un cambio de dirección, la anchura de la meseta será como mínimo de 1,00 m`,
        applicability: 'Escaleras de uso general en edificios'
      },
      '4.3': {
        title: 'Desniveles',
        content: `Protección de desniveles:

- Barreras de protección:
  * Altura mínima: 90 cm en zonas de uso restringido, 110 cm en otras zonas
  * No serán escalables por menores de 6 años
  * No tendrán aberturas que puedan ser atravesadas por una esfera de 10 cm
  
- Diferenciación visual:
  * Los desniveles con diferencia de cota menor que 55 cm se protegerán mediante barreras de protección
  * Se dispondrá señalización visual y táctil en zonas de circulación`,
        applicability: 'Todos los desniveles superiores a 55 cm'
      }
    },
    'DB-SI': {
      '3': {
        title: 'Evacuación de ocupantes',
        content: `Condiciones de evacuación:

- Altura de evacuación: En general no debe exceder de 28 m, salvo en edificios de uso Residencial Vivienda que puede ser de 50 m

- Longitud de los recorridos de evacuación:
  * Origen de evacuación en un sector en un único sentido: 25 m en general, 35 m en plantas con salida directa
  * Origen de evacuación con alternativas en distintos sentidos: 50 m
  
- Número de salidas y longitud de los recorridos de evacuación:
  * Toda planta con ocupación mayor que 100 personas debe disponer de más de una salida
  * La longitud de los recorridos de evacuación hasta alguna salida de planta no debe exceder los valores anteriores
  
- Anchura de las salidas y de los recorridos de evacuación:
  * La anchura de toda puerta de salida y de todo paso debe dimensionarse en función del uso previsto
  * Anchura mínima de puertas y pasos: 0,80 m en general, 1,00 m en recintos con más de 50 personas`,
        applicability: 'Todos los edificios'
      },
      '1': {
        title: 'Propagación interior',
        content: `Compartimentación en sectores de incendio:

- Resistencia al fuego de los elementos separadores:
  * Las paredes, techos y puertas que delimitan sectores de incendio deben tener una resistencia al fuego EI determinada según la tabla 1.1
  * Para uso Residencial Vivienda: EI 60 en general, EI 120 si la superficie construida del sector excede 500 m²
  * Para uso Administrativo: EI 90 en general, EI 120 si la superficie construida del sector excede 2.500 m²
  
- Superficie construida de cada sector:
  * Uso Residencial Vivienda: 2.500 m² en general
  * Uso Administrativo: 2.500 m² en general
  * Uso Comercial: 2.500 m² en general, 10.000 m² en plantas sobre rasante con salida directa al exterior
  
- Los elementos estructurales con función portante y escaleras protegidas que sean sectores de incendio deben tener una resistencia al fuego R o REI según corresponda`,
        applicability: 'Todos los edificios para limitar propagación de incendios'
      }
    },
    'DB-SE-AE': {
      '3.3.2': {
        title: 'Acción del viento',
        content: `Valor básico de la velocidad del viento:

- La velocidad básica del viento, vb, es el valor característico de la velocidad del viento a 10 m de altura sobre un terreno de categoría II (zona rural con vegetación baja y obstáculos aislados)

- Zona A (litoral mediterráneo): vb = 26 m/s
- Zona B (interior peninsular y Baleares): vb = 27 m/s  
- Zona C (norte y noroeste peninsular): vb = 29 m/s

Presión dinámica del viento:
qb = 0,5 × δ × vb²

donde:
- δ = 1,25 kg/m³ (densidad del aire)
- vb = velocidad básica del viento

La presión dinámica puede simplificarse:
- Zona A: qb = 0,42 kN/m²
- Zona B: qb = 0,45 kN/m²
- Zona C: qb = 0,52 kN/m²`,
        applicability: 'Todos los edificios para cálculo de acciones de viento'
      },
      '3.1': {
        title: 'Acciones permanentes',
        content: `Peso propio de elementos constructivos:

Materiales comunes (kN/m³):
- Hormigón armado: 25 kN/m³
- Hormigón en masa: 24 kN/m³
- Acero: 78,5 kN/m³
- Fábrica de ladrillo macizo: 18 kN/m³
- Fábrica de ladrillo perforado: 15 kN/m³
- Fábrica de ladrillo hueco: 12 kN/m³

Cargas permanentes en cubiertas:
- Tablero + impermeabilización: 1,0 - 1,5 kN/m²
- Solado transitable: 1,0 - 2,0 kN/m²
- Aislamiento térmico: 0,05 - 0,15 kN/m²

Las acciones permanentes de valor no constante se representarán por su valor medio cuando sean favorables y por su valor más desfavorable cuando no lo sean`,
        applicability: 'Cálculo de cargas permanentes en estructuras'
      }
    },
    'DB-HS': {
      '1': {
        title: 'Protección frente a la humedad',
        content: `Condiciones de las soluciones constructivas:

Grado de impermeabilidad mínimo exigido a los muros:
- Zona pluviométrica A (< 600 mm): Grado 1, 2 o 3 según exposición
- Zona pluviométrica B (600-800 mm): Grado 2, 3 o 4 según exposición  
- Zona pluviométrica C (> 800 mm): Grado 3, 4 o 5 según exposición

Suelos:
- Grado de impermeabilidad según presencia de agua y tipo de suelo

Fachadas:
- Revestimiento exterior resistente a la filtración
- Sistema de recogida y evacuación del agua de lluvia
- Barrera contra la penetración de agua desde el exterior

Cubiertas:
- Sistema de formación de pendientes: pendiente mínima 1% en azoteas, 5% en cubiertas inclinadas
- Capa de impermeabilización según uso (transitable o no)
- Sistema de evacuación de aguas: canalones, sumideros`,
        applicability: 'Todos los edificios para prevenir humedades'
      },
      '3': {
        title: 'Calidad del aire interior',
        content: `Condiciones de ventilación:

Caudales de ventilación mínimos:
- Dormitorios: 5 l/s por persona (estimando 2 personas por habitación)
- Salas de estar y comedores: 3 l/s por persona
- Aseos y cuartos de baño: 15 l/s por local
- Cocinas: 
  * Con fuegos: 2 l/s por m²
  * Sólo con extracción: caudal mínimo de 50 l/s

Sistemas de ventilación:
- Ventilación natural o mecánica
- Aberturas de admisión comunicadas con el exterior
- Aberturas de paso entre locales
- Aberturas de extracción comunicadas con el exterior o conductos de extracción

Sección mínima de conductos:
- La sección de los conductos debe ser uniforme en todo su recorrido
- Diámetro mínimo: 10 cm en general, 12 cm si longitud > 6 m`,
        applicability: 'Todos los edificios para garantizar calidad del aire'
      }
    },
    'DB-HE': {
      '1': {
        title: 'Limitación del consumo energético',
        content: `Consumo energético de energía primaria no renovable:

Los edificios dispondrán de una envolvente de características tales que limite adecuadamente la demanda energética necesaria para alcanzar el bienestar térmico.

Coeficientes de transmitancia térmica límite de cerramientos y particiones interiores (zona climática D):

- Muros de fachada y cerramientos en contacto con el terreno: U ≤ 0,38 W/m²K
- Suelos en contacto con el aire exterior: U ≤ 0,34 W/m²K
- Cubiertas en contacto con el aire exterior: U ≤ 0,35 W/m²K
- Huecos (conjunto vidrio-marco): U ≤ 2,30 W/m²K
- Medianerías: U ≤ 1,00 W/m²K

Factor solar modificado límite de huecos (zona climática D):
- Baja carga interna: 0,44
- Alta carga interna: 0,35`,
        applicability: 'Edificios de nueva construcción y rehabilitación'
      }
    }
  },
  'rite': {
    'IT-1.3.4.1.2': {
      title: 'Ventilación de salas de máquinas',
      content: `Ventilación de salas de calderas y máquinas:

Aberturas de ventilación:
- Dos aberturas al exterior: una en la parte superior y otra en la inferior
- Sección mínima libre de cada abertura:
  * 4 cm² por cada kW de potencia instalada si comunicación directa
  * 8 cm² por cada kW si comunicación por conducto horizontal < 3m
  * Mínimo absoluto: 0,05 m²

Conductos de ventilación:
- Material incombustible
- Sección uniforme
- Trazado vertical con pendiente mínima del 3%
- Protección contra entrada de lluvia y animales

Sala independiente:
- Las calderas de potencia útil > 70 kW deben instalarse en salas independientes
- Altura libre mínima: 2,50 m
- Puertas de acceso con resistencia al fuego RF-60 y apertura hacia el exterior`,
      applicability: 'Instalaciones térmicas con calderas'
    }
  },
  'ehe': {
    '37.2.4': {
      title: 'Recubrimientos',
      content: `Recubrimientos mínimos del hormigón armado:

Tabla 37.2.4.1.a - Recubrimientos mínimos (mm):

Clase de exposición:
- I: 15 mm (Interior de edificios sin humedad)
- IIa: 20 mm (Exterior normal, humedad alta)
- IIb: 25 mm (Exterior con humedad alta, ciclos hielo-deshielo)
- IIIa: 30 mm (Cloruros de origen no marino, moderado)
- IIIb: 35 mm (Cloruros de origen no marino, alto)
- IIIc: 40 mm (Cloruros de origen no marino, muy alto)
- IV: 30 mm (Ambiente marino, zona aérea)
- Qb: 30 mm (Ataque químico débil)
- Qc: 35 mm (Ataque químico medio)

Incrementos por tipo de cemento:
- Cemento tipo CEM I: Sin incremento
- Cemento tipo CEM II: +5 mm
- Cemento tipo CEM III, IV, V: -5 mm (puede ser negativo)

Control de ejecución:
- Nivel normal: +5 mm adicionales
- Nivel intenso: valores de tabla sin modificar`,
      applicability: 'Estructuras de hormigón armado'
    }
  },
  'rebt': {
    'ITC-BT-06': {
      title: 'Líneas aéreas',
      content: `Distancias mínimas de seguridad a líneas eléctricas aéreas:

Distancias en proyección horizontal:
- Líneas hasta 1 kV: 3,0 m a edificios y construcciones
- Líneas de 1 a 30 kV: 3,3 m a edificios y construcciones
- Líneas de 30 a 66 kV: 5,0 m a edificios y construcciones

Distancias verticales sobre edificios o construcciones accesibles:
- Líneas hasta 1 kV: 5,0 m
- Líneas de 1 a 30 kV: 5,3 m
- Líneas de 30 a 66 kV: 5,5 m

Cruzamientos con otras líneas:
- La altura mínima sobre carreteras será de 7,0 m
- La altura mínima sobre vías férreas electrificadas será de 13,0 m
- La altura mínima sobre otras vías férreas será de 8,0 m`,
      applicability: 'Edificios cercanos a líneas eléctricas aéreas'
    }
  }
}

export async function interpretRegulatoryCode(
  query: string,
  codes: RegulatoryCode[]
): Promise<{ response: string; references: RegulatoryReference[] }> {
  const contextInfo = `
CONTEXTO DE LA CONSULTA:
Usuario consulta: "${query}"
Códigos aplicables: ${codes.join(', ')}

BASE DE DATOS NORMATIVA DISPONIBLE:
${JSON.stringify(REGULATORY_DATABASE, null, 2)}

INSTRUCCIONES:
1. Analiza la consulta del usuario y determina qué normativa específica aplica
2. Busca en la base de datos la información más relevante
3. Proporciona una respuesta clara, estructurada y práctica
4. Incluye siempre las referencias normativas exactas (código, documento, sección)
5. Si hay tablas o valores numéricos, preséntalos de forma clara
6. Si la consulta requiere cálculos, muestra la fórmula y un ejemplo
7. Menciona condiciones de aplicabilidad y excepciones importantes

FORMATO DE RESPUESTA:
Devuelve un JSON con:
{
  "response": "Respuesta detallada y práctica a la consulta, con formato markdown",
  "references": [
    {
      "code": "cte",
      "document": "DB-SUA",
      "section": "4.2.1",
      "article": "",
      "description": "Escaleras de uso general",
      "content": "Extracto relevante de la normativa",
      "applicability": "Cuándo aplica esta norma"
    }
  ]
}

Si la información no está en la base de datos, utiliza tu conocimiento actualizado de la normativa española de edificación.`

  const promptText = `Eres un asistente experto en normativa técnica de edificación española.${contextInfo}`
  const prompt = window.spark.llmPrompt([promptText], promptText)

  const result = await window.spark.llm(prompt, 'gpt-4o', true)
  const parsed = JSON.parse(result)
  
  return {
    response: parsed.response || 'No se pudo generar una respuesta',
    references: parsed.references || []
  }
}

export async function performComplianceCheck(
  projectData: {
    location?: string
    buildingType?: string
    floors?: number
    height?: number
    surface?: number
    use?: string
  }
): Promise<any[]> {
  const contextInfo = `
DATOS DEL PROYECTO:
${JSON.stringify(projectData, null, 2)}

BASE DE DATOS NORMATIVA:
${JSON.stringify(REGULATORY_DATABASE, null, 2)}

TAREA:
Genera una lista completa de verificaciones de cumplimiento normativo que aplican a este proyecto.
Para cada verificación incluye:
- Categoría (ej: "Seguridad Estructural", "Protección contra Incendios", etc.)
- Requisito específico
- Normativa aplicable
- Estado inicial: "pending"
- Notas sobre cómo verificar el cumplimiento

FORMATO DE RESPUESTA:
Devuelve un objeto JSON con una propiedad "checks" que contenga un array de objetos:
{
  "checks": [
    {
      "category": "Seguridad de Utilización",
      "requirement": "Dimensiones de escaleras según DB-SUA 4.2.1",
      "code": "cte",
      "document": "DB-SUA",
      "section": "4.2.1",
      "status": "pending",
      "notes": "Verificar huella ≥28cm, contrahuella 13-18,5cm, altura tramo ≤3,20m"
    }
  ]
}

Genera entre 10-20 verificaciones relevantes según el tipo y características del proyecto.`

  const promptText = `Eres un experto en normativa de edificación que realiza análisis de cumplimiento normativo.${contextInfo}`
  const prompt = window.spark.llmPrompt([promptText], promptText)

  const result = await window.spark.llm(prompt, 'gpt-4o', true)
  const parsed = JSON.parse(result)
  
  return parsed.checks || []
}

export async function generateComplianceReport(
  projectTitle: string,
  checks: any[]
): Promise<string> {
  const compliantChecks = checks.filter(c => c.status === 'compliant')
  const nonCompliantChecks = checks.filter(c => c.status === 'non-compliant')
  const pendingChecks = checks.filter(c => c.status === 'pending')

  const contextInfo = `
PROYECTO: ${projectTitle}

RESULTADOS DE VERIFICACIÓN:
- Verificaciones conformes: ${compliantChecks.length}
- Verificaciones no conformes: ${nonCompliantChecks.length}  
- Verificaciones pendientes: ${pendingChecks.length}

DETALLE DE VERIFICACIONES:
${JSON.stringify(checks, null, 2)}

Genera un informe en formato markdown con:
1. Resumen ejecutivo
2. Análisis por categoría normativa
3. Lista de no conformidades con recomendaciones
4. Lista de verificaciones pendientes
5. Conclusiones y próximos pasos

El informe debe ser profesional, claro y orientado a la acción.`

  const promptText = `Genera un informe profesional de cumplimiento normativo.${contextInfo}`
  const prompt = window.spark.llmPrompt([promptText], promptText)

  const result = await window.spark.llm(prompt, 'gpt-4o', false)
  
  return result
}
