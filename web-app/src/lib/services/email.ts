export interface EmailConfig {
    provider: 'sendgrid' | 'ses'
    apiKey?: string
    from?: string
}

export interface EmailLog {
    id: string
    to: string
    subject: string
    status: 'sent' | 'failed'
    timestamp: number
    error?: string
}

import { storage } from './storage'

const CONFIG_KEY = 'email-config'
const LOGS_KEY = 'email-logs'

export function getEmailConfig(): EmailConfig {
    return storage.get<EmailConfig>(CONFIG_KEY, { provider: 'sendgrid' })
}

export function saveEmailConfig(config: EmailConfig) {
    storage.set(CONFIG_KEY, config)
}

export function getEmailLogs(): EmailLog[] {
    return storage.get<EmailLog[]>(LOGS_KEY, [])
}

export async function sendEmail(to: string, subject: string, body: string): Promise<EmailLog> {
    const log: EmailLog = {
        id: crypto.randomUUID(),
        to,
        subject,
        status: 'sent',
        timestamp: Date.now()
    }
    const logs = getEmailLogs()
    logs.unshift(log)
    storage.set(LOGS_KEY, logs)
    return log
}
