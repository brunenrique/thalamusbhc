"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Tempo de inatividade em milissegundos (15 minutos).
 */
const TIMEOUT = 15 * 60 * 1000;

/**
 * Hook que dispara `onTimeout` quando o usuário fica inativo por um período.
 *
 * @param onTimeout Função chamada após o tempo de inatividade expirar.
 */
export default function useSessionTimeout(onTimeout: () => void) {
  /**
   * Referência para o ID do timer. É usada para limpar o timeout
   * sempre que uma nova atividade é detectada.
   */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Reinicia o timer de inatividade. Quando o tempo definido em
   * `TIMEOUT` se esgota sem detectar eventos de atividade, a função
   * `onTimeout` é executada.
   */
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, TIMEOUT);
  }, [onTimeout]);

  useEffect(() => {
    // Inicia o timer na montagem do componente.
    resetTimer();

    // Eventos que indicam atividade do usuário.
    const events = ["mousemove", "keydown", "scroll"] as const;

    // Para cada evento de atividade, o timer é reiniciado.
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      // Remove os event listeners ao desmontar e limpa o timer.
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);
}
