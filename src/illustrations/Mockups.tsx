/**
 * Vector application mockups for Scene 8. Each one stands in for the matching
 * public/app-*.jpg until real mockup renders are supplied.
 * The logo is always the approved artwork (full colour or reversed), never
 * rotated, recoloured or distorted.
 */
import React from "react";
import { COLORS, FONTS } from "../brand";
import { LogoGroup, LogoVariant, lockupSize } from "../logo/Logo";
import { A_PATH, D_PATH, P_PATH } from "../logo/monogram";
import { paraPath } from "../lib/geometry";
import {
  Backdrop,
  ContainerSide,
  CorrugationPattern,
  IllustrationFrame,
  ShadowFilter,
  TextBars,
  Wheel,
  useSvgId,
} from "./kit";
import { StackRows } from "./PortScenes";

type SizeProps = { width: number; height: number };

const CW = 1600;
const CH = 1000;

/** Places a logo lockup with its top-left corner at (x, y). */
const LogoAt: React.FC<{
  x: number;
  y: number;
  height: number;
  lockup?: "vertical" | "horizontal";
  variant?: LogoVariant;
}> = ({ x, y, height, lockup = "horizontal", variant = "color" }) => {
  const size = lockupSize(lockup === "horizontal" ? 1 : 0);
  return (
    <g transform={`translate(${x} ${y}) scale(${height / size.height})`}>
      <LogoGroup layout={lockup === "horizontal" ? 1 : 0} variant={variant} />
    </g>
  );
};

/** The PAD monogram alone (avatar, small marks). */
const MonogramAt: React.FC<{
  x: number;
  y: number;
  height: number;
  variant?: LogoVariant;
}> = ({ x, y, height, variant = "color" }) => {
  const primary = variant === "color" ? COLORS.blue : COLORS.white;
  return (
    <g transform={`translate(${x} ${y}) scale(${height / 300})`}>
      <path d={P_PATH} fill={primary} />
      <path d={A_PATH} fill={primary} />
      <path d={D_PATH} fill={COLORS.orange} />
    </g>
  );
};

/** Small route line motif (flat, 60 degree kink, flat). */
const routeD = (
  x0: number,
  y: number,
  kink: number,
  rise: number,
  x1: number,
) => {
  const run = rise * 0.577;
  return `M${x0} ${y}H${kink - 8}Q${kink} ${y} ${kink + 4} ${y - 7}L${kink + run - 4} ${y - rise + 7}Q${kink + run} ${y - rise} ${kink + run + 8} ${y - rise}H${x1}`;
};

/* -------------------------------------------------------------------------- */

export const StationeryMockup: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  return (
    <IllustrationFrame
      contentWidth={CW}
      contentHeight={CH}
      width={width}
      height={height}
      maxCrop={0.22}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E7EBF1" />
          <stop offset="1" stopColor="#D3DBE6" />
        </linearGradient>
        <ShadowFilter id={`${id}-sh`} />
        <clipPath id={`${id}-env`}>
          <rect x={650} y={400} width={560} height={280} rx={4} />
        </clipPath>
      </defs>
      <Backdrop fill={`url(#${id}-bg)`} />
      {/* Letterhead */}
      <rect
        x={120}
        y={120}
        width={470}
        height={665}
        rx={3}
        fill={COLORS.white}
        filter={`url(#${id}-sh)`}
      />
      <LogoAt x={160} y={162} height={32} />
      <TextBars x={470} y={166} widths={[80, 60]} gap={14} h={6} />
      <TextBars
        x={160}
        y={262}
        widths={[170, 120]}
        gap={18}
        h={8}
        color="#C5CFDC"
      />
      <TextBars x={160} y={340} widths={[390, 372, 390, 300]} gap={22} />
      <TextBars x={160} y={460} widths={[390, 380, 352, 390, 210]} gap={22} />
      <path
        d={routeD(120, 742, 300, 44, 590)}
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={3}
      />
      <path
        d={routeD(120, 754, 310, 44, 590)}
        fill="none"
        stroke="#B9C5D6"
        strokeWidth={1.5}
        strokeDasharray="6 6"
      />
      <rect x={120} y={770} width={470} height={15} fill={COLORS.blue} />
      {/* Business card, front */}
      <rect
        x={650}
        y={130}
        width={340}
        height={196}
        rx={8}
        fill={COLORS.blue}
        filter={`url(#${id}-sh)`}
      />
      <LogoAt
        x={650 + (340 - 202.6) / 2}
        y={173}
        height={110}
        lockup="vertical"
        variant="reversed"
      />
      <path
        d={paraPath({ x: 928, y: 304, w: 44, h: 10 }, 2)}
        fill={COLORS.orange}
      />
      {/* Business card, back */}
      <rect
        x={1020}
        y={160}
        width={340}
        height={196}
        rx={8}
        fill={COLORS.white}
        filter={`url(#${id}-sh)`}
      />
      <LogoAt x={1046} y={186} height={22} />
      <TextBars
        x={1046}
        y={248}
        widths={[150, 104]}
        gap={18}
        h={8}
        color="#C5CFDC"
      />
      <text
        x={1046}
        y={322}
        fontFamily={FONTS.body}
        fontWeight={600}
        fontSize={13}
        fill={COLORS.blue}
        letterSpacing={1}
      >
        www.phuocandepot.vn
      </text>
      <rect x={1344} y={160} width={16} height={196} fill={COLORS.orange} />
      {/* Envelope */}
      <rect
        x={650}
        y={400}
        width={560}
        height={280}
        rx={4}
        fill={COLORS.white}
        filter={`url(#${id}-sh)`}
      />
      <g clipPath={`url(#${id}-env)`}>
        <LogoAt x={682} y={430} height={28} />
        <TextBars x={930} y={540} widths={[220, 180, 196]} gap={20} h={7} />
        <path
          d={routeD(640, 652, 900, 36, 1220)}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={3}
        />
        <rect x={1180} y={400} width={30} height={280} fill={COLORS.blue} />
      </g>
      {/* Folder */}
      <rect
        x={1250}
        y={400}
        width={310}
        height={450}
        rx={6}
        fill={COLORS.navy}
        filter={`url(#${id}-sh)`}
      />
      <path
        d={paraPath({ x: 1300, y: 600, w: 220, h: 250 }, 8)}
        fill={COLORS.white}
        opacity={0.06}
      />
      <LogoAt
        x={1282}
        y={436}
        height={66}
        lockup="vertical"
        variant="reversed"
      />
      <path
        d={routeD(1250, 790, 1350, 40, 1560)}
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={3}
      />
      <path
        d={routeD(1250, 806, 1360, 40, 1560)}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={1.5}
      />
    </IllustrationFrame>
  );
};

/* -------------------------------------------------------------------------- */

export const UniformMockup: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  const reflective = "#E3E8EF";
  return (
    <IllustrationFrame
      contentWidth={CW}
      contentHeight={CH}
      width={width}
      height={height}
      maxCrop={0.22}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEF0F3" />
          <stop offset="1" stopColor="#DDE3EB" />
        </linearGradient>
        <ShadowFilter id={`${id}-sh`} />
        <pattern
          id={`${id}-refl`}
          width={14}
          height={14}
          patternUnits="userSpaceOnUse"
        >
          <rect width={14} height={14} fill={reflective} />
          <rect width={7} height={14} fill="#FFFFFF" opacity={0.7} />
        </pattern>
      </defs>
      <Backdrop fill={`url(#${id}-bg)`} />
      {/* Polo (navy) */}
      <g transform="translate(110 190)" filter={`url(#${id}-sh)`}>
        <path
          d="M160 10L55 45Q30 55 20 80L0 190L85 215L95 170V520Q95 540 115 540H325Q345 540 345 520V170L355 215L440 190L420 80Q410 55 385 45L280 10Q220 40 160 10Z"
          fill={COLORS.navy}
        />
        <path d="M160 10L220 72L196 98L148 30Z" fill="#183D72" />
        <path d="M280 10L220 72L244 98L292 30Z" fill="#183D72" />
        <rect x={212} y={72} width={16} height={100} fill="#0A2347" />
        <circle cx={220} cy={110} r={4} fill="#C3CDDB" />
        <circle cx={220} cy={140} r={4} fill="#C3CDDB" />
        <LogoAt x={252} y={160} height={18} variant="reversed" />
      </g>
      {/* Hi-vis vest (orange) */}
      <g transform="translate(590 170)" filter={`url(#${id}-sh)`}>
        <path
          d="M120 0H165L210 150L255 0H300C300 70 330 110 380 120V480Q380 510 350 510H70Q40 510 40 480V120C90 110 120 70 120 0Z"
          fill={COLORS.orange}
        />
        <rect
          x={130}
          y={0}
          width={24}
          height={300}
          fill={`url(#${id}-refl)`}
          transform="skewX(6)"
        />
        <rect
          x={266}
          y={0}
          width={24}
          height={300}
          fill={`url(#${id}-refl)`}
          transform="skewX(-6)"
        />
        <rect
          x={40}
          y={318}
          width={340}
          height={30}
          fill={`url(#${id}-refl)`}
        />
        <rect
          x={40}
          y={398}
          width={340}
          height={30}
          fill={`url(#${id}-refl)`}
        />
        <line
          x1={210}
          y1={150}
          x2={210}
          y2={510}
          stroke="#C85300"
          strokeWidth={4}
        />
        <rect
          x={240}
          y={196}
          width={124}
          height={42}
          rx={6}
          fill={COLORS.navy}
        />
        <LogoAt x={250} y={206} height={22} variant="reversed" />
      </g>
      {/* Jacket (PAD blue) */}
      <g transform="translate(1060 170)" filter={`url(#${id}-sh)`}>
        <path
          d="M165 10L70 40Q40 50 35 80L0 520Q0 540 20 540H70L100 200V580Q100 600 120 600H340Q360 600 360 580V200L390 540H440Q460 540 460 520L425 80Q420 50 390 40L295 10Q230 30 165 10Z"
          fill={COLORS.blue}
        />
        <path
          d="M165 10Q230 30 295 10L290 -14Q230 6 170 -14Z"
          fill={COLORS.orange}
        />
        <line
          x1={230}
          y1={22}
          x2={230}
          y2={600}
          stroke={COLORS.orange}
          strokeWidth={4}
        />
        <rect
          x={100}
          y={430}
          width={260}
          height={24}
          fill={`url(#${id}-refl)`}
        />
        <LogoAt x={252} y={110} height={18} variant="reversed" />
      </g>
      {/* Hard hat (white) */}
      <g transform="translate(860 830)" filter={`url(#${id}-sh)`}>
        <path d="M-150 0A150 132 0 0 1 150 0Z" fill={COLORS.white} />
        <path d="M-20 -131Q0 -134 20 -131L22 0H-22Z" fill={COLORS.orange} />
        <rect x={-180} y={-4} width={360} height={22} rx={11} fill="#EEF1F5" />
        <LogoAt x={-118} y={-74} height={22} />
      </g>
    </IllustrationFrame>
  );
};

/* -------------------------------------------------------------------------- */

const Arrow: React.FC<{
  x: number;
  y: number;
  dir: "left" | "right" | "up";
}> = ({ x, y, dir }) => {
  const rot = dir === "right" ? 0 : dir === "left" ? 180 : -90;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path
        d="M-12 0H12M2 -10L12 0L2 10"
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

export const SignageMockup: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  const rows: Array<{ label: string; dir: "left" | "right" | "up" }> = [
    { label: "BÃI RỖNG", dir: "right" },
    { label: "VĂN PHÒNG", dir: "left" },
    { label: "SỬA CHỮA", dir: "up" },
  ];
  return (
    <IllustrationFrame
      contentWidth={CW}
      contentHeight={CH}
      width={width}
      height={height}
      maxCrop={0.22}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C2D1E5" />
          <stop offset="0.8" stopColor="#F2F2EF" />
        </linearGradient>
        <CorrugationPattern id={`${id}-corr`} />
        <ShadowFilter id={`${id}-sh`} />
      </defs>
      <Backdrop fill={`url(#${id}-sky)`} />
      <g opacity={0.45}>
        <StackRows
          seed="gate"
          x0={-600}
          x1={2200}
          groundY={760}
          h={52}
          maxTiers={3}
          patternId={`${id}-corr`}
        />
      </g>
      <rect x={-2000} y={760} width={6000} height={2000} fill="#CDD3DB" />
      <rect x={-2000} y={800} width={6000} height={200} fill="#B8C0CB" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect
          key={i}
          x={-400 + i * 170}
          y={898}
          width={90}
          height={8}
          rx={4}
          fill={COLORS.white}
          opacity={0.85}
        />
      ))}
      {/* Gate pylons and lightbox */}
      <rect x={250} y={250} width={90} height={530} fill={COLORS.navy} />
      <rect x={1090} y={250} width={90} height={530} fill={COLORS.navy} />
      <rect x={326} y={250} width={14} height={530} fill={COLORS.orange} />
      <rect x={1090} y={250} width={14} height={530} fill={COLORS.orange} />
      <rect
        x={220}
        y={150}
        width={990}
        height={150}
        rx={10}
        fill={COLORS.navy}
        filter={`url(#${id}-sh)`}
      />
      <rect
        x={232}
        y={162}
        width={966}
        height={126}
        rx={6}
        fill={COLORS.white}
      />
      <LogoAt x={715 - 600 / 2} y={186} height={78} />
      {/* Barrier */}
      <rect x={325} y={600} width={40} height={60} rx={6} fill={COLORS.navy} />
      <g>
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x={365 + i * 52}
            y={612}
            width={52}
            height={16}
            fill={i % 2 === 0 ? COLORS.orange : COLORS.white}
          />
        ))}
      </g>
      {/* Wayfinding totem */}
      <g filter={`url(#${id}-sh)`}>
        <rect
          x={1280}
          y={300}
          width={240}
          height={480}
          rx={14}
          fill={COLORS.navy}
        />
      </g>
      <LogoAt
        x={1280 + (240 - 140.4) / 2}
        y={330}
        height={76}
        lockup="vertical"
        variant="reversed"
      />
      {rows.map((row, i) => (
        <g key={row.label}>
          <line
            x1={1300}
            x2={1500}
            y1={450 + i * 96}
            y2={450 + i * 96}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={2}
          />
          <text
            x={1304}
            y={506 + i * 96}
            fontFamily={FONTS.body}
            fontWeight={600}
            fontSize={20}
            fill={COLORS.white}
            letterSpacing={1.5}
          >
            {row.label}
          </text>
          <Arrow x={1480} y={499 + i * 96} dir={row.dir} />
        </g>
      ))}
    </IllustrationFrame>
  );
};

/* -------------------------------------------------------------------------- */

export const TruckMockup: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  return (
    <IllustrationFrame
      contentWidth={CW}
      contentHeight={CH}
      width={width}
      height={height}
      maxCrop={0.3}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C7D5E8" />
          <stop offset="0.8" stopColor="#F3F2EE" />
        </linearGradient>
        <CorrugationPattern id={`${id}-corr`} pitch={12} />
        <CorrugationPattern id={`${id}-corr2`} />
      </defs>
      <Backdrop fill={`url(#${id}-sky)`} />
      <g opacity={0.35}>
        <StackRows
          seed="truck"
          x0={-600}
          x1={2200}
          groundY={790}
          h={44}
          maxTiers={3}
          patternId={`${id}-corr2`}
        />
      </g>
      <rect x={-2000} y={790} width={6000} height={2000} fill="#BAC2CD" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect
          key={i}
          x={-400 + i * 170}
          y={930}
          width={90}
          height={8}
          rx={4}
          fill={COLORS.white}
          opacity={0.85}
        />
      ))}
      <ellipse
        cx={810}
        cy={812}
        rx={720}
        ry={16}
        fill="#0F2E5B"
        opacity={0.12}
      />
      {/* Trailer and container */}
      <rect x={470} y={712} width={1010} height={24} fill="#2A3342" />
      <rect x={690} y={736} width={16} height={50} fill="#2A3342" />
      <ContainerSide
        x={470}
        y={440}
        w={1010}
        h={272}
        color={COLORS.navy}
        patternId={`${id}-corr`}
      />
      <LogoAt x={540} y={500} height={84} variant="reversed" />
      <text
        x={544}
        y={650}
        fontFamily={FONTS.body}
        fontWeight={600}
        fontSize={22}
        fill={COLORS.white}
        letterSpacing={3}
        opacity={0.85}
      >
        www.phuocandepot.vn
      </text>
      <path
        d={routeD(470, 690, 1120, 84, 1480)}
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={6}
      />
      <path
        d={routeD(470, 676, 1112, 84, 1480)}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={2}
      />
      {/* Tractor cab */}
      <rect x={140} y={700} width={340} height={36} fill="#2A3342" />
      <path
        d="M190 712V520Q190 470 215 455L300 430H420Q432 430 432 442V712Z"
        fill={COLORS.blue}
      />
      <path d="M212 476L292 452V566H204Z" fill="#BFD3EA" />
      <rect x={302} y={458} width={110} height={104} rx={6} fill="#BFD3EA" />
      <rect
        x={300}
        y={456}
        width={120}
        height={236}
        rx={6}
        fill="none"
        stroke={COLORS.navy}
        strokeOpacity={0.45}
        strokeWidth={2}
      />
      <LogoAt
        x={309}
        y={586}
        height={56}
        lockup="vertical"
        variant="reversed"
      />
      <rect x={190} y={676} width={242} height={14} fill={COLORS.orange} />
      <rect x={132} y={630} width={70} height={82} rx={6} fill="#2A3342" />
      <rect x={140} y={642} width={22} height={14} rx={3} fill="#F4F6F9" />
      <rect x={436} y={360} width={12} height={240} rx={4} fill="#8B97A8" />
      <rect x={330} y={712} width={100} height={36} rx={6} fill="#AEB8C6" />
      <Wheel cx={260} cy={764} r={52} />
      <Wheel cx={540} cy={764} r={52} />
      <Wheel cx={650} cy={764} r={52} />
      <Wheel cx={1240} cy={764} r={52} />
      <Wheel cx={1350} cy={764} r={52} />
    </IllustrationFrame>
  );
};

/* -------------------------------------------------------------------------- */

export const EquipmentMockup: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  return (
    <IllustrationFrame
      contentWidth={CW}
      contentHeight={CH}
      width={width}
      height={height}
      maxCrop={0.3}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C5D3E6" />
          <stop offset="0.85" stopColor="#F2F2EF" />
        </linearGradient>
        <CorrugationPattern id={`${id}-corr`} />
      </defs>
      <Backdrop fill={`url(#${id}-sky)`} />
      <g opacity={0.4}>
        <StackRows
          seed="stacker"
          x0={-600}
          x1={2200}
          groundY={840}
          h={56}
          maxTiers={4}
          patternId={`${id}-corr`}
        />
      </g>
      <rect x={-2000} y={840} width={6000} height={2000} fill="#CBD1D9" />
      <ellipse
        cx={900}
        cy={852}
        rx={520}
        ry={14}
        fill="#0F2E5B"
        opacity={0.14}
      />
      {/* Boom: pivot at the rear of the body, tip above the spreader */}
      <path
        d="M1093.2 570.8L343.2 232.8L316.8 291.2L1066.8 629.2Z"
        fill={COLORS.orange}
      />
      <path
        d="M677.4 392.2L339.9 240.1L320.1 283.9L657.6 436Z"
        fill={COLORS.white}
        opacity={0.18}
      />
      <line
        x1={900}
        y1={640}
        x2={780}
        y2={465}
        stroke="#AEB8C6"
        strokeWidth={22}
        strokeLinecap="round"
      />
      <line
        x1={900}
        y1={640}
        x2={846}
        y2={561}
        stroke="#6B7789"
        strokeWidth={26}
        strokeLinecap="round"
      />
      {/* Spreader and the 20ft container it carries */}
      <rect x={300} y={270} width={60} height={36} rx={6} fill="#1B2433" />
      <rect x={160} y={302} width={340} height={22} rx={4} fill="#1B2433" />
      <rect
        x={152}
        y={300}
        width={28}
        height={26}
        rx={4}
        fill={COLORS.orange}
      />
      <rect
        x={480}
        y={300}
        width={28}
        height={26}
        rx={4}
        fill={COLORS.orange}
      />
      <ContainerSide
        x={175}
        y={324}
        w={310}
        h={146}
        color={COLORS.navy}
        patternId={`${id}-corr`}
      />
      <LogoAt x={198} y={380} height={34} variant="reversed" />
      {/* Body, cab and counterweight */}
      <path
        d="M560 790V650Q560 620 590 620H1220Q1250 620 1250 650V790Z"
        fill={COLORS.blue}
      />
      <rect
        x={1050}
        y={560}
        width={210}
        height={70}
        rx={14}
        fill={COLORS.navy}
      />
      <rect x={712} y={400} width={156} height={16} rx={4} fill={COLORS.navy} />
      <rect
        x={720}
        y={410}
        width={140}
        height={212}
        rx={6}
        fill={COLORS.navy}
      />
      <rect x={732} y={424} width={116} height={180} rx={4} fill="#BFD3EA" />
      <LogoAt x={900} y={672} height={34} variant="reversed" />
      <rect x={560} y={772} width={690} height={18} fill={COLORS.orange} />
      <Wheel cx={650} cy={790} r={80} />
      <Wheel cx={1150} cy={800} r={66} />
    </IllustrationFrame>
  );
};

/* -------------------------------------------------------------------------- */

/** One tile of the social feed grid. */
const FeedTile: React.FC<{
  x: number;
  y: number;
  s: number;
  kind: number;
  patternId: string;
}> = ({ x, y, s, kind, patternId }) => {
  switch (kind) {
    case 0:
      return (
        <g>
          <rect x={x} y={y} width={s} height={s} fill={COLORS.blue} />
          <LogoAt
            x={x + (s - s * 0.62) / 2}
            y={y + s * 0.33}
            height={s * 0.62 * (604.2 / 1113)}
            lockup="vertical"
            variant="reversed"
          />
        </g>
      );
    case 1:
      return (
        <g>
          <rect x={x} y={y} width={s} height={s} fill="#D8E0EA" />
          <ContainerSide
            x={x - 10}
            y={y + s * 0.5}
            w={s * 0.7}
            h={s * 0.22}
            color={COLORS.navy}
            patternId={patternId}
          />
          <ContainerSide
            x={x + s * 0.45}
            y={y + s * 0.5}
            w={s * 0.7}
            h={s * 0.22}
            color={COLORS.orange}
            patternId={patternId}
          />
          <ContainerSide
            x={x + s * 0.1}
            y={y + s * 0.74}
            w={s}
            h={s * 0.22}
            color={COLORS.blue}
            patternId={patternId}
          />
        </g>
      );
    case 2:
      return (
        <g>
          <rect x={x} y={y} width={s} height={s} fill={COLORS.ivory} />
          <rect
            x={x + 12}
            y={y + 22}
            width={18}
            height={3}
            fill={COLORS.orange}
          />
          <rect
            x={x + 12}
            y={y + 34}
            width={s * 0.7}
            height={9}
            rx={2}
            fill={COLORS.blue}
          />
          <rect
            x={x + 12}
            y={y + 48}
            width={s * 0.45}
            height={9}
            rx={2}
            fill={COLORS.orange}
          />
          <TextBars
            x={x + 12}
            y={y + 70}
            widths={[s * 0.6, s * 0.5]}
            gap={10}
            h={4}
          />
        </g>
      );
    case 3:
      return (
        <g>
          <rect x={x} y={y} width={s} height={s} fill={COLORS.navy} />
          <path
            d={routeD(x, y + s * 0.7, x + s * 0.35, s * 0.3, x + s)}
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={3}
          />
          <path
            d={routeD(x, y + s * 0.8, x + s * 0.4, s * 0.3, x + s)}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.5}
          />
        </g>
      );
    case 4:
      return (
        <g>
          <rect x={x} y={y} width={s} height={s} fill={COLORS.orange} />
          <rect
            x={x + s * 0.25}
            y={y + s * 0.32}
            width={s * 0.5}
            height={s * 0.34}
            rx={3}
            fill="none"
            stroke={COLORS.white}
            strokeWidth={3}
          />
          {[0.35, 0.45, 0.55, 0.65].map((t) => (
            <line
              key={t}
              x1={x + s * t}
              x2={x + s * t}
              y1={y + s * 0.38}
              y2={y + s * 0.6}
              stroke={COLORS.white}
              strokeWidth={2}
            />
          ))}
        </g>
      );
    default:
      return (
        <g>
          <rect x={x} y={y} width={s} height={s} fill={COLORS.greyBlue} />
          <path
            d={paraPath(
              { x: x + s * 0.12, y: y + s * 0.25, w: s * 0.3, h: s * 0.5 },
              3,
            )}
            fill={COLORS.blue}
          />
          <path
            d={paraPath(
              { x: x + s * 0.42, y: y + s * 0.25, w: s * 0.3, h: s * 0.5 },
              3,
            )}
            fill={COLORS.orange}
          />
        </g>
      );
  }
};

export const SocialMockup: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  const cell = 108;
  const gridX = 640;
  const gridY = 250;
  const order = [0, 1, 2, 3, 4, 5, 2, 0, 1];
  return (
    <IllustrationFrame
      contentWidth={CW}
      contentHeight={CH}
      width={width}
      height={height}
      maxCrop={0.12}
    >
      <defs>
        <ShadowFilter id={`${id}-sh`} />
        <CorrugationPattern id={`${id}-corr`} pitch={6} />
        <clipPath id={`${id}-screen`}>
          <rect x={634} y={84} width={332} height={732} rx={40} />
        </clipPath>
        <clipPath id={`${id}-post`}>
          <rect x={1050} y={290} width={340} height={420} rx={12} />
        </clipPath>
      </defs>
      <Backdrop fill="#E3E9F1" />
      <g transform="translate(0 50)">
        {/* Left post */}
        <rect
          x={200}
          y={220}
          width={340}
          height={340}
          rx={12}
          fill={COLORS.blue}
          filter={`url(#${id}-sh)`}
        />
        <LogoAt
          x={232}
          y={252}
          height={70}
          lockup="vertical"
          variant="reversed"
        />
        <rect x={232} y={420} width={40} height={4} fill={COLORS.orange} />
        <text
          fontFamily={FONTS.display}
          fontWeight={800}
          fontSize={32}
          fill={COLORS.white}
        >
          <tspan x={232} y={472}>
            MỘT DIỆN MẠO
          </tspan>
          <tspan x={232} y={512}>
            MỚI
          </tspan>
        </text>
        {/* Phone */}
        <rect
          x={620}
          y={70}
          width={360}
          height={760}
          rx={52}
          fill={COLORS.navy}
          filter={`url(#${id}-sh)`}
        />
        <g clipPath={`url(#${id}-screen)`}>
          <rect x={634} y={84} width={332} height={732} fill={COLORS.white} />
          <circle
            cx={682}
            cy={150}
            r={30}
            fill={COLORS.ivory}
            stroke={COLORS.greyBlue}
            strokeWidth={2}
          />
          <MonogramAt x={663} y={143} height={14} />
          <text
            x={724}
            y={146}
            fontFamily={FONTS.body}
            fontWeight={600}
            fontSize={15}
            fill={COLORS.navy}
          >
            phuocandepot
          </text>
          <text
            x={724}
            y={166}
            fontFamily={FONTS.body}
            fontWeight={500}
            fontSize={11}
            fill="#7B879A"
          >
            Logistics · Depot container
          </text>
          <rect
            x={650}
            y={196}
            width={300}
            height={30}
            rx={8}
            fill={COLORS.blue}
          />
          <text
            x={800}
            y={216}
            textAnchor="middle"
            fontFamily={FONTS.body}
            fontWeight={600}
            fontSize={12}
            fill={COLORS.white}
          >
            Theo dõi
          </text>
          {order.map((kind, i) => (
            <FeedTile
              key={i}
              x={gridX - 6 + (i % 3) * (cell + 3)}
              y={gridY + Math.floor(i / 3) * (cell + 3)}
              s={cell}
              kind={kind}
              patternId={`${id}-corr`}
            />
          ))}
        </g>
        {/* Right post */}
        <rect
          x={1050}
          y={290}
          width={340}
          height={420}
          rx={12}
          fill={COLORS.ivory}
          filter={`url(#${id}-sh)`}
        />
        <g clipPath={`url(#${id}-post)`}>
          <rect x={1050} y={290} width={340} height={230} fill="#C9D6E7" />
          <ContainerSide
            x={1030}
            y={410}
            w={200}
            h={52}
            color={COLORS.navy}
            patternId={`${id}-corr`}
          />
          <ContainerSide
            x={1232}
            y={410}
            w={200}
            h={52}
            color={COLORS.orange}
            patternId={`${id}-corr`}
          />
          <ContainerSide
            x={1080}
            y={464}
            w={280}
            h={52}
            color={COLORS.blue}
            patternId={`${id}-corr`}
          />
          <ContainerSide
            x={1362}
            y={464}
            w={120}
            h={52}
            color="#8796AC"
            patternId={`${id}-corr`}
          />
        </g>
        <rect x={1078} y={556} width={34} height={4} fill={COLORS.orange} />
        <text
          x={1078}
          y={598}
          fontFamily={FONTS.display}
          fontWeight={800}
          fontSize={26}
          fill={COLORS.blue}
        >
          Bãi container rỗng
        </text>
        <text
          x={1078}
          y={630}
          fontFamily={FONTS.body}
          fontWeight={500}
          fontSize={14}
          fill="#7B879A"
        >
          Lưu bãi · Cắt mooc · Đảo chuyển
        </text>
        <LogoAt x={1078} y={662} height={20} />
      </g>
    </IllustrationFrame>
  );
};

/* -------------------------------------------------------------------------- */

export const DigitalMockup: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  return (
    <IllustrationFrame
      contentWidth={CW}
      contentHeight={CH}
      width={width}
      height={height}
      maxCrop={0.25}
    >
      <defs>
        <ShadowFilter id={`${id}-sh`} />
        <CorrugationPattern id={`${id}-corr`} pitch={8} />
        <clipPath id={`${id}-hero`}>
          <path d={paraPath({ x: 1010, y: 220, w: 330, h: 380 }, 12)} />
        </clipPath>
        <clipPath id={`${id}-cover`}>
          <rect x={130} y={220} width={380} height={537} rx={4} />
        </clipPath>
      </defs>
      <Backdrop fill="#E5EAF1" />
      {/* Laptop */}
      <rect
        x={520}
        y={110}
        width={940}
        height={580}
        rx={22}
        fill="#1B2433"
        filter={`url(#${id}-sh)`}
      />
      <rect x={538} y={128} width={904} height={544} fill={COLORS.ivory} />
      <rect x={538} y={128} width={904} height={52} fill={COLORS.white} />
      <LogoAt x={566} y={142} height={24} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={1080 + i * 64}
          y={151}
          width={44}
          height={6}
          rx={3}
          fill="#C5CFDC"
        />
      ))}
      <rect
        x={1352}
        y={142}
        width={70}
        height={26}
        rx={6}
        fill={COLORS.orange}
      />
      <rect x={570} y={248} width={34} height={4} fill={COLORS.orange} />
      <text fontFamily={FONTS.display} fontWeight={800} fontSize={46}>
        <tspan x={566} y={316} fill={COLORS.blue}>
          BÃI CONTAINER
        </tspan>
        <tspan x={566} y={370} fill={COLORS.orange}>
          RỖNG
        </tspan>
      </text>
      <TextBars x={570} y={410} widths={[330, 300, 250]} gap={18} h={7} />
      <rect x={570} y={490} width={150} height={44} rx={8} fill={COLORS.blue} />
      <text
        x={645}
        y={518}
        textAnchor="middle"
        fontFamily={FONTS.body}
        fontWeight={600}
        fontSize={15}
        fill={COLORS.white}
      >
        Liên hệ
      </text>
      <g clipPath={`url(#${id}-hero)`}>
        <rect x={980} y={200} width={500} height={420} fill="#C6D4E6" />
        <StackRows
          seed="web"
          x0={960}
          x1={1500}
          groundY={600}
          h={44}
          maxTiers={4}
          patternId={`${id}-corr`}
        />
      </g>
      <path
        d={routeD(538, 640, 820, 40, 1442)}
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={3}
      />
      <path
        d="M440 690H1540L1520 722Q1515 730 1500 730H480Q465 730 460 722Z"
        fill="#C9D1DC"
      />
      <rect x={920} y={690} width={160} height={10} rx={4} fill="#AEB8C6" />
      {/* Company profile brochure */}
      <rect
        x={130}
        y={220}
        width={380}
        height={537}
        rx={4}
        fill={COLORS.blue}
        filter={`url(#${id}-sh)`}
      />
      <g clipPath={`url(#${id}-cover)`}>
        <path
          d={paraPath({ x: 300, y: 150, w: 180, h: 700 }, 10)}
          fill={COLORS.white}
          opacity={0.08}
        />
        <path
          d={paraPath({ x: 420, y: 250, w: 140, h: 600 }, 10)}
          fill={COLORS.white}
          opacity={0.06}
        />
        <path
          d={routeD(130, 470, 300, 60, 510)}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={3}
        />
        <path
          d={routeD(130, 486, 310, 60, 510)}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
        />
      </g>
      <LogoAt
        x={164}
        y={256}
        height={62}
        lockup="vertical"
        variant="reversed"
      />
      <rect x={164} y={560} width={34} height={4} fill={COLORS.orange} />
      <text
        fontFamily={FONTS.display}
        fontWeight={800}
        fontSize={40}
        fill={COLORS.white}
      >
        <tspan x={164} y={618}>
          HỒ SƠ
        </tspan>
        <tspan x={164} y={664}>
          NĂNG LỰC
        </tspan>
      </text>
      <text
        x={164}
        y={704}
        fontFamily={FONTS.body}
        fontWeight={500}
        fontSize={11}
        letterSpacing={3}
        fill={COLORS.white}
        opacity={0.7}
      >
        COMPANY PROFILE 2026
      </text>
    </IllustrationFrame>
  );
};

/** Lookup used by the montage and the collage. */
export const MOCKUPS = {
  stationery: StationeryMockup,
  uniform: UniformMockup,
  signage: SignageMockup,
  truck: TruckMockup,
  equipment: EquipmentMockup,
  social: SocialMockup,
  digital: DigitalMockup,
} as const;
