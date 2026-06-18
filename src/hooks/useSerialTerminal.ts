import { useState, useCallback, useRef } from "react";
import type { ComPortInfo, BaudRate, TerminalMessage } from "../types";
import { ComPortSession } from "../services/comPortService";

interface UseSerialTerminalOptions {
  port: ComPortInfo;
  baudRate?: BaudRate;
}

interface UseSerialTerminalResult {
  connected: boolean;
  connecting: boolean;
  messages: TerminalMessage[];
  baudRate: BaudRate;
  setBaudRate: (rate: BaudRate) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (data: string) => Promise<void>;
  clearMessages: () => void;
  command: string;
  setCommand: (value: string) => void;
}

/**
 * Hook that manages a serial terminal session lifecycle.
 * Wraps ComPortSession and exposes reactive state for React consumption.
 */
export function useSerialTerminal({
  port,
  baudRate: initialBaud = 9600,
}: UseSerialTerminalOptions): UseSerialTerminalResult {
  const [baudRate, setBaudRate] = useState<BaudRate>(initialBaud);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [command, setCommand] = useState("");

  const sessionRef = useRef<ComPortSession | null>(null);

  const addMessage = useCallback((msg: TerminalMessage) => {
    setMessages((prev) => [...prev.slice(-500), msg]);
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);

    const session = new ComPortSession(port.name, baudRate);
    session.onMessage(addMessage);
    sessionRef.current = session;

    const ok = await session.connect();
    setConnected(ok);
    setConnecting(false);
  }, [port.name, baudRate, addMessage]);

  const disconnect = useCallback(() => {
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    setConnected(false);
  }, []);

  const send = useCallback(
    async (data: string) => {
      if (!data.trim() || !connected) return;
      setCommand("");
      await sessionRef.current?.sendCommand(data);
    },
    [connected],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    connected,
    connecting,
    messages,
    baudRate,
    setBaudRate,
    connect,
    disconnect,
    send,
    clearMessages,
    command,
    setCommand,
  };
}
