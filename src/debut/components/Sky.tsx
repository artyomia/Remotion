import React from "react";
import { AbsoluteFill, random } from "remotion";
import { WORLD_COLORS } from "../config";
import { CameraShot } from "../three/CameraRig";

const rad = (d: number) => (d * Math.PI) / 180;

/** Screen y of the horizon for a shot (pixels from the top). */
export const horizonY = (shot: CameraShot, height: number) =>
  height / 2 -
  (Math.tan(rad(shot.elevation)) / Math.tan(rad(shot.fov) / 2)) * (height / 2);

/**
 * Painted sky behind the transparent 3D canvas: a gradient that brightens
 * towards the horizon and soft cumulus clouds that pan with the camera.
 */
export const Sky: React.FC<{
  shot: CameraShot;
  width: number;
  height: number;
}> = ({ shot, width, height }) => {
  const hy = horizonY(shot, height);
  // Clouds pan opposite to the camera's azimuth, scaled by the lens.
  const pxPerDeg = height / shot.fov;
  const pan = -shot.azimuth * pxPerDeg * 0.35;
  const clouds = Array.from({ length: 14 }, (_, i) => {
    const r = (k: string) => random(`cloud-${i}-${k}`);
    return {
      x: (r("x") * 2.4 - 0.7) * width,
      y: hy - (0.08 + r("y") * 0.55) * height,
      w: (0.35 + r("w") * 0.6) * width,
      h: (0.06 + r("h") * 0.06) * height,
      o: 0.55 + r("o") * 0.4,
    };
  });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(to bottom, ${WORLD_COLORS.skyTop} 0px, ${WORLD_COLORS.skyMid} ${Math.max(
          0,
          hy * 0.62,
        )}px, ${WORLD_COLORS.horizon} ${hy}px, ${WORLD_COLORS.horizon} ${height}px)`,
        overflow: "hidden",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="cloud-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={18} />
          </filter>
        </defs>
        <g filter="url(#cloud-blur)">
          {clouds.map((c, i) => {
            const x =
              ((((c.x + pan) % (width * 2.4)) + width * 2.4) % (width * 2.4)) -
              width * 0.7;
            return (
              <g key={i} opacity={c.o}>
                <ellipse
                  cx={x}
                  cy={c.y}
                  rx={c.w / 2}
                  ry={c.h / 2}
                  fill="#FFFFFF"
                />
                <ellipse
                  cx={x - c.w * 0.18}
                  cy={c.y - c.h * 0.35}
                  rx={c.w * 0.22}
                  ry={c.h * 0.5}
                  fill="#FFFFFF"
                />
                <ellipse
                  cx={x + c.w * 0.15}
                  cy={c.y - c.h * 0.4}
                  rx={c.w * 0.18}
                  ry={c.h * 0.45}
                  fill="#FFFFFF"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
