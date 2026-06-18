import { TextAttributes } from "@opentui/core";
import { theme, type ComPortInfo } from "../types";

interface DetailPanelProps {
  port: ComPortInfo;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: "Connected",  color: theme.fg.green },
  busy:   { label: "Busy",       color: theme.fg.yellow },
  idle:   { label: "Idle",       color: theme.fg.dim },
  error:  { label: "Error",      color: theme.fg.red },
};

/**
 * DetailPanel — connection details for the currently selected port.
 */
export function DetailPanel({ port }: DetailPanelProps) {
  const st = STATUS_MAP[port.status] ?? STATUS_MAP.idle!;

  return (
    <box
      flexDirection="column"
      backgroundColor={theme.bg.surface}
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
        <text content="CONNECTION DETAILS" fg={theme.fg.white} attributes={TextAttributes.BOLD} />
      </box>

      {/* ── Body ── */}
      <box flexDirection="column" gap={1} padding={2}>
        <DetailRow label="Port"   value={port.name} />
        <StatusRow label="Status" value={st.label} color={st.color} />
        <DetailRow label="Baud"   value={port.baudRate?.replace(" bps", "") ?? "—"} />
        <DetailRow label="Vendor" value="—" />
        <DetailRow label="Type"   value="—" />

        <text content="" />

        {port.status === "active" ? (
          <text content="Press Enter to open terminal" fg={theme.fg.green} />
        ) : port.status === "busy" ? (
          <text content="Port is currently busy" fg={theme.fg.yellow} />
        ) : (
          <text content="Port is unavailable" fg={theme.fg.dim} />
        )}
      </box>
    </box>
  );
}

/** Simple label: value row. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <box flexDirection="row" gap={1}>
      <text content={`${label}:`} fg={theme.fg.grey} />
      <text content={value} fg={theme.fg.white} />
    </box>
  );
}

/** Status row with coloured dot. */
function StatusRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <box flexDirection="row" gap={1}>
      <text content={`${label}:`} fg={theme.fg.grey} />
      <text content="●" fg={color} attributes={TextAttributes.BOLD} />
      <text content={value} fg={color} attributes={TextAttributes.BOLD} />
    </box>
  );
}
