# Perfil del Arquitecto y Gestión de Datos

## Pantalla de Bienvenida

Al iniciar AFO CORE MANAGER por primera vez, se presenta una pantalla de bienvenida interactiva que te guía a través de la configuración inicial de tu perfil profesional.

### Proceso de Configuración Inicial

La pantalla de bienvenida consta de 3 pasos:

#### Paso 1: Datos Básicos
**Campos obligatorios (*):**
- **Nombre Completo***: Tu nombre completo como profesional
- **NIF/CIF***: Tu identificación fiscal

**Campos opcionales:**
- **Razón Social**: Nombre de tu empresa o estudio (ej: "AFO Arquitectura S.L.")
- **Dirección**: Dirección completa de tu oficina
- **Código Postal**: CP de tu ubicación
- **Localidad**: Ciudad o población
- **Provincia**: Provincia
- **Teléfono**: Número de contacto profesional
- **Email**: Correo electrónico de contacto

#### Paso 2: Información Profesional
**Todos los campos son opcionales:**
- **Número de Colegiado**: Tu número de colegiación (ej: "COA-12345")
- **Colegio Oficial**: Colegio oficial de arquitectos (ej: "COAM", "COACV", "COA Cartagena")
- **Titulación**: Tu titulación académica (ej: "Arquitecto Superior", "Arquitecto Técnico")
- **Sitio Web**: URL de tu página web profesional

#### Paso 3: Logo y Configuración
**Campos opcionales:**
- **Logo Empresarial**: 
  - Formatos aceptados: PNG, JPG, SVG
  - Tamaño máximo: 2MB
  - Se utilizará en:
    - Cabecera de la aplicación
    - Documentos generados
    - Facturas emitidas
- **IBAN**: Cuenta bancaria para incluir en facturas

### Navegación en el Wizard

- **Barra de Progreso**: Indicadores visuales muestran tu progreso (1 de 3, 2 de 3, 3 de 3)
- **Botón "Siguiente"**: Avanza al siguiente paso (pasos 1 y 2)
- **Botón "Anterior"**: Retrocede al paso anterior (pasos 2 y 3)
- **Botón "Completar Configuración"**: Finaliza la configuración (paso 3)
  - Solo se activa cuando se han completado los campos obligatorios (Nombre y NIF)

### Uso del Logo

Una vez cargado tu logo:
- Se mostrará una vista previa en el wizard
- Puedes eliminarlo con el botón "Eliminar" y cargar uno nuevo
- Al completar la configuración, el logo reemplazará el icono predeterminado en la cabecera
- Se utilizará automáticamente en todos los documentos y facturas que generes

---

## Edición del Perfil Profesional

Una vez configurado tu perfil, puedes editarlo en cualquier momento desde la aplicación.

### Acceso a la Edición

1. Haz clic en el menú **"Herramientas"** en la cabecera
2. En la sección **"Configuración"**, selecciona **"Perfil Profesional"**
3. Se abrirá un diálogo con pestañas

### Pestañas del Editor

#### Pestaña "Personal"
- Información personal y de contacto
- Mismo conjunto de campos que el Paso 1 de bienvenida
- Actualiza nombre, NIF, razón social, dirección y contactos

#### Pestaña "Profesional"
- Información de colegiación y titulación
- Mismo conjunto de campos que el Paso 2 de bienvenida
- Actualiza datos profesionales y web

#### Pestaña "Logo y Datos"
- Gestión de logo empresarial
- Configuración bancaria (IBAN)
- Mismo conjunto de campos que el Paso 3 de bienvenida

### Guardar Cambios

1. Realiza las modificaciones necesarias en cualquier pestaña
2. Haz clic en **"Guardar Cambios"**
3. Los cambios se aplican inmediatamente
4. El logo actualizado se reflejará en la cabecera al instante
5. Recibirás una confirmación de éxito

**Nota**: Los campos obligatorios (Nombre Completo y NIF/CIF) deben estar completados para poder guardar.

---

## Personalización de la Aplicación

### Branding Dinámico

AFO CORE MANAGER se personaliza automáticamente con tu información:

**Logo en la Cabecera:**
- Si has cargado un logo, se muestra en lugar del icono predeterminado
- El logo se adapta al tamaño del badge en la cabecera
- Mantiene sus proporciones originales

**Título de la Aplicación:**
- Si has configurado una "Razón Social", se usa como título principal
- Ejemplo: "AFO Arquitectura S.L." en lugar de "AFO CORE MANAGER"
- El título de la pestaña del navegador también se actualiza

**Uso en Documentos y Facturas:**
- Tu logo se incluirá automáticamente en todos los documentos generados
- Tus datos profesionales se utilizarán para completar campos automáticamente
- Las facturas incluirán tu IBAN si lo has configurado

---

## Eliminación de Todos los Datos

AFO CORE MANAGER incluye una opción para eliminar completamente todos los datos almacenados en la aplicación.

⚠️ **ADVERTENCIA: Esta acción es irreversible y permanente**

### Cuándo Usar Esta Función

- Deseas comenzar de nuevo con un perfil limpio
- Estás cambiando de estudio o empresa
- Necesitas realizar pruebas con datos limpios
- Vas a transferir el dispositivo a otra persona

### Proceso de Eliminación

#### Paso 1: Acceso
1. Haz clic en el menú **"Herramientas"** en la cabecera
2. En la sección **"Configuración"**, desplázate hasta el final
3. Haz clic en **"Eliminar Todos los Datos"** (botón rojo)

#### Paso 2: Primera Advertencia
Se mostrará un diálogo con:
- **Advertencia principal**: Esta acción es irreversible
- **Lista completa de datos a eliminar**:
  - Tu perfil profesional y logo
  - Todos los proyectos y sus documentos
  - Todos los clientes registrados
  - Todas las facturas y presupuestos
  - Todos los intervinientes
  - Toda la configuración de email
  - Todos los flujos de aprobación
  - Todas las plantillas personalizadas
  - Todos los registros de actividad
  - Cualquier otro dato almacenado
- **Recomendación**: Exportar proyectos antes de continuar

**Opciones:**
- **Cancelar**: Cierra el diálogo sin hacer cambios
- **Continuar**: Avanza a la confirmación final

#### Paso 3: Confirmación Final
Se requiere confirmación explícita:
1. Se muestra una última advertencia
2. Debes escribir **exactamente**: `ELIMINAR TODO`
3. El texto debe coincidir letra por letra (mayúsculas y espacios)
4. El botón "Eliminar Todo Permanentemente" solo se activa cuando el texto es correcto

**Opciones:**
- **Cancelar**: Cierra el diálogo sin hacer cambios
- **Eliminar Todo Permanentemente**: Ejecuta la eliminación (solo activo con texto correcto)

#### Paso 4: Ejecución
Una vez confirmado:
1. Se eliminan todos los datos de la base de datos local
2. Aparece una notificación de éxito
3. La aplicación se reinicia automáticamente
4. Se muestra la pantalla de bienvenida como si fuera la primera vez
5. Puedes configurar un nuevo perfil desde cero

### Qué NO Se Puede Recuperar

- **Todo**: Esta función elimina absolutamente todos los datos
- **Sin respaldo automático**: No hay papelera de reciclaje
- **Sin deshacer**: No existe opción de restaurar

### Recomendaciones Antes de Eliminar

1. **Exporta tus proyectos**: 
   - Usa "Herramientas" → "Exportar Proyectos"
   - Guarda el archivo ZIP en un lugar seguro
   
2. **Descarga documentos importantes**:
   - Revisa facturas pendientes
   - Guarda presupuestos en proceso
   
3. **Anota configuraciones**:
   - Configuración de email
   - Plantillas personalizadas que hayas creado

4. **Verifica que realmente deseas eliminar todo**:
   - No hay forma de recuperar los datos después

---

## Preguntas Frecuentes

### ¿Puedo cambiar mi logo después de la configuración inicial?
**Sí**, puedes cambiar tu logo en cualquier momento desde "Perfil Profesional" en el menú Herramientas.

### ¿Qué pasa si no cargo un logo?
La aplicación usará el icono predeterminado (edificio). Puedes agregar tu logo más tarde.

### ¿Los documentos y facturas ya generados se actualizan con el nuevo logo?
No, solo los nuevos documentos y facturas usarán el logo actualizado. Los documentos ya generados mantienen el logo que tenían en el momento de su creación.

### ¿Puedo usar la aplicación sin completar todos los campos opcionales?
**Sí**, solo el Nombre Completo y el NIF/CIF son obligatorios. Todos los demás campos son opcionales y pueden dejarse en blanco.

### ¿Qué pasa si cambio mi razón social después de crear proyectos?
Los proyectos existentes mantendrán los datos originales. El nuevo nombre se usará en la aplicación y en nuevos documentos/facturas.

### ¿Puedo tener múltiples perfiles?
No, AFO CORE MANAGER está diseñado para un solo perfil profesional por instalación. Si necesitas usar múltiples perfiles, deberás usar diferentes navegadores o sesiones.

### ¿Cómo exporto mis datos antes de eliminarlos?
Usa la opción "Exportar Proyectos" en el menú Herramientas para descargar un archivo ZIP con toda tu información de proyectos antes de eliminar los datos.

### ¿Se guardará mi información en la nube?
No, todos los datos se almacenan localmente en tu navegador. No se sincronizan con ningún servidor externo.

### ¿Qué pasa si borro los datos del navegador?
Perderás toda la información almacenada en AFO CORE MANAGER, incluyendo tu perfil y proyectos. Es equivalente a usar la función "Eliminar Todos los Datos".

### ¿Puedo cancelar la eliminación de datos después de confirmar?
No, una vez que confirmas en el paso final (escribiendo "ELIMINAR TODO"), la eliminación se ejecuta inmediatamente y no se puede deshacer.

---

## Mejores Prácticas

### Configuración Inicial
1. **Completa todos los campos posibles**: Aunque sean opcionales, más información permite una mejor personalización
2. **Usa un logo de alta calidad**: Asegúrate de que tu logo se vea bien en tamaño pequeño
3. **Verifica tu IBAN**: Un IBAN correcto es crucial para las facturas

### Mantenimiento del Perfil
1. **Revisa periódicamente**: Actualiza tu información de contacto cuando cambie
2. **Actualiza tu logo**: Si renuevas tu marca, actualiza el logo
3. **Mantén datos precisos**: La información correcta genera documentos profesionales

### Seguridad de Datos
1. **Exporta regularmente**: Crea respaldos de tus proyectos frecuentemente
2. **Usa la eliminación con cuidado**: Solo cuando estés completamente seguro
3. **Documenta tu configuración**: Guarda tus preferencias por si necesitas reconfigurarlo

---

## Soporte Técnico

Si encuentras problemas con la configuración de tu perfil o la gestión de datos:

1. Consulta la sección de **Manual de Usuario** en la aplicación
2. Revisa que tu navegador tenga las cookies y el almacenamiento local habilitado
3. Asegúrate de usar un navegador moderno (Chrome, Firefox, Edge, Safari actualizados)
4. Para problemas de carga de logo, verifica el formato y tamaño del archivo

---

**Última actualización**: Diciembre 2024
**Versión del documento**: 1.0
