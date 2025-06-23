"use client";

import { Clipboard, Check } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/copyToClipboard";
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export default function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      const success = await copyToClipboard(value);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch (e) {
      Sentry.captureException(e);
      logger.error({ action: 'copy_failed', meta: { error: e } });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={className}
      aria-label="Copiar para a\u00e1rea de transfer\u00eancia"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
    </Button>
  );
}
