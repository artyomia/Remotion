import React from "react";
import { useCurrentFrame } from "remotion";
import {
  DISPLAY_LINE_HEIGHT,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
} from "../../brand";
import { progress } from "../../lib/motion";

export type SlamLine = {
  /** Text segments with their colours (one line). */
  parts: Array<{ text: string; color: string }>;
  /** Frame the line lands, usually a beat or a hit. */
  at: number;
};

/**
 * Kinetic headline: each line slams in on its beat (scales down from 150%,
 * de-blurs, tracking tightens), with a short landing shudder.
 */
export const SlamText: React.FC<{
  lines: SlamLine[];
  /** Top of the block in px. */
  y: number;
  size: number;
  /** Frame at which the whole block leaves. */
  exitAt: number;
  width: number;
  /** Added to the local frame so cues can be absolute film frames. */
  frameOffset?: number;
}> = ({ lines, y, size, exitAt, width, frameOffset = 0 }) => {
  const frame = useCurrentFrame() + frameOffset;
  const exit = progress(frame, exitAt, 5);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width,
        textAlign: "center",
        opacity: 1 - exit,
        transform: `translateY(${-40 * exit}px)`,
      }}
    >
      {lines.map((line, i) => {
        const s = progress(frame, line.at - 4, 6, EASE_OUT);
        const t = frame - (line.at + 2);
        const shudder =
          t >= 0 && t < 8 ? Math.sin(t * 2.6) * 7 * (1 - t / 8) : 0;
        return (
          <div
            key={i}
            style={{
              fontFamily: FONTS.display,
              fontWeight: FONT_WEIGHTS.display,
              fontSize: size,
              lineHeight: DISPLAY_LINE_HEIGHT,
              whiteSpace: "nowrap",
              letterSpacing: `${0.02 + (1 - s) * 0.18}em`,
              opacity: s,
              filter: `blur(${(1 - s) * 10}px)`,
              transform: `translateX(${shudder}px) scale(${1 + (1 - s) * 0.5})`,
            }}
          >
            {line.parts.map((p, j) => (
              <span key={j} style={{ color: p.color }}>
                {p.text}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
