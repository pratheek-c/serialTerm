import { TextAttributes } from "@opentui/core";
import { theme, type ComPortInfo } from "../types";
import { StatusDot } from "./StatusDot";

interface DataTableProps {
  ports: ComPortInfo[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onConnect: (port: ComPortInfo) => void;
  loading?: boolean;
  error?: string;
}

/**
 * DataTable — structured serial port management table.
 *
 * ┌───────┬──────────────────┬────────┬──────────┬──────────────┬──────────┐
 * │ PORT  │ NAME             │ STATUS │ BAUD     │ DESCRIPTION  │ ACTION   │
 * ├───────┼──────────────────┼────────┼──────────┼──────────────┼──────────┤
 * │ COM3  │ USB Serial Port  │ ● ACT  │ 9600 bps │ FTDI Driver  │ [OPEN]   │
 * │ COM4  │ Debug Interface  │ ○ OFF  │ —        │ CH340        │ —        │
 * └───────┴──────────────────┴────────┴──────────┴──────────────┴──────────┘
 */
export function DataTable({
  ports,
  selectedIndex,
  onSelect,
  onConnect,
  loading,
  error,
}: DataTableProps) {
  // Column widths
  const colPort = 7;
  const colName = 20;
  const colStatus = 8;
  const colBaud = 12;
  const colDesc = 22;
  const colAction = 8;
  const totalWidth =
    colPort + colName + colStatus + colBaud + colDesc + colAction + 11;

  const cell = (text: string, width: number, fg?: string) => (
    <text
      content={text.padEnd(width)}
      fg={fg ?? theme.fg.default}
    />
  );

  const headerBg = theme.bg.header;

  return (
    <box
      flexDirection="column"
      backgroundColor={theme.bg.surface}
      borderStyle="single"
      borderColor={theme.border.default}
    >
      {/* ── Panel title ── */}
      <box
        height={2}
        alignItems="center"
        paddingLeft={2}
        backgroundColor={headerBg}
      >
        <text
          content=">_ SERIAL PORT TABLE"
          fg={theme.fg.accent}
          attributes={TextAttributes.BOLD}
        />
        <box flexGrow={1} />
        <text content={` ${ports.length} devices`} fg={theme.fg.muted} />
      </box>

      {/* ── Column headers ── */}
      <box
        height={2}
        alignItems="center"
        paddingLeft={2}
        backgroundColor={theme.bg.elevated}
        gap={1}
      >
        {cell("PORT", colPort, theme.fg.dim)}
        {cell("NAME", colName, theme.fg.dim)}
        {cell("STATUS", colStatus, theme.fg.dim)}
        {cell("BAUD", colBaud, theme.fg.dim)}
        {cell("DESCRIPTION", colDesc, theme.fg.dim)}
        {cell("ACTION", colAction, theme.fg.dim)}
      </box>

      {/* ── Body ── */}
      {loading ? (
        <box height={4} alignItems="center" justifyContent="center">
          <text content=" Scanning serial ports..." fg={theme.fg.muted} />
        </box>
      ) : error ? (
        <box height={4} alignItems="center" justifyContent="center">
          <text content={`⚠ ${error}`} fg={theme.fg.danger} />
        </box>
      ) : ports.length === 0 ? (
        <box height={4} alignItems="center" justifyContent="center">
          <text content=" No serial ports detected." fg={theme.fg.dim} />
        </box>
      ) : (
        ports.map((port, idx) => {
          const isSelected = idx === selectedIndex;
          const isActive = port.status === "active";
          const rowBg = isSelected ? theme.bg.selected : "transparent";

          return (
            <box
              key={port.name}
              height={2}
              alignItems="center"
              paddingLeft={2}
              backgroundColor={rowBg}
              gap={1}
            >
              {cell(port.name.padEnd(6), colPort, isActive ? theme.fg.accent : theme.fg.dim)}
              {cell(port.description.slice(0, colName - 1), colName, isSelected ? theme.fg.default : theme.fg.muted)}
              <box width={colStatus}>
                <StatusDot status={isActive ? "active" : "inactive"} label={isActive ? "ACT" : "OFF"} />
              </box>
              {cell(port.baudRate?.slice(0, colBaud - 1) ?? "—", colBaud, theme.fg.muted)}
              {cell(port.description.slice(0, colDesc - 1), colDesc, theme.fg.dim)}
              <box width={colAction} justifyContent="center">
                {isActive ? (
                  <text
                    content="[OPEN]"
                    fg={isSelected ? theme.fg.accent : theme.fg.cyan}
                    attributes={isSelected ? TextAttributes.BOLD : 0}
                  />
                ) : (
                  <text content="  —  " fg={theme.fg.dim} />
                )}
              </box>
            </box>
          );
        })
      )}
    </box>
  );
}
