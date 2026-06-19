import { memo } from "react";

import type { IRepeatProps } from "./repeat.types";
import DefaultCard from "./default-card";

const DEFAULT_MAX_COUNT = 1_00_00_00;

const normalizeCount = (
  count: number,
  maxCount: number = DEFAULT_MAX_COUNT,
): number => {
  if (!Number.isFinite(count)) {
    return 0;
  }

  const normalized = Math.floor(count);

  if (normalized <= 0) {
    return 0;
  }

  return Math.min(normalized, maxCount);
};

const Repeat = ({
  count,
  render,
  maxCount = DEFAULT_MAX_COUNT,
}: IRepeatProps) => {
  const totalItems = normalizeCount(count, maxCount);

  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      {Array.from({ length: totalItems }, (_, index) =>
        createCard(index, render),
      )}
    </>
  );
};

Repeat.displayName = "Repeat";

export default memo(Repeat);

const createCard = (
  index: number,
  render?: (index: number) => React.ReactNode,
) => {
  if (render) {
    return render(index);
  }

  return <DefaultCard key={`card-${index}`} index={index} />;
};
