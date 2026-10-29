// Local /tokenomics keyframes, inlined as <style> (a component CSS import breaks on the apostrophe in the project path).
export const tokenomicsCss = `
/* /tokenomics local motion. CSS-only so the hero animates (and stays visible) before hydration.
   Calm and institutional: short ease-out entrances, one slow ambient drift, no glows.
   globals.css already collapses every animation under prefers-reduced-motion. */

@keyframes tk-rise {
  from { transform: translate3d(0, 105%, 0); }
  to { transform: translate3d(0, 0, 0); }
}
@keyframes tk-fade-up {
  from { opacity: 0; transform: translate3d(0, 12px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes tk-spin { to { transform: rotate(360deg); } }
@keyframes tk-dash { to { stroke-dashoffset: -400; } }
/* Flow-loop stop highlight, in step with the 9s particle (delays 0 / 3s / 6s): hairline turns teal, no glow. */
@keyframes tk-node {
  0%, 22%, 100% { border-color: #1C2A2F; color: #9FB3B7; }
  4%, 14% { border-color: #00C6C9; color: #F2FBFB; }
}

.tk-word { display: inline-block; animation: tk-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
.tk-in { animation: tk-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
.tk-spin { animation: tk-spin 120s linear infinite; }
.tk-dash { animation: tk-dash 24s linear infinite; }
.tk-node { border: 1px solid #1C2A2F; background-color: #0B1114; animation: tk-node 9s ease-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .tk-spin, .tk-dash, .tk-node { animation: none !important; }
  .tk-particle { display: none; }
}
`;
