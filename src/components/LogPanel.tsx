import { TextAttributes } from "@opentui/core";
import { theme, type LogEntry } from "../types";

interface LogPanelProps {
  entries: LogEntry[];
  height?: number;
}

let _logId = 0;

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

const LEVEL_STYLE: Record<LogEntry["level"], { prefix: string; color: string }> = {
  info:    { prefix: "•",   color: theme.fg.grey },
  success: { prefix: "✓",  color: theme.fg.green },
  warn:    { prefix: "⚠", color: theme.fg.yellow },
  error:   { prefix: "✖", color: theme.fg.red },
};

/**
 * LogPanel — scrollable system log with severity-coloured prefixes.
 *
 * [14:23:10] •  Scanning serial ports...
 * [14:23:11] ✓  Found 5 serial port(s)
 * [14:23:12] ✓  Scan completed
 */
export function LogPanel({ entries, height = 10 }: LogPanelProps) {
  // Show most recent entries, up to `height` lines
  const visible = entries.slice(-height);

  return (
    <box
      flexDirection="column"
      backgroundColor={theme.bg.log}
      borderStyle="single"
      borderColor={theme.border.default}
    >
      {/* ── Header ── */}
      <box
        height={2}
        alignItems="center"
        paddingLeft={2}
        backgroundColor={theme.bg.header}
      >
        <text content="SYSTEM LOG" fg={theme.fg.white} attributes={TextAttributes.BOLD} />
        <box flexGrow={1} />
        <text content={`${entries.length} entries`} fg={theme.fg.grey} />
      </box>

      {/* ── Body ── */}
      <box flexDirection="column" gap={0} height={height} paddingLeft={2} paddingTop={1}>
        {visible.length === 0 ? (
          <text content="  No log entries yet." fg={theme.fg.dim} />
        ) : (
          visible.map((entry) => {
            const s = LEVEL_STYLE[entry.level];
            return (
              <box key={entry.id} flexDirection="row" gap={1}>
                <text content={`[${entry.timestamp}]`} fg={theme.fg.dim} />
                <text content={s.prefix} fg={s.color} attributes={TextAttributes.BOLD} />
                <text content={entry.text} fg={s.color} />
              </box>
            );
          })
        )}
      </box>
    </box>
  );
}
