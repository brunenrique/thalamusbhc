import pino from 'pino'

const base = pino({ timestamp: pino.stdTimeFunctions.isoTime })

export type LogLevel = 'info' | 'warn' | 'error'

let cloudLog: any

async function sendToCloud(level: LogLevel, payload: Record<string, unknown>) {
  try {
    if (!cloudLog) {
      const { Logging } = await import('@google-cloud/logging')
      const logging = new Logging()
      cloudLog = logging.log(process.env.GOOGLE_CLOUD_LOG_NAME || 'web')
    }
    const entry = cloudLog.entry({ severity: level.toUpperCase() }, payload)
    await cloudLog.write(entry)
  } catch (err) {
    base.error({ action: 'cloud_logging_error', meta: { error: err } })
  }
}

export function log(level: LogLevel, payload: Record<string, unknown>) {
  base[level](payload)
  if (typeof window === 'undefined') {
    void sendToCloud(level, payload)
  }
}

export function logAction(
  userId: string,
  action: string,
  meta: Record<string, unknown> = {}
) {
  log('info', { userId, action, meta })
}

const logger = {
  info(payload: Record<string, unknown>) {
    log('info', payload)
  },
  warn(payload: Record<string, unknown>) {
    log('warn', payload)
  },
  error(payload: Record<string, unknown>) {
    log('error', payload)
  },
}

export default logger
