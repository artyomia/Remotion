import React, { useLayoutEffect, useMemo, useRef } from "react";
import { random } from "remotion";
import * as THREE from "three";
import { CONTAINER_COLORS } from "../config";
import { makeCorrugation } from "./textures";

/** Standard container dimensions in metres. */
export const CONTAINER = { h: 2.59, w: 2.44, l40: 12.19, l20: 6.06 };

/**
 * A block of stacked containers, long side along world x.
 * (x, z) is the block's minimum corner on the ground.
 */
export type StackBlock = {
  x: number;
  z: number;
  bays: number;
  rows: number;
  minTiers: number;
  maxTiers: number;
  seed: string;
  /** Share of 20 ft boxes (0 to 1). */
  short?: number;
};

type Instance = {
  x: number;
  y: number;
  z: number;
  len: 40 | 20;
  color: string;
};

const buildInstances = (blocks: StackBlock[]): Instance[] => {
  const out: Instance[] = [];
  blocks.forEach((b) => {
    for (let bay = 0; bay < b.bays; bay++) {
      for (let row = 0; row < b.rows; row++) {
        const key = `${b.seed}-${bay}-${row}`;
        const tiers =
          b.minTiers +
          Math.floor(random(`${key}-t`) * (b.maxTiers - b.minTiers + 1));
        const isShort = random(`${key}-s`) < (b.short ?? 0.15);
        for (let t = 0; t < tiers; t++) {
          const color =
            CONTAINER_COLORS[
              Math.floor(random(`${key}-c-${t}`) * CONTAINER_COLORS.length)
            ];
          const baseX = b.x + bay * (CONTAINER.l40 + 0.7);
          const z = b.z + row * (CONTAINER.w + 0.1) + CONTAINER.w / 2;
          const y = t * CONTAINER.h + CONTAINER.h / 2;
          if (isShort) {
            // Two 20 ft boxes fill one 40 ft slot.
            out.push({ x: baseX + CONTAINER.l20 / 2, y, z, len: 20, color });
            out.push({
              x: baseX + CONTAINER.l20 * 1.5 + 0.07,
              y,
              z,
              len: 20,
              color:
                CONTAINER_COLORS[
                  Math.floor(random(`${key}-c2-${t}`) * CONTAINER_COLORS.length)
                ],
            });
          } else {
            out.push({ x: baseX + CONTAINER.l40 / 2, y, z, len: 40, color });
          }
        }
      }
    }
  });
  return out;
};

/** Materials for one container length: sides, ends and roof get their own rib count. */
const useContainerMaterials = (len: number) =>
  useMemo(() => {
    const side = makeCorrugation(true);
    side.repeat.set(Math.round(len * 3.6), 1);
    const end = makeCorrugation(true);
    end.repeat.set(9, 1);
    const roof = makeCorrugation(false);
    roof.repeat.set(Math.round(len * 2), 1);
    const mat = (map: THREE.Texture) =>
      new THREE.MeshStandardMaterial({
        map,
        bumpMap: map,
        bumpScale: 0.6,
        roughness: 0.72,
        metalness: 0.12,
      });
    const e = mat(end);
    const r = mat(roof);
    const s = mat(side);
    // BoxGeometry groups: +x, -x, +y, -y, +z, -z
    return [e, e, r, r, s, s];
  }, [len]);

const InstancedContainers: React.FC<{ items: Instance[]; len: number }> = ({
  items,
  len,
}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(
    () => new THREE.BoxGeometry(len, CONTAINER.h - 0.04, CONTAINER.w),
    [len],
  );
  const materials = useContainerMaterials(len);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    items.forEach((it, i) => {
      m.makeTranslation(it.x, it.y, it.z);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.set(it.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);
  if (items.length === 0) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, materials, items.length]}
      castShadow
      receiveShadow
    />
  );
};

/** All stacks for a set of blocks, deterministic per seed. */
export const ContainerStacks: React.FC<{ blocks: StackBlock[] }> = ({
  blocks,
}) => {
  const items = useMemo(() => buildInstances(blocks), [blocks]);
  const long = useMemo(() => items.filter((i) => i.len === 40), [items]);
  const short = useMemo(() => items.filter((i) => i.len === 20), [items]);
  return (
    <group>
      <InstancedContainers items={long} len={CONTAINER.l40} />
      <InstancedContainers items={short} len={CONTAINER.l20} />
    </group>
  );
};
