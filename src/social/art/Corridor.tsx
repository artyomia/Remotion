/**
 * Fly-through of a container lane at blue hour. Flat-shaded 2D, but every
 * container face is projected with a simple pinhole camera so the walls of
 * stacks rush past with real perspective.
 */
import React, { useMemo } from "react";
import { random } from "remotion";
import { COLORS } from "../../brand";
import { DUSK, YARD_CONTAINERS } from "../timeline";

const C_LEN = 12.2; // 40ft container, metres
const C_H = 2.6;
const ROW_DEPTH = 7.3; // three containers deep
const GAP = 9; // cross lane

type Slot = { z0: number; z1: number; tiers: string[]; blockStart: boolean };

/** Lay out one wall of stacks along the lane. */
const buildWall = (seed: string, length: number): Slot[] => {
  const slots: Slot[] = [];
  let z = 4;
  let b = 0;
  while (z < length) {
    const count = 2 + Math.floor(random(`${seed}-n-${b}`) * 3);
    for (let i = 0; i < count; i++) {
      const tiers = 1 + Math.floor(random(`${seed}-t-${b}-${i}`) * 4);
      slots.push({
        z0: z,
        z1: z + C_LEN - 0.15,
        tiers: Array.from(
          { length: tiers },
          (_, k) =>
            YARD_CONTAINERS[
              Math.floor(
                random(`${seed}-c-${b}-${i}-${k}`) * YARD_CONTAINERS.length,
              )
            ],
        ),
        blockStart: i === 0,
      });
      z += C_LEN;
    }
    z += GAP;
    b++;
  }
  return slots;
};

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Blend a colour towards the haze by `t` (0 to 1) and darken by `shade`. */
const mix = (hex: string, haze: string, t: number, shade = 1) => {
  const a = hexToRgb(hex);
  const b = hexToRgb(haze);
  const c = a.map((v, i) => Math.round(v * shade * (1 - t) + b[i] * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

export type CorridorProps = {
  W: number;
  H: number;
  /** Distance travelled along the lane, metres. */
  camZ: number;
  /** Small sideways sway of the camera, metres. */
  camX?: number;
  horizonY: number;
  focal?: number;
  camHeight?: number;
  laneHalf?: number;
};

export const Corridor: React.FC<CorridorProps> = ({
  W,
  H,
  camZ,
  camX = 0,
  horizonY,
  focal = 720,
  camHeight = 2.1,
  laneHalf = 5.6,
}) => {
  const walls = useMemo(
    () => ({ left: buildWall("lane-l", 420), right: buildWall("lane-r", 420) }),
    [],
  );
  const vx = W / 2;
  const near = 0.9;
  const far = 230;
  const X = (x: number, z: number) => vx + (focal * (x - camX)) / z;
  const Y = (y: number, z: number) => horizonY + (focal * (camHeight - y)) / z;
  const haze = DUSK.haze;
  const fog = (z: number) => Math.min(0.88, Math.max(0, (z - 14) / 170));

  const faces: React.ReactNode[] = [];
  (["left", "right"] as const).forEach((side) => {
    const s = side === "left" ? -1 : 1;
    const xw = s * laneHalf;
    const slots = walls[side]
      .map((slot) => ({ ...slot, r0: slot.z0 - camZ, r1: slot.z1 - camZ }))
      .filter((slot) => slot.r1 > near && slot.r0 < far)
      .sort((a, b) => b.r0 - a.r0);
    slots.forEach((slot, si) => {
      const z0 = Math.max(near, slot.r0);
      const z1 = slot.r1;
      slot.tiers.forEach((color, k) => {
        const y0 = k * C_H;
        const y1 = y0 + C_H - 0.06;
        const f = fog((z0 + z1) / 2);
        const fill = mix(color, haze, f, 0.92);
        const key = `${side}-${si}-${k}`;
        // End face towards the camera at the start of a block.
        if (slot.blockStart && slot.r0 > near) {
          const xa = X(xw, slot.r0);
          const xb = X(s * (laneHalf + ROW_DEPTH), slot.r0);
          faces.push(
            <path
              key={`${key}-end`}
              d={`M${xa} ${Y(y0, slot.r0)}L${xa} ${Y(y1, slot.r0)}L${xb} ${Y(y1, slot.r0)}L${xb} ${Y(y0, slot.r0)}Z`}
              fill={mix(color, haze, fog(slot.r0), 0.62)}
            />,
          );
        }
        faces.push(
          <path
            key={key}
            d={`M${X(xw, z0)} ${Y(y0, z0)}L${X(xw, z0)} ${Y(y1, z0)}L${X(xw, z1)} ${Y(y1, z1)}L${X(xw, z1)} ${Y(y0, z1)}Z`}
            fill={fill}
          />,
        );
        // Top and bottom rails.
        faces.push(
          <path
            key={`${key}-rail`}
            d={`M${X(xw, z0)} ${Y(y1, z0)}L${X(xw, z1)} ${Y(y1, z1)}L${X(xw, z1)} ${Y(y1 - 0.18, z1)}L${X(xw, z0)} ${Y(y1 - 0.18, z0)}Z`}
            fill="#000"
            opacity={0.22 * (1 - f)}
          />,
        );
        // Corrugation ribs on the nearer containers.
        const pxWidth = Math.abs(X(xw, z0) - X(xw, z1));
        if (pxWidth > 90) {
          const step = 0.55;
          const ribs: string[] = [];
          for (let z = Math.ceil(slot.r0 / step) * step; z < z1; z += step) {
            if (z <= near) {
              continue;
            }
            ribs.push(
              `M${X(xw, z)} ${Y(y0 + 0.2, z)}L${X(xw, z)} ${Y(y1 - 0.2, z)}`,
            );
          }
          faces.push(
            <path
              key={`${key}-ribs`}
              d={ribs.join("")}
              stroke="#000"
              strokeOpacity={0.18 * (1 - f)}
              strokeWidth={Math.max(
                1,
                Math.min(6, (focal * 0.05) / Math.max(z0, 1)),
              )}
              fill="none"
            />,
          );
        }
      });
    });
  });

  // Lane markings: dashed edges and the orange route line down the middle.
  const dashes: string[] = [];
  const dashLen = 2.2;
  const dashGap = 4.2;
  const period = dashLen + dashGap;
  for (const lx of [-(laneHalf - 1.1), laneHalf - 1.1]) {
    for (let z = period - (camZ % period); z < far; z += period) {
      const za = Math.max(near, z);
      const zb = z + dashLen;
      if (zb <= near) {
        continue;
      }
      const w = 0.12;
      dashes.push(
        `M${X(lx - w, za)} ${Y(0, za)}L${X(lx - w, zb)} ${Y(0, zb)}L${X(lx + w, zb)} ${Y(0, zb)}L${X(lx + w, za)} ${Y(0, za)}Z`,
      );
    }
  }
  const rw = 0.16;
  const route = `M${X(-rw, near)} ${Y(0, near)}L${X(-rw, far)} ${Y(0, far)}L${X(rw, far)} ${Y(0, far)}L${X(rw, near)} ${Y(0, near)}Z`;

  // Lamps over the cross lanes.
  const lamps: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const z = 30 + i * 34 - camZ;
    if (z < 2 || z > far) {
      continue;
    }
    const side = i % 2 === 0 ? -1 : 1;
    const lx = side * (laneHalf + 0.6);
    const top = 14;
    const f = fog(z);
    lamps.push(
      <g key={`lamp-${i}`} opacity={1 - f * 0.6}>
        <line
          x1={X(lx, z)}
          y1={Y(0, z)}
          x2={X(lx, z)}
          y2={Y(top, z)}
          stroke={DUSK.silhouette}
          strokeWidth={Math.max(1.5, (focal * 0.25) / z)}
        />
        <circle
          cx={X(lx, z)}
          cy={Y(top, z)}
          r={Math.max(3, (focal * 0.5) / z)}
          fill={DUSK.lamp}
        />
        <circle
          cx={X(lx, z)}
          cy={Y(top, z)}
          r={Math.max(10, (focal * 3.2) / z)}
          fill={DUSK.lamp}
          opacity={0.18}
        />
      </g>,
    );
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient
          id="corr-ground"
          x1="0"
          y1={horizonY}
          x2="0"
          y2={H}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={DUSK.haze} />
          <stop offset="0.25" stopColor={DUSK.lane} />
          <stop offset="1" stopColor={DUSK.groundNear} />
        </linearGradient>
        <linearGradient
          id="corr-route"
          x1="0"
          y1={horizonY}
          x2="0"
          y2={H}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={COLORS.orange} stopOpacity={0.25} />
          <stop offset="1" stopColor={COLORS.orange} stopOpacity={1} />
        </linearGradient>
      </defs>
      <rect
        x={0}
        y={horizonY}
        width={W}
        height={H - horizonY}
        fill="url(#corr-ground)"
      />
      <path d={dashes.join("")} fill={COLORS.white} opacity={0.5} />
      <path d={route} fill="url(#corr-route)" />
      <path
        d={route}
        fill={COLORS.orange}
        opacity={0.25}
        transform={`translate(0 0)`}
        style={{ filter: "blur(10px)" }}
      />
      {faces}
      {lamps}
    </svg>
  );
};
