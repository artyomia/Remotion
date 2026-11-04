/**
 * PAD social logo debut (30 s, 2D): timing, message, palette and sound cues.
 *
 * Cue frames are measured from public/debut/impact-reveal.mp3. The track
 * moves in two-bar phrases: one beat is 18 frames, bars start on frame
 * 36 + 72n, and the two drops sit four bars apart (frames 324 and 612).
 */
import { COLORS } from "../brand";

export const SOCIAL_FPS = 30;
export const SOCIAL_DURATION = 900;
export const SOCIAL_MUSIC = "debut/impact-reveal.mp3";

/** One beat in frames (100 BPM at 30 fps). */
export const BEAT = 18;

/** Music landmarks (absolute frames). */
export const CUE = {
  firstBar: 36, // 1.2 s, the groove starts
  doorHit: 63, // 2.1 s, first accent: the doors open
  accentsA: [108, 121, 135] as const, // 3.6 / 4.0 / 4.5 s
  bigHitA: 180, // 6.0 s
  breakdown1: 252, // 8.4 s, bass drops out
  buildHits: [280, 289, 303, 316] as const, // snare build into drop 1
  drop1: 324, // 10.8 s, the strongest hit of the track
  dottedB: [351, 378] as const, // 11.7 / 12.6 s
  barB: 396, // 13.2 s
  hitB: 468, // 15.6 s
  breakdown2: 540, // 18.0 s, bass drops out
  fills: [541, 559, 577, 595] as const, // snare fills before drop 2
  drop2: 612, // 20.4 s
  rolls: [638, 656, 674] as const, // drum rolls 21.3 to 22.8 s
  barC: 684, // 22.8 s
  finalHit: 756, // 25.2 s, then the track rings out
  musicEnd: 830, // ~27.7 s, silence after this
} as const;

/** Scene boundaries (absolute frames). */
export const SCENE = {
  doors: { from: 0, to: 66 },
  corridor: { from: 66, to: 108 },
  truck: { from: 108, to: 144 },
  worker: { from: 144, to: 180 },
  stacker: { from: 180, to: 252 },
  logo: { from: 252, to: 432 },
  montage: { from: 432, to: 540 },
  together: { from: 540, to: 612 },
  forward: { from: 612, to: 756 },
  endCard: { from: 756, to: 900 },
} as const;

export type SocialSceneName = keyof typeof SCENE;

/**
 * The message. It follows the three parts of the brand tagline:
 * LOGISTICS (containers, trucks), PEOPLE, FORWARD TOGETHER.
 */
export const COPY = {
  container: { lead: "TỪNG", main: "CONTAINER." },
  truck: { lead: "TỪNG", main: "CHUYẾN XE." },
  people: { lead: "TỪNG", main: "CON NGƯỜI." },
  lift: { lead: "ĐỀU ĐƯỢC", main: "NÂNG TẦM." },
  newLook: ["DIỆN MẠO", "MỚI"],
  together: "CÙNG NHAU,",
  forward: [
    ["TIẾN", "VỀ"],
    ["PHÍA", "TRƯỚC."],
  ],
  launch: "Chính thức ra mắt diện mạo mới",
  follow: "Theo dõi PAD",
  hashtag: "#PADNangTam",
} as const;

/* -------------------------------------------------------------------------- */
/* Palette                                                                     */
/* -------------------------------------------------------------------------- */

/** Blue-hour palette for the yard scenes, built around the brand navy. */
export const DUSK = {
  skyTop: "#050F22",
  skyMid: "#0C2650",
  skyLow: "#2A3C70",
  glow: COLORS.orange,
  ground: "#0A1730",
  groundNear: "#0D1D3B",
  lane: "#14284D",
  silhouette: "#0A1C3A",
  silhouetteFar: "#16305C",
  haze: "#33497F",
  lamp: "#FFE6BF",
  steel: "#8E9AAD",
} as const;

/**
 * Container colours in the yard: the brand blues plus the rust, mustard and
 * steel tones of a real depot, toned down for blue hour.
 */
export const YARD_CONTAINERS = [
  "#1E3A8A",
  "#173070",
  "#26457F",
  "#7C2E27",
  "#8E3A2C",
  "#9C7A2E",
  "#3D5E8E",
  "#55657C",
  "#6E7B8C",
  "#1E3A8A",
  "#8E3A2C",
] as const;

/**
 * Reach stacker colours, matched to PAD's own machines (red body, black
 * boom and spreader). Swap to COLORS.blue / COLORS.orange for a brand-colour
 * machine.
 */
export const STACKER = {
  body: "#C9241C",
  bodyShade: "#9E1B15",
  boom: "#2A2D33",
  boomHighlight: "#3A3E46",
  chassis: "#1E2126",
  cab: "#24272C",
  glass: "#9DC0DC",
  plate: "#F4F4F2",
  beacon: "#FFB020",
} as const;

/** Truck colours: PAD blue tractor units. */
export const TRUCK = {
  cab: COLORS.blue,
  cabShade: "#172E6E",
  chassis: "#1E2126",
  glass: "#9DC0DC",
} as const;

/* -------------------------------------------------------------------------- */
/* Sound effects (placeholders in public/debut/sfx, replaceable 1:1)           */
/* -------------------------------------------------------------------------- */

export const SFX = {
  ambience: "debut/sfx/yard-ambience.mp3",
  lockClank: "debut/sfx/lock-clank.mp3",
  doorOpen: "debut/sfx/door-open.mp3",
  whooshDeep: "debut/sfx/whoosh-deep.mp3",
  whooshCut: "debut/sfx/whoosh-cut.mp3",
  swoosh: "debut/sfx/swoosh.mp3",
  textSlam: "debut/sfx/text-slam.mp3",
  punch: "debut/sfx/punch.mp3",
  truckPass: "debut/sfx/truck-pass.mp3",
  airHorn: "debut/sfx/air-horn.mp3",
  radio: "debut/sfx/radio-chirp.mp3",
  engine: "debut/sfx/engine-rev.mp3",
  hydraulic: "debut/sfx/hydraulic.mp3",
  hydraulicRelease: "debut/sfx/hydraulic-release.mp3",
  twistlock: "debut/sfx/twistlock.mp3",
  containerDrop: "debut/sfx/container-drop.mp3",
  backupBeep: "debut/sfx/backup-beep.mp3",
  riser: "debut/sfx/riser.mp3",
  reverseSuck: "debut/sfx/reverse-suck.mp3",
  impactBig: "debut/sfx/impact-big.mp3",
  debris: "debut/sfx/debris.mp3",
  shimmer: "debut/sfx/shimmer.mp3",
  lightOn: "debut/sfx/light-on.mp3",
  logoSting: "debut/sfx/logo-sting.mp3",
} as const;

export type SfxName = keyof typeof SFX;

/** Every sound effect cue: absolute start frame, file and level. */
export const SFX_CUES: Array<{
  at: number;
  sfx: SfxName;
  volume: number;
  rate?: number;
}> = [
  // 1. Doors
  { at: 0, sfx: "ambience", volume: 0.5 },
  { at: CUE.firstBar - 2, sfx: "lockClank", volume: 0.7 },
  { at: CUE.doorHit - 18, sfx: "doorOpen", volume: 0.65 },
  // 2. Corridor
  { at: CUE.doorHit + 2, sfx: "whooshDeep", volume: 0.6 },
  { at: 72, sfx: "textSlam", volume: 0.45 },
  // 3. Truck
  { at: 104, sfx: "truckPass", volume: 0.6 },
  { at: 108, sfx: "textSlam", volume: 0.45 },
  { at: 121, sfx: "whooshCut", volume: 0.35 },
  { at: 133, sfx: "airHorn", volume: 0.32 },
  // 4. Worker
  { at: 144, sfx: "textSlam", volume: 0.45 },
  { at: 150, sfx: "radio", volume: 0.5 },
  // 5. Reach stacker
  { at: 176, sfx: "engine", volume: 0.55 },
  { at: 180, sfx: "punch", volume: 0.45 },
  { at: 200, sfx: "hydraulic", volume: 0.45 },
  { at: 216, sfx: "textSlam", volume: 0.35 },
  { at: 234, sfx: "twistlock", volume: 0.6 },
  // 6. Logo build
  { at: 252, sfx: "backupBeep", volume: 0.3 },
  ...[262, 270, 280, 289, 297, 303, 310, 316].map((at, i) => ({
    at,
    sfx: "containerDrop" as const,
    volume: 0.32,
    rate: 1.05 + (i % 3) * 0.06,
  })),
  { at: 288, sfx: "textSlam", volume: 0.4 },
  { at: CUE.drop1 - 45, sfx: "riser", volume: 0.4 },
  { at: 312, sfx: "reverseSuck", volume: 0.4 },
  // 7. Drop 1: the D lands, the logo is born
  { at: CUE.drop1, sfx: "impactBig", volume: 0.48 },
  { at: CUE.drop1 + 2, sfx: "debris", volume: 0.45 },
  { at: CUE.drop1 + 4, sfx: "hydraulicRelease", volume: 0.35 },
  { at: 347, sfx: "swoosh", volume: 0.45 },
  { at: 378, sfx: "punch", volume: 0.45 },
  { at: 380, sfx: "shimmer", volume: 0.3 },
  { at: CUE.barB, sfx: "textSlam", volume: 0.5 },
  // 8. Montage cuts
  { at: 430, sfx: "whooshCut", volume: 0.35 },
  { at: 448, sfx: "whooshCut", volume: 0.3 },
  { at: 466, sfx: "whooshCut", volume: 0.4 },
  { at: 484, sfx: "whooshCut", volume: 0.3 },
  { at: 502, sfx: "whooshCut", volume: 0.3 },
  { at: 520, sfx: "whooshCut", volume: 0.35 },
  // 9. Together: yard lights
  { at: 541, sfx: "lightOn", volume: 0.45 },
  { at: 559, sfx: "lightOn", volume: 0.45 },
  { at: 577, sfx: "lightOn", volume: 0.45 },
  { at: 595, sfx: "lightOn", volume: 0.45 },
  { at: CUE.drop2 - 45, sfx: "riser", volume: 0.35 },
  // 10. Forward
  { at: CUE.drop2, sfx: "whooshDeep", volume: 0.5 },
  { at: CUE.drop2, sfx: "textSlam", volume: 0.5 },
  { at: 616, sfx: "truckPass", volume: 0.45 },
  { at: 638, sfx: "textSlam", volume: 0.45 },
  { at: 656, sfx: "textSlam", volume: 0.45 },
  { at: 674, sfx: "textSlam", volume: 0.5 },
  { at: 662, sfx: "airHorn", volume: 0.3 },
  { at: CUE.barC, sfx: "punch", volume: 0.4 },
  { at: 740, sfx: "whooshDeep", volume: 0.45 },
  // 11. End card
  { at: CUE.finalHit, sfx: "logoSting", volume: 0.6 },
  { at: CUE.finalHit + 30, sfx: "shimmer", volume: 0.2 },
];
