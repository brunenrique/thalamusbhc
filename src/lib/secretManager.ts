import type { AccessSecretVersionResponse } from '@google-cloud/secret-manager';
let loaded = false;

export async function loadSecrets(names: string[]): Promise<void> {
  if (loaded) return;
  loaded = true;
  const { SecretManagerServiceClient } = await import('@google-cloud/secret-manager');
  const client = new SecretManagerServiceClient();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) return;

  await Promise.all(
    names.map(async (name) => {
      if (process.env[name]) return;
      try {
        const [version]: AccessSecretVersionResponse = await client.accessSecretVersion({
          name: `projects/${projectId}/secrets/${name}/versions/latest`,
        });
        const value = version.payload?.data?.toString();
        if (value) process.env[name] = value;
      } catch (err) {
        console.error(`Erro ao carregar segredo ${name}:`, err);
      }
    })
  );
}
