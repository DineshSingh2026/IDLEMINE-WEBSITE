/**
 * Page transition: 0.3s fade + 8px rise on every route change.
 * CSS-only (`.page-in` in globals.css) so server-rendered content is never hidden while JS loads.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
