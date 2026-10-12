/**
 * Vector stand-ins for the container and port photography used in Scene 3
 * and as faded backgrounds. Replace them by adding the photo files listed in
 * brand.ts (PHOTOS) to public/.
 */
import React from "react";
import { random } from "remotion";
import { COLORS, FONTS } from "../brand";
import {
  Backdrop,
  ContainerSide,
  ContainerTop,
  CorrugationPattern,
  IllustrationFrame,
  pickColor,
  useSvgId,
} from "./kit";

type SizeProps = { width: number; height: number };

/** Rows of stacked containers filling [x0, x1] above groundY. */
export const StackRows: React.FC<{
  seed: string;
  x0: number;
  x1: number;
  groundY: number;
  h: number;
  maxTiers: number;
  patternId: string;
}> = ({ seed, x0, x1, groundY, h, maxTiers, patternId }) => {
  const items: React.ReactNode[] = [];
  let x = x0;
  let col = 0;
  while (x < x1) {
    const long = random(`${seed}-len-${col}`) > 0.45;
    const w = long ? h * 4.4 : h * 2.2;
    const tiers = 1 + Math.floor(random(`${seed}-tier-${col}`) * maxTiers);
    for (let t = 0; t < tiers; t++) {
      items.push(
        <ContainerSide
          key={`${col}-${t}`}
          x={x}
          y={groundY - (t + 1) * (h + 3)}
          w={w - 4}
          h={h}
          color={pickColor(`${seed}-c-${col}-${t}`)}
          patternId={patternId}
        />,
      );
    }
    x += w;
    col++;
  }
  return <g>{items}</g>;
};

/** Rubber-tyred gantry crane in navy line work. */
const GantryCrane: React.FC<{
  x: number;
  groundY: number;
  w: number;
  top: number;
  load?: string;
  patternId: string;
}> = ({ x, groundY, w, top, load, patternId }) => {
  const leg = 18;
  return (
    <g>
      <rect
        x={x}
        y={top}
        width={leg}
        height={groundY - top}
        fill={COLORS.navy}
      />
      <rect
        x={x + w - leg}
        y={top}
        width={leg}
        height={groundY - top}
        fill={COLORS.navy}
      />
      <rect
        x={x - 30}
        y={top - 34}
        width={w + 60}
        height={40}
        rx={4}
        fill={COLORS.navy}
      />
      <rect
        x={x - 30}
        y={top - 34}
        width={w + 60}
        height={8}
        fill={COLORS.orange}
      />
      <rect
        x={x + w * 0.38}
        y={top + 6}
        width={w * 0.2}
        height={26}
        fill={COLORS.blue}
      />
      <line
        x1={x + w * 0.42}
        y1={top + 32}
        x2={x + w * 0.42}
        y2={top + 190}
        stroke="#5E6F8A"
        strokeWidth={3}
      />
      <line
        x1={x + w * 0.54}
        y1={top + 32}
        x2={x + w * 0.54}
        y2={top + 190}
        stroke="#5E6F8A"
        strokeWidth={3}
      />
      {load ? (
        <ContainerSide
          x={x + w * 0.18}
          y={top + 190}
          w={w * 0.6}
          h={64}
          color={load}
          patternId={patternId}
        />
      ) : null}
    </g>
  );
};

/** Ship-to-shore crane silhouette for the skyline. */
export const StsCrane: React.FC<{
  x: number;
  groundY: number;
  scale: number;
  color: string;
}> = ({ x, groundY, scale, color }) => (
  <g
    transform={`translate(${x} ${groundY}) scale(${scale})`}
    fill="none"
    stroke={color}
    strokeWidth={10}
    strokeLinejoin="round"
  >
    <path d="M0 0V-420M120 0V-420M-10 -420H130M0 -300L120 -420M0 -420L120 -300" />
    <path d="M-260 -470H380M-260 -470L60 -560L380 -470M60 -560V-420" />
    <path d="M-200 -470V-440H-150V-470" />
  </g>
);

/** "Hiện đại": a modern container stack under a gantry crane. */
export const ModernStack: React.FC<SizeProps & { seed?: string }> = ({
  width,
  height,
  seed = "modern",
}) => {
  const id = useSvgId();
  return (
    <IllustrationFrame
      contentWidth={1000}
      contentHeight={1000}
      width={width}
      height={height}
      maxCrop={1}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFCEE2" />
          <stop offset="0.7" stopColor="#EEF1F4" />
        </linearGradient>
        <CorrugationPattern id={`${id}-corr`} pitch={9} />
      </defs>
      <Backdrop fill={`url(#${id}-sky)`} w={1000} h={1000} />
      <rect x={-2000} y={930} width={5000} height={2000} fill="#D6DCE4" />
      <StsCrane x={80} groundY={700} scale={0.8} color="#AFBDD0" />
      <StsCrane x={760} groundY={700} scale={0.65} color="#C1CCDB" />
      <StackRows
        seed={`${seed}-back`}
        x0={-400}
        x1={1400}
        groundY={760}
        h={46}
        maxTiers={3}
        patternId={`${id}-corr`}
      />
      <rect x={-2000} y={758} width={5000} height={30} fill="#E4E8EE" />
      <GantryCrane
        x={520}
        groundY={930}
        w={400}
        top={330}
        load={COLORS.orange}
        patternId={`${id}-corr`}
      />
      <StackRows
        seed={`${seed}-front`}
        x0={-420}
        x1={1420}
        groundY={930}
        h={66}
        maxTiers={3}
        patternId={`${id}-corr`}
      />
      <g opacity={0.9}>
        {Array.from({ length: 14 }, (_, i) => (
          <rect
            key={i}
            x={-400 + i * 140}
            y={958}
            width={70}
            height={6}
            rx={3}
            fill={COLORS.white}
          />
        ))}
      </g>
    </IllustrationFrame>
  );
};

/** "Chính xác": close-up of a container door with locking bars and codes. */
export const PreciseDoor: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  const bars = [190, 350, 650, 810];
  return (
    <IllustrationFrame
      contentWidth={1000}
      contentHeight={1000}
      width={width}
      height={height}
      maxCrop={1}
    >
      <defs>
        <pattern
          id={`${id}-ribs`}
          width={56}
          height={10}
          patternUnits="userSpaceOnUse"
        >
          <rect width={56} height={10} fill={COLORS.navy} />
          <rect x={6} width={20} height={10} fill="#163A6E" />
          <rect x={26} width={4} height={10} fill="#0A2347" />
        </pattern>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9AA7B9" />
          <stop offset="0.45" stopColor="#E8ECF2" />
          <stop offset="1" stopColor="#8392A8" />
        </linearGradient>
      </defs>
      <Backdrop fill={`url(#${id}-ribs)`} w={1000} h={1000} />
      <rect x={494} y={-2000} width={12} height={5000} fill="#06193A" />
      {bars.map((x) => (
        <g key={x}>
          <rect
            x={x - 12}
            y={-2000}
            width={24}
            height={5000}
            fill={`url(#${id}-steel)`}
          />
          {[120, 470, 860].map((y) => (
            <rect
              key={y}
              x={x - 22}
              y={y}
              width={44}
              height={34}
              rx={4}
              fill="#5E6F8A"
            />
          ))}
          {/* Door handle, pointing towards the door seam */}
          <rect
            x={x < 500 ? x - 6 : x - 114}
            y={560}
            width={120}
            height={14}
            rx={7}
            fill="#C8D1DD"
          />
        </g>
      ))}
      {/* Orange security seal on the right-hand door handle */}
      <rect
        x={760}
        y={574}
        width={14}
        height={60}
        rx={4}
        fill={COLORS.orange}
      />
      <circle cx={767} cy={640} r={12} fill={COLORS.orange} />
      <g fill={COLORS.white} fontFamily={FONTS.body} fontWeight={600}>
        <text x={540} y={110} fontSize={46} letterSpacing={4}>
          PADU
        </text>
        <text x={540} y={168} fontSize={46} letterSpacing={4}>
          254017
        </text>
        <rect
          x={758}
          y={130}
          width={40}
          height={46}
          fill="none"
          stroke={COLORS.white}
          strokeWidth={3}
        />
        <text x={767} y={168} fontSize={38}>
          3
        </text>
        <text x={540} y={224} fontSize={32} letterSpacing={4} opacity={0.85}>
          45G1
        </text>
      </g>
      <rect x={380} y={700} width={96} height={64} rx={4} fill="#C3CDDB" />
      <g fill="#8796AC">
        {[714, 728, 742].map((y) => (
          <rect key={y} x={392} y={y} width={70} height={5} />
        ))}
      </g>
    </IllustrationFrame>
  );
};

/** "Kết nối": aerial view of the yard with the orange route through it. */
export const ConnectedYard: React.FC<SizeProps> = ({ width, height }) => {
  const blocks: React.ReactNode[] = [];
  const rows = [
    { y: 60, n: 5 },
    { y: 400, n: 5 },
    { y: 740, n: 4 },
  ];
  rows.forEach((row, r) => {
    for (let b = -2; b < 6; b++) {
      for (let i = 0; i < row.n; i++) {
        for (let j = 0; j < 2; j++) {
          blocks.push(
            <ContainerTop
              key={`${r}-${b}-${i}-${j}`}
              x={b * 280 + j * 128 + 20}
              y={row.y + i * 46}
              w={122}
              h={40}
              color={pickColor(`yard-${r}-${b}-${i}-${j}`)}
            />,
          );
        }
      }
    }
  });
  const route = "M-400 680H210Q240 680 255 654L405 394Q420 368 450 368H1400";
  return (
    <IllustrationFrame
      contentWidth={1000}
      contentHeight={1000}
      width={width}
      height={height}
      maxCrop={1}
    >
      <Backdrop fill="#D3DAE4" w={1000} h={1000} />
      {blocks}
      {[300, 640].map((y) => (
        <g key={y}>
          <rect x={-2000} y={y} width={5000} height={86} fill="#EEF1F5" />
          {Array.from({ length: 30 }, (_, i) => (
            <rect
              key={i}
              x={-600 + i * 80}
              y={y + 41}
              width={40}
              height={4}
              fill="#C5CEDA"
            />
          ))}
        </g>
      ))}
      <path
        d={route}
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={22}
        strokeOpacity={0.18}
        strokeLinecap="round"
      />
      <path
        d={route}
        fill="none"
        stroke={COLORS.orange}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <g transform="translate(560 346)">
        <rect width={150} height={44} rx={4} fill={COLORS.navy} />
        <rect x={156} y={4} width={40} height={36} rx={6} fill={COLORS.blue} />
      </g>
      <circle
        cx={210}
        cy={680}
        r={14}
        fill={COLORS.white}
        stroke={COLORS.orange}
        strokeWidth={6}
      />
      <circle
        cx={880}
        cy={368}
        r={14}
        fill={COLORS.white}
        stroke={COLORS.orange}
        strokeWidth={6}
      />
    </IllustrationFrame>
  );
};

/** Wide port panorama used as a faded background photo. */
export const PortPanorama: React.FC<SizeProps> = ({ width, height }) => {
  const id = useSvgId();
  return (
    <IllustrationFrame
      contentWidth={1600}
      contentHeight={900}
      width={width}
      height={height}
      maxCrop={1}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C4D2E5" />
          <stop offset="0.75" stopColor="#F1F2F2" />
        </linearGradient>
        <CorrugationPattern id={`${id}-corr`} pitch={9} />
      </defs>
      <Backdrop fill={`url(#${id}-sky)`} />
      <StsCrane x={240} groundY={640} scale={1} color="#8FA1BA" />
      <StsCrane x={820} groundY={640} scale={0.85} color="#A3B3C8" />
      <StsCrane x={1320} groundY={640} scale={1.05} color="#8FA1BA" />
      <StackRows
        seed="pano-back"
        x0={-600}
        x1={2200}
        groundY={700}
        h={50}
        maxTiers={4}
        patternId={`${id}-corr`}
      />
      <StackRows
        seed="pano-front"
        x0={-600}
        x1={2200}
        groundY={880}
        h={70}
        maxTiers={2}
        patternId={`${id}-corr`}
      />
      <rect x={-2000} y={880} width={6000} height={2000} fill="#D6DCE4" />
    </IllustrationFrame>
  );
};
