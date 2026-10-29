// Local /tokenomics keyframes, inlined as <style> (a component CSS import breaks on the apostrophe in the project path).
export const tokenomicsCss = `
/* /tokenomics local motion. CSS-only so the hero animates (and stays visible) before hydration.
   globals.css already collapses every animation under prefers-reduced-motion. */

@keyframes tk-rise {
  from { transform: translate3d(0, 105%, 0); }
  to { transform: translate3d(0, 0, 0); }
}
@keyframes tk-fade-up {
  from { opacity: 0; transform: translate3d(0, 18px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes tk-spin { to { transform: rotate(360deg); } }
@keyframes tk-spin-rev { to { transform: rotate(-360deg); } }
@keyframes tk-breathe {
  0%, 100% { opacity: 0.55; transform: scale(0.96); }
  50% { opacity: 0.9; transform: scale(1.04); }
}
@keyframes tk-float {
  0%, 100% { transform: translate3d(0, -8px, 0); }
  50% { transform: translate3d(0, 8px, 0); }
}
@keyframes tk-dash { to { stroke-dashoffset: -400; } }
/* Flow-loop stop glow, in step with the 9s particle (delays 0 / 3s / 6s). */
@keyframes tk-node {
  0%, 22%, 100% { box-shadow: 0 0 0 1px rgba(245, 197, 66, 0.35), 0 0 0 rgba(245, 197, 66, 0); background-color: rgba(15, 17, 25, 0.95); }
  4% { box-shadow: 0 0 0 1px rgba(255, 224, 138, 1), 0 0 48px rgba(245, 197, 66, 0.65); background-color: rgba(245, 197, 66, 0.22); }
}
@keyframes tk-sheen {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.tk-word { display: inline-block; animation: tk-rise 0.95s cubic-bezier(0.22, 1, 0.36, 1) both; }
.tk-in { animation: tk-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
.tk-spin { animation: tk-spin 60s linear infinite; }
.tk-spin-rev { animation: tk-spin-rev 90s linear infinite; }
.tk-breathe { animation: tk-breathe 7s ease-in-out infinite; }
.tk-float { animation: tk-float 7s ease-in-out infinite; }
.tk-dash { animation: tk-dash 18s linear infinite; }
.tk-node { animation: tk-node 9s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
.tk-sheen {
  background-image: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%);
  background-size: 200% 100%;
  animation: tk-sheen 6s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .tk-spin, .tk-spin-rev, .tk-breathe, .tk-float, .tk-dash, .tk-node, .tk-sheen { animation: none !important; }
  .tk-particle { display: none; }
}
`;
