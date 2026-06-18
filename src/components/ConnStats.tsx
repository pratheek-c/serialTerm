import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

interface ConnStatsProps {
  total: number;
  active: number;
  busy: number;
  errors: number;
  username?: string;
}

/**
 * ConnStats — dashboard metrics bar (k9s-style).
 *
 *  Ports Found: 4   Connected: 3   Busy: 1   Errors: 0   │ ● admin
 */
export function ConnStats({
  total,
  active,
  busy,
  errors,
  username,
}: ConnStatsProps) {
  return (
    <box
      height={2}
      backgroundColor={theme.bg.header}
      alignItems="center"
      justifyContent="space-between"
      paddingLeft={3}
      paddingRight={3}
      borderStyle="single"
      borderColor={theme.border.muted}
    >
      {/* Left: metrics */}
      <box alignItems="center" gap={2}>
        <text content="Ports Found:" fg={theme.fg.grey} />
        <text content={String(total)} fg={theme.fg.white} attributes={TextAttributes.BOLD} />
        <text content="│" fg={theme.border.default} />
        <text content="Connected:" fg={theme.fg.grey} />
        <text content={String(active)} fg={theme.fg.green} attributes={TextAttributes.BOLD} />
        <text content="│" fg={theme.border.default} />
        <text content="Busy:" fg={theme.fg.grey} />
        <text content={String(busy)} fg={theme.fg.yellow} attributes={TextAttributes.BOLD} />
        <text content="│" fg={theme.border.default} />
        <text content="Errors:" fg={theme.fg.grey} />
        <text content={String(errors)} fg={theme.fg.red} attributes={TextAttributes.BOLD} />
      </box>

      {/* Right: user */}
      {username && (
        <box alignItems="center" gap={1}>
          <text content="●" fg={theme.fg.green} />
          <text content={username.toUpperCase()} fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
        </box>
      )}
    </box>
  );
}
