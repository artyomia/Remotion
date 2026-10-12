import { useVideoConfig } from "remotion";
import { LAYOUT } from "../brand";

export type Layout = {
  width: number;
  height: number;
  isVertical: boolean;
  /** Safe side margin: 120px landscape, 60px vertical. */
  margin: number;
  /** Width available between the side margins. */
  contentWidth: number;
  headerTop: number;
  headerLogoHeight: number;
  /** Distance from the bottom edge to the footer label baseline area. */
  footerBottom: number;
  /** Picks the landscape or vertical value. */
  pick: <T>(landscape: T, vertical: T) => T;
};

/** Responsive layout values shared by both compositions. */
export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const key = isVertical ? "vertical" : "landscape";
  const margin = LAYOUT.margin[key];
  return {
    width,
    height,
    isVertical,
    margin,
    contentWidth: width - margin * 2,
    headerTop: LAYOUT.headerTop[key],
    headerLogoHeight: LAYOUT.headerLogoHeight[key],
    footerBottom: LAYOUT.footerBottom[key],
    pick: (landscape, vertical) => (isVertical ? vertical : landscape),
  };
};
