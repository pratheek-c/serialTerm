import { TextAttributes } from "@opentui/core";
import { theme, type ComPortInfo } from "../types";

interface DataTableProps {
  ports: ComPortInfo[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onConnect: (port: ComPortInfo) => void;
  loading?: boolean;
  error?: string;
}

// ─── Status rendering helpers (inline for perfect column alignment) ───
interface StatusMeta { dot: string; label: string; color: string }
const STATUS_MAP: { [key: string]: StatusMeta } = {
  active: { dot: "●", label: "ACTIVE", color: theme.fg.green },
  busy:   { dot: "◐", label: "BUSY",  color: theme.fg.yellow },
  idle:   { dot: "○", label: "IDLE",  color: theme.fg.dim },
  error:  { dot: "✖", label: "ERROR", color: theme.fg.red },
};

const COL_STATUS = 10;

function statusCell(port: ComPortInfo): { text: string; color: string } {
  const m: StatusMeta = STATUS_MAP[port.status] ?? STATUS_MAP.idle!;
  return { text: `${m.dot} ${m.label}`.padEnd(COL_STATUS), color: m.color };
}

/**
 * DataTable — k9s-style serial port management table.
 *
 * Each port occupies exactly ONE row at height={1}.
 * Columns are fixed-width for pixel-perfect alignment.
 *
 * PORT     STATUS     BAUD       TYPE             VENDOR         ACTION
 * COM6     ● ACTIVE   115200     BL Serial        Microsoft      [OPEN]
 * COM7     ◐ BUSY     9600       USB UART         FTDI           [BUSY]
 * COM8     ○ IDLE     —          Unknown          Generic          —
 */
export function DataTable({
  ports,
  selectedIndex,
  loading,
  error,
}: DataTableProps) {
  const COL = { port: 8, status: COL_STATUS, baud: 10, type: 18, vendor: 14, action: 8 };

  const cell = (text: string, w: number, color?: string) => (
    <text content={text.padEnd(w)} fg={color ?? theme.fg.grey} />
  );

  const inferType = (desc: string): string => {
    const s = desc.toLowerCase();
    if (s.includes("bluetooth") || s.includes("bt")) return "BL Serial";
    if (s.includes("usb") || s.includes("serial")) return "USB UART";
    if (s.includes("debug")) return "Debug IF";
    if (s.includes("com")) return "COM Port";
    return desc.slice(0, COL.type - 1).trim() || "Unknown";
  };

  const inferVendor = (desc: string): string => {
    const s = desc.toLowerCase();
    if (s.includes("ftdi")) return "FTDI";
    if (s.includes("microsoft")) return "Microsoft";
    if (s.includes("silicon") || s.includes("cp210")) return "SiLabs";
    if (s.includes("ch340") || s.includes("ch34")) return "WCH";
    if (s.includes("prolific") || s.includes("pl2303")) return "Prolific";
    return "Generic";
  };

  const baudText = (b?: string): string =>
    b ? b.replace(/\s*bps\s*/, "").trim() : "—";

  return (
    <box
      flexDirection="column"
      backgroundColor={theme.bg.surface}
      borderStyle="single"
      borderColor={theme.border.default}
    >
      {/* ── Panel heading ── */}
      <box
        height={2}
        alignItems="center"
        paddingLeft={2}
        backgroundColor={theme.bg.header}
      >
        <text content="SERIAL PORTS" fg={theme.fg.white} attributes={TextAttributes.BOLD} />
        <box flexGrow={1} />
        <text content={`${ports.length} Devices Found`} fg={theme.fg.grey} />
      </box>

      {/* ── Column headers ── */}
      <box height={1} alignItems="center" paddingLeft={2} gap={0}>
        {cell("PORT",   COL.port,   theme.fg.dim)}
        {cell("STATUS", COL.status, theme.fg.dim)}
        {cell("BAUD",   COL.baud,   theme.fg.dim)}
        {cell("TYPE",   COL.type,   theme.fg.dim)}
        {cell("VENDOR", COL.vendor, theme.fg.dim)}
        {cell("ACTION", COL.action, theme.fg.dim)}
      </box>

      {/* ── Body ── */}
      {loading ? (
        <box height={3} alignItems="center" justifyContent="center">
          <text content="Scanning serial ports..." fg={theme.fg.grey} />
        </box>
      ) : error ? (
        <box height={3} alignItems="center" justifyContent="center">
          <text content={`⚠ ${error}`} fg={theme.fg.red} />
        </box>
      ) : ports.length === 0 ? (
        <box height={3} alignItems="center" justifyContent="center">
          <text content="No serial ports detected." fg={theme.fg.dim} />
        </box>
      ) : (
        ports.map((port, idx) => {
          const sel = idx === selectedIndex;
          const fgPort = sel ? theme.fg.cyan : theme.fg.white;
          const st = statusCell(port);

          let actionText: string;
          let actionColor: string;
          if (port.status === "active") {
            actionText = "[OPEN]";
            actionColor = sel ? theme.fg.cyan : theme.fg.green;
          } else if (port.status === "busy") {
            actionText = "[BUSY]";
            actionColor = theme.fg.yellow;
          } else {
            actionText = "  —  ";
            actionColor = theme.fg.dim;
          }

          return (
            <box
              key={port.name}
              height={1}
              alignItems="center"
              paddingLeft={2}
              backgroundColor={sel ? theme.bg.selected : "transparent"}
              gap={0}
            >
              {cell(port.name.padEnd(COL.port - 1), COL.port, fgPort)}
              <text content={st.text} fg={st.color} attributes={TextAttributes.BOLD} />
              {cell(baudText(port.baudRate), COL.baud, theme.fg.grey)}
              {cell(inferType(port.description), COL.type, sel ? theme.fg.white : theme.fg.grey)}
              {cell(inferVendor(port.description), COL.vendor, theme.fg.muted)}
              <text content={actionText} fg={actionColor} attributes={sel ? TextAttributes.BOLD : 0} />
            </box>
          );
        })
      )}
    </box>
  );
}
