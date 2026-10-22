/**
 * Impact effects: dust bursts that roll outward along the ground and a
 * shockwave ring, both fully determined by the frame number.
 */
import React, { useMemo } from "react";
import { random } from "remotion";
import * as THREE from "three";
import { WORLD_COLORS } from "../config";
import { makePuff } from "./textures";

export type Impact = {
  frame: number;
  x: number;
  z: number;
  /** Footprint half-width along x, metres. */
  spread: number;
  /** Overall size multiplier. */
  power: number;
};

const PUFFS = 34;
const DURATION = 40;

const DustBurst: React.FC<{
  impact: Impact;
  frame: number;
  texture: THREE.Texture;
}> = ({ impact, frame, texture }) => {
  const t = frame - impact.frame;
  const materials = useMemo(
    () =>
      Array.from(
        { length: PUFFS },
        () =>
          new THREE.SpriteMaterial({
            map: texture,
            color: WORLD_COLORS.dust,
            transparent: true,
            depthWrite: false,
          }),
      ),
    [texture],
  );
  if (t < 0 || t > DURATION) return null;
  const p = t / DURATION;
  const ease = 1 - Math.pow(1 - p, 3);
  return (
    <group>
      {materials.map((mat, i) => {
        const key = `${impact.frame}-${i}`;
        // Puffs start along the footprint edge and roll outward.
        const along = (random(`${key}-a`) - 0.5) * 2 * impact.spread;
        const front = random(`${key}-f`) > 0.5 ? 1 : -1;
        const out = (2 + random(`${key}-o`) * 7) * impact.power * ease;
        const side =
          Math.sign(along) * Math.max(0, Math.abs(along) - impact.spread * 0.7);
        const x = impact.x + along + side * ease * 1.5;
        const z = impact.z + front * (1.4 + out);
        const y = 0.4 + random(`${key}-y`) * 1.6 * impact.power * ease;
        const size =
          (1.2 + random(`${key}-s`) * 2.2) * impact.power * (0.6 + ease);
        mat.opacity = 0.55 * (1 - p) * Math.min(1, t / 2);
        return (
          <sprite
            key={key}
            material={mat}
            position={[x, y, z]}
            scale={[size, size, 1]}
          />
        );
      })}
    </group>
  );
};

const Shockwave: React.FC<{ impact: Impact; frame: number }> = ({
  impact,
  frame,
}) => {
  const t = frame - impact.frame;
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#FFFFFF",
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  if (t < 0 || t > 16) return null;
  const p = t / 16;
  const r = (4 + p * 26) * impact.power;
  material.opacity = 0.5 * (1 - p);
  return (
    <mesh
      material={material}
      position={[impact.x, 0.06, impact.z - 1.2]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[r, r, r]}
    >
      <ringGeometry args={[0.92, 1, 72]} />
    </mesh>
  );
};

export const ImpactEffects: React.FC<{ impacts: Impact[]; frame: number }> = ({
  impacts,
  frame,
}) => {
  const texture = useMemo(() => makePuff(), []);
  return (
    <group>
      {impacts.map((impact) => (
        <React.Fragment key={impact.frame}>
          <DustBurst impact={impact} frame={frame} texture={texture} />
          <Shockwave impact={impact} frame={frame} />
        </React.Fragment>
      ))}
    </group>
  );
};
