import { encrypt, decrypt } from '../src/lib/crypto-utils'

const key = Buffer.alloc(32, 0)

describe('crypto-utils', () => {
  it('encrypts and decrypts a string', () => {
    const text = 'hello world'
    const result = encrypt(text, key)
    const decrypted = decrypt(result, key)
    expect(decrypted).toBe(text)
  })
})
