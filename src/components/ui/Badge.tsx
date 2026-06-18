import { TextAttributes } from "@opentui/core";
import { theme } from "../../types";

type BadgeVariant =
  | "active"
  | "inactive"
  | "success"
  | "danger"
  | "warning"
  | "info";

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  bold?: boolean;
}

const variantColors: Record<BadgeVariant, { fg: string; dot: string }> = {
  active:   { fg: theme.fg.success, dot: "●" },
  inactive: { fg: theme.fg.dim,     dot: "○" },
  success:  { fg: theme.fg.success, dot: "✓" },
  danger:   { fg: theme.fg.danger,  dot: "✗" },
  warning:  { fg: theme.fg.warning, dot: "⚠" },
  info:     { fg: theme.fg.muted,   dot: "ℹ" },
};

/**
 * Badge — compact status indicator with a coloured dot + label.
 *
 *   ● ACTIVE    ○ INACTIVE    ✗ ERROR
 */
export function Badge({ children, variant = "info", bold: isBold }: BadgeProps) {
  const c = variantColors[variant];

  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text content={c.dot} fg={c.fg} attributes={TextAttributes.BOLD} />
      <text
        content={children}
        fg={c.fg}
        attributes={isBold ? TextAttributes.BOLD : 0}
      />
    </box>
  );
}
