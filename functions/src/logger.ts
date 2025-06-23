import pino from 'pino';

const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function logAction(userId: string, action: string, meta: Record<string, unknown> = {}) {
  logger.info({ userId, action, meta });
}

export default logger;
