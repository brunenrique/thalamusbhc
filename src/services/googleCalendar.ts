"use client";

import { google, calendar_v3 } from 'googleapis';
import { encrypt, decrypt, type EncryptionResult } from '@/lib/crypto-utils';
import { deriveKeyFromPassword } from '@/lib/encryptionKey';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_SALT = 'gcal_salt';

interface StoredToken {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

function tokenKey(userId: string): string {
  return `gcal_token_${userId}`;
}

function getKey(userId: string): Buffer {
  return deriveKeyFromPassword(`${userId}_${TOKEN_SALT}`);
}

function decodeTokens(userId: string, stored: string): StoredToken | null {
  try {
    const enc = JSON.parse(stored) as EncryptionResult;
    const json = decrypt(enc, getKey(userId));
    return JSON.parse(json) as StoredToken;
  } catch {
    return null;
  }
}

function encodeTokens(userId: string, tokens: StoredToken): string {
  const enc = encrypt(JSON.stringify(tokens), getKey(userId));
  return JSON.stringify(enc);
}

function createClient() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  );
}

export function getOAuthClient(userId: string) {
  const client = createClient();
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(tokenKey(userId));
    if (stored) {
      const tokens = decodeTokens(userId, stored);
      if (tokens) {
        client.setCredentials(tokens);
      }
    }
  }
  return client;
}

export function hasTokens(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  const item = localStorage.getItem(tokenKey(userId));
  if (!item) return false;
  return decodeTokens(userId, item) !== null;
}

export function clearTokens(userId: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(tokenKey(userId));
  }
}

export function getAuthUrl(userId: string): string {
  const client = getOAuthClient(userId);
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
}

export async function exchangeCodeForTokens(userId: string, code: string) {
  const client = getOAuthClient(userId);
  const { tokens } = await client.getToken(code);
  setTokens(userId, tokens as StoredToken);
  return tokens;
}

export function setTokens(userId: string, tokens: StoredToken) {
  const client = getOAuthClient(userId);
  client.setCredentials(tokens);
  if (typeof window !== 'undefined') {
    localStorage.setItem(tokenKey(userId), encodeTokens(userId, tokens));
  }
}

async function ensureFreshToken(
  client: ReturnType<typeof createClient>,
  userId: string,
) {
  const creds = client.credentials as StoredToken;
  if (creds.expiry_date && creds.expiry_date <= Date.now()) {
    const { credentials } = await client.refreshAccessToken();
    const merged = { ...creds, ...credentials } as StoredToken;
    setTokens(userId, merged);
  }
}

export async function insertOrUpdateEvent(userId: string, event: calendar_v3.Schema$Event) {
  const auth = getOAuthClient(userId);
  await ensureFreshToken(auth, userId);
  const calendar = google.calendar({ version: 'v3', auth });

  if (event.id) {
    const res = await calendar.events.update({
      calendarId: 'primary',
      eventId: event.id,
      requestBody: event,
    });
    return res.data;
  }
  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });
  return res.data;
}

export async function listUpcomingEvents(userId: string, maxResults = 10) {
  const auth = getOAuthClient(userId);
  await ensureFreshToken(auth, userId);
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items || [];
}
