import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { Firestore } from 'firebase/firestore'
import { saveSessionNote, getSessionNotes } from '../src/services/prontuarioService'
import { setEncryptionPassword } from '../src/lib/encryptionKey'

let testEnv: Awaited<ReturnType<typeof initializeTestEnvironment>>

beforeAll(async () => {
  const hostPort = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8084'
  const [host, portStr] = hostPort.split(':')
  const port = parseInt(portStr, 10)

  testEnv = await initializeTestEnvironment({
    projectId: 'demo-project',
    firestore: {
      host,
      port,
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  })
})

afterAll(async () => {
  if (testEnv) await testEnv.cleanup()
})

function getAuthedDb(auth: { sub: string; role: string }): Firestore {
  return testEnv.authenticatedContext(auth.sub, auth).firestore()
}

test('save and retrieve encrypted session note', async () => {
  const auth = { sub: 'therapist1', role: 'Psychologist' }
  const db = getAuthedDb(auth)
  setEncryptionPassword('senha-teste')

  const noteId = await saveSessionNote(db, 'patient1', 'conteudo sigiloso', auth.sub)
  expect(noteId).toBeDefined()

  const notes = await getSessionNotes(db, 'patient1')
  expect(notes[0].summary).toBe('conteudo sigiloso')
})
