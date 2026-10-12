/**
 * Parametric P, A, D letterforms in logo units (monogram height 300).
 *
 * Each letter is drawn from one path template. With t = 1 the template gives
 * the exact final letter; with t = 0 the inner cuts collapse and the same
 * template becomes a plain primitive (rounded rectangle or triangle). Because
 * the command list never changes, any t in between is a clean "carving"
 * morph from primitive to letter.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f = (n: number) => Math.round(n * 100) / 100;

const H = 300;
const R = 100; // outer corner radius, equal to the x unit
const R_IN = 12.7; // inner corner radius of the slots

/** Mid-height of the slots, where the cuts start from when t = 0. */
const SLOT_SEED = 109;

/* P: rounded rectangle carved by the open slot and the lower-right notch. */
const P_FINAL = {
  right: 393.8,
  bowlBottom: 217.2,
  stemRight: 103.1,
  slotTop: 82.8,
  slotBottom: 135.2,
  slotRight: 290.7,
};

export const pPath = (t: number) => {
  const bowlBottom = lerp(H, P_FINAL.bowlBottom, t);
  const slotTop = lerp(SLOT_SEED, P_FINAL.slotTop, t);
  const slotBottom = lerp(SLOT_SEED, P_FINAL.slotBottom, t);
  const slotRight = lerp(0, P_FINAL.slotRight, t);
  const r = Math.min(R_IN * t, slotRight / 2, (slotBottom - slotTop) / 2);
  const { right, stemRight } = P_FINAL;
  return [
    `M0 0H${f(right - R)}`,
    `A${R} ${R} 0 0 1 ${f(right)} ${R}`,
    `V${f(bowlBottom - R)}`,
    `A${R} ${R} 0 0 1 ${f(right - R)} ${f(bowlBottom)}`,
    `H${stemRight}V${H}H0V${f(slotBottom)}`,
    `H${f(slotRight - r)}`,
    `A${f(r)} ${f(r)} 0 0 0 ${f(slotRight)} ${f(slotBottom - r)}`,
    `V${f(slotTop + r)}`,
    `A${f(r)} ${f(r)} 0 0 0 ${f(slotRight - r)} ${f(slotTop)}`,
    "H0Z",
  ].join("");
};

/* A: flat-topped triangle carved by the counter and the foot gap. */
const A_OUTER = [
  [313, 300],
  [488.9, 0],
  [533.7, 0],
  [709.6, 300],
] as const;
const A_INNER_FINAL = [
  [461.1, 300],
  [494.8, 242.5],
  [592.6, 242.5],
  [511.3, 103.9],
  [396.3, 300],
] as const;
const A_INNER_SEED = [428.7, 300] as const;

export const aPath = (t: number) => {
  const inner = A_INNER_FINAL.map(([x, y]) => [
    lerp(A_INNER_SEED[0], x, t),
    lerp(A_INNER_SEED[1], y, t),
  ]);
  const pts = [...A_OUTER, ...inner];
  return `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z`;
};

/* D: rounded rectangle carved by the slot and the counter. */
const D_FINAL = {
  left: 719.2,
  right: 1112.5,
  stemRight: 822.2,
  counterRight: 1009.4,
  counterBottom: 217.6,
  slotTop: 82.8,
  slotBottom: 135.2,
};

export const dPath = (t: number) => {
  const { left, right } = D_FINAL;
  const stemRight = lerp(left, D_FINAL.stemRight, t);
  const counterRight = lerp(left, D_FINAL.counterRight, t);
  const counterBottom = lerp(SLOT_SEED, D_FINAL.counterBottom, t);
  const slotTop = lerp(SLOT_SEED, D_FINAL.slotTop, t);
  const slotBottom = lerp(SLOT_SEED, D_FINAL.slotBottom, t);
  const r = Math.min(
    R_IN * t,
    (counterRight - stemRight) / 2,
    (counterBottom - slotTop) / 2,
  );
  return [
    `M${left} 0H${f(right - R)}`,
    `A${R} ${R} 0 0 1 ${right} ${R}`,
    `V${H - R}`,
    `A${R} ${R} 0 0 1 ${f(right - R)} ${H}`,
    `H${left}V${f(slotBottom)}H${f(stemRight)}V${f(counterBottom)}`,
    `H${f(counterRight - r)}`,
    `A${f(r)} ${f(r)} 0 0 0 ${f(counterRight)} ${f(counterBottom - r)}`,
    `V${f(slotTop + r)}`,
    `A${f(r)} ${f(r)} 0 0 0 ${f(counterRight - r)} ${f(slotTop)}`,
    `H${left}Z`,
  ].join("");
};

/** Bounding boxes of the three letters (logo units), used for fly-in paths. */
export const LETTER_BOXES = {
  P: { x: 0, y: 0, width: 393.8, height: 300 },
  A: { x: 313, y: 0, width: 396.6, height: 300 },
  D: { x: 719.2, y: 0, width: 393.3, height: 300 },
} as const;

export const P_PATH = pPath(1);
export const A_PATH = aPath(1);
export const D_PATH = dPath(1);
