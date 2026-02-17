import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadIBMPlexSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadHeebo } from "@remotion/google-fonts/Heebo";

const dmSans = loadDMSans("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const ibmPlexSans = loadIBMPlexSans("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

const heebo = loadHeebo("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["hebrew"],
});

export const FONT_HEADING = `${dmSans.fontFamily}, ${heebo.fontFamily}, sans-serif`;
export const FONT_BODY = `${ibmPlexSans.fontFamily}, ${heebo.fontFamily}, sans-serif`;
export const FONT_MONO = `${ibmPlexSans.fontFamily}, monospace`;
