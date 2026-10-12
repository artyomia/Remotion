import {
  APPLICATIONS,
  FRAMES_PER_BEAT,
  MONTAGE_BEATS_PER_SHOT,
  SCENES,
  beatToFrame,
} from "../brand";

/** Length of the diagonal wipe between montage shots. */
export const MONTAGE_WIPE = 10;

/**
 * Beat-aligned timing for the Scene 8 montage, derived from BPM.
 * Every wipe lands exactly on a beat (counted from the start of the film),
 * one shot every MONTAGE_BEATS_PER_SHOT beats. Whatever is left of the scene
 * after the last shot goes to the bento collage.
 */
export const getMontageTiming = () => {
  const { from, duration } = SCENES.applications;
  const firstBeat = Math.ceil(from / FRAMES_PER_BEAT - 1e-6);
  const shotCount = APPLICATIONS.length;

  // Local frames at which wipes into shots 2..N and into the collage land.
  const landings = Array.from(
    { length: shotCount },
    (_, k) => beatToFrame(firstBeat + (k + 1) * MONTAGE_BEATS_PER_SHOT) - from,
  );

  const shotDurations = landings.map((land, k) =>
    k === 0 ? land : land - landings[k - 1] + MONTAGE_WIPE,
  );
  const collageDuration = duration - (landings[shotCount - 1] - MONTAGE_WIPE);

  return {
    shotDurations,
    collageDuration,
    /** Absolute frames at which each wipe starts (for the whoosh SFX). */
    wipeStarts: landings.map((land) => from + land - MONTAGE_WIPE),
  };
};
