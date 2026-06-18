import { TextAttributes, t, bold, fg } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useState, useCallback } from "react";
import { useSerialTerminal } from "../hooks/useSerialTerminal";
import type { ComPortInfo, BaudRate } from "../types";
import { BAUD_RATES, theme } from "../types";

interface TerminalScreenProps {
  port: ComPortInfo;
  onBack: () => void;
}

/** Helper: repeat a character N times for box-drawing. */
function rep(ch: string, n: number): string {
  return n > 0 ? ch.repeat(n) : "";
}

/**
 * TerminalScreen — full-screen Cyberpunk serial terminal.
 * Box-drawing frame, $ prompt, colour-coded message log.
 */
export function TerminalScreen({ port, onBack }: TerminalScreenProps) {
  const dims = useTerminalDimensions();
  const terminal = useSerialTerminal({ port });
  const [showBaudSelector, setShowBaudSelector] = useState(false);
  const [baudSelectorIndex, setBaudSelectorIndex] = useState(
    BAUD_RATES.indexOf(terminal.baudRate as BaudRate),
  );

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
    if (showBaudSelector) {
      if (key.name === "up" || key.name === "k")
        setBaudSelectorIndex((p) => Math.max(0, p - 1));
      else if (key.name === "down" || key.name === "j")
        setBaudSelectorIndex((p) => Math.min(BAUD_RATES.length - 1, p + 1));
      else if (key.name === "return") handleConfirmBaud();
      else if (key.name === "escape") setShowBaudSelector(false);
      return;
    }
    if (key.name === "escape") {
      terminal.disconnect();
      onBack();
      return;
    }
    if (terminal.connected) {
      if (key.name === "return" && terminal.command.trim()) handleSend();
      return;
    }
    if (key.name === "return") terminal.connect();
    else if (key.name === "tab") handleOpenBaudSelector();
  });

  const tw = Math.min(dims.width - 4, 76);

  return (
    <box flexGrow={1} flexDirection="column" backgroundColor={theme.bg.base}>
      {/* ── Header ── */}
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
        <box alignItems="center" gap={2}>
          <text content=">_" fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
          <text content={`TERMINAL — ${port.name}`} fg={theme.fg.white} attributes={TextAttributes.BOLD} />
        </box>
        <box alignItems="center" gap={3}>
          <text
            content={terminal.connected ? "● CONNECTED" : "○ DISCONNECTED"}
            fg={terminal.connected ? theme.fg.green : theme.fg.red}
            attributes={TextAttributes.BOLD}
          />
          <text content={`${terminal.baudRate} baud`} fg={theme.fg.grey} />
        </box>
      </box>

      {/* ── Terminal body ── */}
      <box
        flexGrow={1}
        flexDirection="column"
        backgroundColor={theme.bg.terminal}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
      >
        {/* ── Frame top ── */}
        <text
          content={t`${fg(theme.fg.dim)(`┌─ ${port.name} ${rep("─", Math.max(0, tw - port.name.length - 6))}┐`)}`}
        />
        <text
          content={t`${fg(theme.fg.dim)("│")}  ${fg(theme.fg.grey)(port.description)}${rep(" ", Math.max(0, tw - port.description.length - 9))}${fg(theme.fg.dim)("│")}`}
        />
        <text
          content={t`${fg(theme.fg.dim)("│")}  Baud: ${fg(theme.fg.cyan)(String(terminal.baudRate))}${rep(" ", Math.max(0, tw - String(terminal.baudRate).length - 13))}${fg(theme.fg.dim)("│")}`}
        />
        <text
          content={t`${fg(theme.fg.dim)(`├${rep("─", tw)}┤`)}`}
        />

        {/* ── Messages ── */}
        {terminal.messages.length === 0 ? (
          <text content="" />
        ) : (
          terminal.messages.slice(-(dims.height - 12)).map((msg) => {
            let color: string = theme.fg.grey;
            if (msg.type === "sent") color = theme.fg.cyan;
            else if (msg.type === "received") color = theme.fg.yellow;
            else if (msg.type === "error") color = theme.fg.red;
            const prefix: Record<string, string> = { sent: "→ ", received: "← ", error: "⚠ " };
            return (
              <text key={msg.id} content={`${prefix[msg.type] ?? "  "}${msg.text}`} fg={color} />
            );
          })
        )}

        {/* ── Input ── */}
        {terminal.connected && (
          <box flexDirection="row" gap={1} marginTop={1}>
            <text content="$" fg={theme.fg.green} attributes={TextAttributes.BOLD} />
            <input
              placeholder="Type command..."
              value={terminal.command}
              onInput={terminal.setCommand}
              onSubmit={handleSend}
              width={tw - 3}
              textColor={theme.fg.white}
              backgroundColor="transparent"
              cursorColor={theme.fg.cyan}
            />
          </box>
        )}

        {/* ── Frame bottom ── */}
        <text content={t`${fg(theme.fg.dim)(`└${rep("─", tw)}┘`)}`} />
      </box>

      {/* ── Baud selector modal ── */}
      {showBaudSelector && (
        <box position="absolute" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.bg.overlay}>
          <box borderStyle="rounded" borderColor={theme.fg.cyan} backgroundColor={theme.bg.elevated} padding={2} width={34} flexDirection="column" gap={1}>
            <text content=">_ SELECT BAUD RATE" fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
            <text content={"─".repeat(30)} fg={theme.border.default} />
            {BAUD_RATES.map((rate, i) => (
              <text key={rate} content={`${i === baudSelectorIndex ? "▸ " : "  "}${rate}`}
                fg={i === baudSelectorIndex ? theme.fg.cyan : theme.fg.grey}
                attributes={i === baudSelectorIndex ? TextAttributes.BOLD : 0} />
            ))}
            <text content="" />
            <text content=" ↑↓ Navigate  │  Enter Select  │  Esc Cancel" fg={theme.fg.dim} />
          </box>
        </box>
      )}

      {/* ── Connect overlay ── */}
      {!terminal.connected && !showBaudSelector && (
        <box position="absolute" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.bg.overlay}>
          <box borderStyle="rounded" borderColor={terminal.connecting ? theme.fg.cyan : theme.border.success}
            backgroundColor={theme.bg.elevated} padding={3} width={46} flexDirection="column" gap={1}>
            {terminal.connecting ? (
              <>
                <text content="⏳  CONNECTING..." fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
                <text content={`Opening ${port.name} @ ${terminal.baudRate} baud...`} fg={theme.fg.grey} />
              </>
            ) : (
              <>
                <text content=">_ CONNECT TO PORT" fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
                <text content={"─".repeat(40)} fg={theme.border.default} />
                <text content={`  ${port.name}  —  ${port.description}`} fg={theme.fg.white} />
                <text content={`  Baud Rate: ${terminal.baudRate}`} fg={theme.fg.grey} />
                <text content="" />
                <text content="  Enter — Connect" fg={theme.fg.green} />
                <text content="  Tab   — Change baud rate" fg={theme.fg.grey} />
                <text content="  Esc   — Back" fg={theme.fg.dim} />
              </>
            )}
          </box>
        </box>
      )}

      {/* ── Status bar ── */}
      <box height={2} borderStyle="single" borderColor={theme.border.muted}
        backgroundColor={theme.bg.header} alignItems="center" paddingLeft={3} paddingRight={3}>
        {!terminal.connected ? (
          <box flexDirection="row" gap={2} alignItems="center">
            <text content="Tab" fg={theme.fg.dim} /><text content="Baud rate" fg={theme.fg.grey} />
            <text content="│" fg={theme.border.default} />
            <text content="Enter" fg={theme.fg.cyan} attributes={1} /><text content="Connect" fg={theme.fg.cyan} />
            <text content="│" fg={theme.border.default} />
            <text content="Esc" fg={theme.fg.red} attributes={1} /><text content="Back" fg={theme.fg.red} />
            <box flexGrow={1} /><text content={port.name} fg={theme.fg.dim} />
          </box>
        ) : (
          <box flexDirection="row" gap={2} alignItems="center">
            <text content="Type +" fg={theme.fg.dim} />
            <text content="Enter" fg={theme.fg.cyan} attributes={1} /><text content="to send" fg={theme.fg.grey} />
            <text content="│" fg={theme.border.default} />
            <text content="Esc" fg={theme.fg.red} attributes={1} /><text content="Disconnect" fg={theme.fg.red} />
            <box flexGrow={1} /><text content={`${terminal.messages.length} messages`} fg={theme.fg.dim} />
          </box>
        )}
      </box>
    </box>
  );
}
