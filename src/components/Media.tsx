import React from "react";
import { Img, staticFile } from "remotion";
import { hasPublicFile } from "../lib/assets";

export type MediaProps = {
  /** File name in public/. */
  file: string;
  /** Rendered when the file is not in public/ yet. Receives the box size. */
  fallback: (size: { width: number; height: number }) => React.ReactNode;
  width: number;
  height: number;
  /** Ken Burns zoom factor (1 to 1.08 over the shot). */
  zoom?: number;
  /** Zoom origin, e.g. "50% 50%". */
  origin?: string;
  style?: React.CSSProperties;
};

/**
 * A photo from public/ with a slow Ken Burns zoom. When the photo has not been
 * supplied, the built-in vector illustration is shown in the same frame so
 * the film always renders.
 */
export const Media: React.FC<MediaProps> = ({
  file,
  fallback,
  width,
  height,
  zoom = 1,
  origin = "50% 50%",
  style,
}) => {
  const hasFile = hasPublicFile(file);
  return (
    <div
      style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: origin,
        }}
      >
        {hasFile ? (
          <Img
            src={staticFile(file)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          fallback({ width, height })
        )}
      </div>
    </div>
  );
};
