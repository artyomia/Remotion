import { evolvePath } from "@remotion/paths";
import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, EASE_OUT, FONTS, FONT_WEIGHTS, NEUTRALS } from "../brand";
import { Headline } from "../components/Headline";
import { ModuleBlock } from "../components/ModuleBlock";
import { RouteLines } from "../components/RouteLines";
import { PageBackground, SceneChrome } from "../components/SceneChrome";
import { ContainerSide, CorrugationPattern } from "../illustrations/kit";
import { BrandPattern } from "../illustrations/Pattern";
import { logoWidthForHeight } from "../logo/Logo";
import { paraPath } from "../lib/geometry";
import { useLayout } from "../lib/layout";
import { progress, uiSpring } from "../lib/motion";
import { skewedWipeClip, skewedWipeEdge } from "../transitions/skewedWipe";

const PATTERN_START = 70;

const ELEMENTS = [
  "Đường dẫn",
  "Khối module",
  "Panel",
  "Line kỹ thuật",
] as const;

type CellProps = { w: number; h: number; start: number };

/** Element 1: route lines drawing. */
const RouteDemo: React.FC<CellProps> = ({ w, h, start }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <RouteLines
      y={h * 0.68}
      kinkX={w * 0.32}
      rise={h * 0.3}
      x0={-20}
      x1={w + 20}
      start={start}
      duration={26}
      stagger={5}
      cornerRadius={24}
      parallels={[
        { gap: -14, color: NEUTRALS.line, width: 1.5 },
        { gap: 14, dashed: true, color: NEUTRALS.line, width: 1.5 },
      ]}
      viewport={{ width: w, height: h }}
    />
  </div>
);

/** Element 2: module blocks popping in. */
const ModuleDemo: React.FC<CellProps> = ({ w, h, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fills = ["blue", "orange", "grey", "outline"] as const;
  const bw = w * 0.16;
  const bh = h * 0.46;
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      {fills.map((fill, i) => {
        const s = uiSpring(frame, fps, start + i * 4, 14);
        const x = w * 0.08 + i * (bw + w * 0.05);
        const y = h * 0.27;
        const cx = x + bw / 2 + bh * 0.18;
        const cy = y + bh / 2;
        return (
          <g
            key={fill}
            transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}
            opacity={s}
          >
            <ModuleBlock x={x} y={y} w={bw} h={bh} fill={fill} radius={8} />
          </g>
        );
      })}
    </svg>
  );
};

/** Element 3: glass panels sliding over a container texture. */
const PanelDemo: React.FC<CellProps> = ({ w, h, start }) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <CorrugationPattern id={`${id}-c`} pitch={8} />
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={COLORS.white} stopOpacity={0.85} />
          <stop offset="1" stopColor="#C8D6EA" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <ContainerSide
        x={-10}
        y={h * 0.5}
        w={w * 0.62}
        h={h * 0.22}
        color={COLORS.navy}
        patternId={`${id}-c`}
      />
      <ContainerSide
        x={w * 0.55}
        y={h * 0.5}
        w={w * 0.6}
        h={h * 0.22}
        color={COLORS.orange}
        patternId={`${id}-c`}
      />
      <ContainerSide
        x={w * 0.1}
        y={h * 0.73}
        w={w}
        h={h * 0.22}
        color={COLORS.blue}
        patternId={`${id}-c`}
      />
      {[0, 1, 2].map((i) => {
        const p = progress(frame, start + i * 5, 22, EASE_OUT);
        const x =
          w * (0.18 + i * 0.22) +
          (1 - p) * w * 0.8 -
          (frame - start) * (0.2 + i * 0.15);
        const d = paraPath(
          { x, y: h * (0.12 + i * 0.05), w: w * 0.24, h: h * 0.78 },
          10,
        );
        return (
          <g key={i} opacity={p * (0.6 - i * 0.12)}>
            <path d={d} fill={`url(#${id}-g)`} />
            <path d={d} fill="none" stroke={COLORS.white} strokeWidth={1.5} />
          </g>
        );
      })}
    </svg>
  );
};

/** Element 4: technical lines (dimension, guides, crosshair, 60 degree angle). */
const TechDemo: React.FC<CellProps> = ({ w, h, start }) => {
  const frame = useCurrentFrame();
  const p = (offset: number, dur = 18) => progress(frame, start + offset, dur);
  const draw = (d: string, t: number) =>
    t > 0 ? evolvePath(t, d) : { strokeDasharray: "0 1", strokeDashoffset: 0 };
  const dim = `M${w * 0.14} ${h * 0.26}H${w * 0.86}M${w * 0.14} ${h * 0.2}V${h * 0.32}M${w * 0.86} ${h * 0.2}V${h * 0.32}`;
  const ax = w * 0.58;
  const ay = h * 0.78;
  const r = h * 0.3;
  const angle = `M${ax} ${ay}H${ax + r * 1.2}M${ax} ${ay}L${ax + r * 0.6} ${ay - r * 1.04}`;
  const arc = `M${ax + r * 0.55} ${ay}A${r * 0.55} ${r * 0.55} 0 0 0 ${ax + r * 0.275} ${ay - r * 0.476}`;
  const cx = w * 0.26;
  const cy = h * 0.66;
  const cr = h * 0.13;
  const cross = `M${cx - cr * 1.6} ${cy}H${cx + cr * 1.6}M${cx} ${cy - cr * 1.6}V${cy + cr * 1.6}`;
  const circle = `M${cx - cr} ${cy}a${cr} ${cr} 0 1 0 ${cr * 2} 0a${cr} ${cr} 0 1 0 ${-cr * 2} 0`;
  const stroke = {
    fill: "none",
    stroke: COLORS.blue,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
  };
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <line
        x1={0}
        x2={w}
        y1={h * 0.44}
        y2={h * 0.44}
        stroke={NEUTRALS.line}
        strokeDasharray="5 6"
        opacity={p(0, 10)}
      />
      <path d={dim} {...stroke} {...draw(dim, p(2))} />
      <text
        x={w / 2}
        y={h * 0.26 - 10}
        textAnchor="middle"
        fontFamily={FONTS.body}
        fontWeight={FONT_WEIGHTS.body.medium}
        fontSize={14}
        fill={NEUTRALS.label}
        opacity={p(10, 8)}
      >
        x
      </text>
      <path
        d={cross}
        {...stroke}
        stroke={NEUTRALS.line}
        {...draw(cross, p(6))}
      />
      <path d={circle} {...stroke} {...draw(circle, p(8))} />
      <path d={angle} {...stroke} {...draw(angle, p(10))} />
      <path
        d={arc}
        {...stroke}
        stroke={COLORS.orange}
        strokeWidth={2}
        {...draw(arc, p(16, 10))}
      />
      <text
        x={ax + r * 0.62}
        y={ay - r * 0.2}
        fontFamily={FONTS.body}
        fontWeight={FONT_WEIGHTS.body.medium}
        fontSize={14}
        fill={COLORS.orange}
        opacity={p(20, 8)}
      >
        60°
      </text>
    </svg>
  );
};

const DEMOS = [RouteDemo, ModuleDemo, PanelDemo, TechDemo];

/**
 * Scene 6, "Graphic System and Pattern" (frames 735 to 885).
 * An ivory wipe over navy, the four graphic elements demonstrated in a grid,
 * then the procedural brand pattern tiles across the frame in a diagonal wave.
 */
export const Scene6GraphicSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = useLayout();
  const {
    width,
    height,
    margin,
    headerTop,
    headerLogoHeight,
    contentWidth,
    pick,
  } = layout;

  const wipe = progress(frame, 0, 14);
  const edge = skewedWipeEdge(wipe, width, height);
  const elementsOut = progress(frame, PATTERN_START - 8, 12);

  const cellW = pick((contentWidth - 3 * 40) / 4, (contentWidth - 40) / 2);
  const cellH = pick(290, 400);
  const cellPos = (i: number) =>
    pick(
      { x: margin + i * (cellW + 40), y: 586 },
      {
        x: margin + (i % 2) * (cellW + 40),
        y: 690 + Math.floor(i / 2) * (cellH + 120),
      },
    );

  // Pattern area excludes the header logo so it stays legible.
  const logoBox = {
    x0: margin - 30,
    y0: headerTop - 30,
    x1: margin + logoWidthForHeight(headerLogoHeight, "horizontal") + 30,
    y1: headerTop + headerLogoHeight + 30,
  };
  const cell = 120;
  const panel = pick(
    { x: -240, y: 560, w: 1040, h: 620, textX: margin, textY: 612, size: 96 },
    { x: -300, y: 1150, w: 1150, h: 900, textX: margin, textY: 1214, size: 92 },
  );
  const panelIn = progress(frame, PATTERN_START + 16, 22, EASE_OUT);

  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      <AbsoluteFill style={{ clipPath: skewedWipeClip(wipe, width, height) }}>
        <PageBackground />

        {/* Part 1: the four graphic elements */}
        <Headline
          lines={[
            { text: "HỆ GRAPHIC", color: COLORS.blue },
            { text: "ELEMENTS", color: COLORS.orange },
          ]}
          x={margin}
          y={pick(200, 250)}
          fontSize={pick(120, 104)}
          start={10}
          exitStart={PATTERN_START - 10}
        />
        {DEMOS.map((Demo, i) => {
          const pos = cellPos(i);
          const s = progress(frame, 14 + i * 5, 18, EASE_OUT);
          return (
            <div
              key={ELEMENTS[i]}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: cellW,
                opacity: s * (1 - elementsOut),
                transform: `translateY(${(1 - s) * 24 - elementsOut * 20}px)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: cellW,
                  height: cellH,
                  borderRadius: 16,
                  background: COLORS.white,
                  border: `1px solid ${NEUTRALS.grid}`,
                  overflow: "hidden",
                }}
              >
                <Demo w={cellW} h={cellH} start={20 + i * 5} />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  marginTop: 18,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: FONT_WEIGHTS.body.semibold,
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    color: COLORS.orange,
                  }}
                >
                  0{i + 1}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.sub,
                    fontWeight: 600,
                    fontSize: 22,
                    color: COLORS.blue,
                  }}
                >
                  {ELEMENTS[i]}
                </span>
              </div>
            </div>
          );
        })}

        {/* Part 2: the brand pattern */}
        <div style={{ position: "absolute", inset: 0 }}>
          <BrandPattern
            width={width}
            height={height}
            cell={cell}
            frame={frame}
            fps={fps}
            start={PATTERN_START}
            exclude={(cx, cy) =>
              cx > logoBox.x0 &&
              cx < logoBox.x1 &&
              cy > logoBox.y0 &&
              cy < logoBox.y1
            }
          />
        </div>
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d={paraPath(
              {
                x: panel.x - (1 - panelIn) * 1200,
                y: panel.y,
                w: panel.w,
                h: panel.h,
              },
              18,
            )}
            fill={COLORS.ivory}
          />
        </svg>
        {panelIn > 0 ? (
          <Headline
            lines={[
              { text: "BRAND", color: COLORS.blue },
              { text: "PATTERN", color: COLORS.orange },
            ]}
            x={panel.textX}
            y={panel.textY}
            fontSize={panel.size}
            start={PATTERN_START + 24}
          >
            <div
              style={{
                marginTop: 24,
                maxWidth: pick(660, 900),
                fontFamily: FONTS.body,
                fontWeight: FONT_WEIGHTS.body.medium,
                fontSize: pick(22, 26),
                lineHeight: 1.5,
                color: NEUTRALS.ink,
                opacity: progress(frame, PATTERN_START + 36, 14),
              }}
            >
              Họa tiết phát triển từ hình học của PAD, thể hiện sự kết nối,
              chuyển động và vững chắc.
            </div>
          </Headline>
        ) : null}

        <SceneChrome index="06" title="GRAPHIC SYSTEM" fadeIn={8} />
      </AbsoluteFill>
      {wipe > 0 && wipe < 1 ? (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0 }}
        >
          <line {...edge} stroke={COLORS.orange} strokeWidth={4} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
