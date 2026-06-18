import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useCallback, useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { DataTable } from "../components/DataTable";
import { DetailPanel } from "../components/DetailPanel";
import { LogPanel, makeLog } from "../components/LogPanel";
import { ConnStats } from "../components/ConnStats";
import { useComPorts } from "../hooks/useComPorts";
import type { ComPortInfo, NavItem, LogEntry } from "../types";
import { theme } from "../types";

interface DashboardScreenProps {
  username: string;
  onSelectPort: (port: ComPortInfo) => void;
  onLogout: () => void;
}

/**
 * DashboardScreen — professional NOC terminal layout (k9s/lazygit inspired).
 *
 * ┌──────────┬────────────────────────────────────────────────────┐
 * │          │  Ports Found: 4 │ Connected: 3 │ Busy: 1 │ ...    │
 * │ SIDEBAR  ├────────────────────────┬───────────────────────────┤
 * │ ▶ Ports  │  SERIAL PORTS          │ CONNECTION DETAILS       │
 * │   Conns  │  PORT  STATUS  BAUD .. │ Port:  COM6              │
 * │   Logs   │  COM6  ● ACTI  115200  │ Status: ● Connected      │
 * │   Setup  │  COM7  ◐ BUSY  9600    │ Baud:   115200           │
 * │   About  │  COM8  ○ IDLE  —       │                          │
 * │   Exit   │                        │                          │
 * │          ├────────────────────────┴───────────────────────────┤
 * │  @admin  │  SYSTEM LOG                                        │
 * │          │  [14:23:10] ✓ Found 4 port(s)                     │
 * └──────────┴────────────────────────────────────────────────────┘
 *  [F1 Help]  [R Rescan]  [Enter Connect]  [Esc Exit]
 */
export function DashboardScreen({
  username,
  onSelectPort,
  onLogout,
}: DashboardScreenProps) {
  const dims = useTerminalDimensions();
  const {
    ports,
    loading,
    error,
    selectedIndex,
    setSelectedIndex,
    refresh,
  } = useComPorts();

  const activePorts = ports.filter((p) => p.status === "active");
  const busyPorts = ports.filter((p) => p.status === "busy");
  const errorPorts = ports.filter((p) => p.status === "error");

  const [activeNav, setActiveNav] = useState<NavItem>("ports");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Push initial log entries once scan completes
  useEffect(() => {
    if (!loading && !error) {
      setLogs((prev) =>
        [
          ...prev,
          makeLog(`Scanning serial ports...`, "info"),
          makeLog(`Found ${ports.length} serial port(s)`, "info"),
          makeLog(`Scan completed — ${activePorts.length} active, ${busyPorts.length} busy`, "success"),
        ].slice(-100),
      );
    }
  }, [loading, error, ports.length, activePorts.length, busyPorts.length]);

  const handleSelect = useCallback(() => {
    const port = ports[selectedIndex];
    if (port && port.status === "active") {
      setLogs((prev) => [...prev, makeLog(`Opening ${port.name}...`, "info")]);
      onSelectPort(port);
    } else if (port && port.status === "busy") {
      setLogs((prev) => [...prev, makeLog(`${port.name} is busy`, "warn")]);
    }
  }, [ports, selectedIndex, onSelectPort]);

  const handleRefresh = useCallback(() => {
    setLogs((prev) => [...prev, makeLog(`Initiating port scan...`, "info")]);
    refresh().then(() => {
      setLogs((prev) => [...prev, makeLog(`Rescan complete`, "success")]);
    });
  }, [refresh]);

  useKeyboard((key) => {
    switch (key.name) {
      case "up":
      case "k":
        setSelectedIndex(Math.max(0, selectedIndex - 1));
        break;
      case "down":
      case "j":
        setSelectedIndex(Math.min(ports.length - 1, selectedIndex + 1));
        break;
      case "return":
        handleSelect();
        break;
      case "escape":
        onLogout();
        break;
      case "r":
        if (!key.ctrl) handleRefresh();
        break;
      case "f1":
        setLogs((prev) => [...prev, makeLog("Help: ↑↓=Navigate  Enter=Open  R=Rescan  Esc=Exit", "info")]);
        break;
    }
  });

  const handleNav = useCallback(
    (item: NavItem) => {
      setActiveNav(item);
      if (item === "exit") onLogout();
      if (item === "ports") handleRefresh();
    },
    [onLogout, handleRefresh],
  );

  const selectedPort = ports[selectedIndex];
  const canShowDetail = dims.width >= 100 && selectedPort;

  return (
    <box flexGrow={1} flexDirection="column" backgroundColor={theme.bg.base}>
      {/* ── Main row: Sidebar + content ── */}
      <box flexGrow={1} flexDirection="row">
        {/* ── Left sidebar ── */}
        <Sidebar activeItem={activeNav} username={username} onNavigate={handleNav} />

        {/* ── Right content area ── */}
        <box flexGrow={1} flexDirection="column">
          {/* ── Metrics bar ── */}
          <ConnStats
            total={ports.length}
            active={activePorts.length}
            busy={busyPorts.length}
            errors={errorPorts.length}
            username={username}
          />

          {/* ── Main content: table + detail (side-by-side on wide) + log ── */}
          <box flexGrow={1} flexDirection="column" padding={1} gap={1}>
            {/* Top: table row (optionally with detail panel) */}
            <box flexGrow={1} flexDirection="row" gap={1}>
              {/* Serial port table — fills available width */}
              <box flexGrow={1} flexDirection="column">
                <DataTable
                  ports={ports}
                  selectedIndex={selectedIndex}
                  onSelect={setSelectedIndex}
                  onConnect={onSelectPort}
                  loading={loading}
                  error={error}
                />
              </box>

              {/* Detail panel (≥100 cols) */}
              {canShowDetail && (
                <box width={34} flexDirection="column">
                  <DetailPanel port={selectedPort} />
                </box>
              )}
            </box>

            {/* ── System log ── */}
            <LogPanel entries={logs} height={Math.min(12, dims.height - 18)} />
          </box>
        </box>
      </box>

      {/* ── Status bar ── */}
      <box
        height={2}
        borderStyle="single"
        borderColor={theme.border.muted}
        backgroundColor={theme.bg.header}
        alignItems="center"
        paddingLeft={3}
        paddingRight={3}
      >
        <box flexDirection="row" gap={2} alignItems="center">
          <text content="[F1]" fg={theme.fg.dim} />
          <text content="Help" fg={theme.fg.grey} />
          <text content="│" fg={theme.border.default} />
          <text content="[R]" fg={theme.fg.cyan} />
          <text content="Rescan" fg={theme.fg.cyan} />
          <text content="│" fg={theme.border.default} />
          <text content="[Enter]" fg={theme.fg.green} />
          <text content="Connect" fg={theme.fg.green} />
          <text content="│" fg={theme.border.default} />
          <text content="[Esc]" fg={theme.fg.red} />
          <text content="Exit" fg={theme.fg.red} />
        </box>
        <box flexGrow={1} />
        <text content={`DMS Terminal  v2.1`} fg={theme.fg.dim} />
      </box>
    </box>
  );
}
