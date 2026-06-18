import { TextAttributes, t, bold, fg } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Header } from "../components/ui/Header";
import { Badge } from "../components/ui/Badge";
import { Modal, ModalHelp } from "../components/ui/Modal";
import { StatusBar } from "../components/ui/StatusBar";
import { useSerialTerminal } from "../hooks/useSerialTerminal";
import { useResponsive } from "../hooks/useResponsive";
import type { ComPortInfo, BaudRate } from "../types";
import { BAUD_RATES, theme } from "../types";

interface TerminalScreenProps {
  port: ComPortInfo;
  onBack: () => void;
}

/**
 * TerminalScreen — full macOS Terminal emulation for serial communication.
 *
 * The output area looks and feels like a real terminal window:
 * - Pure black background
 * - Green/cyan/amber text for different message types
 * - Box-drawing header with port info
 * - Responsive input bar at the bottom when connected
 * - Baud rate selector modal overlay
 */
export function TerminalScreen({ port, onBack }: TerminalScreenProps) {
  const resp = useResponsive();
  const terminal = useSerialTerminal({ port });
  const [showBaudSelector, setShowBaudSelector] = useState(false);
  const [baudSelectorIndex, setBaudSelectorIndex] = useState(
    BAUD_RATES.indexOf(terminal.baudRate as BaudRate),
  );
  const outputRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => {
    terminal.send(terminal.command);
  }, [terminal]);

  const handleOpenBaudSelector = useCallback(() => {
    setBaudSelectorIndex(BAUD_RATES.indexOf(terminal.baudRate as BaudRate));
    setShowBaudSelector(true);
  }, [terminal.baudRate]);

  const handleConfirmBaud = useCallback(() => {
    const rate = BAUD_RATES[baudSelectorIndex];
    if (rate) terminal.setBaudRate(rate);
    setShowBaudSelector(false);
  }, [baudSelectorIndex, terminal]);

  useKeyboard((key) => {
    // Baud selector mode
    if (showBaudSelector) {
      if (key.name === "up" || key.name === "k")
        setBaudSelectorIndex((p) => Math.max(0, p - 1));
      else if (key.name === "down" || key.name === "j")
        setBaudSelectorIndex((p) => Math.min(BAUD_RATES.length - 1, p + 1));
      else if (key.name === "return") handleConfirmBaud();
      else if (key.name === "escape") setShowBaudSelector(false);
      return;
    }

    // Escape: disconnect + go back
    if (key.name === "escape") {
      terminal.disconnect();
      onBack();
      return;
    }

    // Connected: send on Enter
    if (terminal.connected) {
      if (key.name === "return" && terminal.command.trim()) handleSend();
      return;
    }

    // Disconnected: connect / baud selector
    if (key.name === "return") terminal.connect();
    else if (key.name === "tab") handleOpenBaudSelector();
  });

  // ─── Box-drawing header (responsive width) ───
  const headerWidth = resp.isSmall ? resp.width - 6 : 48;

  return (
    <box
      flexGrow={1}
      flexDirection="column"
      backgroundColor={theme.bg.base}
    >
      {/* ── Terminal title bar ── */}
      <Header
        icon="🔌"
        title={`Terminal — ${port.name}`}
        rightContent={
          terminal.connected ? "● CONNECTED" : "○ DISCONNECTED"
        }
        rightLabel={`${terminal.baudRate} baud`}
      />

      {/* ── Terminal output area (pure terminal black) ── */}
      <box
        flexGrow={1}
        flexDirection="column"
        backgroundColor={theme.bg.terminal}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
      >
        {/* ── Port info banner (box-drawing characters) ── */}
        <text
          content={t`${fg(theme.border.terminal)(
            `┌─ ${port.name} ─────────────────────────────────────────────┐`,
          )}`}
        />
        <text
          content={t`${fg(theme.border.terminal)("│")}  ${fg(theme.fg.muted)(
            port.description,
          )}${fg(theme.border.terminal)(" ".repeat(
            Math.max(0, headerWidth - port.description.length - 6),
          ))}${fg(theme.border.terminal)("│")}`}
        />
        <text
          content={t`${fg(theme.border.terminal)("│")}  Baud Rate: ${fg(
            theme.fg.accent,
          )(String(terminal.baudRate))}${fg(theme.border.terminal)(
            " ".repeat(
              Math.max(
                0,
                headerWidth -
                  String(terminal.baudRate).length -
                  16,
              ),
            ),
          )}${fg(theme.border.terminal)("│")}`}
        />
        <text
          content={t`${fg(theme.border.terminal)(
            `└${"─".repeat(headerWidth - 2)}┘`,
          )}`}
        />

        <text content="" />

        {/* ── Message log ── */}
        {terminal.messages.map((msg) => {
          let color: string = theme.fg.muted;
          if (msg.type === "sent") color = theme.text.success;
          else if (msg.type === "received") color = theme.text.received;
          else if (msg.type === "error") color = theme.fg.danger;
          else if (msg.type === "system") color = theme.fg.muted;

          const prefix: Record<string, string> = {
            sent: "→ ",
            received: "← ",
            error: "⚠ ",
          };

          return (
            <text
              key={msg.id}
              content={`${prefix[msg.type] ?? "  "}${msg.text}`}
              fg={color}
            />
          );
        })}

        {/* ── Command input (visible when connected) ── */}
        {terminal.connected && (
          <box flexDirection="column" gap={0}>
            <text content="" />
            <box flexDirection="row" gap={1}>
              <text content="$" fg={theme.fg.success} attributes={TextAttributes.BOLD} />
              <input
                placeholder="Type a command..."
                value={terminal.command}
                onInput={terminal.setCommand}
                onSubmit={handleSend}
                width={resp.inputWidth}
                textColor={theme.fg.default}
                backgroundColor="transparent"
                cursorColor={theme.fg.accent}
              />
            </box>
          </box>
        )}
      </box>

      {/* ── Baud rate selector modal ── */}
      <Modal
        open={showBaudSelector}
        title="Select Baud Rate"
        width={36}
      >
        {BAUD_RATES.map((rate, i) => (
          <text
            key={rate}
            content={`${i === baudSelectorIndex ? "▸ " : "  "}${rate}`}
            fg={
              i === baudSelectorIndex ? theme.fg.accent : theme.fg.muted
            }
            attributes={
              i === baudSelectorIndex ? TextAttributes.BOLD : 0
            }
          />
        ))}
        <text content="" />
        <ModalHelp
          items={[
            { key: "↑↓", label: "Navigate" },
            { key: "Enter", label: "Select" },
            { key: "Esc", label: "Cancel" },
          ]}
        />
      </Modal>

      {/* ── Connect overlay ── */}
      {!terminal.connected && !showBaudSelector && (
        <box
          position="absolute"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          backgroundColor={theme.bg.overlay}
        >
          <box
            borderStyle="rounded"
            borderColor={
              terminal.connecting
                ? theme.fg.accent
                : theme.border.success
            }
            backgroundColor={theme.bg.elevated}
            padding={3}
            width={Math.min(48, resp.width - 6)}
            flexDirection="column"
            gap={1}
          >
            {terminal.connecting ? (
              <>
                <text
                  content="⏳  Connecting..."
                  fg={theme.fg.accent}
                  attributes={TextAttributes.BOLD}
                />
                <text
                  content={`Attempting to open ${port.name}...`}
                  fg={theme.fg.muted}
                />
              </>
            ) : (
              <>
                <box justifyContent="center" marginBottom={1}>
                  <Badge variant="info">{port.name}</Badge>
                </box>

                <text
                  content={`Connect to ${port.name}?`}
                  fg={theme.fg.default}
                  attributes={TextAttributes.BOLD}
                />
                <text
                  content={`Baud Rate: ${terminal.baudRate}`}
                  fg={theme.fg.muted}
                />

                <text content="" />

                <text
                  content="  Press Enter to connect"
                  fg={theme.fg.accent}
                />
                <text
                  content="  Press Tab to change baud rate"
                  fg={theme.fg.muted}
                />
                <text
                  content="  Press Esc to go back"
                  fg={theme.fg.dim}
                />
              </>
            )}
          </box>
        </box>
      )}

      {/* ── Status bar ── */}
      {!terminal.connected ? (
        <StatusBar
          items={[
            { key: "Tab", label: "Baud rate" },
            { key: "Enter", label: "Connect", accent: true },
            { key: "Esc", label: "Back" },
          ]}
        />
      ) : (
        <StatusBar
          items={[
            { key: "Type +", label: "Enter", accent: true },
            { key: "", label: "to send" },
            { key: "Esc", label: "Disconnect", color: theme.fg.danger },
          ]}
        />
      )}
    </box>
  );
}
