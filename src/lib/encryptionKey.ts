import crypto from 'crypto'

let key: Buffer | null = null

export function deriveKeyFromPassword(password: string, salt = 'psiguard'): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256')
}

export function setEncryptionPassword(password: string): void {
  key = deriveKeyFromPassword(password)
}

export function getEncryptionKey(): Buffer {
  if (!key) throw new Error('Chave de criptografia não definida')
  return key
}
