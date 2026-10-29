"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { community } from "@/data/content/home";
import { cn } from "@/lib/utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Status = "idle" | "loading" | "ok" | "invalid" | "error";

/** Newsletter form → POST /api/subscribe. Status messages are announced via aria-live. */
export function SubscribeForm() {
  const { form } = community;
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) return setStatus("invalid");
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (res.status === 422) return setStatus("invalid");
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const message = status === "ok" || status === "invalid" || status === "error" ? form.messages[status] : "";
  const bad = status === "invalid" || status === "error";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={`${id}-email`} className="sr-only">
        {form.label}
      </label>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-[28px] border bg-black/40 p-2 backdrop-blur-xl transition-colors duration-300 focus-within:border-gold/50 sm:flex-row sm:rounded-full",
          bad ? "border-[#FF6B6B]/50" : "border-white/12",
        )}
      >
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "loading") setStatus("idle");
          }}
          placeholder={form.placeholder}
          aria-invalid={status === "invalid" || undefined}
          aria-describedby={`${id}-status`}
          className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[16px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group/btn inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-6 text-[15px] font-semibold text-[#0B0B0F] shadow-[0_0_0_1px_rgba(245,197,66,0.4),0_8px_32px_-8px_rgba(245,197,66,0.55)] transition-[background-color,transform] duration-300 ease-quint hover:bg-gold-2 active:scale-[0.98] disabled:opacity-70"
        >
          {form.button}
          {status === "loading" ? (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          ) : status === "ok" ? (
            <Check aria-hidden className="size-4" />
          ) : (
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-quint group-hover/btn:translate-x-1" />
          )}
        </button>
      </div>
      <p
        id={`${id}-status`}
        role="status"
        aria-live="polite"
        className={cn("mt-3 min-h-6 px-5 text-sm", status === "ok" ? "text-mint" : bad ? "text-[#FF8A8A]" : "text-ink-3")}
      >
        {message}
      </p>
    </form>
  );
}
