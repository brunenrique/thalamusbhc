'use client';

import type {
  GenerateSessionInsightsInput,
  GenerateSessionInsightsOutput,
} from '@/ai/flows/generate-session-insights';
import type {
  GenerateReportDraftInput,
  GenerateReportDraftOutput,
} from '@/ai/flows/generate-report-draft-flow';
import type {
  GenerateSessionNoteTemplateInput,
  GenerateSessionNoteTemplateOutput,
} from '@/ai/flows/generate-session-note-template';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

export const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos

interface CacheEntry<T> {
  ts: number;
  data: T;
}

async function hashInput(input: unknown): Promise<string> {
  const str = JSON.stringify(input);
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function requestAI<T>(url: string, body: unknown, ttlMs = DEFAULT_CACHE_TTL_MS): Promise<T> {
  const key = `ai_${url}_${await hashInput(body)}`;

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const entry = JSON.parse(stored) as CacheEntry<T>;
        if (Date.now() - entry.ts < ttlMs) {
          return entry.data;
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || 'Erro na requisição AI');
    }
    const data = (await res.json()) as T;
    if (typeof window !== 'undefined') {
      const entry: CacheEntry<T> = { ts: Date.now(), data };
      try {
        localStorage.setItem(key, JSON.stringify(entry));
      } catch {
        // ignore quota errors
      }
    }
    return data;
  } catch (e) {
    Sentry.captureException(e);
    logger.error({ action: 'ai_service_error', meta: { error: e } });
    throw new Error(
      'Não foi possível conectar ao serviço de IA. Verifique sua conexão e tente novamente.'
    );
  }
}

export async function generateSessionInsights(
  input: GenerateSessionInsightsInput
): Promise<GenerateSessionInsightsOutput> {
  return requestAI<GenerateSessionInsightsOutput>('/api/ai/session-insights', input);
}

export async function generateReportDraft(
  input: GenerateReportDraftInput
): Promise<GenerateReportDraftOutput> {
  return requestAI<GenerateReportDraftOutput>('/api/ai/report-draft', input);
}

export async function generateSessionNoteTemplate(
  input: GenerateSessionNoteTemplateInput
): Promise<GenerateSessionNoteTemplateOutput> {
  return requestAI<GenerateSessionNoteTemplateOutput>('/api/ai/session-note-template', input);
}
