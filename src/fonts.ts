/**
 * Font loading. Imported once from Root.tsx so it runs in the Studio and in
 * every render tab.
 *
 * - Montserrat (body) and the two fallbacks come from @remotion/google-fonts
 *   with the Vietnamese subset.
 * - SVN-Harabaras and UTM Micra are licensed files. They are loaded with
 *   @remotion/fonts only when they exist in public/, so a missing file never
 *   breaks a render; the fallback in the font stack takes over instead.
 */
import { loadFont } from "@remotion/fonts";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadChakraPetch } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { staticFile } from "remotion";
import { FONT_FILES } from "./brand";
import { hasPublicFile } from "./lib/assets";

const SUBSETS = ["latin", "latin-ext", "vietnamese"] as const;

loadMontserrat("normal", {
  weights: ["400", "500", "600"],
  subsets: [...SUBSETS],
});
loadBeVietnamPro("normal", { weights: ["800"], subsets: [...SUBSETS] });
loadChakraPetch("normal", { weights: ["600"], subsets: [...SUBSETS] });

/** True when the licensed display font is in public/. */
export const HAS_DISPLAY_FONT = hasPublicFile(FONT_FILES.display.file);
/** True when the licensed sub-headline font is in public/. */
export const HAS_SUB_FONT = hasPublicFile(FONT_FILES.sub.file);

for (const font of [FONT_FILES.display, FONT_FILES.sub]) {
  if (hasPublicFile(font.file)) {
    loadFont({
      family: font.family,
      url: staticFile(font.file),
      // Single-weight files: accept any requested weight so the browser never
      // synthesises a faux bold on top of the real design.
      weight: "100 900",
    });
  }
}
