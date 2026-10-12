import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../brand";
import { SKEW_T } from "../lib/geometry";

/**
 * CSS clip-path for a diagonal wipe whose edge leans at the brand skew.
 * p = 0: nothing visible, p = 1: the whole frame is visible. The revealed
 * area grows from the right edge towards the left.
 */
export const skewedWipeClip = (p: number, width: number, height: number) => {
  const lean = height * SKEW_T;
  const bottomX = width + 2 - p * (width + lean + 4);
  return `polygon(${bottomX + lean}px 0px, ${width + lean + 2}px 0px, ${width + lean + 2}px ${height}px, ${bottomX}px ${height}px)`;
};

/** Position of the wipe edge, for drawing an accent line along it. */
export const skewedWipeEdge = (p: number, width: number, height: number) => {
  const lean = height * SKEW_T;
  const bottomX = width + 2 - p * (width + lean + 4);
  return { x1: bottomX + lean, y1: 0, x2: bottomX, y2: height };
};

type SkewedWipeProps = {
  width: number;
  height: number;
  /** Colour of the thin line riding the wipe edge. */
  edgeColor?: string;
};

const SkewedWipePresentation: React.FC<
  TransitionPresentationComponentProps<SkewedWipeProps>
> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const { width, height, edgeColor = COLORS.orange } = passedProps;
  const edge = skewedWipeEdge(presentationProgress, width, height);
  const showEdge = presentationProgress > 0 && presentationProgress < 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: skewedWipeClip(presentationProgress, width, height),
        }}
      >
        {children}
      </AbsoluteFill>
      {showEdge ? (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0 }}
        >
          <line {...edge} stroke={edgeColor} strokeWidth={4} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * Custom @remotion/transitions presentation: a diagonal wipe leaning at the
 * brand skew (-20 degrees) with a thin orange line riding the edge.
 */
export const skewedWipe = (
  props: SkewedWipeProps,
): TransitionPresentation<SkewedWipeProps> => ({
  component: SkewedWipePresentation,
  props,
});
