/**
 * Blue-hour yard backdrop pieces, drawn as flat layers with soft light:
 * sky, skyline of stacks and cranes, ground and lamp posts.
 */
import React from "react";
import { random } from "remotion";
import { COLORS } from "../../brand";
import { useSvgId } from "../../illustrations/kit";
import { DUSK } from "../timeline";

/** Sky gradient with an orange afterglow on the horizon. Fills the SVG. */
export const DuskSky: React.FC<{
  W: number;
  H: number;
  horizonY: number;
  glow?: number;
  stars?: boolean;
}> = ({ W, H, horizonY, glow = 1, stars = true }) => {
  const id = useSvgId();
  return (
    <g>
      <defs>
        <linearGradient
          id={`${id}-sky`}
          x1="0"
          y1="0"
          x2="0"
          y2={horizonY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={DUSK.skyTop} />
          <stop offset="0.6" stopColor={DUSK.skyMid} />
          <stop offset="1" stopColor={DUSK.skyLow} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="1" r="0.75">
          <stop offset="0" stopColor={DUSK.glow} stopOpacity={0.55 * glow} />
          <stop offset="0.45" stopColor={DUSK.glow} stopOpacity={0.14 * glow} />
          <stop offset="1" stopColor={DUSK.glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect
        x={-W}
        y={-H}
        width={W * 3}
        height={H * 3}
        fill={`url(#${id}-sky)`}
      />
      <rect
        x={-W * 0.2}
        y={horizonY - H * 0.32}
        width={W * 1.4}
        height={H * 0.4}
        fill={`url(#${id}-glow)`}
      />
      {stars
        ? Array.from({ length: 40 }, (_, i) => (
            <circle
              key={i}
              cx={random(`star-x-${i}`) * W}
              cy={random(`star-y-${i}`) * horizonY * 0.55}
              r={0.8 + random(`star-r-${i}`) * 1.4}
              fill={COLORS.white}
              opacity={0.15 + random(`star-o-${i}`) * 0.35}
            />
          ))
        : null}
    </g>
  );
};

/** Ship-to-shore crane silhouette (feet on groundY). */
export const CraneSilhouette: React.FC<{
  x: number;
  groundY: number;
  scale: number;
  color?: string;
  lights?: boolean;
}> = ({ x, groundY, scale, color = DUSK.silhouetteFar, lights = true }) => (
  <g transform={`translate(${x} ${groundY}) scale(${scale})`}>
    <g fill="none" stroke={color} strokeWidth={12} strokeLinejoin="round">
      <path d="M0 0V-420M130 0V-420M-12 -420H142M0 -300L130 -420M0 -420L130 -300" />
      <path d="M-300 -470H420M-300 -470L65 -575L420 -470M65 -575V-420" />
    </g>
    <rect x={-300} y={-478} width={720} height={16} fill={color} />
    {lights ? (
      <g>
        <circle cx={65} cy={-582} r={7} fill="#FF4D3A" />
        <circle cx={-296} cy={-470} r={5} fill="#FF4D3A" />
        <circle cx={416} cy={-470} r={5} fill="#FF4D3A" />
      </g>
    ) : null}
  </g>
);

/** Row of stack silhouettes along the horizon, uneven heights. */
export const StackSkyline: React.FC<{
  x0: number;
  x1: number;
  groundY: number;
  unit: number;
  seed: string;
  color?: string;
  maxTiers?: number;
}> = ({
  x0,
  x1,
  groundY,
  unit,
  seed,
  color = DUSK.silhouette,
  maxTiers = 5,
}) => {
  const parts: string[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const w = unit * (random(`${seed}-w-${i}`) > 0.5 ? 4.6 : 2.3);
    const tiers = 1 + Math.floor(random(`${seed}-t-${i}`) * maxTiers);
    parts.push(
      `M${x} ${groundY}V${groundY - tiers * unit}H${x + w - unit * 0.08}V${groundY}Z`,
    );
    x += w;
    i++;
  }
  return <path d={parts.join("")} fill={color} />;
};

/** Yard lamp post with a switchable lamp and light cone. */
export const LampPost: React.FC<{
  x: number;
  groundY: number;
  height: number;
  /** 0 = off, 1 = fully on. */
  on: number;
  coneWidth?: number;
}> = ({ x, groundY, height, on, coneWidth = 420 }) => {
  const id = useSvgId();
  const top = groundY - height;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DUSK.lamp} stopOpacity={0.55} />
          <stop offset="1" stopColor={DUSK.lamp} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor={DUSK.lamp} stopOpacity={0.9} />
          <stop offset="0.35" stopColor={DUSK.lamp} stopOpacity={0.35} />
          <stop offset="1" stopColor={DUSK.lamp} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path
        d={`M${x - 16} ${top + 30}L${x - coneWidth / 2} ${groundY}H${x + coneWidth / 2}L${x + 16} ${top + 30}Z`}
        fill={`url(#${id}-cone)`}
        opacity={on * 0.8}
      />
      <ellipse
        cx={x}
        cy={groundY}
        rx={coneWidth * 0.45}
        ry={coneWidth * 0.06}
        fill={DUSK.lamp}
        opacity={on * 0.22}
      />
      <rect
        x={x - 5}
        y={top}
        width={10}
        height={height}
        fill={DUSK.silhouette}
      />
      <rect
        x={x - 34}
        y={top - 6}
        width={68}
        height={18}
        rx={6}
        fill={DUSK.silhouette}
      />
      <rect
        x={x - 28}
        y={top + 8}
        width={56}
        height={8}
        rx={3}
        fill={on > 0.05 ? DUSK.lamp : "#3A4A6A"}
        opacity={0.4 + on * 0.6}
      />
      <circle
        cx={x}
        cy={top + 14}
        r={150}
        fill={`url(#${id}-halo)`}
        opacity={on}
      />
    </g>
  );
};
