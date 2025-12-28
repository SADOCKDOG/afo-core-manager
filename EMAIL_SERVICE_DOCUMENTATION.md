# Servicio de Email Integrado - Documentación

## Descripción General

AFO CORE MANAGER ahora incluye un servicio de email completamente integrado que permite el envío profesional de informes de cumplimiento, notificaciones y documentos a los intervinientes del proyecto. El sistema soporta dos proveedores líderes de la industria: **SendGrid** y **AWS SES**.

## Características Principales

### ✅ Proveedores Soportados

1. **SendGrid** (Recomendado)
   - Configuración rápida y sencilla
   - Solo requiere una API Key
   - Plan gratuito disponible (100 emails/día)
   - Excelente deliverability
   - Panel de control intuitivo

2. **AWS SES** (Amazon Simple Email Service)
   - Para envíos a gran escala
   - Costos muy competitivos
   - Requiere cuenta AWS y credenciales IAM
   - Máxima flexibilidad y control

### 🚀 Funcionalidades

#### 1. Configuración de Email
- Interfaz intuitiva para configurar proveedores
- Soporte para múltiples proveedores (cambio fácil)
- Verificación de credenciales con email de prueba
- Almacenamiento seguro de credenciales en el navegador
- Configuración de remitente y email de respuesta

#### 2. Envío de Emails
- Envío inmediato de informes de cumplimiento
- Personalización de asunto y mensaje
- Destinatarios múltiples (To, CC, BCC)
- Resumen ejecutivo integrado en el cuerpo del email
- Plantillas HTML profesionales y responsive
- Generación automática de versión texto plano

#### 3. Entregas Automáticas Programadas
- Envío automático diario, semanal o mensual
- Configuración flexible de horarios
- Activación/pausado de entregas
- Regeneración automática de informes actualizados
- Gestión de múltiples entregas programadas

#### 4. Registro y Auditoría
- Historial completo de emails enviados
- Estado de entrega (enviado, fallido, pendiente)
- IDs de mensaje para seguimiento
- Registro de errores detallado
- Visualización de entregas programadas
- Últimas 100 transacciones guardadas

## Configuración Paso a Paso

### Opción 1: SendGrid (Recomendado)

#### Paso 1: Crear Cuenta en SendGrid
1. Vaya a [https://sendgrid.com](https://sendgrid.com)
2. Cree una cuenta gratuita (100 emails/día)
3. Verifique su email

#### Paso 2: Verificar Remitente
1. En SendGrid, vaya a **Settings → Sender Authentication**
2. Opción A: **Single Sender Verification** (más rápido)
   - Añada su email profesional
   - Verifique mediante el email de confirmación
3. Opción B: **Domain Authentication** (recomendado para producción)
   - Configure DNS para su dominio
   - Mejor deliverability y reputación

#### Paso 3: Crear API Key
1. Vaya a **Settings → API Keys**
2. Click en **Create API Key**
3. Nombre: `AFO-CORE-MANAGER`
4. Permisos: **Full Access** (o mínimo **Mail Send**)
5. **IMPORTANTE**: Copie la API Key inmediatamente (solo se muestra una vez)

#### Paso 4: Configurar en AFO CORE MANAGER
1. Click en el icono de engranaje (⚙️) en la barra superior
2. Seleccione la pestaña **SendGrid**
3. Pegue su API Key
4. Ingrese su **Email de Remitente** (debe estar verificado en SendGrid)
5. Configure el **Nombre del Remitente** (ej: "Su Estudio de Arquitectura")
6. (Opcional) Configure un **Email de Respuesta**
7. Click en **Enviar Prueba** para verificar
8. Click en **Guardar Configuración**

### Opción 2: AWS SES

#### Requisitos Previos
- Cuenta de AWS activa
- AWS SES configurado en su región
- Usuario IAM con permisos de SES

#### Paso 1: Configurar AWS SES
1. Inicie sesión en la Consola de AWS
2. Vaya al servicio **Amazon SES**
3. Seleccione su región (ej: `us-east-1`)
4. Verifique un email o dominio:
   - **Email**: Settings → Identities → Verify email address
   - **Dominio**: Settings → Identities → Create domain identity

#### Paso 2: Salir del Sandbox (Producción)
- Por defecto, SES está en "sandbox mode" (solo emails verificados)
- Para producción: Request production access
- Documentación: [AWS SES Sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)

#### Paso 3: Crear Usuario IAM
1. Vaya a **IAM → Users → Create user**
2. Nombre: `afo-core-ses-sender`
3. Permisos: Adjunte la política `AmazonSESFullAccess` o cree una personalizada:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```
4. Cree credenciales de acceso:
   - Security credentials → Create access key
   - Tipo: Application running outside AWS
   - **Guarde el Access Key ID y Secret Access Key**

#### Paso 4: Configurar en AFO CORE MANAGER
1. Click en el icono de engranaje (⚙️) en la barra superior
2. Seleccione la pestaña **AWS SES**
3. Seleccione su **Región de AWS**
4. Ingrese su **Access Key ID**
5. Ingrese su **Secret Access Key**
6. Configure el **Email de Remitente** (verificado en SES)
7. Configure el **Nombre del Remitente**
8. Click en **Enviar Prueba** para verificar
9. Click en **Guardar Configuración**

## Uso del Sistema

### Enviar Informe de Cumplimiento

1. **Generar Informe**
   - Abra un proyecto
   - Vaya a la pestaña **Cumplimiento Normativo**
   - Click en **Generar Informe Completo**

2. **Configurar Email**
   - Click en **Enviar por Email** en el informe generado
   - Los intervinientes del proyecto con email se añaden automáticamente
   - Añada destinatarios adicionales si es necesario
   - Personalice el asunto y mensaje

3. **Opciones de Contenido**
   - ✓ **Incluir informe completo en PDF**: Adjunta el informe detallado
   - ✓ **Incluir resumen ejecutivo**: Muestra estadísticas en el cuerpo del email

4. **Envío o Programación**
   - **Envío inmediato**: Click en "Enviar Ahora"
   - **Entrega automática**: 
     - Active "Entrega Automática"
     - Elija frecuencia: Diario, Semanal, Mensual
     - Configure el día/hora
     - Click en "Configurar Entrega"

### Ver Registro de Emails

1. Click en el icono de reloj (🕐) en la barra superior
2. Pestaña **Historial**: Ver todos los emails enviados
   - Estado de entrega
   - Destinatarios
   - Fecha y hora
   - Message ID
   - Errores (si los hay)

3. Pestaña **Automáticos**: Gestionar entregas programadas
   - Ver próximo envío
   - Pausar/Activar entregas
   - Eliminar programaciones

### Modificar Configuración

- Click en el icono de sobre/engranaje (📧/⚙️) en cualquier momento
- Cambie de proveedor sin perder histórico
- Actualice credenciales
- Modifique email de remitente

## Plantilla de Email

Los emails enviados utilizan una plantilla profesional que incluye:

### Encabezado
- Logo/título "AFO CORE MANAGER"
- Subtítulo "Informe de Cumplimiento Normativo"

### Cuerpo Principal
- Título del proyecto
- Fecha de generación
- Mensaje personalizado del usuario

### Resumen Ejecutivo (si se activa)
- Total de verificaciones
- Conformes (verde)
- No conformes (rojo)
- Pendientes (naranja)
- Progreso de verificación (%)

### Recomendaciones Prioritarias
- Lista de recomendaciones clave
- Destacadas en formato de alerta

### Pie de Página
- Firma automática de AFO CORE MANAGER
- Descargo de responsabilidad

### Características del Template
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Compatible con todos los clientes de email
- ✅ Colores corporativos de AFO CORE MANAGER
- ✅ Tipografía IBM Plex Sans
- ✅ Estructura semántica HTML5

## Solución de Problemas

### Error: "Email service not configured"
**Solución**: Configure el servicio de email primero usando el botón de configuración (⚙️)

### Error: "SendGrid API key is required"
**Solución**: Ingrese una API Key válida de SendGrid en la configuración

### Error: "From email is required"
**Solución**: Configure el email de remitente en la configuración

### Email no llega al destinatario

**Para SendGrid:**
1. Verifique que el email de remitente esté verificado en SendGrid
2. Revise la Activity Feed en SendGrid para ver el estado de entrega
3. Compruebe la carpeta de spam del destinatario
4. Verifique que no haya excedido el límite de su plan

**Para AWS SES:**
1. Verifique que el email/dominio esté verificado en SES
2. Si está en sandbox, solo puede enviar a emails verificados
3. Revise CloudWatch Logs para errores detallados
4. Compruebe que las credenciales IAM tengan permisos correctos

### Error: "SendGrid API error: 403"
**Causas comunes:**
- API Key inválida o expirada
- Permisos insuficientes en la API Key
- Email de remitente no verificado

**Solución**: Cree una nueva API Key con permisos Full Access

### Error: "AWS SES API error"
**Causas comunes:**
- Credenciales inválidas
- Región incorrecta
- Email no verificado
- Cuenta en sandbox intentando enviar a email no verificado

**Solución**: Verifique la configuración paso a paso

## Mejores Prácticas

### Seguridad
- ✅ Las credenciales se almacenan localmente en su navegador
- ✅ Nunca comparta su API Key o credenciales AWS
- ✅ Use API Keys con permisos mínimos necesarios
- ✅ Rote sus credenciales periódicamente

### Deliverability
- ✅ Verifique su dominio (no solo email) para mejor reputación
- ✅ Use un email corporativo, no gratuito (gmail, hotmail, etc.)
- ✅ Configure SPF, DKIM y DMARC en su dominio
- ✅ No envíe emails masivos sin consentimiento previo
- ✅ Incluya siempre una forma de darse de baja (si aplica)

### Contenido
- ✅ Personalice el mensaje para cada destinatario
- ✅ Use asuntos claros y descriptivos
- ✅ Incluya contexto suficiente en el mensaje
- ✅ Revise la ortografía antes de enviar
- ✅ Pruebe primero enviándose un email a usted mismo

### Entregas Programadas
- ✅ No programe con excesiva frecuencia
- ✅ Elija horarios laborales (9-18h)
- ✅ Revise periódicamente las entregas activas
- ✅ Pause entregas cuando el proyecto esté finalizado

## Límites y Cuotas

### SendGrid - Plan Gratuito
- **100 emails/día**
- Funcionalidades completas
- Suficiente para la mayoría de estudios pequeños

### SendGrid - Planes de Pago
- Desde $19.95/mes (40,000 emails/mes)
- Sin límite diario
- Soporte prioritario
- [Ver planes](https://sendgrid.com/pricing/)

### AWS SES
- **$0.10 por cada 1,000 emails enviados**
- Sin límite estricto (depende de reputación)
- Primeros 62,000 emails/mes gratis si usa desde EC2
- Costos adicionales por datos salientes

## Privacidad y Cumplimiento

- Los datos de email se procesan según la política de privacidad del proveedor elegido
- SendGrid y AWS cumplen con GDPR, CCPA, y otras regulaciones
- Los emails enviados se registran localmente en su navegador
- No se almacenan copias de los emails en servidores de AFO CORE MANAGER
- El contenido de los informes es responsabilidad del usuario

## Soporte

Para problemas con:
- **SendGrid**: [Soporte SendGrid](https://support.sendgrid.com/)
- **AWS SES**: [Documentación AWS SES](https://docs.aws.amazon.com/ses/)
- **AFO CORE MANAGER**: Abra un issue en el repositorio del proyecto

## Actualizaciones Futuras

Funcionalidades planificadas:
- [ ] Adjuntar PDFs reales generados
- [ ] Plantillas de email personalizables
- [ ] Soporte para más proveedores (Mailgun, Postmark)
- [ ] Firma digital de emails
- [ ] Confirmación de lectura
- [ ] Integración con CRM externo
- [ ] Exportación de logs a CSV
- [ ] Notificaciones push cuando llegan respuestas

---

**Versión del documento**: 1.0  
**Última actualización**: Enero 2025
