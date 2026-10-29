import { Fragment } from "react";

/** Renders a copy string with every "$IDLE" in the gold brand gradient. */
export function GoldText({ text, token = "$IDLE" }: { text: string; token?: string }) {
  const parts = text.split(token);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <span className="text-grad-brand font-semibold">{token}</span>}
        </Fragment>
      ))}
    </>
  );
}
