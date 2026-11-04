import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BRAND,
  COLORS,
  EASE,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
  TRACKING,
} from "../../brand";
import { RouteLines } from "../../components/RouteLines";
import { LogoGroup, lockupSize } from "../../logo/Logo";
import { A_PATH, D_PATH, P_PATH } from "../../logo/monogram";
import { DEPOT_PATHS, LOCKUPS, PHUOC_PATHS } from "../../logo/paths";
import { hitSpring, progress } from "../../lib/motion";
import { Flash, shakeAt, Shockwave, SpeedBurst } from "../fx";
import { useStage } from "../stage";
import { COPY } from "../timeline";

/** Fade and rise in from `at`. */
const rise = (frame: number, at: number) => {
  const p = progress(frame, at, 12, EASE_OUT);
  return { opacity: p, transform: `translateY(${(1 - p) * 24}px)` };
};

/**
 * Scene 12 (25.2 to 30 s): the reversed logo slams onto Deep Navy on the
 * final hit, then the tagline, the launch line, the website and a follow
 * call to action. Holds to the end so the post can loop.
 */
export const S10EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, pick } = useStage();

  const size = lockupSize(0);
  const logoW = pick(700, 600);
  const scale = logoW / size.width;
  const logoH = size.height * scale;
  const logoX = (W - logoW) / 2;
  const logoY = pick(450, 170);
  const hit = hitSpring(frame, fps, 0);
  const slam = interpolate(hit, [0, 1], [1.4, 1]);
  const shake = shakeAt(frame, [{ at: 0, amp: 24, decay: 6 }], "end");
  const sweep = progress(frame, 16, 16, EASE);
  const cx = W / 2;
  const cy = logoY + logoH / 2;
  const below = logoY + logoH;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 38%, #1B3A74 0%, #0F2E5B 40%, #071833 100%)",
      }}
    >
      <RouteLines
        y={pick(1560, 1250)}
        kinkX={W * 0.25}
        rise={pick(120, 90)}
        start={4}
        duration={26}
        parallels={[
          { gap: -18, color: "rgba(255,255,255,0.25)", width: 1.5 },
          {
            gap: 18,
            dashed: true,
            color: "rgba(255,255,255,0.25)",
            width: 1.5,
          },
        ]}
      />
      <AbsoluteFill
        style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}
      >
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <defs>
            <clipPath id="end-logo-clip">
              {[P_PATH, A_PATH, D_PATH].map((d) => (
                <path
                  key={d.slice(0, 16)}
                  d={d}
                  transform={`translate(${logoX} ${logoY}) scale(${scale})`}
                />
              ))}
              {PHUOC_PATHS.map((d) => (
                <path
                  key={d.slice(0, 16)}
                  d={d}
                  transform={`translate(${logoX} ${logoY}) scale(${scale}) translate(0 ${LOCKUPS.vertical.phuoc.y})`}
                />
              ))}
              {DEPOT_PATHS.map((d) => (
                <path
                  key={d.slice(0, 16)}
                  d={d}
                  transform={`translate(${logoX} ${logoY}) scale(${scale}) translate(${LOCKUPS.vertical.depot.x} ${LOCKUPS.vertical.depot.y})`}
                />
              ))}
            </clipPath>
          </defs>
          <g
            transform={`translate(${cx} ${cy}) scale(${slam}) translate(${-cx} ${-cy}) translate(${logoX} ${logoY}) scale(${scale})`}
            opacity={Math.min(1, frame / 3)}
          >
            <LogoGroup variant="reversed" />
          </g>
          {sweep > 0 && sweep < 1 ? (
            <g clipPath="url(#end-logo-clip)">
              <rect
                x={logoX - 200 + sweep * (logoW + 400)}
                y={logoY - 50}
                width={110}
                height={logoH + 100}
                fill="#FFFFFF"
                opacity={0.45}
                transform={`skewX(-20)`}
              />
            </g>
          ) : null}
        </svg>
        <Shockwave
          at={0}
          cx={cx}
          cy={cy}
          r0={logoW * 0.4}
          r1={pick(1100, 900)}
          width={12}
          color={COLORS.orange}
        />
        <SpeedBurst
          at={0}
          cx={cx}
          cy={cy}
          inner={logoW * 0.55}
          color="#FFFFFF"
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: below + pick(70, 50),
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: FONT_WEIGHTS.body.medium,
            fontSize: pick(22, 20),
            letterSpacing: TRACKING.micro,
            paddingLeft: TRACKING.micro,
            color: "rgba(255,255,255,0.82)",
            ...rise(frame, 34),
          }}
        >
          {BRAND.tagline.join(" · ")}
        </div>
        <div
          style={{
            marginTop: pick(46, 34),
            fontFamily: FONTS.display,
            fontWeight: FONT_WEIGHTS.display,
            fontSize: pick(50, 44),
            lineHeight: 1.2,
            color: COLORS.white,
            ...rise(frame, 50),
          }}
        >
          {COPY.launch}
        </div>
        <div
          style={{
            marginTop: pick(18, 12),
            fontFamily: FONTS.body,
            fontWeight: FONT_WEIGHTS.body.semibold,
            fontSize: pick(28, 26),
            letterSpacing: "0.06em",
            color: COLORS.orange,
            ...rise(frame, 66),
          }}
        >
          {BRAND.website}
        </div>
        <div
          style={{
            marginTop: pick(44, 30),
            display: "flex",
            justifyContent: "center",
            ...rise(frame, 84),
          }}
        >
          <div
            style={{
              padding: "16px 40px",
              borderRadius: 999,
              border: `3px solid ${COLORS.white}`,
              fontFamily: FONTS.body,
              fontWeight: FONT_WEIGHTS.body.semibold,
              fontSize: pick(28, 26),
              color: COLORS.white,
              transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((frame - 84) * 0.25)) * progress(frame, 96, 1)})`,
            }}
          >
            {COPY.follow}
          </div>
        </div>
      </div>
      <Flash at={0} peak={0.85} decay={4} color="#FFE9D2" />
    </AbsoluteFill>
  );
};
