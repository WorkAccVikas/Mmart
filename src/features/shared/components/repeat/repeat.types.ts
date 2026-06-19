import type { ReactNode } from "react";

export interface IRepeatProps {
  count: number; // Number of items to render.

  render?: (index: number) => ReactNode; // Optional custom renderer.

  /**
   * Maximum allowed items.
   * Prevents accidental large renders.
   */
  maxCount?: number;
}
