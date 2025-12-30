# Sistema de Firma Electrónica Cualificada

## Descripción General

AFO CORE MANAGER integra un sistema completo de **firma electrónica cualificada** que permite a los arquitectos firmar documentos con plena validez jurídica según el **Reglamento eIDAS** (UE 910/2014) y la **Ley 6/2020** española. El sistema soporta dos proveedores principales: **Cl@ve** (sistema oficial del Gobierno de España) y **ViafirmaPro** (proveedor privado certificado).

## Características Principales

### 🔐 Niveles de Firma Soportados

1. **Firma Simple**
   - Identifica al firmante
   - Válida para documentos internos
   - Rápida y sin requisitos adicionales

2. **Firma Avanzada**
   - Vincula al firmante con el documento de forma única
   - Detecta cambios posteriores
   - Adecuada para la mayoría de documentos profesionales

3. **Firma Cualificada** ⭐
   - **Mismo valor jurídico que la firma manuscrita**
   - Basada en certificado cualificado
   - Obligatoria para documentos administrativos oficiales
   - Cumple plenamente con eIDAS

### 🏛️ Proveedores Integrados

#### Cl@ve (Gobierno de España)

Sistema oficial de identificación y firma electrónica del Estado español.

**Métodos de Autenticación:**
- **Cl@ve PIN**: Código de un solo uso enviado por SMS
- **Cl@ve Permanente**: Contraseña personal permanente + SMS
- **DNI Electrónico**: Usando lector de tarjetas y DNI 3.0/4.0
- **Certificado Digital**: Certificado de la FNMT u otras entidades

**Características:**
- Completamente gratuito
- Máxima confianza institucional
- Integración vía SAML 2.0
- Válido para todas las administraciones públicas

#### ViafirmaPro

Proveedor privado certificado con servicios avanzados de firma electrónica.

**Características:**
- API REST moderna
- Múltiples formatos (PAdES, XAdES, CAdES)
- Niveles de firma configurables (B, T, LT, LTA)
- Timestamping automático
- Flujos de firma complejos
- Portal web para firmantes

## Configuración de Proveedores

### Configurar Cl@ve

1. Accede a **Herramientas → Proveedores de Firma**
2. Click en **Nuevo Proveedor**
3. Selecciona **Cl@ve (Gobierno de España)**
4. Configura:
   - **Nombre**: "Cl@ve Producción"
   - **Entity ID**: Identificador único de tu organización
   - **Metadata URL**: URL de metadatos SAML de Cl@ve
   - **Assertion Consumer URL**: `https://tu-dominio.com/signature-callback`
   - **Algoritmo de Firma**: SHA-256 o SHA-512
   - **Validar Certificados**: Activado (recomendado)
   - **Modo de Prueba**: Desactivado para producción

5. Guarda la configuración
6. Activa el proveedor

**Nota**: Para usar Cl@ve en producción necesitas registrar tu aplicación en el PAe (Punto de Acceso General electrónico).

### Configurar ViafirmaPro

1. Accede a **Herramientas → Proveedores de Firma**
2. Click en **Nuevo Proveedor**
3. Selecciona **ViafirmaPro**
4. Configura:
   - **Nombre**: "Viafirma Producción"
   - **API Key**: Tu clave API de Viafirma
   - **API Secret**: Tu secreto API
   - **Endpoint URL**: `https://api.viafirma.com/v1`
   - **Workflow ID**: (opcional) ID del flujo personalizado
   - **Formato de Firma**: PAdES (recomendado para PDF)
   - **Nivel de Firma**: LTA (máxima validez a largo plazo)
   - **Timestamp Automático**: Activado
   - **Modo de Prueba**: Desactivado para producción

5. Guarda la configuración
6. Activa el proveedor

**Nota**: Necesitas una cuenta activa en ViafirmaPro con créditos de firma disponibles.

## Flujo de Firma

### Para el Iniciador (Arquitecto)

1. **Seleccionar documento a firmar**
   - Desde el gestor documental del proyecto
   - Desde un flujo de aprobación
   - Directamente desde cualquier documento

2. **Iniciar firma cualificada**
   - Click en "Firma Electrónica Cualificada"
   - Selecciona proveedor (Cl@ve o Viafirma)
   - Elige nivel de firma (recomendado: Cualificada)

3. **Configurar firma**
   - Si es Cl@ve: elige método de autenticación
   - Verifica datos del firmante (nombre, email, NIF)
   - Confirma documento y proyecto

4. **Completar autenticación**
   - Para Cl@ve PIN/Permanente: introduce código SMS
   - Para DNI-e/Certificado: autentícate en ventana emergente
   - Para Viafirma: recibirás email con enlace

5. **Confirmar firma**
   - Sistema captura metadata automáticamente
   - Se genera hash del documento
   - Se añade timestamp
   - Se registra en audit trail

### Para el Firmante

#### Con Cl@ve PIN

1. Recibes SMS con código de 6 dígitos
2. Introduces el código en la aplicación
3. Sistema valida el código (máx. 3 intentos)
4. Firma se completa automáticamente

**Código expira en 5 minutos**

#### Con Cl@ve DNI Electrónico

1. Se abre ventana de autenticación
2. Conecta lector de DNI-e
3. Introduce PIN del DNI
4. Sistema lee certificado del DNI
5. Firma se completa automáticamente

#### Con ViafirmaPro

1. Recibes email con asunto "Solicitud de Firma"
2. Click en enlace del email
3. Se abre portal de Viafirma
4. Autentícate con tu método preferido
5. Revisa documento y confirma firma
6. Sistema actualiza estado automáticamente

## Metadatos de Firma

Cada firma cualificada captura automáticamente:

- **Certificado del Firmante**:
  - Número de serie
  - Emisor (ej: FNMT, AC Camerfirma)
  - Sujeto (nombre, NIF)
  - Validez (desde/hasta)
  - Huella digital

- **Información del Documento**:
  - Hash SHA-256 del documento
  - Nombre del documento
  - Proyecto asociado

- **Timestamp**:
  - Sello de tiempo certificado
  - Proveedor de timestamp (TSA)
  - Token de timestamp

- **Contexto de Firma**:
  - IP del firmante
  - User Agent (navegador)
  - Fecha y hora exacta
  - Proveedor utilizado

- **Formato de Firma**:
  - PAdES (PDF Advanced Electronic Signature)
  - XAdES (XML Advanced Electronic Signature)
  - CAdES (CMS Advanced Electronic Signature)

## Visualizar Solicitudes de Firma

### Panel de Solicitudes

Accede a **Herramientas → Solicitudes de Firma** para ver:

#### Pendientes
- Firmas iniciadas pero no completadas
- Estado: esperando OTP, firmando, etc.
- Tiempo restante antes de expiración
- Opciones: cancelar, reenviar OTP

#### Firmados
- Documentos firmados exitosamente
- Metadata completa visible
- Certificados utilizados
- Timestamps válidos

#### Fallidos
- Firmas rechazadas o expiradas
- Motivo del fallo
- Posibilidad de reintentar

### Información Detallada

Para cada solicitud puedes ver:
- Detalles del documento
- Información del firmante
- Proveedor utilizado
- Estado actual con timeline
- Metadata de firma (si completada)
- Audit trail completo

## Integración con Flujos de Aprobación

Las firmas cualificadas se integran perfectamente con los flujos de aprobación existentes:

1. **Al crear flujo**:
   - Define si requiere firma cualificada por paso
   - Selecciona proveedor predeterminado
   - Configura nivel de firma requerido

2. **Durante aprobación**:
   - Aprobador ve opción de firma cualificada
   - Puede elegir entre firma simple o cualificada
   - Firma cualificada tiene badge especial

3. **Al completar**:
   - Metadata de firma se guarda en el paso
   - Audit trail incluye detalles del certificado
   - Documento final incluye todas las firmas

4. **Certificado final**:
   - Exporta certificado de flujo completo
   - Incluye todas las firmas cualificadas
   - Lista completa de metadata
   - Válido como evidencia legal

## Validez Legal

### En España

Según la **Ley 6/2020** de regulación de servicios de confianza:

✅ **Firma Cualificada = Firma Manuscrita**

- Admisible como prueba en juicio
- Válida para contratos vinculantes
- Aceptada por todas las administraciones
- Efecto jurídico pleno

### En la Unión Europea

Según el **Reglamento eIDAS (UE) 910/2014**:

✅ **Reconocimiento mutuo en todos los estados miembros**

- Firma cualificada española válida en toda la UE
- No puede rechazarse por ser electrónica
- Mismo valor que firma manuscrita nacional

### Documentos Arquitectónicos

Especialmente válida para:
- 📋 Proyectos de ejecución
- 📐 Proyectos básicos
- 🏗️ Direcciones de obra
- ✅ Certificados finales de obra
- 📄 Memorias técnicas
- 🔖 Visados colegiales (según colegio)
- 📊 Informes técnicos
- 🏛️ Documentación administrativa

## Seguridad y Cumplimiento

### Protección de Datos

- Datos de firma encriptados en reposo
- Comunicaciones HTTPS obligatorias
- No se almacenan contraseñas
- Códigos OTP de un solo uso
- Cumplimiento RGPD completo

### Audit Trail

Cada acción registra:
- Usuario que la realiza
- Timestamp preciso
- IP de origen
- Detalles de la acción
- Resultado (éxito/error)

El audit trail es **inmutable** y sirve como evidencia legal.

### Certificados y Validación

- Validación automática de cadena de certificados
- Verificación de estado de revocación (CRL/OCSP)
- Comprobación de validez temporal
- Verificación de emisor reconocido

## Mejores Prácticas

### Para Arquitectos

1. **Usa firma cualificada** para todos los documentos oficiales
2. **Verifica los datos del firmante** antes de iniciar
3. **Guarda copias** de los certificados de firma
4. **Documenta el contexto** de cada firma en las notas
5. **Mantén actualizado** tu certificado digital

### Para Estudios

1. **Configura ambos proveedores** para redundancia
2. **Activa el modo de prueba** primero para testear
3. **Forma al equipo** en el uso de cada método
4. **Revisa periódicamente** las solicitudes pendientes
5. **Exporta audit trails** regularmente para archivo

### Seguridad

1. **No compartas** API keys de proveedores
2. **Usa HTTPS** siempre en producción
3. **Renueva certificados** antes de que expiren
4. **Monitoriza** intentos fallidos
5. **Habilita 2FA** en cuentas de proveedor

## Troubleshooting

### "No hay proveedores configurados"

**Causa**: No se han configurado Cl@ve ni Viafirma  
**Solución**: Accede a Proveedores de Firma y configura al menos uno

### "Código OTP incorrecto"

**Causa**: Código mal introducido o expirado  
**Solución**: Verifica el código recibido por SMS, solicita nuevo código si expiró

### "Error al iniciar autenticación Cl@ve"

**Causa**: Configuración incorrecta o servicio Cl@ve no disponible  
**Solución**: Verifica Entity ID y URLs en configuración, intenta en modo de prueba

### "Firma expirada"

**Causa**: Solicitud no completada en 7 días  
**Solución**: Crea nueva solicitud de firma, las antiguas no pueden recuperarse

### "Error de red durante firma"

**Causa**: Pérdida de conexión o timeout  
**Solución**: Verifica conexión y reintenta, no se habrán guardado firmas parciales

## Roadmap Futuro

Próximas mejoras planificadas:

- 📧 **Notificaciones por email** automáticas
- 📱 **App móvil** para firmar en dispositivos móviles
- 🔗 **Más proveedores** (Uanataca, Signaturit)
- 📊 **Reportes** de actividad de firmas
- 🤖 **Recordatorios** automáticos de firmas pendientes
- 🔄 **Sincronización** con sistemas externos
- 📦 **Firma masiva** de múltiples documentos
- 🎨 **Personalización** de posición de firma en PDF

## Soporte y Contacto

Para soporte técnico con el sistema de firma:

- **Documentación**: Este archivo y PRD.md
- **Issues**: Usa el sistema de issues del proyecto
- **Email**: Contacta al administrador del sistema

Para soporte con proveedores externos:

- **Cl@ve**: https://clave.gob.es/soporte
- **Viafirma**: support@viafirma.com

---

**Última actualización**: Diciembre 2024  
**Versión del sistema**: 1.0.0
