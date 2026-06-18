import { TextAttributes } from "@opentui/core";
import type { ReactNode } from "react";
import { theme } from "../../types";

interface ButtonProps {
  children: string;
  onActivate?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  focused?: boolean;
  width?: number;
  height?: number;
  icon?: string;
}

const variantStyles = {
  primary: {
    borderColor: theme.border.focus,
    textColor: theme.fg.accent,
    bg: theme.bg.surface,
    focusedBg: theme.bg.selected,
  },
  secondary: {
    borderColor: theme.border.default,
    textColor: theme.fg.default,
    bg: theme.bg.surface,
    focusedBg: theme.bg.selected,
  },
  danger: {
    borderColor: theme.border.danger,
    textColor: theme.fg.danger,
    bg: theme.bg.surface,
    focusedBg: "#f8514933",
  },
  ghost: {
    borderColor: "transparent",
    textColor: theme.fg.muted,
    bg: "transparent",
    focusedBg: theme.bg.hover,
  },
};

/**
 * Button — a focusable bordered box that acts as an activatable element.
 */
export function Button({
  children,
  variant = "secondary",
  focused = false,
  width = 16,
  height = 3,
  icon,
}: ButtonProps) {
  const styles = variantStyles[variant];
  const bgColor = focused ? styles.focusedBg : styles.bg;

  return (
    <box
      borderStyle="single"
      borderColor={styles.borderColor}
      width={width}
      height={height}
      backgroundColor={bgColor}
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
      gap={1}
    >
      {icon && <text content={icon} fg={styles.textColor} />}
      <text
        content={children}
        fg={styles.textColor}
        attributes={focused ? TextAttributes.BOLD : 0}
      />
    </box>
  );
}

interface ButtonBarProps {
  children?: ReactNode;
  justifyContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around";
  gap?: number;
  marginTop?: number;
}

/**
 * ButtonBar — horizontal row of buttons.
 */
export function ButtonBar({
  children,
  justifyContent = "center",
  gap = 2,
  marginTop = 1,
}: ButtonBarProps) {
  return (
    <box justifyContent={justifyContent} gap={gap} marginTop={marginTop}>
      {children}
    </box>
  );
}
