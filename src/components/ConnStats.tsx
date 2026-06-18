import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

interface ConnStatsProps {
  connected: number;
  disconnected: number;
  total: number;
  username?: string;
}

/**
 * Connection statistics bar — rendered at the top of the dashboard.
 * Shows counts of connected/disconnected/total devices.
 */
export function ConnStats({
  connected,
  disconnected,
  total,
  username,
}: ConnStatsProps) {
  return (
    <box
      height={3}
      backgroundColor={theme.bg.header}
      alignItems="center"
      justifyContent="space-between"
      paddingLeft={3}
      paddingRight={3}
      borderStyle="single"
      borderColor={theme.border.muted}
    >
      {/* Left: stats */}
      <box alignItems="center" gap={3}>
        <text content="◈" fg={theme.fg.accent} attributes={TextAttributes.BOLD} />
        <box flexDirection="row" gap={1}>
          <text content="Connected:" fg={theme.fg.muted} />
          <text content={String(connected)} fg={theme.fg.success} attributes={TextAttributes.BOLD} />
        </box>
        <box flexDirection="row" gap={1}>
          <text content="Disconnected:" fg={theme.fg.muted} />
          <text content={String(disconnected)} fg={theme.fg.danger} attributes={TextAttributes.BOLD} />
        </box>
        <box flexDirection="row" gap={1}>
          <text content="Total:" fg={theme.fg.muted} />
          <text content={String(total)} fg={theme.fg.default} />
        </box>
      </box>

      {/* Right: user */}
      {username && (
        <box alignItems="center" gap={1}>
          <text content="@" fg={theme.fg.dim} />
          <text content={username} fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
        </box>
      )}
    </box>
  );
}
