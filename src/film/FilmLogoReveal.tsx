import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, EASE, EASE_OUT } from "../brand";
import { RouteLines } from "../components/RouteLines";
import { A_PATH, D_PATH, dPath, P_PATH } from "../logo/monogram";
import { DEPOT_PATHS, DEPOT_SIZE, LOCKUPS, PHUOC_PATHS } from "../logo/paths";
import { hitSpring, lerp, progress } from "../lib/motion";
import { DustBurst, Flash, HBlur, shakeAt, Shockwave } from "../social/fx";
import { SlamBlock } from "../social/Slam";
import { useStage } from "../social/stage";
import { COPY, CUE } from "../social/timeline";

const FROM = CUE.drop1;
const L = (abs: number) => abs - FROM;
/** Centre of the D in logo units. */
const D_CX = (719.2 + 1112.5) / 2;
const D_CY = 150;

/**
 * Drop 1 (10.8 to 14.4 s). Match cut from the orange box filling the frame
 * to the orange D filling the frame; the camera pulls back fast to reveal
 * the whole PAD monogram, the box carving into the D on the way. Then the
 * wordmark lands and "DIỆN MẠO MỚI" slams in under the logo.
 */
export const FilmLogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, pick, textX } = useStage();

  /* Final placement of the vertical lockup, then its smaller resting place */
  const s0 = pick(0.86, 0.8);
  const lockH0 = LOCKUPS.vertical.height * s0;
  const x0 = (W - LOCKUPS.vertical.width * s0) / 2;
  const y0 = (H - lockH0) / 2 - pick(40, 20);
  const settle = progress(frame, L(CUE.barB) - 12, 12, EASE);
  const s1 = pick(0.62, 0.5);
  const x1 = (W - LOCKUPS.vertical.width * s1) / 2;
  const y1 = pick(330, 140);

  /* Pull-back from inside the D */
  const pull = progress(frame, 0, 16, EASE_OUT);
  const sStart = (H / 300) * 1.2;
  const sPull = sStart * Math.pow(s0 / sStart, pull);
  const ax = lerp(W / 2, x0 + D_CX * s0, pull);
  const ay = lerp(H / 2, y0 + D_CY * s0, pull);
  const pulledX = ax - D_CX * sPull;
  const pulledY = ay - D_CY * sPull;

  const s = settle > 0 ? lerp(s0, s1, settle) : sPull;
  const x = settle > 0 ? lerp(x0, x1, settle) : pulledX;
  const y = settle > 0 ? lerp(y0, y1, settle) : pulledY;
  const carve = progress(frame, 3, 11, EASE);

  /* Wordmark */
  const phuocAt = L(CUE.dottedB[0]);
  const phuocX = interpolate(frame, [phuocAt - 8, phuocAt], [-1300, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phuocBlur = (1 - progress(frame, phuocAt - 8, 10)) * 24;
  const depot = hitSpring(frame, fps, L(CUE.dottedB[1]) - 4);
  const sweep = progress(frame, L(372), 14, EASE);

  const shake = shakeAt(
    frame,
    [
      { at: 0, amp: 30, decay: 7 },
      { at: L(CUE.barB), amp: 10, decay: 4 },
    ],
    "film-reveal",
  );
  const baseY = y0 + 300 * s0;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #FAFAF7 55%, #EEF1F5 100%)",
      }}
    >
      <AbsoluteFill
        style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}
      >
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <defs>
            <HBlur id="film-phuoc-blur" amount={phuocBlur} />
            <clipPath id="film-logo-clip">
              {[P_PATH, A_PATH, D_PATH].map((d) => (
                <path key={d.slice(0, 16)} d={d} />
              ))}
              {PHUOC_PATHS.map((d) => (
                <path
                  key={d.slice(0, 16)}
                  d={d}
                  transform={`translate(0 ${LOCKUPS.vertical.phuoc.y})`}
                />
              ))}
              {DEPOT_PATHS.map((d) => (
                <path
                  key={d.slice(0, 16)}
                  d={d}
                  transform={`translate(${LOCKUPS.vertical.depot.x} ${LOCKUPS.vertical.depot.y})`}
                />
              ))}
            </clipPath>
          </defs>
          <g transform={`translate(${x} ${y}) scale(${s})`}>
            <path d={P_PATH} fill={COLORS.blue} />
            <path d={A_PATH} fill={COLORS.blue} />
            <path d={dPath(carve)} fill={COLORS.orange} />
            <g
              transform={`translate(${LOCKUPS.vertical.phuoc.x + phuocX} ${LOCKUPS.vertical.phuoc.y})`}
              filter="url(#film-phuoc-blur)"
            >
              {frame >= phuocAt - 8
                ? PHUOC_PATHS.map((d) => (
                    <path key={d.slice(0, 20)} d={d} fill={COLORS.blue} />
                  ))
                : null}
            </g>
            <g
              transform={`translate(${LOCKUPS.vertical.depot.x + DEPOT_SIZE.width / 2} ${LOCKUPS.vertical.depot.y + DEPOT_SIZE.height / 2}) scale(${depot}) translate(${-DEPOT_SIZE.width / 2} ${-DEPOT_SIZE.height / 2})`}
            >
              {DEPOT_PATHS.map((d) => (
                <path key={d.slice(0, 20)} d={d} fill={COLORS.orange} />
              ))}
            </g>
            {sweep > 0 && sweep < 1 ? (
              <g clipPath="url(#film-logo-clip)">
                <rect
                  x={-500 + sweep * 2100}
                  y={-100}
                  width={180}
                  height={900}
                  fill="#FFFFFF"
                  opacity={0.55}
                  transform="skewX(-20)"
                />
              </g>
            ) : null}
          </g>
        </svg>
        <Shockwave
          at={14}
          cx={W / 2}
          cy={y0 + 150 * s0}
          r0={300}
          r1={pick(1200, 950)}
          width={10}
          color={COLORS.orange}
        />
        <DustBurst
          at={12}
          x={W / 2}
          y={baseY}
          spread={1000 * s0}
          count={60}
          seed="film-dust"
          color="#C8B9A2"
          scale={1.2}
        />
      </AbsoluteFill>
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
      <Flash at={0} peak={1} decay={5} />
    </AbsoluteFill>
  );
};
