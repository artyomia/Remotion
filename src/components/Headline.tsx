import React from "react";
import { useCurrentFrame } from "remotion";
import { DISPLAY_LINE_HEIGHT, EASE_OUT, FONTS, FONT_WEIGHTS } from "../brand";
import { AccentDash } from "./AccentDash";
import { tween } from "../lib/motion";

export type HeadlineLine = {
  text: string;
  color: string;
  /** Extra coloured segments on the same line, e.g. "HỆ" blue + "ICON" orange. */
  parts?: Array<{ text: string; color: string }>;
};

export type HeadlineProps = {
  lines: HeadlineLine[];
  x: number;
  y: number;
  fontSize: number;
  start?: number;
  /** Delay between lines. */
  stagger?: number;
  /** Frame at which the headline slides back out, if any. */
  exitStart?: number;
  /** Content rendered under the lines (sub-label etc.). */
  children?: React.ReactNode;
};

/**
 * Left-aligned two-tone headline in the display face. The orange accent dash
 * scales in first, then each line rises into view through its own mask.
 * The masks are padded so stacked Vietnamese diacritics never clip.
 */
export const Headline: React.FC<HeadlineProps> = ({
  lines,
  x,
  y,
  fontSize,
  start = 0,
  stagger = 5,
  exitStart,
  children,
}) => {
  const frame = useCurrentFrame();
  const pad = 0.24; // em of headroom above the cap height for diacritics
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <AccentDash
        start={start}
        exitStart={exitStart}
        style={{ marginBottom: fontSize * 0.28 }}
      />
      {lines.map((line, i) => {
        const lineStart = start + 6 + i * stagger;
        const inY = tween(frame, [lineStart, lineStart + 20], [1, 0], EASE_OUT);
        const outY =
          exitStart === undefined
            ? 0
            : tween(
                frame,
                [exitStart + i * 3, exitStart + i * 3 + 14],
                [0, -1],
              );
        // Fade while exiting so diacritics below the baseline never linger.
        const outFade = exitStart === undefined ? 1 : 1 + outY;
        return (
          <div
            key={line.text}
            style={{
              overflow: "hidden",
              paddingTop: `${pad}em`,
              marginTop: `-${pad}em`,
              paddingBottom: "0.06em",
              marginBottom: "-0.06em",
              fontSize,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.display,
                fontWeight: FONT_WEIGHTS.display,
                lineHeight: DISPLAY_LINE_HEIGHT,
                whiteSpace: "nowrap",
                color: line.color,
                opacity: outFade,
                transform: `translateY(${(inY + outY) * (1 + pad) * 100}%)`,
              }}
            >
              {line.parts
                ? line.parts.map((p) => (
                    <span key={p.text} style={{ color: p.color }}>
                      {p.text}
                    </span>
                  ))
                : line.text}
            </div>
          </div>
        );
      })}
      {children}
    </div>
  );
};
