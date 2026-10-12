import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  COLORS,
  EASE_OUT,
  FONTS,
  FONT_WEIGHTS,
  NEUTRALS,
  PHOTOS,
  TRACKING,
} from "../brand";
import { GlassPanels } from "../components/GlassPanels";
import { Headline } from "../components/Headline";
import { Media } from "../components/Media";
import { ParaMask } from "../components/ParaMask";
import { PageBackground, SceneChrome } from "../components/SceneChrome";
import { TypeOn } from "../components/TextEffects";
import {
  ConnectedYard,
  ModernStack,
  PortPanorama,
  PreciseDoor,
} from "../illustrations/PortScenes";
import { paraFootprint } from "../lib/geometry";
import { useLayout } from "../lib/layout";
import { progress } from "../lib/motion";

const DURATION = 150;

const CARDS = [
  { keyword: "Hiện đại", file: PHOTOS.ideaModern, Art: ModernStack },
  { keyword: "Chính xác", file: PHOTOS.ideaPrecise, Art: PreciseDoor },
  { keyword: "Kết nối", file: PHOTOS.ideaConnected, Art: ConnectedYard },
] as const;

const STATEMENT = "Bản sắc logistics tối giản, rõ ràng và đáng tin cậy.";

/**
 * Scene 3, "Brand Idea" (frames 300 to 450).
 * Two-tone headline, three parallelogram photo cards with keywords, a typed
 * brand statement, and glass panels drifting over a faded port photo.
 */
export const Scene3BrandIdea: React.FC = () => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const { width, height, margin, contentWidth, pick } = layout;

  const card = pick(
    { h: 480, w: 190, pitch: 214, y: 230 },
    { h: 560, w: 230, pitch: 252, y: 770 },
  );
  const rowWidth =
    card.pitch * (CARDS.length - 1) + paraFootprint(card.w, card.h);
  const cardsX = pick(
    width - margin - rowWidth,
    margin + (contentWidth - rowWidth) / 2,
  );

  const exit = progress(frame, DURATION - 14, 12);
  const contentStyle: React.CSSProperties = {
    opacity: 1 - exit,
    transform: `translateX(${-40 * exit}px)`,
  };
  const zoom = 1 + 0.08 * (frame / DURATION);

  const photoBox = pick(
    { left: width * 0.42, top: 0, w: width * 0.58, h: height },
    { left: 0, top: 560, w: width, h: 1000 },
  );

  return (
    <AbsoluteFill>
      <PageBackground />
      {/* Faded port photo behind the cards */}
      <div
        style={{
          position: "absolute",
          left: photoBox.left,
          top: photoBox.top,
          width: photoBox.w,
          height: photoBox.h,
          opacity: 0.16 * progress(frame, 0, 24) * (1 - exit),
          WebkitMaskImage: pick(
            "linear-gradient(to right, transparent 0%, black 45%)",
            "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          ),
        }}
      >
        <Media
          file={PHOTOS.port}
          width={photoBox.w}
          height={photoBox.h}
          zoom={1.02 + 0.05 * (frame / DURATION)}
          fallback={(size) => <PortPanorama {...size} />}
        />
      </div>
      <GlassPanels
        fromX={pick(width * 0.5, width * 0.3)}
        start={2}
        opacity={1 - exit}
      />

      <Headline
        lines={[
          { text: "Ý TƯỞNG", color: COLORS.blue },
          { text: "THƯƠNG HIỆU", color: COLORS.orange },
        ]}
        x={margin}
        y={pick(200, 250)}
        fontSize={pick(120, 104)}
        start={4}
        exitStart={DURATION - 16}
      >
        <div
          style={{
            marginTop: 28,
            fontFamily: FONTS.body,
            fontWeight: FONT_WEIGHTS.body.medium,
            fontSize: 16,
            letterSpacing: TRACKING.micro,
            color: NEUTRALS.label,
            opacity: progress(frame, 22, 14) * (1 - exit),
          }}
        >
          ĐỊNH HƯỚNG NHẬN DIỆN
        </div>
      </Headline>

      <div style={{ position: "absolute", inset: 0, ...contentStyle }}>
        {CARDS.map(({ keyword, file, Art }, i) => {
          const start = 14 + i * 8;
          const s = progress(frame, start, 24, EASE_OUT);
          const x = cardsX + i * card.pitch;
          const footprint = paraFootprint(card.w, card.h);
          const labelIn = progress(frame, start + 14, 14, EASE_OUT);
          return (
            <React.Fragment key={keyword}>
              <ParaMask
                x={x + (1 - s) * pick(720, 520)}
                y={card.y}
                w={card.w}
                h={card.h}
                radius={14}
                style={{ opacity: s }}
              >
                <Media
                  file={file}
                  width={footprint}
                  height={card.h}
                  zoom={zoom}
                  fallback={(size) => <Art {...size} />}
                />
              </ParaMask>
              <div
                style={{
                  position: "absolute",
                  left: x + 4,
                  top: card.y + card.h + 26,
                  opacity: labelIn,
                  transform: `translateY(${(1 - labelIn) * 12}px)`,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 3,
                    background: COLORS.orange,
                    marginBottom: 12,
                    transform: `scaleX(${labelIn})`,
                    transformOrigin: "left",
                  }}
                />
                <div
                  style={{
                    fontFamily: FONTS.sub,
                    fontWeight: 600,
                    fontSize: pick(26, 28),
                    lineHeight: 1.3,
                    color: COLORS.blue,
                    whiteSpace: "nowrap",
                  }}
                >
                  {keyword}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Brand statement, typed in */}
        <div
          style={{
            position: "absolute",
            left: margin,
            top: pick(870, 1600),
            display: "flex",
            alignItems: "stretch",
            gap: 22,
            opacity: progress(frame, 62, 8),
          }}
        >
          <div
            style={{ width: 4, background: COLORS.orange, borderRadius: 2 }}
          />
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: FONT_WEIGHTS.body.medium,
              fontSize: pick(26, 28),
              lineHeight: 1.5,
              color: NEUTRALS.ink,
              maxWidth: pick(900, contentWidth - 30),
            }}
          >
            <TypeOn
              text={STATEMENT}
              start={66}
              charsPerFrame={1.2}
              caret
              caretColor={COLORS.orange}
            />
          </div>
        </div>
      </div>

      <SceneChrome index="03" title="BRAND IDEA" />
    </AbsoluteFill>
  );
};
