import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

type DotStatus = "active" | "busy" | "idle" | "error";

interface StatusDotProps {
  status: DotStatus;
  label?: string;
  /** Show the label inline after the dot (default true). */
  showLabel?: boolean;
}

const dotStyle: Record<DotStatus, { char: string; color: string }> = {
  active: { char: "●", color: theme.fg.green },
  busy:   { char: "◐", color: theme.fg.yellow },
  idle:   { char: "○", color: theme.fg.dim },
  error:  { char: "✖", color: theme.fg.red },
};

const labelMap: Record<DotStatus, string> = {
  active: "ACTIVE",
  busy:   "BUSY",
  idle:   "IDLE",
  error:  "ERROR",
};

/**
 * StatusDot — coloured status icon with optional label.
 *
 *   ● ACTIVE    ◐ BUSY    ○ IDLE    ✖ ERROR
 */
export function StatusDot({
  status,
  label,
  showLabel = true,
}: StatusDotProps) {
  const d = dotStyle[status];
  const lbl = label ?? labelMap[status];

  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text content={d.char} fg={d.color} attributes={TextAttributes.BOLD} />
      {showLabel && <text content={lbl} fg={d.color} />}
    </box>
  );
}
