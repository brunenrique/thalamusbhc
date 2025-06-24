import { loadSecrets } from '../src/lib/secretManager';

jest.mock('@google-cloud/secret-manager', () => {
  return {
    SecretManagerServiceClient: jest.fn(() => ({
      accessSecretVersion: jest.fn(async ({ name }) => [
        {
          payload: { data: Buffer.from(name.includes('CLIENT_EMAIL') ? 'admin@test.com' : 'priv') },
        },
      ]),
    })),
  };
});

describe('loadSecrets', () => {
  const origEnv = process.env;
  beforeEach(() => {
    process.env = { ...origEnv, FIREBASE_PROJECT_ID: 'demo' };
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;
  });
  afterAll(() => {
    process.env = origEnv;
  });

  it('carrega variáveis do Secret Manager', async () => {
    await loadSecrets(['FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY']);
    expect(process.env.FIREBASE_CLIENT_EMAIL).toBe('admin@test.com');
    expect(process.env.FIREBASE_PRIVATE_KEY).toBe('priv');
  });
});
