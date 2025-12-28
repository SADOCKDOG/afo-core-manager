import { useKV } from '@github/spark/hooks'

export interface EmailConfig {
  provider: 'sendgrid' | 'aws-ses'
  apiKey?: string
  awsRegion?: string
  awsAccessKeyId?: string
  awsSecretAccessKey?: string
  fromEmail: string
  fromName: string
  replyToEmail?: string
}

export interface EmailAttachment {
  content: string
  filename: string
  type: string
  disposition?: 'attachment' | 'inline'
}

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailParams {
  to: EmailRecipient[]
  cc?: EmailRecipient[]
  bcc?: EmailRecipient[]
  subject: string
  html: string
  text?: string
  attachments?: EmailAttachment[]
  replyTo?: string
  headers?: Record<string, string>
}

export interface EmailSchedule {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  dayOfWeek?: number
  dayOfMonth?: number
  hour?: number
}

export interface ScheduledEmail {
  id: string
  schedule: EmailSchedule
  emailParams: EmailParams
  projectId: string
  reportType: string
  createdAt: number
  lastSentAt?: number
  nextSendAt: number
  active: boolean
}

export interface EmailLog {
  id: string
  timestamp: number
  to: string[]
  subject: string
  status: 'sent' | 'failed' | 'pending'
  provider: string
  messageId?: string
  error?: string
  scheduledEmailId?: string
}

const SENDGRID_API_ENDPOINT = 'https://api.sendgrid.com/v3/mail/send'

export class EmailService {
  private config: EmailConfig | null = null

  setConfig(config: EmailConfig) {
    this.config = config
    this.validateConfig()
  }

  getConfig(): EmailConfig | null {
    return this.config
  }

  isConfigured(): boolean {
    return this.config !== null && this.validateConfig(false)
  }

  private validateConfig(throwError = true): boolean {
    if (!this.config) {
      if (throwError) throw new Error('Email service not configured')
      return false
    }

    if (this.config.provider === 'sendgrid') {
      if (!this.config.apiKey) {
        if (throwError) throw new Error('SendGrid API key is required')
        return false
      }
    } else if (this.config.provider === 'aws-ses') {
      if (!this.config.awsRegion || !this.config.awsAccessKeyId || !this.config.awsSecretAccessKey) {
        if (throwError) throw new Error('AWS SES credentials are required')
        return false
      }
    }

    if (!this.config.fromEmail) {
      if (throwError) throw new Error('From email is required')
      return false
    }

    return true
  }

  async sendEmail(params: EmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config) {
      throw new Error('Email service not configured. Please configure the service first.')
    }

    this.validateConfig()

    try {
      if (this.config.provider === 'sendgrid') {
        return await this.sendViaSendGrid(params)
      } else if (this.config.provider === 'aws-ses') {
        return await this.sendViaAWSSES(params)
      }
      
      throw new Error(`Unsupported email provider: ${this.config.provider}`)
    } catch (error) {
      console.error('Email sending error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async sendViaSendGrid(params: EmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config?.apiKey) {
      throw new Error('SendGrid API key not configured')
    }

    const sendGridPayload = {
      personalizations: [
        {
          to: params.to.map(recipient => ({
            email: recipient.email,
            name: recipient.name
          })),
          ...(params.cc && params.cc.length > 0 && {
            cc: params.cc.map(recipient => ({
              email: recipient.email,
              name: recipient.name
            }))
          }),
          ...(params.bcc && params.bcc.length > 0 && {
            bcc: params.bcc.map(recipient => ({
              email: recipient.email,
              name: recipient.name
            }))
          }),
          subject: params.subject,
          ...(params.headers && { headers: params.headers })
        }
      ],
      from: {
        email: this.config.fromEmail,
        name: this.config.fromName
      },
      reply_to: params.replyTo ? {
        email: params.replyTo
      } : (this.config.replyToEmail ? {
        email: this.config.replyToEmail
      } : undefined),
      content: [
        {
          type: 'text/html',
          value: params.html
        },
        ...(params.text ? [{
          type: 'text/plain',
          value: params.text
        }] : [])
      ],
      ...(params.attachments && params.attachments.length > 0 && {
        attachments: params.attachments.map(att => ({
          content: att.content,
          filename: att.filename,
          type: att.type,
          disposition: att.disposition || 'attachment'
        }))
      })
    }

    const response = await fetch(SENDGRID_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendGridPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `SendGrid API error: ${response.status}`
      
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.errors && errorJson.errors.length > 0) {
          errorMessage = errorJson.errors.map((e: any) => e.message).join(', ')
        }
      } catch {
        errorMessage = errorText || errorMessage
      }

      throw new Error(errorMessage)
    }

    const messageId = response.headers.get('X-Message-Id') || Date.now().toString()

    return {
      success: true,
      messageId
    }
  }

  private async sendViaAWSSES(params: EmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config?.awsRegion || !this.config?.awsAccessKeyId || !this.config?.awsSecretAccessKey) {
      throw new Error('AWS SES credentials not configured')
    }

    const sesPayload = {
      Source: this.config.fromName 
        ? `${this.config.fromName} <${this.config.fromEmail}>` 
        : this.config.fromEmail,
      Destination: {
        ToAddresses: params.to.map(r => r.name ? `${r.name} <${r.email}>` : r.email),
        ...(params.cc && params.cc.length > 0 && {
          CcAddresses: params.cc.map(r => r.name ? `${r.name} <${r.email}>` : r.email)
        }),
        ...(params.bcc && params.bcc.length > 0 && {
          BccAddresses: params.bcc.map(r => r.name ? `${r.name} <${r.email}>` : r.email)
        })
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: params.html,
            Charset: 'UTF-8'
          },
          ...(params.text && {
            Text: {
              Data: params.text,
              Charset: 'UTF-8'
            }
          })
        }
      },
      ...(params.replyTo && { ReplyToAddresses: [params.replyTo] })
    }

    const endpoint = `https://email.${this.config.awsRegion}.amazonaws.com`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.0',
        'X-Amz-Target': 'SimpleEmailService_v2.SendEmail'
      },
      body: JSON.stringify(sesPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`AWS SES API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    
    return {
      success: true,
      messageId: result.MessageId || Date.now().toString()
    }
  }

  generateTextFromHTML(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
}

export const emailService = new EmailService()

export function useEmailConfig() {
  const [config, setConfig] = useKV<EmailConfig | null>('email-config', null)
  
  const updateConfig = (newConfig: EmailConfig) => {
    emailService.setConfig(newConfig)
    setConfig(newConfig)
  }

  if (config) {
    emailService.setConfig(config)
  }

  return {
    config,
    updateConfig,
    isConfigured: emailService.isConfigured()
  }
}

export function useEmailLogs() {
  const [logs, setLogs] = useKV<EmailLog[]>('email-logs', [])

  const addLog = (log: Omit<EmailLog, 'id' | 'timestamp'>) => {
    const newLog: EmailLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    setLogs(currentLogs => [newLog, ...(currentLogs || [])].slice(0, 100))
  }

  const clearLogs = () => {
    setLogs([])
  }

  return {
    logs: logs || [],
    addLog,
    clearLogs
  }
}

export function useScheduledEmails() {
  const [scheduledEmails, setScheduledEmails] = useKV<ScheduledEmail[]>('scheduled-emails', [])

  const addScheduledEmail = (email: Omit<ScheduledEmail, 'id' | 'createdAt' | 'nextSendAt'>) => {
    const nextSendAt = calculateNextSendTime(email.schedule)
    const newEmail: ScheduledEmail = {
      ...email,
      id: Date.now().toString(),
      createdAt: Date.now(),
      nextSendAt
    }
    setScheduledEmails(current => [...(current || []), newEmail])
    return newEmail
  }

  const updateScheduledEmail = (id: string, updates: Partial<ScheduledEmail>) => {
    setScheduledEmails(current => 
      (current || []).map(email => 
        email.id === id ? { ...email, ...updates } : email
      )
    )
  }

  const removeScheduledEmail = (id: string) => {
    setScheduledEmails(current => (current || []).filter(email => email.id !== id))
  }

  const toggleScheduledEmail = (id: string) => {
    setScheduledEmails(current => 
      (current || []).map(email => 
        email.id === id ? { ...email, active: !email.active } : email
      )
    )
  }

  return {
    scheduledEmails: scheduledEmails || [],
    addScheduledEmail,
    updateScheduledEmail,
    removeScheduledEmail,
    toggleScheduledEmail
  }
}

function calculateNextSendTime(schedule: EmailSchedule): number {
  const now = new Date()
  const hour = schedule.hour || 9
  
  if (schedule.frequency === 'daily') {
    const next = new Date(now)
    next.setHours(hour, 0, 0, 0)
    if (next <= now) {
      next.setDate(next.getDate() + 1)
    }
    return next.getTime()
  }
  
  if (schedule.frequency === 'weekly' && schedule.dayOfWeek) {
    const next = new Date(now)
    next.setHours(hour, 0, 0, 0)
    const currentDay = next.getDay() || 7
    const targetDay = schedule.dayOfWeek
    let daysToAdd = targetDay - currentDay
    if (daysToAdd <= 0) {
      daysToAdd += 7
    }
    next.setDate(next.getDate() + daysToAdd)
    return next.getTime()
  }
  
  if (schedule.frequency === 'monthly' && schedule.dayOfMonth) {
    const next = new Date(now)
    next.setHours(hour, 0, 0, 0)
    next.setDate(schedule.dayOfMonth)
    if (next <= now) {
      next.setMonth(next.getMonth() + 1)
    }
    return next.getTime()
  }
  
  return now.getTime() + 24 * 60 * 60 * 1000
}
