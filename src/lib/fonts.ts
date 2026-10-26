import {
  IBM_Plex_Sans_Arabic,
  Inter,
  JetBrains_Mono,
  Noto_Naskh_Arabic,
} from "next/font/google";

// All four families are SIL Open Font License 1.1. next/font downloads them
// at build time and serves them from this site's origin.

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Inter's generated fallback face is local Arial, which has Arabic glyphs and
// would shadow the Arabic fonts in the Arabic stack. Expose the Inter face on
// its own (first family in the stack) so the Arabic stack can skip the fallback.
export const interFaceOnly = inter.style.fontFamily.split(",")[0].trim();

// Both locales share one root layout, so preloading here would also preload
// the Arabic files on English pages. Arabic faces load on demand with swap.
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

export const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-naskh",
  display: "swap",
  preload: false,
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  inter.variable,
  plexArabic.variable,
  naskh.variable,
  jetbrains.variable,
].join(" ");
