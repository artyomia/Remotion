import React from "react";
import { random, useCurrentFrame } from "remotion";
import { progress } from "../lib/motion";

/**
 * Types text on character by character.
 * `charsPerFrame` controls speed; an optional caret blinks while typing.
 */
export const TypeOn: React.FC<{
  text: string;
  start: number;
  charsPerFrame?: number;
  caret?: boolean;
  caretColor?: string;
  style?: React.CSSProperties;
}> = ({
  text,
  start,
  charsPerFrame = 1,
  caret = false,
  caretColor = "currentColor",
  style,
}) => {
  const frame = useCurrentFrame();
  const count = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - start) * charsPerFrame)),
  );
  const typing = frame >= start && count < text.length;
  const caretOn =
    caret && (typing || (frame >= start && Math.floor(frame / 8) % 2 === 0));
  // Untyped characters stay in the layout (transparent) so lines never reflow.
  return (
    <span style={{ whiteSpace: "pre", ...style }}>
      {text.slice(0, count)}
      <span style={{ position: "relative" }}>
        {caret && frame >= start ? (
          <span
            style={{
              position: "absolute",
              left: 1,
              top: "0.1em",
              width: 2,
              height: "1em",
              background: caretColor,
              opacity: caretOn ? 1 : 0,
            }}
          />
        ) : null}
      </span>
      <span style={{ opacity: 0 }}>{text.slice(count)}</span>
    </span>
  );
};

/** Reveals text one character at a time with a short fade per character. */
export const LetterFade: React.FC<{
  text: string;
  start: number;
  /** Frames between characters. */
  stagger?: number;
  fade?: number;
  style?: React.CSSProperties;
}> = ({ text, start, stagger = 1, fade = 6, style }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ whiteSpace: "pre", ...style }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{ opacity: progress(frame, start + i * stagger, fade) }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
};

const HEX = "0123456789ABCDEF";

/**
 * Hex code that scrambles through random characters and resolves to the final
 * value from left to right over `duration` frames. Deterministic per seed.
 */
export const ScrambleHex: React.FC<{
  value: string;
  start: number;
  duration?: number;
  seed: string;
  style?: React.CSSProperties;
}> = ({ value, start, duration = 15, seed, style }) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / duration;
  const chars = value.split("").map((ch, i) => {
    if (ch === "#" || t >= 1) {
      return ch;
    }
    if (t < 0) {
      return " ";
    }
    const settleAt = (i + 1) / value.length;
    if (t >= settleAt) {
      return ch;
    }
    const r = random(`${seed}-${i}-${frame}`);
    return HEX[Math.floor(r * HEX.length)];
  });
  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "pre",
        ...style,
      }}
    >
      {chars.join("")}
    </span>
  );
};
