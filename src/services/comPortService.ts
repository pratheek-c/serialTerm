import type { ComPortInfo, BaudRate, TerminalMessage } from "../types";

let _messageIdCounter = 0;

/**
 * Create a timestamped terminal message.
 */
function msg(text: string, type: TerminalMessage["type"]): TerminalMessage {
  return {
    id: ++_messageIdCounter,
    timestamp: new Date().toLocaleTimeString(),
    text,
    type,
  };
}

// ─── Port Detection ───

/**
 * Detect COM ports on Windows via PowerShell WMI + .NET fallback.
 * On non-Windows systems, returns an empty array.
 */
export async function getComPorts(): Promise<ComPortInfo[]> {
  try {
    const ports = await getPortsFromWmi();
    if (ports.length > 0) return ports;
  } catch {
    // fall through to .NET fallback
  }

  try {
    return await getPortsFromDotNet();
  } catch {
    return [];
  }
}

async function getPortsFromWmi(): Promise<ComPortInfo[]> {
  const proc = Bun.spawnSync([
    "powershell",
    "-NoProfile",
    "-Command",
    [
      "Get-WmiObject Win32_SerialPort",
      "| Select-Object Name, Status, Description, @{N='Baud';E={$_.MaxBaudRate}}",
      "| ConvertTo-Json",
    ].join(" "),
  ]);

  const output = proc.stdout.toString().trim();
  if (!output || output === "null") return [];

  const parsed = JSON.parse(output);
  const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

  return items.map((item) => ({
    name: item.Name || "Unknown",
    description: item.Description || "Serial Port",
    status: item.Status?.toLowerCase() === "ok" ? ("active" as const) : ("idle" as const),
    baudRate: item.Baud ? `${item.Baud} bps` : undefined,
  }));
}

async function getPortsFromDotNet(): Promise<ComPortInfo[]> {
  const proc = Bun.spawnSync([
    "powershell",
    "-NoProfile",
    "-Command",
    "[System.IO.Ports.SerialPort]::GetPortNames()",
  ]);

  const output = proc.stdout.toString().trim();
  if (!output) return [];

  return output
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      description: "Standard Serial Port",
      status: "active" as const,
    }));
}

// ─── Port Accessibility ───

/**
 * Test whether a COM port can be opened for communication.
 */
export async function checkPortAccessible(portName: string): Promise<boolean> {
  const proc = Bun.spawnSync([
    "powershell",
    "-NoProfile",
    "-Command",
    [
      `$port = New-Object System.IO.Ports.SerialPort '${portName}'`,
      "try { $port.Open(); $port.Close(); Write-Output 'true' }",
      "catch { Write-Output 'false' }",
    ].join("; "),
  ]);

  return proc.stdout.toString().trim() === "true";
}

// ─── Port Communication ───

/**
 * Send a command string to a COM port and read back any response.
 */
export async function sendToPort(
  portName: string,
  command: string,
  baudRate: number = 9600,
  readTimeoutMs: number = 2000,
): Promise<string> {
  const escapedCommand = command.replace(/'/g, "''");

  const proc = Bun.spawnSync([
    "powershell",
    "-NoProfile",
    "-Command",
    [
      `$port = New-Object System.IO.Ports.SerialPort '${portName}', ${baudRate}`,
      "try {",
      "  $port.Open()",
      `  $port.WriteLine('${escapedCommand}')`,
      `  Start-Sleep -Milliseconds ${readTimeoutMs}`,
      "  $response = $port.ReadExisting()",
      "  $port.Close()",
      "  Write-Output $response",
      "} catch {",
      '  Write-Output "ERROR: $($_.Exception.Message)"',
      "}",
    ].join("; "),
  ]);

  return proc.stdout.toString().trim();
}

/**
 * Read any available data from a COM port without sending anything.
 */
export async function readFromPort(
  portName: string,
  baudRate: number = 9600,
): Promise<string> {
  const proc = Bun.spawnSync([
    "powershell",
    "-NoProfile",
    "-Command",
    [
      `$port = New-Object System.IO.Ports.SerialPort '${portName}', ${baudRate}`,
      "try {",
      "  $port.Open()",
      "  $port.ReadTimeout = 2000",
      "  $data = $port.ReadExisting()",
      "  $port.Close()",
      '  Write-Output $data',
      "} catch {",
      '  Write-Output ""',
      "}",
    ].join("; "),
  ]);

  return proc.stdout.toString().trim();
}

// ─── Terminal Session ───

/**
 * Manages a serial terminal session lifecycle.
 * Provides high-level send/read operations with typed message history.
 */
export class ComPortSession {
  public readonly portName: string;
  public readonly baudRate: number;
  public connected = false;

  private _onMessage?: (msg: TerminalMessage) => void;

  constructor(portName: string, baudRate: BaudRate) {
    this.portName = portName;
    this.baudRate = baudRate;
  }

  /** Register a callback for every terminal message. */
  onMessage(cb: (msg: TerminalMessage) => void): void {
    this._onMessage = cb;
  }

  /** Attempt to open the COM port. Returns true on success. */
  async connect(): Promise<boolean> {
    this.emit(msg(`Connecting to ${this.portName} @ ${this.baudRate} baud...`, "system"));

    try {
      const accessible = await checkPortAccessible(this.portName);
      if (accessible) {
        this.connected = true;
        this.emit(msg(`✓ Connected to ${this.portName}`, "system"));
        this.emit(msg("Type a command and press Enter to send", "info"));
        this.emit(msg("Press Esc to disconnect", "info"));
        return true;
      } else {
        this.emit(msg(`✗ Failed to connect to ${this.portName}`, "error"));
        this.emit(msg("Port may be in use or inaccessible", "error"));
        return false;
      }
    } catch (e) {
      this.emit(msg(`Connection error: ${String(e)}`, "error"));
      return false;
    }
  }

  /** Disconnect from the COM port. */
  disconnect(): void {
    this.connected = false;
    this.emit(msg(`Disconnected from ${this.portName}`, "system"));
  }

  /** Send a command and capture the response. */
  async sendCommand(data: string): Promise<void> {
    if (!data.trim()) return;

    this.emit(msg(data, "sent"));

    try {
      const response = await sendToPort(this.portName, data, this.baudRate);
      if (response) {
        response.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (trimmed) {
            this.emit(msg(trimmed, trimmed.startsWith("ERROR") ? "error" : "received"));
          }
        });
      } else {
        this.emit(msg("(no response)", "info"));
      }
    } catch (e) {
      this.emit(msg(`ERROR: ${String(e)}`, "error"));
    }
  }

  /** Read any pending data from the port. */
  async readPending(): Promise<void> {
    try {
      const data = await readFromPort(this.portName, this.baudRate);
      if (data) {
        this.emit(msg(data, "received"));
      }
    } catch (e) {
      this.emit(msg(`Read error: ${String(e)}`, "error"));
    }
  }

  private emit(message: TerminalMessage): void {
    this._onMessage?.(message);
  }
}
