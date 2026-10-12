/**
 * PAD - Phuoc An Depot: brand constants for the debut video.
 *
 * Every colour, font, timing and asset name used by the scenes lives here, so
 * the film can be retuned without touching scene code.
 */
import { Easing } from "remotion";

/* -------------------------------------------------------------------------- */
/* Colours                                                                     */
/* -------------------------------------------------------------------------- */

/** Official brand tokens (exact values from the identity guidelines). */
export const COLORS = {
  blue: "#1E3A8A", // PAD Blue, primary
  orange: "#FF6A00", // PAD Orange, accent
  ivory: "#FAFAF7", // Ivory White, main background
  greyBlue: "#E5EBF3", // Light Grey Blue, panels and secondary shapes
  navy: "#0F2E5B", // Deep Navy, dark backgrounds and outro
  white: "#FFFFFF",
} as const;

/**
 * Supporting neutrals derived from the tokens above. They are only used for
 * hairlines, guides and small labels where the light grey blue would be too
 * faint on ivory.
 */
export const NEUTRALS = {
  line: "#A9B7CC", // thin route lines, guides
  grid: "#C9D3E2", // background grid
  label: "#7B879A", // footer labels, captions
  ink: "#33415C", // long body copy on ivory
} as const;

/* -------------------------------------------------------------------------- */
/* Typography                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Brand fonts. The licensed files are loaded from public/ when present
 * (see fonts.ts). The fallback families keep full Vietnamese coverage so the
 * film still renders correctly before the licensed files are added.
 */
export const FONT_FILES = {
  display: { family: "SVN-Harabaras", file: "SVN-Harabaras.otf" },
  sub: { family: "UTM Micra", file: "UTM-Micra.ttf" },
} as const;

export const FONTS = {
  /** Headlines. SVN-Harabaras, fallback Be Vietnam Pro ExtraBold. */
  display: `"${FONT_FILES.display.family}", "Be Vietnam Pro", sans-serif`,
  /** Sub-headlines and keywords. UTM Micra, fallback Chakra Petch. */
  sub: `"${FONT_FILES.sub.family}", "Chakra Petch", sans-serif`,
  /** Body copy and micro labels. */
  body: '"Montserrat", sans-serif',
} as const;

export const FONT_WEIGHTS = {
  display: 800, // only affects the fallback; the licensed file has one weight
  sub: 600,
  body: { regular: 400, medium: 500, semibold: 600 },
} as const;

/** Letter-spacing for uppercase micro labels. */
export const TRACKING = {
  micro: "0.3em",
  wide: "0.4em",
} as const;

/** SVN-Harabaras needs room for stacked Vietnamese diacritics. */
export const DISPLAY_LINE_HEIGHT = 1.15;

/* -------------------------------------------------------------------------- */
/* Motion                                                                      */
/* -------------------------------------------------------------------------- */

/** Default ease for every interpolate() call. */
export const EASE = Easing.bezier(0.65, 0, 0.35, 1);
/** Soft deceleration for things that land (cards, swatches). */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const SPRINGS = {
  /** UI elements: critically damped, no overshoot. */
  ui: { damping: 200 },
  /** Logo hits: a single crisp overshoot. */
  hit: { damping: 14, stiffness: 120 },
} as const;

/** Parallelogram skew used by module blocks, swatches, masks and panels. */
export const SKEW_DEG = -20;
/** Route lines kink upward at this angle (same as the legs of the A). */
export const ROUTE_ANGLE_DEG = 60;

/* -------------------------------------------------------------------------- */
/* Timing                                                                      */
/* -------------------------------------------------------------------------- */

export const FPS = 30;
export const DURATION_IN_FRAMES = 1350;

/**
 * Music tempo. At 120 BPM one beat is exactly 15 frames, so every scene
 * boundary below falls on a beat. Change BPM to match a new track and the
 * montage cuts in Scene 8 follow automatically.
 */
export const BPM = 120;
export const FRAMES_PER_BEAT = (60 / BPM) * FPS;
/** Frame of the n-th beat, counted from the start of the film. */
export const beatToFrame = (beat: number) => Math.round(beat * FRAMES_PER_BEAT);

/** Scene start frames and durations (absolute, 30 fps). */
export const SCENES = {
  signal: { from: 0, duration: 90 },
  logo: { from: 90, duration: 210 },
  idea: { from: 300, duration: 150 },
  palette: { from: 450, duration: 150 },
  typography: { from: 600, duration: 135 },
  graphics: { from: 735, duration: 150 },
  icons: { from: 885, duration: 120 },
  applications: { from: 1005, duration: 225 },
  outro: { from: 1230, duration: 120 },
} as const;

export type SceneName = keyof typeof SCENES;

/** Key moments inside scenes, relative to the start of the film. */
export const CUES = {
  primitivesFlyIn: 90,
  logoHit: 150,
  outroLogoHit: 1260,
  iconTilesStart: 885 + 18,
  iconTileStagger: 5,
} as const;

/** Montage: each application shot lasts this many beats. */
export const MONTAGE_BEATS_PER_SHOT = 2;

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

export const LAYOUT = {
  margin: { landscape: 120, vertical: 60 },
  headerLogoHeight: { landscape: 40, vertical: 34 },
  headerTop: { landscape: 64, vertical: 84 },
  footerBottom: { landscape: 56, vertical: 72 },
} as const;

/** The only shadow allowed, and only on mockup cards. */
export const MOCKUP_SHADOW = "0 20px 60px rgba(15,46,91,0.15)";

/* -------------------------------------------------------------------------- */
/* Brand copy                                                                  */
/* -------------------------------------------------------------------------- */

export const BRAND = {
  name: "PAD - Phuoc An Depot",
  tagline: ["LOGISTICS", "PEOPLE", "FORWARD TOGETHER"],
  website: "www.phuocandepot.vn",
} as const;

/* -------------------------------------------------------------------------- */
/* Assets in public/                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Optional photography. When a file is missing from public/, the matching
 * scene renders a built-in vector illustration in the same frame instead.
 */
export const PHOTOS = {
  ideaModern: "photo-modern.jpg",
  ideaPrecise: "photo-precise.jpg",
  ideaConnected: "photo-connected.jpg",
  port: "photo-port.jpg",
} as const;

export const APPLICATIONS = [
  { key: "stationery", label: "Bộ văn phòng phẩm", file: "app-stationery.jpg" },
  { key: "uniform", label: "Đồng phục & PPE", file: "app-uniform.jpg" },
  { key: "signage", label: "Biển hiệu & chỉ dẫn", file: "app-signage.jpg" },
  { key: "truck", label: "Nhận diện phương tiện", file: "app-truck.jpg" },
  { key: "equipment", label: "Thiết bị", file: "app-equipment.jpg" },
  { key: "social", label: "Hệ social media", file: "app-social.jpg" },
  { key: "digital", label: "Brochure & Digital", file: "app-digital.jpg" },
] as const;

export type ApplicationKey = (typeof APPLICATIONS)[number]["key"];

export const AUDIO = {
  music: "music.mp3",
  whoosh: "whoosh.mp3",
  hit: "hit.mp3",
  click: "click.mp3",
} as const;
