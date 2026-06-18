import { TextAttributes } from "@opentui/core";
import { theme, type LogEntry } from "../types";

interface LogPanelProps {
  entries: LogEntry[];
  height?: number;
}

let _logId = 0;

/**
 * Create a log entry.
 */
export function makeLog(
  text: string,
  level: LogEntry["level"] = "info",
): LogEntry {
  return {
    id: ++_logId,
    timestamp: new Date().toLocaleTimeString(),
    text,
    level,
  };
}

const levelFg: Record<LogEntry["level"], string> = {
  info: theme.fg.muted,
  success: theme.fg.success,
  warn: theme.fg.warning,
  error: theme.fg.danger,
};

const levelPrefix: Record<LogEntry["level"], string> = {
  info: " •",
  success: " ✓",
  warn: " ⚠",
  error: " ✗",
};

/**
 * LogPanel — a scrollable, timestamped system log at the bottom of the dashboard.
 *
 * [14:23:10] • Scanning serial ports...
 * [14:23:11] ✓ Found 5 serial port(s)
 * [14:23:12] ✓ Scan completed successfully
 */
export function LogPanel({ entries, height = 8 }: LogPanelProps) {
  return (
    <box
      flexDirection="column"
      backgroundColor={theme.bg.log}
      borderStyle="single"
      borderColor={theme.border.default}
    >
      {/* Header */}
      <box
        height={2}
        alignItems="center"
        paddingLeft={2}
        backgroundColor={theme.bg.header}
      >
        <text
          content=">_ SYSTEM LOG"
          fg={theme.fg.accent}
          attributes={TextAttributes.BOLD}
        />
      </box>

      {/* Log entries */}
      <box
        flexDirection="column"
        gap={0}
        height={height}
        paddingLeft={2}
        paddingTop={1}
      >
        {entries.length === 0 ? (
          <text content="  No log entries yet." fg={theme.fg.dim} />
        ) : (
          entries.map((entry) => (
            <box key={entry.id} flexDirection="row" gap={2}>
              <text
                content={`[${entry.timestamp}]`}
                fg={theme.fg.dim}
              />
              <text
                content={levelPrefix[entry.level]}
                fg={levelFg[entry.level]}
              />
              <text
                content={entry.text}
                fg={levelFg[entry.level]}
              />
            </box>
          ))
        )}
      </box>
    </box>
  );
}
