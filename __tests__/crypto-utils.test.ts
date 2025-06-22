import { encrypt, decrypt } from '../src/lib/crypto-utils'
import { deriveKeyFromPassword } from '../src/lib/encryptionKey'

const key = deriveKeyFromPassword('senha-teste')

describe('crypto-utils', () => {
  it('encrypts and decrypts a string', () => {
    const text = 'hello world'
    const result = encrypt(text, key)
    const decrypted = decrypt(result, key)
    expect(decrypted).toBe(text)
  })
})
