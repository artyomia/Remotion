import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  COLORS,
  CUES,
  FONTS,
  FONT_WEIGHTS,
  NEUTRALS,
  SCENES,
  TRACKING,
} from "../brand";
import { Headline } from "../components/Headline";
import { PageBackground, SceneChrome } from "../components/SceneChrome";
import { IconName, LineIcon } from "../illustrations/Icons";
import { useLayout } from "../lib/layout";
import { progress, uiSpring } from "../lib/motion";

const DURATION = 120;

export const ICON_TILES: Array<{ name: IconName; label: string }> = [
  { name: "emptyContainer", label: "Container rỗng" },
  { name: "reposition", label: "Đảo chuyển" },
  { name: "trailerDrop", label: "Cắt mooc" },
  { name: "yardStorage", label: "Lưu bãi" },
  { name: "tractor", label: "Xe đầu kéo" },
  { name: "office", label: "Văn phòng" },
  { name: "safety", label: "An toàn" },
  { name: "location", label: "Định vị" },
];

/** Local frame at which tile i appears (matches the click SFX cues). */
export const iconTileStart = (i: number) =>
  CUES.iconTilesStart - SCENES.icons.from + i * CUES.iconTileStagger;

/**
 * Scene 7, "Icon System" (frames 885 to 1005).
 * Eight rounded-square tiles; each line icon draws itself stroke by stroke.
 */
export const Scene7IconSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = useLayout();
  const { width, margin, pick } = layout;

  const cols = pick(4, 3);
  const tile = pick(210, 290);
  const gap = pick(40, 45);
  const gridWidth = cols * tile + (cols - 1) * gap;
  const gridX = pick(width - margin - gridWidth, margin);
  const gridY = pick(262, 570);
  const rowPitch = tile + pick(110, 110);
  const exit = progress(frame, DURATION - 10, 8);

  return (
    <AbsoluteFill>
      <PageBackground />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        <Headline
          lines={[
            {
              text: "HỆ ICON",
              color: COLORS.blue,
              parts: [
                { text: "HỆ ", color: COLORS.blue },
                { text: "ICON", color: COLORS.orange },
              ],
            },
          ]}
          x={margin}
          y={pick(262, 250)}
          fontSize={pick(120, 104)}
          start={2}
        >
          <div
            style={{
              marginTop: 28,
              fontFamily: FONTS.body,
              fontWeight: FONT_WEIGHTS.body.medium,
              fontSize: 16,
              letterSpacing: TRACKING.micro,
              color: NEUTRALS.label,
              opacity: progress(frame, 14, 14),
            }}
          >
            BỘ ICON DỊCH VỤ
          </div>
        </Headline>

        {ICON_TILES.map((icon, i) => {
          const start = iconTileStart(i);
          const s = uiSpring(frame, fps, start, 16);
          const col = i % cols;
          const row = Math.floor(i / cols);
          const iconSize = Math.round(tile * 0.44);
          return (
            <div
              key={icon.name}
              style={{
                position: "absolute",
                left: gridX + col * (tile + gap),
                top: gridY + row * rowPitch,
                width: tile,
                opacity: s,
                transform: `translateY(${(1 - s) * 16}px)`,
              }}
            >
              <div
                style={{
                  width: tile,
                  height: tile,
                  borderRadius: tile * 0.14,
                  background: COLORS.greyBlue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.92 + 0.08 * s})`,
                }}
              >
                <LineIcon
                  name={icon.name}
                  progress={progress(frame, start + 3, 26)}
                  size={iconSize}
                />
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: FONTS.body,
                  fontWeight: FONT_WEIGHTS.body.medium,
                  fontSize: pick(17, 22),
                  color: NEUTRALS.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {icon.label}
              </div>
            </div>
          );
        })}
      </div>
      <SceneChrome index="07" title="ICON SYSTEM" />
    </AbsoluteFill>
  );
};
