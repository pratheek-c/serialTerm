import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

/**
 * Large ASCII art logo for the login screen left panel.
 * A stylised "DMS" with terminal aesthetic.
 */
export function AsciiLogo() {
  return (
    <box flexDirection="column" gap={0} alignItems="center">
      <text content="  ██████╗ ███╗   ███╗███████╗" fg={theme.fg.accent} />
      <text content="  ██╔══██╗████╗ ████║██╔════╝" fg={theme.fg.accent} attributes={TextAttributes.DIM} />
      <text content="  ██║  ██║██╔████╔██║███████╗" fg={theme.fg.cyan} />
      <text content="  ██║  ██║██║╚██╔╝██║╚════██║" fg={theme.fg.cyan} attributes={TextAttributes.DIM} />
      <text content="  ██████╔╝██║ ╚═╝ ██║███████║" fg={theme.fg.accent} />
      <text content="  ╚═════╝ ╚═╝     ╚═╝╚══════╝" fg={theme.fg.accent} attributes={TextAttributes.DIM} />
    </box>
  );
}

/**
 * Smaller horizontal badge — "SERIAL TERMINAL v2.1".
 */
export function VersionBadge() {
  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text content="[" fg={theme.fg.dim} />
      <text content="SERIAL TERMINAL" fg={theme.fg.accent} attributes={TextAttributes.BOLD} />
      <text content="v2.1" fg={theme.fg.muted} />
      <text content="]" fg={theme.fg.dim} />
    </box>
  );
}
