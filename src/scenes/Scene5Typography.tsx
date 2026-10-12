import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  COLORS,
  DISPLAY_LINE_HEIGHT,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
  TRACKING,
} from "../brand";
import { SceneChrome } from "../components/SceneChrome";
import { useLayout } from "../lib/layout";
import { progress, tween } from "../lib/motion";

const DURATION = 135;

type Row = {
  label: string;
  name: string;
  specimen: string;
  family: string;
  weight: number;
  /** Specimen size: landscape, vertical. */
  size: [number, number];
  lineHeight: number;
};

const ROWS: Row[] = [
  {
    label: "FONT NHẬN DIỆN",
    name: "SVN-HARABARAS",
    specimen: "TIÊU ĐỀ",
    family: FONTS.display,
    weight: FONT_WEIGHTS.display,
    size: [104, 96],
    lineHeight: DISPLAY_LINE_HEIGHT,
  },
  {
    label: "FONT ỨNG DỤNG",
    name: "UTM MICRA",
    specimen: "Phụ đề",
    family: FONTS.sub,
    weight: FONT_WEIGHTS.sub,
    size: [84, 78],
    lineHeight: 1.25,
  },
  {
    label: "FONT PHỤ TRỢ",
    name: "Montserrat",
    specimen: "Nội dung ngắn",
    family: FONTS.body,
    weight: FONT_WEIGHTS.body.semibold,
    size: [64, 60],
    lineHeight: 1.25,
  },
];

const ALPHABET = ["ABCDEFGHIJKLMN", "OPQRSTUVWXYZ", "0123456789"];
const ROW_STAGGER = 32;
const FIRST_ROW = 12;

/** Types the three alphabet lines one after another. */
const Alphabet: React.FC<{
  start: number;
  family: string;
  weight: number;
  size: number;
}> = ({ start, family, weight, size }) => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, (frame - start) * 2);
  let used = 0;
  return (
    <div
      style={{
        fontFamily: family,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.55,
        color: COLORS.white,
      }}
    >
      {ALPHABET.map((line) => {
        const visible = Math.max(
          0,
          Math.min(line.length, Math.floor(typed - used)),
        );
        used += line.length;
        return (
          <div key={line} style={{ whiteSpace: "pre", opacity: 0.78 }}>
            {line.slice(0, visible)}
            <span style={{ opacity: 0 }}>{line.slice(visible)}</span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Scene 5, "Typography" (frames 600 to 735).
 * Deep navy page. Three font rows reveal one by one: label and name,
 * a large specimen, and the alphabet typed on the right, separated by
 * hairlines that draw in.
 */
export const Scene5Typography: React.FC = () => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { margin, contentWidth, isVertical, pick } = layout;

  // Arrive on PAD Blue (the previous scene's wipe), settle into Deep Navy.
  const navy = progress(frame, 0, 12);
  const exit = progress(frame, DURATION - 12, 10);

  const rowTop = (i: number) => pick(196 + i * 240, 260 + i * 520);
  const rowH = pick(220, 480);

  return (
    <AbsoluteFill style={{ background: COLORS.blue }}>
      <AbsoluteFill style={{ background: COLORS.navy, opacity: navy }} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {ROWS.map((row, i) => {
          const start = FIRST_ROW + i * ROW_STAGGER;
          const top = rowTop(i);
          const size = pick(row.size[0], row.size[1]);
          const labelIn = progress(frame, start, 14, EASE_OUT);
          const specimenY = tween(
            frame,
            [start + 4, start + 24],
            [1, 0],
            EASE_OUT,
          );
          const lineIn = progress(frame, start + 16, 22);

          const labelTop = pick(top + rowH / 2 - 34, top);
          const specimenLeft = pick(margin + 420, margin);
          const specimenTop = pick(
            top + (rowH - size * row.lineHeight) / 2,
            top + 76,
          );
          const alphaLeft = pick(margin + 1110, margin);
          const alphaTop = pick(
            top + (rowH - 22 * 1.55 * 3) / 2,
            specimenTop + size * row.lineHeight + 28,
          );

          return (
            <React.Fragment key={row.name}>
              <div
                style={{
                  position: "absolute",
                  left: margin,
                  top: labelTop,
                  opacity: labelIn,
                  transform: `translateY(${(1 - labelIn) * 10}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: FONT_WEIGHTS.body.medium,
                    fontSize: 14,
                    letterSpacing: TRACKING.micro,
                    color: COLORS.orange,
                    marginBottom: 10,
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: FONT_WEIGHTS.body.semibold,
                    fontSize: 22,
                    letterSpacing: "0.08em",
                    color: COLORS.white,
                  }}
                >
                  {row.name}
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  left: specimenLeft,
                  top: specimenTop,
                  overflow: "hidden",
                  paddingTop: "0.24em",
                  marginTop: "-0.24em",
                  paddingBottom: "0.08em",
                  fontSize: size,
                }}
              >
                <div
                  style={{
                    fontFamily: row.family,
                    fontWeight: row.weight,
                    lineHeight: row.lineHeight,
                    color:
                      i === 0
                        ? COLORS.white
                        : i === 1
                          ? COLORS.orange
                          : COLORS.white,
                    whiteSpace: "nowrap",
                    transform: `translateY(${specimenY * 130}%)`,
                  }}
                >
                  {row.specimen}
                </div>
              </div>

              <div
                style={{ position: "absolute", left: alphaLeft, top: alphaTop }}
              >
                <Alphabet
                  start={start + 10}
                  family={row.family}
                  weight={row.weight}
                  size={isVertical ? 24 : 22}
                />
              </div>

              {i < ROWS.length - 1 ? (
                <div
                  style={{
                    position: "absolute",
                    left: margin,
                    top: top + rowH + pick(10, 20),
                    width: contentWidth,
                    height: 1,
                    background: "rgba(255,255,255,0.22)",
                    transform: `scaleX(${lineIn})`,
                    transformOrigin: "left",
                  }}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      <SceneChrome
        index="05"
        title="TYPOGRAPHY"
        dark
        fadeIn={6}
        exitStart={DURATION - 12}
      />
    </AbsoluteFill>
  );
};
