/**
 * PAD logo debut film (30 s, live-action AI footage + exact logo graphics).
 * Same music, message and cue frames as the 2D social debut (see
 * ../social/timeline.ts); this file maps the Higgsfield clips onto them.
 */
import { CUE, SfxName } from "../social/timeline";

export const FILM_FOOTAGE = "debut/footage";

export type ClipName =
  | "door"
  | "lane"
  | "truck"
  | "worker"
  | "stacker"
  | "orangeDrop"
  | "aerial"
  | "convoy";

/** Files in public/debut/footage (1080x1912, 24 fps, 5 s, from Higgsfield). */
export const CLIP_FILES: Record<ClipName, string> = {
  door: `${FILM_FOOTAGE}/door.mp4`,
  lane: `${FILM_FOOTAGE}/lane.mp4`,
  truck: `${FILM_FOOTAGE}/truck.mp4`,
  worker: `${FILM_FOOTAGE}/worker.mp4`,
  stacker: `${FILM_FOOTAGE}/stacker.mp4`,
  orangeDrop: `${FILM_FOOTAGE}/orange-drop.mp4`,
  aerial: `${FILM_FOOTAGE}/aerial.mp4`,
  convoy: `${FILM_FOOTAGE}/convoy.mp4`,
};

/**
 * Second in orange-drop.mp4 where the box hits the ground (dust starts on
 * source frame 78 at 24 fps). The clip is trimmed so this lands on drop 1.
 */
export const ORANGE_IMPACT_S = 3.25;

export type ShotSpec = {
  clip: ClipName;
  from: number;
  to: number;
  /** Where in the clip to start, seconds. */
  start: number;
  rate?: number;
  /** Scale at the start and end of the shot (slow push). */
  zoom?: [number, number];
  /** Zoom origin, fractions of the frame. */
  focus?: [number, number];
};

const S = 30; // fps

/** Main timeline. Every boundary sits on a beat or an accent of the track. */
const BASE_SHOTS: ShotSpec[] = [
  // Doors: shut until the first bar, open on the first accent (frame 63).
  { clip: "door", from: 0, to: 66, start: 0.7, rate: 1.1, zoom: [1.0, 1.1] },
  {
    clip: "lane",
    from: 66,
    to: 108,
    start: 0.3,
    rate: 1.6,
    zoom: [1.05, 1.12],
  },
  // Three cuts on the three accents: the truck head-on, the trailer, the cab.
  { clip: "truck", from: 108, to: 121, start: 0, rate: 1.3, zoom: [1.0, 1.06] },
  {
    clip: "truck",
    from: 121,
    to: 135,
    start: 3.6,
    rate: 1.3,
    zoom: [1.35, 1.45],
    focus: [0.5, 0.78],
  },
  {
    clip: "truck",
    from: 135,
    to: 144,
    start: 1.6,
    rate: 1.3,
    zoom: [1.6, 1.7],
    focus: [0.3, 0.55],
  },
  {
    clip: "worker",
    from: 144,
    to: 180,
    start: 0,
    zoom: [1.06, 1.14],
    focus: [0.5, 0.35],
  },
  {
    clip: "stacker",
    from: 180,
    to: 252,
    start: 0,
    rate: 1.2,
    zoom: [1.12, 1.0],
  },
  {
    clip: "orangeDrop",
    from: 252,
    to: CUE.drop1,
    start: ORANGE_IMPACT_S - (CUE.drop1 - 252) / S,
    zoom: [1.0, 1.1],
  },
  // 324 to 432: logo reveal (graphics)
  // Montage: one shot per beat, the brand out in the yard.
  {
    clip: "stacker",
    from: 432,
    to: 450,
    start: 3.4,
    zoom: [1.55, 1.62],
    focus: [0.62, 0.32],
  },
  {
    clip: "lane",
    from: 450,
    to: 468,
    start: 1.6,
    zoom: [1.35, 1.45],
    focus: [0.75, 0.4],
  },
  {
    clip: "truck",
    from: 468,
    to: 486,
    start: 4.2,
    zoom: [1.15, 1.22],
    focus: [0.6, 0.5],
  },
  {
    clip: "worker",
    from: 486,
    to: 504,
    start: 2.4,
    zoom: [1.9, 2.0],
    focus: [0.5, 0.55],
  },
  // Breakdown 2.
  {
    clip: "aerial",
    from: 540,
    to: 612,
    start: 0,
    zoom: [1.0, 1.12],
    focus: [0.5, 0.6],
  },
];

/** Shots that use the convoy clip. */
const CONVOY_SHOTS: ShotSpec[] = [
  {
    clip: "convoy",
    from: 504,
    to: 522,
    start: 2.0,
    zoom: [1.2, 1.3],
    focus: [0.5, 0.5],
  },
  {
    clip: "aerial",
    from: 522,
    to: 540,
    start: 3.0,
    zoom: [1.3, 1.4],
    focus: [0.5, 0.75],
  },
  {
    clip: "convoy",
    from: 612,
    to: 756,
    start: 0.1,
    rate: 1.0,
    zoom: [1.06, 1.16],
  },
];

/** Stand-ins until convoy.mp4 is supplied: truck and lane footage. */
const NO_CONVOY_SHOTS: ShotSpec[] = [
  {
    clip: "truck",
    from: 504,
    to: 522,
    start: 2.6,
    zoom: [1.45, 1.55],
    focus: [0.3, 0.55],
  },
  {
    clip: "aerial",
    from: 522,
    to: 540,
    start: 3.0,
    zoom: [1.3, 1.4],
    focus: [0.5, 0.75],
  },
  {
    clip: "truck",
    from: 612,
    to: CUE.barC,
    start: 1.8,
    rate: 1.25,
    zoom: [1.08, 1.16],
  },
  {
    clip: "lane",
    from: CUE.barC,
    to: 756,
    start: 2.6,
    rate: 1.0,
    zoom: [1.06, 1.14],
  },
];

/** The shot list, using the convoy clip when it is present in public/. */
export const getShots = (hasConvoy: boolean): ShotSpec[] => [
  ...BASE_SHOTS,
  ...(hasConvoy ? CONVOY_SHOTS : NO_CONVOY_SHOTS),
];

/** Where each text block lands (absolute frames). */
export const TEXT_CUES = {
  container: { lead: 70, main: 72, exit: 104 },
  truck: { lead: 106, main: 110, exit: 141 },
  people: { lead: 142, main: 146, exit: 177 },
  lift: { lead: 216, main: 288, exit: CUE.drop1 - 1 },
  newLook: CUE.barB,
  together: CUE.fills[1],
} as const;

/** Sound design for the film, on top of the music. */
export const FILM_SFX_CUES: Array<{
  at: number;
  sfx: SfxName;
  volume: number;
  rate?: number;
}> = [
  { at: 0, sfx: "ambience", volume: 0.4 },
  { at: 34, sfx: "lockClank", volume: 0.7 },
  { at: 45, sfx: "doorOpen", volume: 0.6 },
  { at: 65, sfx: "whooshDeep", volume: 0.6 },
  { at: 72, sfx: "textSlam", volume: 0.42 },
  { at: 104, sfx: "truckPass", volume: 0.6 },
  { at: 110, sfx: "textSlam", volume: 0.42 },
  { at: 121, sfx: "whooshCut", volume: 0.32 },
  { at: 133, sfx: "airHorn", volume: 0.3 },
  { at: 135, sfx: "whooshCut", volume: 0.3 },
  { at: 146, sfx: "textSlam", volume: 0.42 },
  { at: 150, sfx: "radio", volume: 0.45 },
  { at: 176, sfx: "engine", volume: 0.55 },
  { at: 180, sfx: "punch", volume: 0.4 },
  { at: 196, sfx: "hydraulic", volume: 0.45 },
  { at: 216, sfx: "textSlam", volume: 0.32 },
  { at: 252, sfx: "backupBeep", volume: 0.28 },
  { at: 256, sfx: "hydraulic", volume: 0.35 },
  { at: CUE.drop1 - 45, sfx: "riser", volume: 0.4 },
  { at: 288, sfx: "textSlam", volume: 0.42 },
  { at: CUE.drop1 - 12, sfx: "reverseSuck", volume: 0.4 },
  { at: CUE.drop1, sfx: "impactBig", volume: 0.5 },
  { at: CUE.drop1 + 2, sfx: "debris", volume: 0.45 },
  { at: CUE.drop1 + 4, sfx: "hydraulicRelease", volume: 0.3 },
  { at: 347, sfx: "swoosh", volume: 0.45 },
  { at: 372, sfx: "shimmer", volume: 0.3 },
  { at: 378, sfx: "punch", volume: 0.42 },
  { at: CUE.barB, sfx: "textSlam", volume: 0.5 },
  ...[430, 448, 466, 484, 502, 520].map((at) => ({
    at,
    sfx: "whooshCut" as const,
    volume: 0.32,
  })),
  { at: 556, sfx: "textSlam", volume: 0.36 },
  { at: CUE.drop2 - 45, sfx: "riser", volume: 0.35 },
  { at: CUE.drop2, sfx: "whooshDeep", volume: 0.5 },
  { at: CUE.drop2, sfx: "textSlam", volume: 0.5 },
  { at: 616, sfx: "truckPass", volume: 0.45 },
  { at: 638, sfx: "textSlam", volume: 0.45 },
  { at: 656, sfx: "textSlam", volume: 0.45 },
  { at: 662, sfx: "airHorn", volume: 0.28 },
  { at: 674, sfx: "textSlam", volume: 0.5 },
  { at: CUE.barC, sfx: "punch", volume: 0.4 },
  { at: 740, sfx: "whooshDeep", volume: 0.45 },
  { at: CUE.finalHit, sfx: "logoSting", volume: 0.6 },
  { at: CUE.finalHit + 30, sfx: "shimmer", volume: 0.2 },
];
