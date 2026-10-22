/**
 * The PAD monogram as giant container-letters: each letter is extruded from
 * the exact logo geometry to a container's width and clad in corrugated
 * steel. Driving `morph` carves the primitive blocks into the final letters.
 */
import React, { useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { COLORS } from "../../brand";
import { aPath, dPath, pPath } from "../../logo/monogram";
import { LETTER_DEPTH, MONO_X0, M_PER_UNIT } from "../config";
import { makeCorrugation } from "./textures";

const DEPTH_UNITS = LETTER_DEPTH / M_PER_UNIT;
const loader = new SVGLoader();

/** SVG path (logo units, y down) to y-up shapes with the base on y = 0. */
const shapesFromPath = (d: string) => {
  const data = loader.parse(
    `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`,
  );
  const out: THREE.Shape[] = [];
  data.paths.forEach((p) =>
    p.toShapes().forEach((shape) => {
      const { shape: outer, holes } = shape.extractPoints(18);
      const flip = (pts: THREE.Vector2[]) =>
        pts.map((v) => new THREE.Vector2(v.x, 300 - v.y)).reverse();
      const s = new THREE.Shape(flip(outer));
      holes.forEach((h) => s.holes.push(new THREE.Path(flip(h))));
      out.push(s);
    }),
  );
  return out;
};

const geometryCache = new Map<string, THREE.ExtrudeGeometry>();

/** Extruded letter geometry, cached per letter and morph step. */
const letterGeometry = (letter: "P" | "A" | "D", morph: number) => {
  const step = Math.round(Math.max(0, Math.min(1, morph)) * 40) / 40;
  const key = `${letter}-${step}`;
  const cached = geometryCache.get(key);
  if (cached) return cached;
  const d =
    letter === "P"
      ? pPath(step, { keepNotch: true })
      : letter === "A"
        ? aPath(step)
        : dPath(step);
  const geo = new THREE.ExtrudeGeometry(shapesFromPath(d), {
    depth: DEPTH_UNITS,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 1.6,
    bevelOffset: -1.6,
    bevelSegments: 2,
    curveSegments: 18,
  });
  geometryCache.set(key, geo);
  return geo;
};

export type LetterState = {
  /** Offset from the letter's slot in metres. */
  offset: [number, number, number];
  morph: number;
  visible: boolean;
};

const useLetterMaterial = (color: string) =>
  useMemo(() => {
    const ribs = makeCorrugation(false);
    // Caps use logo units as UVs: one rib every 15 units (0.4 m).
    ribs.repeat.set(1 / 15, 1 / 300);
    return new THREE.MeshStandardMaterial({
      color,
      map: ribs,
      bumpMap: ribs,
      bumpScale: 0.8,
      roughness: 0.5,
      metalness: 0.2,
    });
  }, [color]);

export const LetterBlocks: React.FC<{
  P: LetterState;
  A: LetterState;
  D: LetterState;
  /** Uniform "pop" scale about the monogram centre. */
  pop?: number;
}> = ({ P, A, D, pop = 1 }) => {
  const blue = useLetterMaterial(COLORS.blue);
  const orange = useLetterMaterial(COLORS.orange);
  const center = new THREE.Vector3(0, 150 * M_PER_UNIT, -LETTER_DEPTH / 2);

  const letter = (key: "P" | "A" | "D", s: LetterState, mat: THREE.Material) =>
    s.visible ? (
      <mesh
        key={key}
        geometry={letterGeometry(key, s.morph)}
        material={mat}
        position={[
          MONO_X0 + s.offset[0] - center.x,
          s.offset[1] - center.y,
          -LETTER_DEPTH + s.offset[2] - center.z,
        ]}
        scale={M_PER_UNIT}
        castShadow
        receiveShadow
      />
    ) : null;

  return (
    <group position={center} scale={pop}>
      {letter("P", P, blue)}
      {letter("A", A, blue)}
      {letter("D", D, orange)}
    </group>
  );
};
