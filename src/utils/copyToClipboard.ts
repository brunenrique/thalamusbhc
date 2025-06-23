import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      logger.warn({ action: 'clipboard_write_failed', meta: { error: err } })
    }
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '0'
  textArea.style.top = '0'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  let success = false
  try {
    success = document.execCommand('copy')
  } catch (err) {
    Sentry.captureException(err)
    logger.error({ action: 'clipboard_fallback_failed', meta: { error: err } })
  }
  document.body.removeChild(textArea)
  return success
}
