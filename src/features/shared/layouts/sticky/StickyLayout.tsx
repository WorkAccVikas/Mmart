import { Children, isValidElement, type ReactNode } from "react";

interface StickyLayoutProps {
  children: ReactNode;
}

interface SlotProps {
  children: ReactNode;
}

function Top({ children }: SlotProps) {
  return children;
}

function Content({ children }: SlotProps) {
  return children;
}

function Bottom({ children }: SlotProps) {
  return children;
}

export function StickyLayout({ children }: StickyLayoutProps) {
  let top: ReactNode = null;
  let content: ReactNode = null;
  let bottom: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Top) {
      top = child.props.children;
    }

    if (child.type === Content) {
      content = child.props.children;
    }

    if (child.type === Bottom) {
      bottom = child.props.children;
    }
  });

  return (
    <div className="flex min-h-dvh flex-col">
      {top && <div className="sticky top-0 z-10 shrink-0">{top}</div>}

      <main className="flex-1">{content}</main>

      {bottom && <div className="sticky bottom-0 z-10 shrink-0">{bottom}</div>}
    </div>
  );
}

StickyLayout.Top = Top;
StickyLayout.Content = Content;
StickyLayout.Bottom = Bottom;
