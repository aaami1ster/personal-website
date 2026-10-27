import type { ReactNode } from "react";

/**
 * `<Ltr>` (design spec §9.3): isolates an inline technical string (an API
 * path, "IPS/SARIE", a class name) as left-to-right inside Arabic prose, so
 * adjacent punctuation cannot reorder.
 */
export function Ltr({ children }: { children?: ReactNode }) {
  return <bdi dir="ltr">{children}</bdi>;
}
