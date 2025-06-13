import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

export interface EncryptionResult {
  ciphertext: string
  iv: string
  tag: string
}

export function encrypt(text: string, key: Buffer): EncryptionResult {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  }
}

export function decrypt(result: EncryptionResult, key: Buffer): string {
  const iv = Buffer.from(result.iv, 'base64')
  const tag = Buffer.from(result.tag, 'base64')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(result.ciphertext, 'base64')),
    decipher.final(),
  ])
  return plaintext.toString('utf8')
}
