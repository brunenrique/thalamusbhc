"use client";

import { Clipboard, Check } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  value: string;
  className?: string;
}

export default function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Failed to copy", e);
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
