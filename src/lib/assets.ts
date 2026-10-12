import { getStaticFiles } from "@remotion/studio";

/**
 * Whether a file exists in public/. Works in the Studio and during rendering,
 * where the bundler embeds the list of public files in the page.
 */
export const hasPublicFile = (name: string): boolean => {
  try {
    return getStaticFiles().some((file) => file.name === name);
  } catch {
    return false;
  }
};
