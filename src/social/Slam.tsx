/**
 * Kinetic typography for the social debut. Words slam in on their beat:
 * they drop from 150% scale, de-blur and shudder as they land.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  COLORS,
  DISPLAY_LINE_HEIGHT,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
} from "../brand";
import { progress } from "../lib/motion";

/** `at` is the frame the word lands on (put it on the beat). */
export type SlamWord = { text: string; at: number; color?: string };

const shudder = (frame: number, at: number) => {
  const t = frame - at;
  return t >= 0 && t < 9 ? Math.sin(t * 2.4) * 8 * (1 - t / 9) : 0;
};

/** One word slamming in. */
const Word: React.FC<{ word: SlamWord; size: number; frame: number }> = ({
  word,
  size,
  frame,
}) => {
  const s = progress(frame, word.at - 6, 6, EASE_OUT);
  if (frame < word.at - 6) {
    return (
      <span style={{ opacity: 0, display: "inline-block" }}>{word.text}</span>
    );
  }
  return (
    <span
      style={{
        display: "inline-block",
        color: word.color ?? COLORS.white,
        opacity: Math.min(1, s * 2),
        filter: `blur(${(1 - s) * 14}px)`,
        transform: `translateX(${shudder(frame, word.at)}px) scale(${1 + (1 - s) * 0.5})`,
        fontSize: size,
      }}
    >
      {word.text}
    </span>
  );
};

export type SlamBlockProps = {
  /** Small kicker line above, e.g. "TỪNG". */
  lead?: SlamWord;
  /** Big lines; each word slams on its own frame. */
  lines: SlamWord[][];
  /** Top of the block in px; the block is centred horizontally on `cx`. */
  y: number;
  cx: number;
  size: number;
  /** Frame at which the block leaves (optional). */
  exitAt?: number;
  /** Orange bar under the last line, shooting in after it lands. */
  underline?: boolean;
  /** Legibility glow behind the letters. */
  glow?: boolean;
};

export const SlamBlock: React.FC<SlamBlockProps> = ({
  lead,
  lines,
  y,
  cx,
  size,
  exitAt,
  underline = false,
  glow = true,
}) => {
  const frame = useCurrentFrame();
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, 6);
  const leadIn = lead ? progress(frame, lead.at - 6, 8, EASE_OUT) : 0;
  const lastAt = lines.flat().reduce((m, w) => Math.max(m, w.at), 0);
  const bar = progress(frame, lastAt, 9, EASE_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - 1000,
        width: 2000,
        top: y,
        textAlign: "center",
        opacity: 1 - exit,
        transform: `translateY(${-50 * exit}px) scale(${1 - 0.08 * exit})`,
        fontFamily: FONTS.display,
        fontWeight: FONT_WEIGHTS.display,
        lineHeight: DISPLAY_LINE_HEIGHT,
        whiteSpace: "nowrap",
        textShadow: glow ? "0 8px 40px rgba(2,8,20,0.55)" : undefined,
      }}
    >
      {lead ? (
        <div
          style={{
            fontSize: size * 0.4,
            letterSpacing: "0.14em",
            paddingLeft: "0.14em",
            color: lead.color ?? COLORS.orange,
            opacity: leadIn,
            transform: `translateY(${(1 - leadIn) * 30}px)`,
            marginBottom: size * 0.12,
          }}
        >
          {lead.text}
        </div>
      ) : null}
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize: size }}>
          {line.map((w, j) => (
            <React.Fragment key={j}>
              {j > 0 ? " " : null}
              <Word word={w} size={size} frame={frame} />
            </React.Fragment>
          ))}
        </div>
      ))}
      {underline ? (
        <div
          style={{
            margin: `${size * 0.12}px auto 0`,
            width: size * 1.6,
            height: Math.max(6, size * 0.07),
            background: COLORS.orange,
            transform: `scaleX(${bar})`,
            transformOrigin: "left center",
          }}
        />
      ) : null}
    </div>
  );
};
