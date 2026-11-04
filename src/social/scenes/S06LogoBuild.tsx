import { evolvePath } from "@remotion/paths";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, EASE } from "../../brand";
import { RouteLines } from "../../components/RouteLines";
import { ContainerSide, CorrugationPattern } from "../../illustrations/kit";
import {
  aPath,
  A_PATH,
  dPath,
  D_PATH,
  pPath,
  P_PATH,
} from "../../logo/monogram";
import {
  DEPOT_PATHS,
  DEPOT_SIZE,
  LOCKUPS,
  PHUOC_PATHS,
} from "../../logo/paths";
import { hitSpring, lerp, progress } from "../../lib/motion";
import { ContainerDoor, DoorRibs } from "../art/Rigs";
import {
  DustBurst,
  Flash,
  HBlur,
  punch,
  shakeAt,
  Shockwave,
  SpeedBurst,
  Vignette,
} from "../fx";
import { SlamBlock } from "../Slam";
import { useStage } from "../stage";
import { COPY, CUE, SCENE, STACKER } from "../timeline";

const L = (abs: number) => abs - SCENE.logo.from;

/** Landing frames of the container rows: P bottom to top, then A. */
export const ROW_LANDINGS = {
  P: [262, 270, 280, 289],
  A: [297, 303, 310, 316],
} as const;

const DROP = L(CUE.drop1);
const FALL = 8; // frames a row takes to fall in
const ROW_H = 75; // one container high, logo units
const P_ROW_X = [
  [0, 196],
  [198, 394],
];
const A_ROW_X = [
  [313, 510],
  [512, 710],
];
const ROW_COLORS = ["#2F55B8", "#24479E", "#3A63C4", "#284C9F"];

/** Vertical offset of a falling row (logo units). */
const rowOffset = (frame: number, land: number) => {
  if (frame < land - FALL) {
    return null;
  }
  if (frame < land) {
    const p = (frame - (land - FALL)) / FALL;
    return -1100 * (1 - p * p);
  }
  const t = frame - land;
  return -10 * Math.exp(-t / 2) * Math.abs(Math.sin(t * 1.3));
};

/** Hover height of the orange D (logo units, 0 = in place). */
const dOffset = (frame: number) => {
  if (frame < L(270)) {
    return interpolate(frame, [0, L(270)], [-1500, -150], {
      easing: Easing.out(Easing.poly(5)),
      extrapolateRight: "clamp",
    });
  }
  if (frame < L(306)) {
    return -150 + Math.sin((frame - L(270)) * 0.22) * 9;
  }
  if (frame < DROP - 6) {
    return interpolate(frame, [L(306), DROP - 6], [-150, -215], {
      easing: EASE,
    });
  }
  if (frame < DROP) {
    const p = (frame - (DROP - 6)) / 6;
    return -215 * (1 - p * p * p);
  }
  return 0;
};

/**
 * Scenes 6 to 8 (8.4 to 14.4 s), one continuous shot.
 * Blue boxes drop row by row into a P and an A on the snare build while the
 * reach stacker's spreader holds an orange box over the D. On drop 1 the D
 * slams down, the page flashes white, the boxes melt into the exact flat
 * logo, the wordmark lands, then "DIỆN MẠO MỚI".
 */
export const S06LogoBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, pick, textY, textX } = useStage();

  const after = frame >= DROP;

  /* Logo placement: big while building, smaller once the headline arrives */
  const s0 = pick(0.86, 0.8);
  const y0 = pick(960, 660);
  // Move up out of the headline's way just before it lands on bar B.
  const settle = progress(frame, L(CUE.barB) - 12, 12, EASE);
  const s1 = pick(0.62, 0.5);
  const y1 = pick(330, 140);
  const s = lerp(s0, s1, settle);
  const lockupW = LOCKUPS.vertical.width * s;
  const x = (W - lockupW) / 2;
  const y = lerp(y0, y1, settle);
  const toX = (u: number) => x + u * s;
  const toY = (v: number) => y + v * s;

  /* Construction and morph */
  const guides = progress(frame, 0, 14);
  const tex = after ? 1 - progress(frame, DROP + 2, 10) : 1;
  const morph = after ? progress(frame, DROP + 4, 12, EASE) : 0;
  const d = dOffset(frame);
  const release = progress(frame, DROP + 3, 18, Easing.in(Easing.cubic));
  const spreaderY = after ? -release * 1700 : d;

  /* Wordmark */
  const phuocX = interpolate(
    frame,
    [L(CUE.dottedB[0]) - 8, L(CUE.dottedB[0])],
    [-1300, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const phuocBlur = (1 - progress(frame, L(CUE.dottedB[0]) - 8, 10)) * 24;
  const depot = hitSpring(frame, fps, L(CUE.dottedB[1]) - 4);
  const sweep = progress(frame, L(372), 14, EASE);

  /* Camera */
  const push = after
    ? punch(frame, DROP, 0.07, 12)
    : interpolate(frame, [0, DROP], [1, 1.07], { easing: EASE });
  const rowImpacts = [...ROW_LANDINGS.P, ...ROW_LANDINGS.A].map((f) => ({
    at: L(f),
    amp: 7,
    decay: 3,
  }));
  const shake = shakeAt(
    frame,
    [
      ...rowImpacts,
      { at: DROP, amp: 36, decay: 7 },
      { at: L(CUE.barB), amp: 10, decay: 4 },
    ],
    "logo",
  );

  const bgDark = (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 55%, #1D3B78 0%, #0C2650 38%, #050F22 100%)",
      }}
    />
  );
  const bgLight = (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #FAFAF7 55%, #EEF1F5 100%)",
      }}
    />
  );

  const letterFill = (key: "P" | "A" | "D", path: string) => (
    <path key={key} d={path} fill={key === "D" ? COLORS.orange : COLORS.blue} />
  );

  return (
    <AbsoluteFill>
      {after ? bgLight : bgDark}
      {!after ? (
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0, opacity: 0.5 }}
        >
          {/* Two spotlights from above */}
          <path
            d={`M${W * 0.2} -50L${W * 0.02} ${H}H${W * 0.55}Z`}
            fill="#FFFFFF"
            opacity={0.035}
          />
          <path
            d={`M${W * 0.8} -50L${W * 0.45} ${H}H${W * 0.98}Z`}
            fill="#FFFFFF"
            opacity={0.035}
          />
        </svg>
      ) : null}
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${push})`,
        }}
      >
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <defs>
            <CorrugationPattern id="logo-corr" pitch={9} />
            <DoorRibs id="logo-ribs" pitch={26} />
            <HBlur id="logo-phuoc-blur" amount={phuocBlur} />
            <clipPath id="clip-p">
              <path d={pPath(morph)} />
              <rect x={-20} y={-3000} width={434} height={3000} />
            </clipPath>
            <clipPath id="clip-a">
              <path d={aPath(morph)} />
              <rect x={300} y={-3000} width={420} height={3000} />
            </clipPath>
            <clipPath id="clip-d">
              <path d={dPath(morph)} />
            </clipPath>
            <clipPath id="clip-logo">
              <path d={P_PATH} />
              <path d={A_PATH} />
              <path d={D_PATH} />
              {PHUOC_PATHS.map((p) => (
                <path
                  key={p.slice(0, 20)}
                  d={p}
                  transform={`translate(0 ${LOCKUPS.vertical.phuoc.y})`}
                />
              ))}
              {DEPOT_PATHS.map((p) => (
                <path
                  key={p.slice(0, 20)}
                  d={p}
                  transform={`translate(${LOCKUPS.vertical.depot.x} ${LOCKUPS.vertical.depot.y})`}
                />
              ))}
            </clipPath>
          </defs>
          <g transform={`translate(${x} ${y}) scale(${s})`}>
            {/* Construction outlines of the three primitives */}
            {!after
              ? [pPath(0), aPath(0), dPath(0)].map((p, i) => {
                  const ev = evolvePath(Math.max(0.001, guides), p);
                  return (
                    <path
                      key={i}
                      d={p}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeOpacity={0.3}
                      strokeWidth={2 / s}
                      strokeDasharray={ev.strokeDasharray}
                      strokeDashoffset={ev.strokeDashoffset}
                    />
                  );
                })
              : null}
            {/* Flat letters, revealed as the box textures melt away */}
            {after
              ? [letterFill("P", pPath(morph)), letterFill("A", aPath(morph))]
              : null}
            {/* Container rows of the P and the A */}
            {(["P", "A"] as const).map((letter) => (
              <g
                key={letter}
                clipPath={`url(#clip-${letter.toLowerCase()})`}
                opacity={tex}
              >
                {ROW_LANDINGS[letter].map((land, row) => {
                  const off = rowOffset(frame, L(land));
                  if (off === null) {
                    return null;
                  }
                  const top = 300 - ROW_H * (row + 1) + off;
                  const xs = letter === "P" ? P_ROW_X : A_ROW_X;
                  return xs.map(([a, b], k) => (
                    <g key={`${row}-${k}`}>
                      <ContainerSide
                        x={a}
                        y={top}
                        w={b - a}
                        h={ROW_H - 2}
                        color={ROW_COLORS[(row + k) % ROW_COLORS.length]}
                        patternId="logo-corr"
                      />
                      <rect
                        x={a}
                        y={top}
                        width={b - a}
                        height={3}
                        fill="#FFFFFF"
                        opacity={0.35}
                      />
                    </g>
                  ));
                })}
              </g>
            ))}
            {/* Spreader and boom, holding the D until the drop */}
            <g transform={`translate(0 ${spreaderY})`}>
              <path
                d={`M896 -70L${896 + 2600 * 0.53} ${-70 - 2600 * 0.848}L${966 + 2600 * 0.53} ${-70 - 2600 * 0.848 + 40}L966 -40Z`}
                fill={STACKER.boom}
              />
              <path
                d={`M900 -66L${900 + 2600 * 0.53} ${-66 - 2600 * 0.848}`}
                stroke={STACKER.boomHighlight}
                strokeWidth={8}
              />
              <rect
                x={886}
                y={-84}
                width={60}
                height={50}
                rx={8}
                fill={STACKER.chassis}
              />
              <rect
                x={700}
                y={-36}
                width={432}
                height={28}
                rx={5}
                fill={STACKER.chassis}
              />
              <rect
                x={692}
                y={-40}
                width={34}
                height={36}
                rx={5}
                fill="#F2B21B"
              />
              <rect
                x={1106}
                y={-40}
                width={34}
                height={36}
                rx={5}
                fill="#F2B21B"
              />
            </g>
            {/* The D: an orange box end, then the letter */}
            <g transform={`translate(0 ${d})`}>
              {after ? letterFill("D", dPath(morph)) : null}
              <g clipPath="url(#clip-d)" opacity={tex}>
                <g transform="translate(719.2 0)">
                  <ContainerDoor
                    w={196.7}
                    h={300}
                    side="left"
                    color={COLORS.orange}
                    ribId="logo-ribs"
                  />
                  <g transform="translate(196.6 0)">
                    <ContainerDoor
                      w={196.7}
                      h={300}
                      side="right"
                      color={COLORS.orange}
                      ribId="logo-ribs"
                    />
                  </g>
                </g>
              </g>
            </g>
            {/* Wordmark */}
            <g
              transform={`translate(${LOCKUPS.vertical.phuoc.x + phuocX} ${LOCKUPS.vertical.phuoc.y})`}
              filter="url(#logo-phuoc-blur)"
            >
              {frame >= L(CUE.dottedB[0]) - 8
                ? PHUOC_PATHS.map((p) => (
                    <path key={p.slice(0, 20)} d={p} fill={COLORS.blue} />
                  ))
                : null}
            </g>
            <g
              transform={`translate(${LOCKUPS.vertical.depot.x + DEPOT_SIZE.width / 2} ${LOCKUPS.vertical.depot.y + DEPOT_SIZE.height / 2}) scale(${depot}) translate(${-DEPOT_SIZE.width / 2} ${-DEPOT_SIZE.height / 2})`}
            >
              {DEPOT_PATHS.map((p) => (
                <path key={p.slice(0, 20)} d={p} fill={COLORS.orange} />
              ))}
            </g>
            {/* Light sweep across the finished logo */}
            {sweep > 0 && sweep < 1 ? (
              <g clipPath="url(#clip-logo)">
                <rect
                  x={-500 + sweep * 2100}
                  y={-100}
                  width={180}
                  height={900}
                  fill="#FFFFFF"
                  opacity={0.55}
                  transform={`skewX(-20)`}
                />
              </g>
            ) : null}
          </g>
        </svg>
        {/* Impact effects in screen space */}
        <DustBurst
          at={DROP}
          x={toX(556)}
          y={toY(300)}
          spread={1112 * s}
          count={70}
          seed="logo-dust"
          color="#9AA6BA"
          scale={1.3}
        />
        <Shockwave
          at={DROP}
          cx={toX(916)}
          cy={toY(150)}
          r1={pick(1100, 900)}
          width={14}
          color={COLORS.orange}
        />
        <Shockwave
          at={DROP + 2}
          cx={toX(556)}
          cy={toY(300)}
          r1={pick(900, 760)}
          squash={0.18}
          width={10}
          color={COLORS.blue}
        />
        <SpeedBurst
          at={DROP}
          cx={toX(556)}
          cy={toY(150)}
          color={COLORS.blue}
          inner={pick(560, 520)}
        />
        {[...ROW_LANDINGS.P, ...ROW_LANDINGS.A].map((land, i) => {
          const letter = i < 4 ? "P" : "A";
          const row = i % 4;
          const cx = letter === "P" ? toX(197) : toX(511);
          return (
            <DustBurst
              key={land}
              at={L(land)}
              x={cx}
              y={toY(300 - ROW_H * row)}
              spread={330 * s}
              count={16}
              seed={`row-${land}`}
              color="#5E6D8C"
              scale={0.55}
            />
          );
        })}
      </AbsoluteFill>
      {!after ? <Vignette strength={0.5} /> : null}
      {/* "ĐỀU ĐƯỢC / NÂNG TẦM." rises with the hoist */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${-interpolate(frame, [L(288), DROP], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        <SlamBlock
          lead={{ text: COPY.lift.lead, at: L(216) }}
          lines={[[{ text: COPY.lift.main, at: L(288) }]]}
          cx={textX}
          y={textY}
          size={pick(128, 120)}
          exitAt={DROP - 1}
          underline
        />
      </div>
      {/* "DIỆN MẠO MỚI" */}
      <SlamBlock
        lines={[
          [{ text: COPY.newLook[0], at: L(CUE.barB), color: COLORS.blue }],
          [
            {
              text: COPY.newLook[1],
              at: L(CUE.barB) + 6,
              color: COLORS.orange,
            },
          ],
        ]}
        cx={textX}
        y={pick(820, 560)}
        size={pick(150, 122)}
        underline
        glow={false}
      />
      {frame >= L(CUE.barB) ? (
        <RouteLines
          y={pick(1420, 1180)}
          kinkX={W * 0.3}
          rise={pick(110, 80)}
          start={L(CUE.barB)}
          duration={14}
          stagger={3}
        />
      ) : null}
      <Flash at={DROP} peak={1} decay={6} />
    </AbsoluteFill>
  );
};
