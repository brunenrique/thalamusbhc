
import React from 'react';
import { CLINICAL_KEYWORDS } from '@/constants/keywords';
import { cn } from '@/shared/utils';

/**
 * Função para destacar palavras-chave em um texto.
 * @param text O texto a ser analisado.
 * @param keywords Um array de palavras-chave a serem destacadas. Padrão: CLINICAL_KEYWORDS.
 * @param highlightClassName Classes Tailwind para o destaque.
 * @returns Um array de elementos React (string ou JSX) com as palavras-chave destacadas.
 */
export function highlightKeywords(
  text: string | undefined | null,
  keywords: string[] = CLINICAL_KEYWORDS,
  highlightClassName: string = "bg-yellow-100 dark:bg-yellow-700/30 dark:text-yellow-300 rounded px-0.5 font-medium"
): React.ReactNode[] {
  if (!text) {
    return [text || ''];
  }

  if (!keywords || keywords.length === 0) {
    return [text];
  }

  // Ordena as palavras-chave por comprimento, da mais longa para a mais curta
  // para evitar que "ansiedade" destaque parte de "ansiedade social", por exemplo.
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

  // Constrói uma expressão regular que corresponda a qualquer uma das palavras-chave,
  // de forma case-insensitive e considerando palavras inteiras (word boundaries).
  // Escapa caracteres especiais nas palavras-chave.
  const regex = new RegExp(
    `\\b(${sortedKeywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );

  const parts = text.split(regex);
  const result: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (part) { // Ignora strings vazias resultantes do split
      // Verifica se a parte corresponde a alguma das palavras-chave (de forma case-insensitive)
      const isKeyword = sortedKeywords.some(
        (kw) => kw.toLowerCase() === part.toLowerCase()
      );
      if (isKeyword) {
        result.push(
          <mark key={`${part}-${index}`} className={cn("bg-transparent p-0", highlightClassName)}>
            {part}
          </mark>
        );
      } else {
        result.push(part);
      }
    }
  });

  return result;
}
