import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS, FONT_WEIGHTS, NEUTRALS, TRACKING } from "../brand";
import { Logo } from "../logo/Logo";
import { useLayout } from "../lib/layout";
import { progress } from "../lib/motion";

/** Distance from the margin to where the footer hairline begins. */
const HAIRLINE_OFFSET = 340;

export type SceneChromeProps = {
  /** Section index, e.g. "03". */
  index: string;
  /** Section name, e.g. "BRAND IDEA". */
  title: string;
  showLogo?: boolean;
  dark?: boolean;
  /**
   * "draw": first appearance, the hairline draws in.
   * "swap": the hairline is already there and only the label changes.
   */
  enter?: "draw" | "swap";
  /** Frame at which the chrome fades out, if any. */
  exitStart?: number;
  /** Frame at which the chrome fades in (after a full-screen transition). */
  fadeIn?: number;
};

/**
 * Persistent page furniture: the small header logo top-left and the footer
 * index label bottom-left with a hairline running to the right margin.
 */
export const SceneChrome: React.FC<SceneChromeProps> = ({
  index,
  title,
  showLogo = true,
  dark = false,
  enter = "swap",
  exitStart,
  fadeIn,
}) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { margin, width, height, headerTop, headerLogoHeight, footerBottom } =
    layout;

  const labelIn = progress(frame, enter === "draw" ? 6 : 0, 14);
  const lineIn = enter === "draw" ? progress(frame, 4, 30) : 1;
  const out = exitStart === undefined ? 0 : progress(frame, exitStart, 12);
  const fade = fadeIn === undefined ? 1 : progress(frame, fadeIn, 10);
  const labelColor = dark ? "rgba(255,255,255,0.62)" : NEUTRALS.label;
  const lineColor = dark ? "rgba(255,255,255,0.22)" : NEUTRALS.grid;
  const footerY = height - footerBottom;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade * (1 - out),
        pointerEvents: "none",
      }}
    >
      {showLogo ? (
        <Logo
          height={headerLogoHeight}
          lockup="horizontal"
          variant={dark ? "reversed" : "color"}
          style={{ position: "absolute", left: margin, top: headerTop }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: footerY - 9,
          height: 18,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: FONT_WEIGHTS.body.medium,
            fontSize: 14,
            lineHeight: "18px",
            letterSpacing: TRACKING.micro,
            color: labelColor,
            whiteSpace: "nowrap",
            transform: `translateY(${(1 - labelIn) * 18}px)`,
            opacity: labelIn,
          }}
        >
          {index} / {title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: margin + HAIRLINE_OFFSET,
          top: footerY,
          width: width - margin * 2 - HAIRLINE_OFFSET,
          height: 1,
          background: lineColor,
          transform: `scaleX(${lineIn})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

/** Solid page background, optionally with the faint construction grid. */
export const PageBackground: React.FC<{
  color?: string;
  grid?: boolean;
  gridOpacity?: number;
}> = ({ color = COLORS.ivory, grid = false, gridOpacity = 1 }) => {
  const { width, height, isVertical } = useLayout();
  const cell = isVertical ? 90 : 96;
  return (
    <div style={{ position: "absolute", inset: 0, background: color }}>
      {grid ? (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0, opacity: gridOpacity }}
        >
          <defs>
            <pattern
              id="pad-grid"
              width={cell}
              height={cell}
              patternUnits="userSpaceOnUse"
              x={(width % cell) / 2}
              y={(height % cell) / 2}
            >
              <path
                d={`M${cell} 0H0V${cell}`}
                fill="none"
                stroke={NEUTRALS.grid}
                strokeWidth={1}
              />
            </pattern>
          </defs>
          <rect
            width={width}
            height={height}
            fill="url(#pad-grid)"
            opacity={0.55}
          />
        </svg>
      ) : null}
    </div>
  );
};
