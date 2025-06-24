'use client';

import { ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import logger from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function uploadFile(
  path: string,
  file: File,
  cacheMaxAge = 86400,
  storageInstance: FirebaseStorage = storage,
): Promise<string> {
  try {
    const fileRef = ref(storageInstance, path);
    await uploadBytes(fileRef, file, {
      cacheControl: `public,max-age=${cacheMaxAge}`,
    });
    return await getDownloadURL(fileRef);
  } catch (err) {
    Sentry.captureException(err);
    logger.error({ action: 'storage_upload_error', meta: { path, error: err } });
    throw err;
  }
}

export async function getFileUrl(
  path: string,
  storageInstance: FirebaseStorage = storage,
): Promise<string> {
  const fileRef = ref(storageInstance, path);
  return getDownloadURL(fileRef);
}
