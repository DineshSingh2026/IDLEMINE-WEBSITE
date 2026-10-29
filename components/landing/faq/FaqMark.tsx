import Image from "next/image";

/**
 * Small animated emblem for the sticky FAQ column: the official mark (unaltered) inside a
 * hairline rim, a slowly rotating dashed orbit and a teal satellite dot. CSS-only,
 * transform/opacity only; static under reduced motion.
 */
const CSS = `
@keyframes faqm-spin{to{transform:rotate(360deg)}}
@keyframes faqm-spin-r{to{transform:rotate(-360deg)}}
@keyframes faqm-breathe{0%,100%{opacity:.55;transform:scale(.96)}50%{opacity:1;transform:scale(1.04)}}
.faqm-spin{animation:faqm-spin 38s linear infinite;will-change:transform}
.faqm-spin-r{animation:faqm-spin-r 22s linear infinite;will-change:transform}
.faqm-breathe{animation:faqm-breathe 5.5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.faqm-spin,.faqm-spin-r,.faqm-breathe{animation:none!important}}
`;

export function FaqMark({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="relative size-[88px]">
        {/* soft halo */}
        <div className="faqm-breathe absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.30)_0%,rgba(0,198,201,0.08)_45%,transparent_70%)]" />
        {/* dashed orbit */}
        <svg viewBox="0 0 88 88" className="faqm-spin absolute inset-0 size-full">
          <circle cx="44" cy="44" r="43" fill="none" stroke="rgba(0,198,201,0.55)" strokeWidth="1" strokeDasharray="2 5" />
        </svg>
        {/* rotating mint satellite (humans) */}
        <div className="faqm-spin absolute inset-0">
          <span className="absolute bottom-0 left-1/2 size-[5px] -translate-x-1/2 translate-y-1/2 rounded-full bg-mint shadow-[0_0_8px_rgba(61,245,176,0.8)]" />
        </div>
        {/* counter-rotating violet satellite (agents) */}
        <div className="faqm-spin-r absolute inset-[6px]">
          <span className="absolute left-1/2 top-0 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet shadow-[0_0_8px_rgba(155,123,255,0.8)]" />
        </div>
        {/* rim */}
        <div className="absolute inset-[12px] rounded-full border border-teal-400/45 bg-[radial-gradient(circle,#05080A_0%,#05080A_50%,#013B3D_100%)] shadow-[0_0_24px_rgba(0,198,201,0.28)]" />
        <div className="absolute inset-[26px]">
          <Image src="/assets/img/idlemine-mark.png" alt="" fill sizes="36px" className="object-contain" />
        </div>
      </div>
    </div>
  );
}
