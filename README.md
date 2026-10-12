# PAD - Phuoc An Depot: Brand Identity Debut

A 45-second brand reveal film built with [Remotion](https://www.remotion.dev).
Clean, precise, premium logistics aesthetic. All on-screen copy is Vietnamese.

| Composition             | Size      | FPS | Frames | Length |
| ----------------------- | --------- | --- | ------ | ------ |
| `PADBrandDebut`         | 1920x1080 | 30  | 1350   | 45 s   |
| `PADBrandDebutVertical` | 1080x1920 | 30  | 1350   | 45 s   |

Both compositions use the same scenes. Every scene reads the frame size with
`useVideoConfig()` and switches to a vertical layout (60px margins instead of 120px).

## Commands

```console
npm install
npm run dev                                                 # Remotion Studio
npx remotion render PADBrandDebut out/pad-16x9.mp4
npx remotion render PADBrandDebutVertical out/pad-9x16.mp4
npm run lint                                                # ESLint + TypeScript
```

## Scenes

| #   | Scene                      | Frames      | File                                    |
| --- | -------------------------- | ----------- | --------------------------------------- |
| 1   | Signal                     | 0 to 90     | `src/scenes/Scene1Signal.tsx`           |
| 2   | Logo Construction (hero)   | 90 to 300   | `src/scenes/Scene2LogoConstruction.tsx` |
| 3   | Brand Idea                 | 300 to 450  | `src/scenes/Scene3BrandIdea.tsx`        |
| 4   | Color Palette              | 450 to 600  | `src/scenes/Scene4ColorPalette.tsx`     |
| 5   | Typography                 | 600 to 735  | `src/scenes/Scene5Typography.tsx`       |
| 6   | Graphic System and Pattern | 735 to 885  | `src/scenes/Scene6GraphicSystem.tsx`    |
| 7   | Icon System                | 885 to 1005 | `src/scenes/Scene7IconSystem.tsx`       |
| 8   | Applications Montage       | 1005 to 1230| `src/scenes/Scene8Applications.tsx`     |
| 9   | Outro                      | 1230 to 1350| `src/scenes/Scene9Outro.tsx`            |

All colours, fonts, timings, BPM, copy and asset names live in `src/brand.ts`.

## File tree

```
public/
  logo-vertical.svg          approved vertical lockup (groups: P, A, D, PHUOC_AN, DEPOT)
  logo-horizontal.svg        approved horizontal lockup (same groups)
  music.mp3                  PLACEHOLDER music bed, 120 BPM (replace)
  whoosh.mp3, hit.mp3,       PLACEHOLDER sound effects (replace)
  click.mp3
src/
  index.ts                   entry point
  Root.tsx                   registers both compositions, loads fonts
  PADBrandDebut.tsx          scene timeline and soundtrack
  brand.ts                   brand tokens, fonts, motion, timings, BPM, assets
  fonts.ts                   Montserrat + fallbacks, licensed fonts when present
  audio/Soundtrack.tsx       music with fades, whoosh/hit/click cues
  logo/
    paths.ts                 logo path data (wordmark traced from the artwork)
    monogram.ts              parametric P, A, D: primitive shape to final letter
    Logo.tsx                 LogoGroup (animatable) and static Logo
  components/
    RouteLines.tsx           route lines (60 degree kink, strokeDashoffset draw)
    ModuleBlock.tsx          parallelogram module blocks (-20 degree skew)
    GlassPanels.tsx          translucent parallax panels
    AccentDash.tsx           40x4 orange dash above headlines
    Headline.tsx             two-tone display headline with mask reveal
    SceneChrome.tsx          header logo, footer index label, page background
    ParaMask.tsx             parallelogram image mask
    Media.tsx                photo with Ken Burns, or built-in illustration
    TextEffects.tsx          type-on, letter fade, hex scramble
    BentoCollage.tsx         applications collage (Scene 8 and 9)
  illustrations/             vector stand-ins for photos and mockups, icons, pattern
  scenes/                    one component per scene
  transitions/skewedWipe.tsx custom @remotion/transitions presentation
  lib/                       layout, motion, geometry, montage timing, asset checks
```

## Assets to supply

The film renders out of the box. Each asset below is picked up automatically
as soon as the file is added to `public/` (checked with `getStaticFiles()`).

| File                                   | Used in           | Until supplied                         |
| -------------------------------------- | ----------------- | -------------------------------------- |
| `SVN-Harabaras.otf`                    | all headlines     | Be Vietnam Pro ExtraBold               |
| `UTM-Micra.ttf`                        | sub-headlines     | Chakra Petch SemiBold                  |
| `photo-modern.jpg`                     | Scene 3 card 1    | vector container stack                 |
| `photo-precise.jpg`                    | Scene 3 card 2    | vector container door close-up         |
| `photo-connected.jpg`                  | Scene 3 card 3    | vector aerial yard with route          |
| `photo-port.jpg`                       | Scene 3 backdrop  | vector port panorama                   |
| `app-stationery.jpg` ... `app-digital.jpg` | Scene 8       | vector mockups with the real logo      |

Both fallback fonts have full Vietnamese coverage. After adding the licensed
fonts, check the headline widths in the Studio (Scene 3, 4 and 6 headlines are
120px in landscape, 104px in vertical).

**Audio:** `music.mp3`, `whoosh.mp3`, `hit.mp3` and `click.mp3` are synthesized
placeholders so the edit can be timed and previewed. Replace them with licensed
audio using the same file names. If the new track is not 120 BPM, set `BPM` in
`src/brand.ts`; the Scene 8 montage cuts are derived from it and always land on
a beat.

## Logo

- `src/logo/monogram.ts` rebuilds P, A and D as exact geometry measured from the
  approved artwork. One parameter morphs each letter from its primitive shape
  (rounded rectangle, triangle) into the final letterform, which drives the
  construction in Scene 2.
- The PHUOC AN and DEPOT wordmarks are vector traces of the supplied artwork.
  If the original vector file is available, paste its path data into
  `src/logo/paths.ts` and the SVGs in `public/`.
- Grid used by the construction guides: x = monogram height / 3. Monogram
  height 3x, P stem x, monogram to wordmark 0.55x, PHUOC AN to DEPOT 0.4x.
- Only the full-colour and reversed (white + orange) versions are used. The
  logo is never rotated, recoloured or distorted after construction.

## License

Remotion is free for individuals and companies of up to 3 people. Larger teams
need a company license: https://www.remotion.pro/license
