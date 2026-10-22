/**
 * Procedural canvas textures for the 3D yard. Everything is drawn in code so
 * the scene renders identically in the Studio and in every render tab.
 */
import * as THREE from "three";
import { random } from "remotion";
import { COLORS } from "../../brand";
import { A_PATH, D_PATH, P_PATH } from "../../logo/monogram";
import { DEPOT_PATHS, LOCKUPS, PHUOC_PATHS } from "../../logo/paths";
import { WORLD_COLORS } from "../config";

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas unavailable");
  }
  return { c, ctx };
};

const finish = (c: HTMLCanvasElement, srgb = true) => {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  if (srgb) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
};

/**
 * Corrugated steel: one rib per texture tile along u. With `rails`, darker
 * top and bottom bands (container side rails) are added along v.
 */
export const makeCorrugation = (rails: boolean) => {
  const { c, ctx } = canvas(64, 64);
  for (let x = 0; x < 64; x++) {
    const t = x / 64;
    // Trapezoid profile: flat, slope, groove, slope.
    let v = 236;
    if (t > 0.42 && t < 0.5) v = 236 - (t - 0.42) * 600;
    else if (t >= 0.5 && t < 0.82) v = 188;
    else if (t >= 0.82 && t < 0.9) v = 188 + (t - 0.82) * 500;
    else if (t >= 0.9) v = 255;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, 0, 1, 64);
  }
  if (rails) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, 64, 4);
    ctx.fillRect(0, 59, 64, 5);
  }
  return finish(c);
};

/** Soft round puff for dust sprites. */
export const makePuff = () => {
  const { c, ctx } = canvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.5, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return finish(c);
};

/**
 * Concrete yard surface, one 40 x 40 m tile: subtle stains, white slot
 * outlines and painted bay numbers.
 */
export const makeGround = () => {
  const size = 1024;
  const { c, ctx } = canvas(size, size);
  ctx.fillStyle = WORLD_COLORS.concrete;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 260; i++) {
    const x = random(`g-x-${i}`) * size;
    const y = random(`g-y-${i}`) * size;
    const r = 6 + random(`g-r-${i}`) * 40;
    ctx.fillStyle = `rgba(90,80,70,${0.02 + random(`g-a-${i}`) * 0.04})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Paving joints every 5 m.
  ctx.strokeStyle = "rgba(120,110,100,0.18)";
  ctx.lineWidth = 2;
  for (let k = 0; k <= 8; k++) {
    const p = (k * size) / 8;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }
  // Container slot outlines (12.5 x 2.7 m) with bay numbers.
  const mpp = size / 40;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 3;
  for (let row = 0; row < 4; row++) {
    const y0 = (3 + row * 2.8) * mpp;
    ctx.strokeRect(4 * mpp, y0, 12.5 * mpp, 2.7 * mpp);
    ctx.strokeRect(22 * mpp, y0, 12.5 * mpp, 2.7 * mpp);
  }
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `bold ${Math.round(1.6 * mpp)}px sans-serif`;
  ctx.fillText("22", 1 * mpp, 5 * mpp);
  ctx.fillText("23", 19 * mpp, 5 * mpp);
  // Driving lane edge lines.
  ctx.fillRect(0, 20 * mpp, size, 0.18 * mpp);
  ctx.fillRect(0, 36 * mpp, size, 0.18 * mpp);
  return finish(c);
};

/** The white front plate on the reach stacker: "PHUOC AN DEPOT". */
export const makePlate = () => {
  const { c, ctx } = canvas(512, 128);
  ctx.fillStyle = WORLD_COLORS.plate;
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 506, 122);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 58px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PHUOC AN DEPOT", 256, 68);
  return finish(c);
};

/** Blue bay sign ("1C") as on the site, white lettering. */
export const makeBaySign = (label: string) => {
  const { c, ctx } = canvas(128, 96);
  ctx.fillStyle = WORLD_COLORS.signBlue;
  ctx.fillRect(0, 0, 128, 96);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, 120, 88);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 58px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 64, 52);
  return finish(c);
};

/**
 * PAD horizontal lockup as a decal (reversed: white + orange), drawn from
 * the same path data as the 2D logo.
 */
export const makeLogoDecal = (variant: "reversed" | "color") => {
  const lock = LOCKUPS.horizontal;
  const scale = 0.5;
  const pad = 40;
  const w = Math.round(lock.width * scale + pad * 2);
  const h = Math.round(lock.height * scale + pad * 2);
  const { c, ctx } = canvas(w, h);
  const primary = variant === "color" ? COLORS.blue : COLORS.white;
  ctx.translate(pad, pad);
  ctx.scale(scale, scale);
  ctx.fillStyle = primary;
  ctx.fill(new Path2D(P_PATH));
  ctx.fill(new Path2D(A_PATH));
  ctx.fillStyle = COLORS.orange;
  ctx.fill(new Path2D(D_PATH));
  ctx.save();
  ctx.translate(lock.phuoc.x, lock.phuoc.y);
  ctx.fillStyle = primary;
  PHUOC_PATHS.forEach((d) => ctx.fill(new Path2D(d)));
  ctx.restore();
  ctx.save();
  ctx.translate(lock.depot.x, lock.depot.y);
  ctx.fillStyle = COLORS.orange;
  DEPOT_PATHS.forEach((d) => ctx.fill(new Path2D(d)));
  ctx.restore();
  const tex = finish(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return { texture: tex, aspect: w / h };
};
