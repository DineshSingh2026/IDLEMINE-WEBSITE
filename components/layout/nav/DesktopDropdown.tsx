"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { MenuItem } from "@/data/content/landing";
import { cn } from "@/lib/utils";
import { NavRow } from "./NavRow";

const CLOSE_DELAY = 140;

/**
 * Disclosure-pattern nav dropdown. Opens on hover (mouse), click, or keyboard
 * (Enter/Space toggle, ArrowDown/ArrowUp open + focus first/last). Inside the panel
 * Arrow keys / Home / End move focus, Esc closes and returns focus to the trigger,
 * tabbing out closes it.
 */
export function DesktopDropdown({
  id,
  label,
  items,
  open,
  onOpenChange,
}: {
  id: string;
  label: string;
  items: MenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpened = useRef(false);
  const pendingFocus = useRef<"first" | "last" | null>(null);

  const live = items.filter((i) => !i.soon && i.href);
  const soon = items.filter((i) => i.soon || !i.href);

  const clearTimer = () => window.clearTimeout(closeTimer.current);
  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!open) hoverOpened.current = false;
  }, [open]);

  const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>("[data-nav-item]") ?? []);

  // Move focus into the panel once it has rendered (keyboard open).
  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    const which = pendingFocus.current;
    const raf = requestAnimationFrame(() => {
      const list = focusables();
      (which === "first" ? list[0] : list[list.length - 1])?.focus();
      pendingFocus.current = null;
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      pendingFocus.current = e.key === "ArrowDown" ? "first" : "last";
      if (open) {
        const list = focusables();
        (e.key === "ArrowDown" ? list[0] : list[list.length - 1])?.focus();
        pendingFocus.current = null;
      } else onOpenChange(true);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  const onPanelKey = (e: React.KeyboardEvent) => {
    const list = focusables();
    const i = list.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    if (e.key === "ArrowDown") next = list[(i + 1) % list.length];
    else if (e.key === "ArrowUp") next = list[(i - 1 + list.length) % list.length];
    else if (e.key === "Home") next = list[0];
    else if (e.key === "End") next = list[list.length - 1];
    else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onOpenChange(false);
      triggerRef.current?.focus();
      return;
    }
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimer();
        if (!open) {
          hoverOpened.current = true;
          onOpenChange(true);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimer();
        closeTimer.current = window.setTimeout(() => onOpenChange(false), CLOSE_DELAY);
      }}
      onBlur={(e) => {
        if (open && !wrapRef.current?.contains(e.relatedTarget as Node | null)) onOpenChange(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onKeyDown={onTriggerKey}
        onClick={() => {
          // A click right after a hover-open keeps the panel open rather than toggling it shut.
          if (open && hoverOpened.current) {
            hoverOpened.current = false;
            return;
          }
          onOpenChange(!open);
        }}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-[10px] px-3.5 text-[15px] font-normal transition-colors duration-200 ease-out",
          open ? "bg-white/[0.04] text-ink" : "text-ink-2 hover:text-ink",
        )}
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn("size-4 text-ink-3 transition-transform duration-200 ease-out", open && "rotate-180")}
        />
      </button>

      {/* pt-3 is the hover bridge between trigger and panel */}
      <div id={`${id}-panel`} className="absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3">
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              onKeyDown={onPanelKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4, transition: { duration: 0.12, ease: "easeOut" } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-[380px] rounded-[20px] border border-line bg-surface p-2"
            >
              <ul aria-label={label}>
                {live.map((item) => (
                  <li key={item.label}>
                    <NavRow item={item} onNavigate={() => onOpenChange(false)} />
                  </li>
                ))}
              </ul>
              {soon.length > 0 && (
                <>
                  <div aria-hidden className="mx-3 my-2 h-px bg-line" />
                  <ul aria-label={`${label}: coming soon`}>
                    {soon.map((item) => (
                      <li key={item.label}>
                        <NavRow item={item} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
