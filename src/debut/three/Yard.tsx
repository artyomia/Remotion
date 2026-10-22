/**
 * The PAD container yard: concrete apron with markings, stacked container
 * blocks around an open stage, bay signs, sun and sky light.
 */
import React, { useMemo } from "react";
import * as THREE from "three";
import { ContainerStacks, StackBlock } from "./ContainerStacks";
import { makeBaySign, makeGround } from "./textures";

/** Stacks framing the logo stage (open apron x -36..38, z -14..22). */
export const STAGE_BLOCKS: StackBlock[] = [
  // Back wall, tall
  { x: -76, z: -44, bays: 12, rows: 7, minTiers: 3, maxTiers: 6, seed: "back" },
  // Second line behind, lower
  { x: -64, z: -26, bays: 4, rows: 4, minTiers: 2, maxTiers: 4, seed: "back2" },
  { x: 22, z: -26, bays: 4, rows: 4, minTiers: 2, maxTiers: 4, seed: "back3" },
  // Sides
  { x: -90, z: -14, bays: 4, rows: 10, minTiers: 2, maxTiers: 5, seed: "left" },
  { x: 38, z: -14, bays: 4, rows: 10, minTiers: 2, maxTiers: 5, seed: "right" },
  // Foreground sides for depth in 3/4 shots
  { x: 40, z: 22, bays: 3, rows: 6, minTiers: 1, maxTiers: 4, seed: "frontR" },
  { x: -80, z: 22, bays: 3, rows: 6, minTiers: 1, maxTiers: 4, seed: "frontL" },
];

const BaySign: React.FC<{
  label: string;
  position: [number, number, number];
}> = ({ label, position }) => {
  const tex = useMemo(() => makeBaySign(label), [label]);
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color="#E8B50A" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.6, 8]} />
        <meshStandardMaterial color="#E9ECEF" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 3.1, 0.04]}>
        <planeGeometry args={[0.9, 0.68]} />
        <meshStandardMaterial map={tex} roughness={0.5} />
      </mesh>
    </group>
  );
};

export const Yard: React.FC<{ blocks?: StackBlock[] }> = ({
  blocks = STAGE_BLOCKS,
}) => {
  const ground = useMemo(() => {
    const t = makeGround();
    t.repeat.set(10, 10);
    return t;
  }, []);

  // A sun high and to the front-left keeps the letters' faces lit.
  const sun = useMemo(() => {
    const light = new THREE.DirectionalLight("#FFF1DC", 2.6);
    light.position.set(-45, 70, 55);
    light.castShadow = true;
    light.shadow.mapSize.set(4096, 4096);
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    cam.left = -90;
    cam.right = 90;
    cam.top = 90;
    cam.bottom = -90;
    cam.near = 1;
    cam.far = 300;
    light.shadow.bias = -0.0004;
    light.shadow.normalBias = 0.04;
    return light;
  }, []);

  return (
    <group>
      <hemisphereLight args={["#CFE3F7", "#B9AE98", 1.15]} />
      <ambientLight intensity={0.15} />
      <primitive object={sun} />
      <primitive object={sun.target} />

      {/* Marked apron and a plain outer ground out to the horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial map={ground} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[6000, 6000]} />
        <meshStandardMaterial color="#CFCAC0" roughness={1} />
      </mesh>

      <ContainerStacks blocks={blocks} />
      <BaySign label="1C" position={[-19, 0, 6]} />
      <BaySign label="1D" position={[19.5, 0, 7]} />
    </group>
  );
};
