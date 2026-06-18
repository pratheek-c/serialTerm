import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback } from "react";
import { Header } from "../components/ui/Header";
import { Card, CardSection, CardFooter } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/Select";
import { StatusBar } from "../components/ui/StatusBar";
import { PanelGroup } from "../components/layout/AppLayout";
import { useComPorts } from "../hooks/useComPorts";
import type { ComPortInfo } from "../types";
import { theme } from "../types";

interface DashboardScreenProps {
  username: string;
  onSelectPort: (port: ComPortInfo) => void;
  onLogout: () => void;
}

/**
 * DashboardScreen — macOS Terminal-style COM port manager.
 *
 * Responsive layout:
 * - ≥ 60 cols: side-by-side port list (left) + detail panel (right)
 * - < 60 cols: stacked vertically
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
    selectedPort,
    refresh,
    lastRefresh,
  } = useComPorts();

  const handleSelect = useCallback(() => {
    if (selectedPort && selectedPort.status === "active") {
      onSelectPort(selectedPort);
    }
  }, [selectedPort, onSelectPort]);

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
        if (!key.ctrl) refresh();
        break;
    }
  });

  // ─── Port list content ──────────────────────────────────────
  const portList = (
    <Card title="📡  COM Ports">
      <CardSection
        label={`${ports.length} port${ports.length !== 1 ? "s" : ""}`}
        right={<text content="[R]efresh" fg={theme.fg.dim} />}
        flexGrow={1}
        padding={1}
      >
        {/* Loading */}
        {loading && (
          <box alignItems="center" justifyContent="center" height={8}>
            <text content=" Scanning ports..." fg={theme.fg.muted} />
          </box>
        )}

        {/* Error */}
        {!loading && error && (
          <box alignItems="center" justifyContent="center" height={8}>
            <text content={`⚠  ${error}`} fg={theme.fg.danger} />
          </box>
        )}

        {/* Empty */}
        {!loading && !error && ports.length === 0 && (
          <box alignItems="center" justifyContent="center" height={8}>
            <text content=" No COM ports detected" fg={theme.fg.muted} />
          </box>
        )}

        {/* Ports */}
        {!loading && !error && ports.length > 0 && (
          <box flexDirection="column" gap={0}>
            {/* ── Active section ── */}
            <SectionHeader
              label="ACTIVE"
              count={activePorts.length}
              color={theme.text.success}
            />

            {activePorts.length === 0 ? (
              <text content="  (none detected)" fg={theme.fg.dim} />
            ) : (
              activePorts.map((port) => {
                const idx = ports.indexOf(port);
                const isSel = idx === selectedIndex;
                return (
                  <box
                    key={port.name}
                    flexDirection="column"
                    backgroundColor={
                      isSel ? theme.bg.selected : "transparent"
                    }
                    paddingLeft={2}
                  >
                    <text
                      content={`  ● ${port.name}`}
                      fg={isSel ? theme.fg.accent : theme.text.success}
                      attributes={isSel ? TextAttributes.BOLD : 0}
                    />
                    <text
                      content={`     ${port.description}${port.baudRate ? `  │  ${port.baudRate}` : ""}`}
                      fg={isSel ? theme.fg.muted : theme.fg.dim}
                    />
                  </box>
                );
              })
            )}

            <text content="" />

            {/* ── Inactive section ── */}
            <SectionHeader
              label="INACTIVE"
              count={inactivePorts.length}
              color={theme.fg.danger}
            />

            {inactivePorts.length === 0 ? (
              <text content="  (none)" fg={theme.fg.dim} />
            ) : (
              inactivePorts.map((port) => {
                const idx = ports.indexOf(port);
                const isSel = idx === selectedIndex;
                return (
                  <box
                    key={port.name}
                    backgroundColor={
                      isSel ? theme.bg.selected : "transparent"
                    }
                    paddingLeft={2}
                  >
                    <text
                      content={`  ○ ${port.name}`}
                      fg={isSel ? theme.fg.accent : theme.fg.dim}
                      attributes={
                        isSel ? TextAttributes.BOLD : TextAttributes.DIM
                      }
                    />
                    <text
                      content={`     ${port.description}`}
                      fg={theme.fg.dim}
                    />
                  </box>
                );
              })
            )}
          </box>
        )}
      </CardSection>

      <CardFooter>
        <text content="↑↓" fg={theme.fg.dim} />
        <text content="Navigate" fg={theme.fg.muted} />
        <text content="┃" fg={theme.border.default} />
        <text content="Enter" fg={theme.fg.accent} attributes={1} />
        <text content="Select" fg={theme.fg.accent} />
      </CardFooter>
    </Card>
  );

  // ─── Detail panel content ───────────────────────────────────
  const detailPanel = (
    <Card title="ℹ  Port Details">
      <CardSection flexGrow={1} padding={2}>
        {selectedPort ? (
          <box flexDirection="column" gap={1}>
            {/* Port identity */}
            <box flexDirection="row" gap={2}>
              <text content="Port:" fg={theme.fg.muted} />
              <text
                content={selectedPort.name}
                fg={theme.fg.default}
                attributes={TextAttributes.BOLD}
              />
            </box>

            {/* Description */}
            <box flexDirection="row" gap={2}>
              <text content="Desc:" fg={theme.fg.muted} />
              <text
                content={selectedPort.description || "—"}
                fg={theme.fg.muted}
              />
            </box>

            {/* Baud rate */}
            {selectedPort.baudRate && (
              <box flexDirection="row" gap={2}>
                <text content="Baud:" fg={theme.fg.muted} />
                <text content={selectedPort.baudRate} fg={theme.fg.muted} />
              </box>
            )}

            {/* Status */}
            <box flexDirection="row" gap={2}>
              <text content="Status:" fg={theme.fg.muted} />
              <Badge
                variant={
                  selectedPort.status === "active" ? "active" : "inactive"
                }
                bold
              >
                {selectedPort.status.toUpperCase()}
              </Badge>
            </box>

            <text content="" />

            {/* Action hint */}
            {selectedPort.status === "active" ? (
              <box flexDirection="column" gap={0}>
                <text
                  content="  Press Enter to open terminal"
                  fg={theme.fg.accent}
                />
                <text
                  content="  and communicate with this device."
                  fg={theme.fg.accent}
                />
              </box>
            ) : (
              <text
                content="  Port is inactive or unavailable."
                fg={theme.fg.danger}
              />
            )}
          </box>
        ) : (
          <box
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
            height={6}
          >
            <text
              content=" Select a COM port to view details"
              fg={theme.fg.dim}
            />
          </box>
        )}
      </CardSection>

      {/* Last refresh */}
      <box
        height={1}
        alignItems="center"
        paddingLeft={2}
      >
        <text
          content={`Last refreshed: ${lastRefresh.toLocaleTimeString()}`}
          fg={theme.fg.dim}
        />
      </box>
    </Card>
  );

  return (
    <box
      flexGrow={1}
      flexDirection="column"
      backgroundColor={theme.bg.base}
    >
      {/* ── Top bar ── */}
      <Header
        icon="◆"
        title="Device Management System"
        rightLabel="User:"
        rightContent={username}
      />

      {/* ── Main content ── */}
      <PanelGroup left={portList} right={detailPanel} />

      {/* ── Status bar ── */}
      <StatusBar
        items={[
          { key: "↑↓", label: "Navigate" },
          { key: "Enter", label: "Select", accent: true },
          { key: "Esc", label: "Logout" },
          { key: "R", label: "Refresh" },
        ]}
      />
    </box>
  );
}
