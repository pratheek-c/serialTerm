import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

interface StatusDotProps {
  status: "active" | "inactive" | "success" | "error" | "warning";
  label?: string;
}

const dotMap = {
  active:   { char: "●", color: theme.fg.success },
  inactive: { char: "○", color: theme.fg.dim },
  success:  { char: "●", color: theme.fg.success },
  error:    { char: "●", color: theme.fg.danger },
  warning:  { char: "●", color: theme.fg.warning },
};

/**
 * A single coloured dot with optional label — compact status indicator.
 */
export function StatusDot({ status, label }: StatusDotProps) {
  const d = dotMap[status];

  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text content={d.char} fg={d.color} attributes={TextAttributes.BOLD} />
      {label && <text content={label} fg={d.color} />}
    </box>
  );
}
