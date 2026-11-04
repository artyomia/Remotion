/**
 * Animatable 2D "rigs" for the social debut: a reach stacker with a working
 * boom and spreader, a tractor unit with trailer, a yard worker and a
 * container door end. All are SVG groups in their own local units; place
 * them with a transform. Ground is y = 0 and up is negative y.
 */
import React from "react";
import { COLORS, FONTS } from "../../brand";
import { ContainerSide } from "../../illustrations/kit";
import { LogoAt, routeD } from "../../illustrations/Mockups";
import { STACKER, TRUCK } from "../timeline";

/* -------------------------------------------------------------------------- */
/* Wheel                                                                       */
/* -------------------------------------------------------------------------- */

/** Wheel with visible lug holes so its rotation reads on screen. */
export const RotWheel: React.FC<{
  cx: number;
  cy: number;
  r: number;
  angle: number;
}> = ({ cx, cy, r, angle }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <circle r={r} fill="#15171B" />
    <circle r={r * 0.86} fill="none" stroke="#24272C" strokeWidth={r * 0.06} />
    <g transform={`rotate(${angle})`}>
      <circle r={r * 0.56} fill="#9AA2AC" />
      <circle r={r * 0.46} fill="#7D8692" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r * 0.32}
            cy={Math.sin(a) * r * 0.32}
            r={r * 0.06}
            fill="#4A525E"
          />
        );
      })}
      <rect
        x={-r * 0.5}
        y={-r * 0.035}
        width={r}
        height={r * 0.07}
        fill="#5E6773"
        opacity={0.6}
      />
    </g>
    <circle r={r * 0.16} fill="#C5CCD5" />
  </g>
);

/* -------------------------------------------------------------------------- */
/* Reach stacker                                                               */
/* -------------------------------------------------------------------------- */

export const STACKER_GEOM = {
  pivot: { x: 560, y: -380 },
  boomLength: 820,
  maxExtension: 420,
  /** Distance from the boom tip to the underside of the spreader. */
  tipToSpreader: 78,
};

/** Boom tip position for a given pose (machine-local units). */
export const stackerTip = (boomAngleDeg: number, extension: number) => {
  const a = (boomAngleDeg * Math.PI) / 180;
  const len = STACKER_GEOM.boomLength + extension * STACKER_GEOM.maxExtension;
  return {
    x: STACKER_GEOM.pivot.x - Math.cos(a) * len,
    y: STACKER_GEOM.pivot.y - Math.sin(a) * len,
  };
};

export type StackerPose = {
  /** Boom elevation above horizontal, degrees (the boom points left). */
  boomAngle: number;
  /** Telescopic extension, 0 to 1. */
  extension: number;
  /** Wheel rotation, degrees. */
  wheel: number;
  /** Body pitch in degrees (braking dive), about the front wheel. */
  pitch?: number;
  /** Spreader width in local units. */
  spreaderWidth?: number;
  /** Container carried under the spreader, if any. */
  container?: { color: string; w: number; h: number; branded?: boolean };
  /** Amber beacon brightness, 0 to 1. */
  beacon?: number;
  branded?: boolean;
  /** Set when a parent flips the rig horizontally; keeps logos readable. */
  mirrored?: boolean;
  patternId: string;
};

/** Undo a parent's horizontal flip around x = cx, so artwork stays readable. */
const Unflip: React.FC<{
  on: boolean;
  cx: number;
  children: React.ReactNode;
}> = ({ on, cx, children }) =>
  on ? (
    <g transform={`translate(${cx} 0) scale(-1 1) translate(${-cx} 0)`}>
      {children}
    </g>
  ) : (
    <>{children}</>
  );

/**
 * Reach stacker in profile, front (load side) to the left. Colours follow
 * PAD's machines: red body, black boom and spreader.
 */
export const ReachStackerRig: React.FC<StackerPose> = ({
  boomAngle,
  extension,
  wheel,
  pitch = 0,
  spreaderWidth = 560,
  container,
  beacon = 0,
  branded = false,
  mirrored = false,
  patternId,
}) => {
  const a = (boomAngle * Math.PI) / 180;
  const dx = -Math.cos(a);
  const dy = -Math.sin(a);
  const nx = -dy;
  const ny = dx;
  const { pivot, boomLength } = STACKER_GEOM;
  const tip = stackerTip(boomAngle, extension);
  const seg = (from: number, to: number, half: number) => {
    const p0 = { x: pivot.x + dx * from, y: pivot.y + dy * from };
    const p1 = { x: pivot.x + dx * to, y: pivot.y + dy * to };
    return `M${p0.x + nx * half} ${p0.y + ny * half}L${p1.x + nx * half} ${p1.y + ny * half}L${p1.x - nx * half} ${p1.y - ny * half}L${p0.x - nx * half} ${p0.y - ny * half}Z`;
  };
  const ext = extension * STACKER_GEOM.maxExtension;
  const cylA = { x: 210, y: -270 };
  const cylB = {
    x: pivot.x + dx * boomLength * 0.42,
    y: pivot.y + dy * boomLength * 0.42,
  };
  const sw = spreaderWidth;
  return (
    <g transform={`rotate(${pitch} 0 0)`}>
      {/* Telescopic boom: inner section, then the outer section over it */}
      <path
        d={seg(boomLength * 0.55, boomLength + ext, 26)}
        fill={STACKER.boomHighlight}
      />
      <path d={seg(-70, boomLength, 36)} fill={STACKER.boom} />
      <path
        d={seg(-70, boomLength, 6)}
        fill={STACKER.boomHighlight}
        opacity={0.5}
        transform={`translate(${nx * -22} ${ny * -22})`}
      />
      {/* Lift cylinder */}
      <line
        x1={cylA.x}
        y1={cylA.y}
        x2={cylB.x}
        y2={cylB.y}
        stroke="#B8C0CA"
        strokeWidth={12}
        strokeLinecap="round"
      />
      <line
        x1={cylA.x}
        y1={cylA.y}
        x2={cylA.x + (cylB.x - cylA.x) * 0.58}
        y2={cylA.y + (cylB.y - cylA.y) * 0.58}
        stroke="#3A3E46"
        strokeWidth={30}
        strokeLinecap="round"
      />
      {/* Spreader hanging from the tip, always level */}
      <rect
        x={tip.x - 34}
        y={tip.y - 6}
        width={68}
        height={50}
        rx={8}
        fill={STACKER.chassis}
      />
      <rect
        x={tip.x - sw / 2}
        y={tip.y + 44}
        width={sw}
        height={30}
        rx={5}
        fill={STACKER.chassis}
      />
      <rect
        x={tip.x - sw / 2 - 8}
        y={tip.y + 40}
        width={30}
        height={38}
        rx={5}
        fill="#F2B21B"
      />
      <rect
        x={tip.x + sw / 2 - 22}
        y={tip.y + 40}
        width={30}
        height={38}
        rx={5}
        fill="#F2B21B"
      />
      {container ? (
        <g>
          <ContainerSide
            x={tip.x - container.w / 2}
            y={tip.y + STACKER_GEOM.tipToSpreader - 4}
            w={container.w}
            h={container.h}
            color={container.color}
            patternId={patternId}
          />
          {container.branded ? (
            <Unflip on={mirrored} cx={tip.x}>
              <LogoAt
                x={tip.x - container.w / 2 + container.w * 0.08}
                y={tip.y + STACKER_GEOM.tipToSpreader + container.h * 0.3}
                height={container.h * 0.3}
                variant="reversed"
              />
            </Unflip>
          ) : null}
        </g>
      ) : null}

      {/* Chassis, wheel wells */}
      <rect
        x={-120}
        y={-160}
        width={810}
        height={84}
        rx={10}
        fill={STACKER.chassis}
      />
      {/* Front body */}
      <rect
        x={-140}
        y={-280}
        width={580}
        height={130}
        rx={20}
        fill={STACKER.body}
      />
      {/* Counterweight and engine hood */}
      <path
        d="M400 -150V-340Q400 -372 432 -372H650Q706 -372 706 -316V-150Z"
        fill={STACKER.body}
      />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={560}
          y={-330 + i * 22}
          width={118}
          height={9}
          rx={4}
          fill={STACKER.bodyShade}
        />
      ))}
      <rect
        x={-140}
        y={-186}
        width={846}
        height={36}
        fill={STACKER.bodyShade}
      />
      {/* Plate on the body side */}
      <rect
        x={-118}
        y={-262}
        width={368}
        height={64}
        rx={8}
        fill={STACKER.plate}
      />
      {branded ? (
        <Unflip on={mirrored} cx={66}>
          <LogoAt x={-89} y={-250} height={40} />
        </Unflip>
      ) : (
        <g fill="#B9BEC6">
          <rect x={-94} y={-244} width={150} height={9} rx={4} />
          <rect x={-94} y={-226} width={100} height={9} rx={4} />
        </g>
      )}
      {/* Cab */}
      <rect
        x={112}
        y={-488}
        width={204}
        height={18}
        rx={6}
        fill={STACKER.cab}
      />
      <rect
        x={120}
        y={-474}
        width={186}
        height={196}
        rx={10}
        fill={STACKER.cab}
      />
      <rect
        x={134}
        y={-460}
        width={158}
        height={168}
        rx={6}
        fill={STACKER.glass}
      />
      <path d="M134 -460H200L134 -380Z" fill={COLORS.white} opacity={0.25} />
      <circle
        cx={292}
        cy={-500}
        r={12}
        fill={STACKER.beacon}
        opacity={0.5 + beacon * 0.5}
      />
      {beacon > 0 ? (
        <circle
          cx={292}
          cy={-500}
          r={70}
          fill={STACKER.beacon}
          opacity={0.25 * beacon}
        />
      ) : null}
      {/* Wheels */}
      <circle cx={0} cy={-82} r={98} fill={STACKER.chassis} />
      <circle cx={560} cy={-66} r={80} fill={STACKER.chassis} />
      <RotWheel cx={0} cy={-82} r={82} angle={wheel} />
      <RotWheel cx={560} cy={-66} r={66} angle={wheel * 1.24} />
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/* Truck                                                                       */
/* -------------------------------------------------------------------------- */

/** Tractor unit with a 40ft container on its trailer, facing right. */
export const TruckRig: React.FC<{
  wheel: number;
  containerColor: string;
  patternId: string;
  branded?: boolean;
  headlight?: number;
}> = ({ wheel, containerColor, patternId, branded = false, headlight = 1 }) => (
  <g>
    {/* Trailer */}
    <rect x={0} y={-118} width={1030} height={26} fill={TRUCK.chassis} />
    <rect x={70} y={-112} width={310} height={14} fill={TRUCK.chassis} />
    <rect x={720} y={-92} width={14} height={50} fill={TRUCK.chassis} />
    <ContainerSide
      x={8}
      y={-392}
      w={1010}
      h={274}
      color={containerColor}
      patternId={patternId}
    />
    {branded ? (
      <g>
        <LogoAt x={70} y={-340} height={86} variant="reversed" />
        <text
          x={76}
          y={-166}
          fontFamily={FONTS.body}
          fontWeight={600}
          fontSize={22}
          letterSpacing={3}
          fill={COLORS.white}
          opacity={0.85}
        >
          www.phuocandepot.vn
        </text>
        <path
          d={routeD(8, -136, 640, 70, 1018)}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={6}
        />
      </g>
    ) : null}
    {/* Tractor */}
    <rect x={980} y={-112} width={384} height={28} fill={TRUCK.chassis} />
    <rect x={1000} y={-128} width={112} height={16} fill="#2E3238" />
    <rect x={1150} y={-486} width={12} height={250} rx={4} fill="#8B97A8" />
    <path
      d="M1170 -110V-398Q1170 -432 1204 -432H1298L1346 -402Q1356 -394 1356 -380V-110Z"
      fill={TRUCK.cab}
    />
    <rect x={1170} y={-160} width={186} height={50} fill={TRUCK.cabShade} />
    <rect x={1170} y={-152} width={186} height={12} fill={COLORS.orange} />
    <rect x={1236} y={-394} width={96} height={92} rx={8} fill={TRUCK.glass} />
    <path d="M1236 -394H1280L1236 -350Z" fill={COLORS.white} opacity={0.3} />
    <rect
      x={1230}
      y={-400}
      width={110}
      height={262}
      rx={8}
      fill="none"
      stroke={TRUCK.cabShade}
      strokeWidth={3}
    />
    {branded ? (
      <LogoAt
        x={1238}
        y={-262}
        height={52}
        lockup="vertical"
        variant="reversed"
      />
    ) : null}
    <rect x={1182} y={-200} width={44} height={40} rx={6} fill="#AEB8C6" />
    <rect
      x={1342}
      y={-196}
      width={34}
      height={92}
      rx={6}
      fill={TRUCK.chassis}
    />
    <rect x={1352} y={-182} width={22} height={18} rx={4} fill="#FFF4DD" />
    {headlight > 0 ? (
      <g opacity={headlight}>
        <circle cx={1370} cy={-173} r={60} fill="#FFE6BF" opacity={0.25} />
        <path
          d="M1374 -182L1900 -230V-110L1374 -164Z"
          fill="#FFE6BF"
          opacity={0.12}
        />
      </g>
    ) : null}
    {/* Wheels */}
    {[120, 225, 330].map((x) => (
      <RotWheel key={x} cx={x} cy={-50} r={50} angle={wheel} />
    ))}
    {[1062, 1166, 1300].map((x) => (
      <RotWheel key={x} cx={x} cy={-52} r={52} angle={wheel} />
    ))}
  </g>
);

/* -------------------------------------------------------------------------- */
/* Worker                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Yard worker in hard hat and hi-vis vest, front view, feet at (0, 0).
 * `wave` is the raised arm's angle from hanging (0) to overhead (~165).
 */
export const WorkerRig: React.FC<{
  wave: number;
  branded?: boolean;
  /** Reflective strips flare when light hits them, 0 to 1. */
  flare?: number;
}> = ({ wave, branded = false, flare = 0 }) => {
  const skin = "#C98E68";
  const navy = "#13254A";
  const strip = flare > 0 ? "#F4F7FB" : "#C9D1DC";
  return (
    <g>
      {/* Legs and boots */}
      <rect x={-72} y={-450} width={60} height={420} rx={20} fill={navy} />
      <rect x={12} y={-450} width={60} height={420} rx={20} fill={navy} />
      <rect x={-80} y={-48} width={74} height={48} rx={14} fill="#1A1C20" />
      <rect x={6} y={-48} width={74} height={48} rx={14} fill="#1A1C20" />
      {/* Hanging arm with radio (viewer's right) */}
      <g transform="rotate(-8 118 -760)">
        <rect x={98} y={-772} width={52} height={300} rx={24} fill={navy} />
        <rect x={98} y={-540} width={52} height={18} fill={strip} />
        <circle cx={124} cy={-460} r={28} fill="#E7DFC4" />
        <rect x={108} y={-500} width={34} height={70} rx={6} fill="#1A1C20" />
        <rect x={130} y={-536} width={6} height={40} rx={3} fill="#1A1C20" />
      </g>
      {/* Torso and vest */}
      <rect x={-125} y={-792} width={250} height={380} rx={48} fill={navy} />
      <path
        d="M-125 -752Q-125 -792 -92 -792H-42L0 -676L42 -792H92Q125 -792 125 -752V-412H-125Z"
        fill={COLORS.orange}
      />
      <rect x={-96} y={-792} width={26} height={240} fill={strip} />
      <rect x={70} y={-792} width={26} height={240} fill={strip} />
      <rect x={-125} y={-560} width={250} height={28} fill={strip} />
      <rect x={-125} y={-500} width={250} height={28} fill={strip} />
      <line
        x1={0}
        y1={-676}
        x2={0}
        y2={-412}
        stroke="#C85300"
        strokeWidth={4}
      />
      {branded ? (
        <g>
          <rect
            x={14}
            y={-740}
            width={104}
            height={34}
            rx={6}
            fill={COLORS.navy}
          />
          <LogoAt x={21} y={-731} height={14} variant="reversed" />
        </g>
      ) : null}
      {/* Raised, waving arm (viewer's left) */}
      <g transform={`rotate(${wave} -118 -760)`}>
        <rect x={-144} y={-772} width={52} height={310} rx={24} fill={navy} />
        <rect x={-144} y={-540} width={52} height={18} fill={strip} />
        <circle cx={-118} cy={-452} r={30} fill="#E7DFC4" />
      </g>
      {/* Head and hard hat */}
      <rect x={-24} y={-830} width={48} height={50} rx={12} fill={skin} />
      <circle cx={0} cy={-884} r={64} fill={skin} />
      <path d="M-84 -892A84 80 0 0 1 84 -892Z" fill={COLORS.white} />
      <rect
        x={-12}
        y={-970}
        width={24}
        height={78}
        rx={10}
        fill={COLORS.orange}
      />
      <ellipse cx={0} cy={-890} rx={100} ry={14} fill="#EEF1F5" />
      {branded ? <LogoAt x={-56} y={-942} height={14} /> : null}
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/* Container door end                                                          */
/* -------------------------------------------------------------------------- */

/**
 * One container door (half of a container end), drawn in a w x h box.
 * `side` is the hinge side. `handle` turns the lock handles (0 = locked,
 * 1 = released).
 */
export const ContainerDoor: React.FC<{
  w: number;
  h: number;
  side: "left" | "right";
  color: string;
  handle?: number;
  code?: boolean;
  ribId: string;
}> = ({ w, h, side, color, handle = 0, code = false, ribId }) => {
  const bars = side === "left" ? [0.3, 0.72] : [0.28, 0.7];
  const hingeX = side === "left" ? 0 : w - 16;
  return (
    <g>
      <rect width={w} height={h} fill={color} />
      <rect width={w} height={h} fill={`url(#${ribId})`} />
      <rect
        x={side === "left" ? w - 6 : 0}
        width={6}
        height={h}
        fill="#000"
        opacity={0.35}
      />
      {[0.12, 0.5, 0.88].map((t) => (
        <rect
          key={t}
          x={hingeX}
          y={h * t - 22}
          width={16}
          height={44}
          rx={4}
          fill="#000"
          opacity={0.3}
        />
      ))}
      {bars.map((t) => {
        const x = w * t;
        const ang = side === "left" ? -handle * 80 : handle * 80;
        return (
          <g key={t}>
            <rect
              x={x - 11}
              y={0}
              width={22}
              height={h}
              rx={8}
              fill="#B8C1CC"
            />
            <rect
              x={x - 4}
              y={0}
              width={5}
              height={h}
              fill={COLORS.white}
              opacity={0.45}
            />
            {[0.03, 0.97].map((k) => (
              <rect
                key={k}
                x={x - 22}
                y={h * k - 18}
                width={44}
                height={36}
                rx={6}
                fill="#7D8794"
              />
            ))}
            <rect
              x={x - 20}
              y={h * 0.58 - 12}
              width={40}
              height={24}
              rx={5}
              fill="#7D8794"
            />
            <g transform={`rotate(${ang} ${x} ${h * 0.58})`}>
              <rect
                x={side === "left" ? x : x - w * 0.16}
                y={h * 0.58 - 9}
                width={w * 0.16}
                height={18}
                rx={9}
                fill="#D5DCE4"
              />
            </g>
          </g>
        );
      })}
      {code ? (
        <g fill={COLORS.white} fontFamily={FONTS.body} fontWeight={600}>
          <text x={w * 0.36} y={h * 0.1} fontSize={h * 0.045} letterSpacing={3}>
            PADU 254017
          </text>
          <text
            x={w * 0.36}
            y={h * 0.155}
            fontSize={h * 0.035}
            letterSpacing={3}
            opacity={0.8}
          >
            45G1
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** Vertical ribs of a container door, to put in <defs>. */
export const DoorRibs: React.FC<{ id: string; pitch?: number }> = ({
  id,
  pitch = 46,
}) => (
  <pattern id={id} width={pitch} height={10} patternUnits="userSpaceOnUse">
    <rect
      x={pitch * 0.1}
      width={pitch * 0.34}
      height={10}
      fill="#FFFFFF"
      opacity={0.07}
    />
    <rect
      x={pitch * 0.48}
      width={pitch * 0.08}
      height={10}
      fill="#000000"
      opacity={0.28}
    />
  </pattern>
);
