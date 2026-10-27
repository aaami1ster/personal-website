import { Fragment } from "react";
import { localeDirection, type Locale } from "@/i18n/routing";

// A run of Latin words: technology names, acronyms and figures such as
// "IPS/SARIE", "Node.js", "C++", "OpenAI Agents SDK" or "6". Runs start and end
// on a letter, digit, "+" or "#", so surrounding punctuation stays outside.
const word = String.raw`[A-Za-z0-9](?:[A-Za-z0-9.+#/&-]*[A-Za-z0-9+#])?`;
const latinRun = new RegExp(`(${word}(?: ${word})*)`);

/**
 * Renders plain data text. On RTL pages every Latin run inside Arabic text is
 * wrapped in `<bdi>`, so adjacent punctuation ("BMS:", "(CBS)", "C++") cannot
 * reorder (design spec §9.3). LTR pages get the text unchanged.
 */
export function BidiText({ text, locale }: { text: string; locale: Locale }) {
  if (localeDirection[locale] === "ltr") return text;
  return text
    .split(latinRun)
    .map((part, i) =>
      i % 2 === 1 ? <bdi key={i}>{part}</bdi> : <Fragment key={i}>{part}</Fragment>,
    );
}
