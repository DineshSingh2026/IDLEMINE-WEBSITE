"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { contract } from "@/data/content/site";
import { truncateAddress } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Mono contract address with copy-to-clipboard. Truncates below `sm` unless `full`. */
export function CopyAddress({
  address = contract,
  className,
  full = false,
  compact = false,
}: {
  address?: string;
  className?: string;
  full?: boolean;
  /** Always truncated (footer). */
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  return (
    <span className={cn("inline-flex max-w-full items-center gap-2", className)}>
      <code className="min-w-0 truncate font-mono text-sm text-ink" title={address}>
        {compact ? (
          truncateAddress(address)
        ) : full ? (
          <span className="break-all whitespace-normal">{address}</span>
        ) : (
          <>
            <span className="hidden sm:inline">{address}</span>
            <span className="sm:hidden">{truncateAddress(address)}</span>
          </>
        )}
      </code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-gold"
        aria-label={copied ? "Contract address copied" : "Copy contract address"}
      >
        {copied ? <Check aria-hidden className="size-4 text-mint" /> : <Copy aria-hidden className="size-4" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
