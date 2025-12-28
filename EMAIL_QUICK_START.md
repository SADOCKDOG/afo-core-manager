# Guía Rápida: Configuración de Email en 5 Minutos

## Configuración con SendGrid (Recomendado)

### 1️⃣ Crear Cuenta SendGrid (2 minutos)
1. Vaya a: https://sendgrid.com
2. Click en "Start for Free"
3. Complete el registro
4. Verifique su email

### 2️⃣ Verificar Email de Remitente (1 minuto)
1. En SendGrid: **Settings → Sender Authentication**
2. Click en **Get Started** en "Authenticate Your Domain"
3. O más rápido: **Verify a Single Sender**
4. Ingrese su email profesional
5. Verifique mediante el email que recibirá

### 3️⃣ Crear API Key (1 minuto)
1. **Settings → API Keys**
2. **Create API Key**
3. Nombre: `AFO-CORE-MANAGER`
4. Permissions: **Full Access**
5. **Copie la API Key** (solo se muestra una vez!)

### 4️⃣ Configurar en AFO CORE MANAGER (1 minuto)
1. Abra AFO CORE MANAGER
2. Click en el icono **⚙️** (engranaje) en la barra superior
3. Pestaña **SendGrid**
4. Pegue su **API Key**
5. Ingrese su **Email de Remitente** (el que verificó)
6. Click en **Enviar Prueba** ✉️
7. Revise su bandeja de entrada
8. Click en **Guardar Configuración** ✓

### ✅ ¡Listo! Ya puede enviar informes por email

---

## Primer Envío de Prueba

### Paso 1: Generar un Informe
1. Abra cualquier proyecto
2. Vaya a **Cumplimiento Normativo**
3. Click en **Generar Informe Completo**

### Paso 2: Enviar por Email
1. En el informe generado, click en **Enviar por Email**
2. Añada su email como destinatario
3. Revise el mensaje predeterminado
4. Click en **Enviar Ahora**

### Paso 3: Verificar Recepción
1. Revise su bandeja de entrada
2. Si no aparece, revise SPAM
3. El email debe llegar en menos de 1 minuto

---

## Configurar Entregas Automáticas

Para recibir informes automáticamente cada semana:

1. En el diálogo de envío de email
2. Active **☑ Entrega Automática**
3. Seleccione **Semanal**
4. Elija el día (ej: Lunes)
5. Click en **Configurar Entrega**

El informe se regenerará y enviará automáticamente cada semana.

---

## Solución Rápida de Problemas

### ❌ "Email service not configured"
→ Configure el servicio usando el botón ⚙️

### ❌ Email no llega
→ Revise la carpeta SPAM  
→ Verifique que el email de remitente esté verificado en SendGrid

### ❌ "Invalid API Key"
→ Cree una nueva API Key con permisos "Full Access"

### ❌ "From email not verified"
→ En SendGrid, vaya a Sender Authentication y verifique su email

---

## Plan Gratuito de SendGrid

✓ **100 emails por día**  
✓ Funcionalidades completas  
✓ Sin tarjeta de crédito requerida  
✓ Perfecto para estudios pequeños  

Si necesita más, los planes de pago empiezan en $19.95/mes (40,000 emails/mes).

---

## Preguntas Frecuentes

**P: ¿Mis credenciales están seguras?**  
R: Sí, se almacenan solo en su navegador local. Nunca se envían a servidores externos.

**P: ¿Puedo cambiar de proveedor después?**  
R: Sí, puede cambiar entre SendGrid y AWS SES en cualquier momento sin perder el historial.

**P: ¿Qué pasa si supero el límite de 100 emails/día?**  
R: SendGrid bloqueará el envío hasta el día siguiente, o puede actualizar a un plan de pago.

**P: ¿Los destinatarios pueden responder?**  
R: Sí, las respuestas irán al email de remitente (o al email de respuesta si lo configuró).

**P: ¿Puedo personalizar el diseño del email?**  
R: Actualmente usa una plantilla profesional fija. La personalización llegará en futuras versiones.

---

## Recursos Adicionales

📖 [Documentación Completa](./EMAIL_SERVICE_DOCUMENTATION.md)  
🎥 [Video Tutorial SendGrid](https://sendgrid.com/resource/getting-started-with-sendgrid/)  
💬 [Soporte SendGrid](https://support.sendgrid.com/)

---

¿Listo para empezar? ¡Solo 5 minutos y estará enviando emails profesionales! 🚀
