import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { COLORS } from "../brand";
import { RouteLines } from "../components/RouteLines";
import { progress } from "../lib/motion";
import { Flash } from "../social/fx";
import { S01Doors } from "../social/scenes/S01Doors";
import { S10EndCard } from "../social/scenes/S10EndCard";
import { SlamBlock } from "../social/Slam";
import { SocialSoundtrack } from "../social/SocialSoundtrack";
import { useStage } from "../social/stage";
import { COPY, CUE, SCENE } from "../social/timeline";
import { FilmLogoReveal } from "./FilmLogoReveal";
import { FootageShot } from "./FootageShot";
import { hasPublicFile } from "../lib/assets";
import { CLIP_FILES, FILM_SFX_CUES, getShots, TEXT_CUES } from "./timeline";

/** Dark gradient at the top of the frame so white headlines read over sky. */
const Scrim: React.FC = () => {
  const { textY } = useStage();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(rgba(3,10,24,0.62) 0px, rgba(3,10,24,0.35) ${textY + 260}px, rgba(3,10,24,0) ${textY + 560}px)`,
      }}
    />
  );
};

/** A text block living in its own Sequence, cues given in absolute frames. */
const Headline: React.FC<{
  from: number;
  to: number;
  lead?: { text: string; at: number };
  lines: Array<Array<{ text: string; at: number; color?: string }>>;
  exitAt?: number;
  size?: [number, number];
  underline?: boolean;
}> = ({ from, to, lead, lines, exitAt, size = [118, 104], underline }) => {
  const { textX, textY, pick } = useStage();
  const rel = (abs: number) => abs - from;
  return (
    <Sequence from={from} durationInFrames={to - from} name="Headline">
      <Scrim />
      <SlamBlock
        lead={lead ? { text: lead.text, at: rel(lead.at) } : undefined}
        lines={lines.map((line) => line.map((w) => ({ ...w, at: rel(w.at) })))}
        cx={textX}
        y={textY}
        size={pick(size[0], size[1])}
        exitAt={exitAt === undefined ? undefined : rel(exitAt)}
        underline={underline}
      />
    </Sequence>
  );
};

/** Route lines bursting across the convoy on drop 2. */
const DropTwoLines: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, pick } = useStage();
  const ys = [H * 0.82, H * 0.62, H * 0.9];
  return (
    <AbsoluteFill style={{ opacity: 1 - progress(frame, 100, 30) * 0.6 }}>
      {ys.map((y, i) => (
        <RouteLines
          key={i}
          y={y}
          kinkX={W * (0.3 + i * 0.18)}
          rise={pick(90, 70)}
          start={i * 3}
          duration={12}
          stagger={2}
          parallels={i === 0 ? undefined : []}
        />
      ))}
    </AbsoluteFill>
  );
};

/**
 * PAD logo debut, live-action version: Higgsfield footage of the depot cut to
 * "Impact Reveal", with the exact logo, headlines and sound design on top.
 */
export const PADDebutFilm: React.FC = () => {
  const shots = getShots(hasPublicFile(CLIP_FILES.convoy));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {shots.map((shot, i) => (
        <Sequence
          key={i}
          from={shot.from}
          durationInFrames={shot.to - shot.from}
          premountFor={30}
          name={`Shot ${shot.clip}`}
        >
          <FootageShot
            spec={shot}
            fallback={shot.clip === "door" ? <S01Doors /> : undefined}
          />
        </Sequence>
      ))}
      <Sequence
        from={CUE.drop1}
        durationInFrames={SCENE.montage.from - CUE.drop1}
        name="Logo reveal"
      >
        <FilmLogoReveal />
      </Sequence>
      <Sequence
        from={SCENE.endCard.from}
        durationInFrames={SCENE.endCard.to - SCENE.endCard.from}
        name="End card"
      >
        <S10EndCard />
      </Sequence>

      {/* Headlines */}
      <Headline
        from={66}
        to={108}
        lead={{ text: COPY.container.lead, at: TEXT_CUES.container.lead }}
        lines={[[{ text: COPY.container.main, at: TEXT_CUES.container.main }]]}
        exitAt={TEXT_CUES.container.exit}
      />
      <Headline
        from={108}
        to={144}
        lead={{ text: COPY.truck.lead, at: TEXT_CUES.truck.lead }}
        lines={[[{ text: COPY.truck.main, at: TEXT_CUES.truck.main }]]}
        exitAt={TEXT_CUES.truck.exit}
      />
      <Headline
        from={144}
        to={180}
        lead={{ text: COPY.people.lead, at: TEXT_CUES.people.lead }}
        lines={[[{ text: COPY.people.main, at: TEXT_CUES.people.main }]]}
        exitAt={TEXT_CUES.people.exit}
      />
      <Headline
        from={180}
        to={CUE.drop1}
        lead={{ text: COPY.lift.lead, at: TEXT_CUES.lift.lead }}
        lines={[[{ text: COPY.lift.main, at: TEXT_CUES.lift.main }]]}
        exitAt={TEXT_CUES.lift.exit}
        size={[128, 120]}
        underline
      />
      <Headline
        from={SCENE.together.from}
        to={SCENE.together.to}
        lines={[[{ text: COPY.together, at: TEXT_CUES.together }]]}
        size={[128, 120]}
      />
      <Sequence
        from={SCENE.forward.from}
        durationInFrames={SCENE.forward.to - SCENE.forward.from}
        name="Drop 2 lines"
      >
        <DropTwoLines />
      </Sequence>
      <Headline
        from={SCENE.forward.from}
        to={SCENE.forward.to}
        lines={[
          [
            { text: COPY.forward[0][0], at: CUE.drop2 },
            { text: COPY.forward[0][1], at: CUE.rolls[0] },
          ],
          [
            {
              text: COPY.forward[1][0],
              at: CUE.rolls[1],
              color: COLORS.orange,
            },
            {
              text: COPY.forward[1][1],
              at: CUE.rolls[2],
              color: COLORS.orange,
            },
          ],
        ]}
        exitAt={CUE.finalHit - 6}
        size={[124, 120]}
        underline
      />

      {/* Cut accents */}
      <Flash at={66} peak={1} decay={4} color="#FFF6E8" />
      {[108, 121, 135, 144].map((at) => (
        <Flash key={at} at={at} peak={0.25} decay={2} />
      ))}
      <Flash at={180} peak={0.45} decay={3} />
      {[432, 450, 468, 486, 504, 522].map((at) => (
        <Flash key={at} at={at} peak={at === 468 ? 0.45 : 0.25} decay={2} />
      ))}
      <Flash at={CUE.drop2} peak={0.7} decay={4} color="#FFE2C4" />
      <Flash at={CUE.barC} peak={0.3} decay={3} color={COLORS.orange} />

      <SocialSoundtrack cues={FILM_SFX_CUES} />
    </AbsoluteFill>
  );
};
