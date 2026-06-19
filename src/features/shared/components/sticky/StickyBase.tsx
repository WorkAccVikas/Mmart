import { cn } from "@/lib/utils";
import type { StickyContainerProps } from "./sticky.types";

export function StickyBase({ children, className, ref }: StickyContainerProps) {
  return (
    <div ref={ref} className={cn("sticky z-10", className)}>
      {children}
    </div>
  );
}
