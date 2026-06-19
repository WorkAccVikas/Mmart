import { cn } from "@/lib/utils";
import { StickyBase } from "./StickyBase";
import type { StickyContainerProps } from "./sticky.types";

export default function StickyTop({
  className,
  ...props
}: StickyContainerProps) {
  return <StickyBase className={cn("top-0 shrink-0", className)} {...props} />;
}
