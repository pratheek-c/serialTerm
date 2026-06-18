import { useTerminalDimensions } from "@opentui/react";
import { breakpoints, type ScreenSize } from "../types";

export interface ResponsiveInfo {
  /** Current width in character columns. */
  width: number;
  /** Current height in character rows. */
  height: number;
  /** Named breakpoint. */
  size: ScreenSize;
  /** True when width < breakpoints.sm (60). */
  isSmall: boolean;
  /** True when width >= breakpoints.sm and < breakpoints.md. */
  isMedium: boolean;
  /** True when width >= breakpoints.md. */
  isLarge: boolean;
  /** True when terminal is wide enough for side-by-side panels (≥ md). */
  canSplit: boolean;
  /** Computed login card width: narrow on small, comfortable on large. */
  loginCardWidth: number;
  /** Computed port list panel width: narrower on small, wider on large. */
  portListWidth: number | string;
  /** Computed command input width. */
  inputWidth: number;
}

/**
 * Hook that returns responsive sizing info based on the actual terminal dimensions.
 * Every value reactively updates when the user resizes their terminal window.
 */
export function useResponsive(): ResponsiveInfo {
  const { width, height } = useTerminalDimensions();

  const size: ScreenSize =
    width < breakpoints.sm ? "sm" : width < breakpoints.md ? "md" : "lg";

  const isSmall = size === "sm";
  const isMedium = size === "md";
  const isLarge = size === "lg";
  const canSplit = width >= breakpoints.sm;

  // Login card: 80% width on small, fixed 54 on medium, 58 on large
  const loginCardWidth = isSmall ? width - 4 : isMedium ? 54 : 58;

  // Port list panel: min 32 cols on small, percentage on large
  const portListWidth: number | string = isSmall
    ? "100%"
    : isMedium
      ? 38
      : Math.min(48, Math.floor(width * 0.35));

  // Command input: fill available space
  const inputWidth = isSmall ? width - 8 : Math.min(80, width - 12);

  return {
    width,
    height,
    size,
    isSmall,
    isMedium,
    isLarge,
    canSplit,
    loginCardWidth,
    portListWidth,
    inputWidth,
  };
}
