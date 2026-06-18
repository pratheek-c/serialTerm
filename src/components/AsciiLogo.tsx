import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

/**
 * ASCII art DMS logo — alternating green/cyan lines.
 */
export function AsciiLogo() {
  return (
    <box flexDirection="column" gap={0} alignItems="center">
      <text content="  ██████╗ ███╗   ███╗███████╗" fg={theme.fg.green} />
      <text content="  ██╔══██╗████╗ ████║██╔════╝" fg={theme.fg.green} attributes={TextAttributes.DIM} />
      <text content="  ██║  ██║██╔████╔██║███████╗" fg={theme.fg.cyan} />
      <text content="  ██║  ██║██║╚██╔╝██║╚════██║" fg={theme.fg.cyan} attributes={TextAttributes.DIM} />
      <text content="  ██████╔╝██║ ╚═╝ ██║███████║" fg={theme.fg.green} />
      <text content="  ╚═════╝ ╚═╝     ╚═╝╚══════╝" fg={theme.fg.green} attributes={TextAttributes.DIM} />
    </box>
  );
}

/**
 * Version badge — "[SERIAL TERMINAL v2.1]".
 */
export function VersionBadge() {
  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text content="[" fg={theme.fg.dim} />
      <text content="SERIAL TERMINAL" fg={theme.fg.green} attributes={TextAttributes.BOLD} />
      <text content="v2.1" fg={theme.fg.grey} />
      <text content="]" fg={theme.fg.dim} />
    </box>
  );
}
