/**
 * PAD logo debut (social, 30 s): timing, palette and world constants.
 *
 * All cue frames were measured from public/debut/impact-reveal.mp3
 * (136 BPM, 29.6 s) so the picture cuts land on the music.
 */

export const DEBUT_FPS = 30;
export const DEBUT_DURATION = 900;
export const DEBUT_MUSIC = "debut/impact-reveal.mp3";
export const DEBUT_BPM = 136;

/** Music landmarks, in frames at 30 fps. */
export const CUE = {
  firstDownbeat: 37, // 1.25 s, the track kicks in
  breakdown: 210, // 7.0 s, energy drops
  buildHits: [280, 289, 303, 316] as const, // snare build into drop 1
  drop1: 325, // 10.85 s
  sectionBHits: [424, 470] as const, // 14.1 s, 15.7 s
  fills: [510, 523, 541, 559, 568, 577, 595] as const, // 17.0 to 19.9 s
  drop2: 613, // 20.43 s, the biggest hit
  sectionCHits: [636, 686] as const, // 21.2 s, 22.85 s
  finalHit: 757, // 25.25 s
} as const;

/** On-screen message, "ĐIỂM TỰA CHO MỌI HÀNH TRÌNH". */
export const MESSAGE = {
  journeyA: "MỖI CONTAINER",
  journeyB: "LÀ MỘT HÀNH TRÌNH",
  pivotA: "MỖI HÀNH TRÌNH",
  pivotB: ["CẦN MỘT ", "ĐIỂM TỰA"] as const,
  values: ["HIỆN ĐẠI", "CHÍNH XÁC", "KẾT NỐI"] as const,
  newLook: "DIỆN MẠO MỚI",
  claimA: "ĐIỂM TỰA",
  claimB: "CHO MỌI HÀNH TRÌNH",
  launch: "Chính thức ra mắt nhận diện mới",
  follow: "Theo dõi Phuoc An Depot",
} as const;

/* -------------------------------------------------------------------------- */
/* 3D world                                                                    */
/* -------------------------------------------------------------------------- */

/** Metres per logo unit: x (monogram height / 3) = 2.7 m, one container high. */
export const M_PER_UNIT = 0.027;
/** Depth of the container-letters (a container's width). */
export const LETTER_DEPTH = 2.44;
export const MONO_WIDTH_M = 1112.5 * M_PER_UNIT;
export const MONO_HEIGHT_M = 300 * M_PER_UNIT;
/** World x of the monogram's left edge (monogram centred on x = 0). */
export const MONO_X0 = -MONO_WIDTH_M / 2;
/** World x of the centre of the D. */
export const D_CENTER_X = MONO_X0 + ((719.2 + 1112.5) / 2) * M_PER_UNIT;
/** Width of the D, which the spreader is set to. */
export const D_WIDTH_M = (1112.5 - 719.2) * M_PER_UNIT;

/** Equipment and yard colours, sampled from the PAD site photos. */
export const WORLD_COLORS = {
  stackerRed: "#C9241C",
  boom: "#2A2D33",
  chassis: "#24272C",
  tyre: "#1B1D21",
  hub: "#9AA2AC",
  glass: "#9DC0DC",
  plate: "#F4F4F2",
  concrete: "#D9D5CC",
  skyTop: "#4F8FD0",
  skyMid: "#8DBDE8",
  horizon: "#DCE7F1",
  dust: "#CFC6B6",
  signBlue: "#1F5FB3",
};

/**
 * Shipping-container colours as seen in the PAD yard photos (no line logos).
 * Repeated entries weight the random pick.
 */
export const CONTAINER_COLORS = [
  "#9E2B25",
  "#A8342C",
  "#7C2A28",
  "#B8432F",
  "#D4A93A",
  "#C99F37",
  "#DDB64A",
  "#D4A93A",
  "#2F5E9E",
  "#3C8DC5",
  "#C94B86",
  "#8E969E",
  "#D9DCDF",
] as const;
