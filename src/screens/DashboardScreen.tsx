import { useKeyboard } from "@opentui/react";
import { useCallback, useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { DataTable } from "../components/DataTable";
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
 * DashboardScreen — Cyberpunk Terminal dashboard.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────┐
 * │  ┌──────┐  ┌── CONNECTION STATS ──────────────────┐    │
 * │  │      │  │  Connected: 3  Disconnected: 2  ...  │    │
 * │  │ SIDE │  ├───────────────────────────────────────┤    │
 * │  │ BAR  │  │  SERIAL PORT TABLE                    │    │
 * │  │      │  │  ┌─────┬──────┬──────┬──────┬──────┐  │    │
 * │  │      │  │  │PORT │ NAME │STATUS│ BAUD │DESC  │  │    │
 * │  │      │  │  ├─────┼──────┼──────┼──────┼──────┤  │    │
 * │  │      │  │  │COM3 │USB...│● ACT │9600  │FTDI  │  │    │
 * │  │      │  │  └─────┴──────┴──────┴──────┴──────┘  │    │
 * │  │      │  ├── SYSTEM LOG ─────────────────────────┤    │
 * │  │      │  │  [14:23:10] • Scanning...             │    │
 * │  │      │  │  [14:23:11] ✓ Found 5 ports           │    │
 * │  └──────┘  └───────────────────────────────────────┘    │
 * │  Status: ↑↓ Navigate  Enter Open  Esc Logout           │
 * └─────────────────────────────────────────────────────────┘
 */
export function DashboardScreen({
  username,
  onSelectPort,
  onLogout,
}: DashboardScreenProps) {
  const {
    ports,
    activePorts,
    inactivePorts,
    loading,
    error,
    selectedIndex,
    setSelectedIndex,
    refresh,
  } = useComPorts();

  const [activeNav, setActiveNav] = useState<NavItem>("serial-ports");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Push initial log entries
  useEffect(() => {
    if (!loading && !error) {
      setLogs((prev) => [
        ...prev,
        makeLog(`Scanning serial ports...`, "info"),
        makeLog(`Found ${ports.length} serial port(s)`, "success"),
        makeLog(`Scan completed successfully`, "success"),
      ].slice(-50));
    }
  }, [loading, error, ports.length]);

  const handleSelect = useCallback(() => {
    const port = ports[selectedIndex];
    if (port && port.status === "active") {
      setLogs((prev) => [
        ...prev,
        makeLog(`Opening ${port.name}...`, "info"),
      ]);
      onSelectPort(port);
    }
  }, [ports, selectedIndex, onSelectPort]);

  const handleRefresh = useCallback(() => {
    setLogs((prev) => [...prev, makeLog(`Initiating port scan...`, "info")]);
    refresh().then(() => {
      setLogs((prev) => [
        ...prev,
        makeLog(`Scan refresh triggered`, "success"),
      ]);
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
    }
  });

  const handleNav = useCallback(
    (item: NavItem) => {
      setActiveNav(item);
      if (item === "exit") onLogout();
      if (item === "serial-ports") handleRefresh();
    },
    [onLogout, handleRefresh],
  );

  return (
    <box
      flexGrow={1}
      flexDirection="column"
      backgroundColor={theme.bg.base}
    >
      {/* ── Main row: Sidebar + Content ── */}
      <box flexGrow={1} flexDirection="row">
        {/* Left sidebar */}
        <Sidebar
          activeItem={activeNav}
          username={username}
          onNavigate={handleNav}
        />

        {/* Right content area */}
        <box flexGrow={1} flexDirection="column">
          {/* Connection stats bar */}
          <ConnStats
            connected={activePorts.length}
            disconnected={inactivePorts.length}
            total={ports.length}
            username={username}
          />

          {/* Main content: table + log */}
          <box flexGrow={1} flexDirection="column" padding={1} gap={1}>
            {/* Serial port table */}
            <DataTable
              ports={ports}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onConnect={onSelectPort}
              loading={loading}
              error={error}
            />

            {/* Log panel */}
            <LogPanel entries={logs} height={6} />
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
          <text content="↑↓" fg={theme.fg.dim} />
          <text content="Navigate" fg={theme.fg.muted} />
          <text content="┃" fg={theme.border.default} />
          <text content="Enter" fg={theme.fg.accent} attributes={1} />
          <text content="Open" fg={theme.fg.accent} />
          <text content="┃" fg={theme.border.default} />
          <text content="R" fg={theme.fg.cyan} attributes={1} />
          <text content="Rescan" fg={theme.fg.cyan} />
          <text content="┃" fg={theme.border.default} />
          <text content="Esc" fg={theme.fg.danger} attributes={1} />
          <text content="Logout" fg={theme.fg.danger} />
        </box>
        <box flexGrow={1} />
        <text content={`${ports.length} device(s)`} fg={theme.fg.dim} />
      </box>
    </box>
  );
}
