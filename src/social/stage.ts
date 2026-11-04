import { useVideoConfig } from "remotion";

export type Stage = {
  W: number;
  H: number;
  /** True for 9:16, false for 4:5. */
  tall: boolean;
  /** Text-safe band: clear of the platform UI on Reels and TikTok. */
  safeTop: number;
  safeBottom: number;
  safeLeft: number;
  safeRight: number;
  /** Vertical centre of the text-safe band. */
  midY: number;
  /** Top of the headline block used by every scene, so lines never jump. */
  textY: number;
  /** Horizontal centre of the text-safe band. */
  textX: number;
  /** Picks the 9:16 or the 4:5 value. */
  pick: <T>(tall: T, feed: T) => T;
};

/**
 * Frame geometry for the social debut. 9:16 keeps text clear of the top
 * 250px, the bottom 400px and the right 150px, where Reels and TikTok draw
 * their buttons and captions. 4:5 feed posts only need a small margin.
 */
export const useStage = (): Stage => {
  const { width: W, height: H } = useVideoConfig();
  const tall = H / W > 1.5;
  const safeTop = tall ? 250 : 90;
  const safeBottom = tall ? H - 400 : H - 100;
  return {
    W,
    H,
    tall,
    safeTop,
    safeBottom,
    safeLeft: tall ? 64 : 64,
    safeRight: tall ? W - 150 : W - 64,
    midY: (safeTop + safeBottom) / 2,
    textY: tall ? 365 : 230,
    textX: tall ? (64 + W - 150) / 2 : W / 2,
    pick: (a, b) => (tall ? a : b),
  };
};
