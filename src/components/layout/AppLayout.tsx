import type { ReactNode } from "react";
import { theme } from "../../types";
import { useResponsive } from "../../hooks/useResponsive";

interface AppLayoutProps {
  children?: ReactNode;
}

/**
 * AppLayout — root-level wrapper.
 * Full-height flex column with the macOS Terminal dark base background.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <box flexGrow={1} flexDirection="column" backgroundColor={theme.bg.base}>
      {children}
    </box>
  );
}

interface PanelGroupProps {
  /** Left panel content. */
  left: ReactNode;
  /** Right panel content. */
  right: ReactNode;
  /** Gap between panels. */
  gap?: number;
  /** Outer padding. */
  padding?: number;
}

/**
 * PanelGroup — responsive side-by-side layout.
 *
 * - **Large terminals (≥ breakpoints.sm / 60 cols):** row layout,
 *   left gets ~35% width, right fills the rest.
 * - **Small terminals (< 60 cols):** column layout, left stacked
 *   above right for comfortable single-column reading.
 */
export function PanelGroup({
  left,
  right,
  gap = 1,
  padding = 1,
}: PanelGroupProps) {
  const resp = useResponsive();

  return (
    <box
      flexGrow={1}
      flexDirection={resp.canSplit ? "row" : "column"}
      gap={gap}
      padding={padding}
    >
      {/* ── Left panel ── */}
      <box
        flexDirection="column"
        width={resp.canSplit ? (resp.portListWidth as number) : ("100%" as `${number}%`)}
      >
        {left}
      </box>

      {/* ── Right panel ── */}
      <box flexDirection="column" flexGrow={1}>
        {right}
      </box>
    </box>
  );
}

interface CenterContentProps {
  children?: ReactNode;
  flexGrow?: number;
}

/**
 * CenterContent — centers children both horizontally and vertically.
 * Used for login / splash screens.
 */
export function CenterContent({ children, flexGrow = 1 }: CenterContentProps) {
  return (
    <box alignItems="center" justifyContent="center" flexGrow={flexGrow}>
      {children}
    </box>
  );
}
