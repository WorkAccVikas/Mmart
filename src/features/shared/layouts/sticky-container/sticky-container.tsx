import { cn } from "@/lib/utils";

interface StickyContainerProps {
  children: React.ReactNode;
  position?: "top" | "bottom"; // defaults to top
  className?: string;
}

const StickyContainer = ({
  children,
  position = "top",
  className = "",
}: StickyContainerProps) => {
  const positionClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div className={cn(`sticky ${positionClass} z-10`, className)}>
      {children}
    </div>
  );
};

export default StickyContainer;
