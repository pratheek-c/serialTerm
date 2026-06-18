// ═══════════════════════════════════════════════════════════════
//  CYBERPUNK TERMINAL THEME
//  Hacker-console inspired, high-contrast, neon-on-black.
// ═══════════════════════════════════════════════════════════════
export const theme = {
  bg: {
    base: "#000000",
    surface: "#0a0a0a",
    elevated: "#111111",
    overlay: "#000000bb",
    input: "#050505",
    selected: "#00ff4111",
    hover: "#00ff4108",
    terminal: "#000000",
    sidebar: "#050505",
    header: "#0a0a0a",
    log: "#050505",
  },
  border: {
    default: "#1a1a1a",
    muted: "#111111",
    focus: "#00ff41",
    success: "#00ff41",
    danger: "#ff003c",
    warning: "#ffd700",
    terminal: "#00ff4122",
  },
  fg: {
    default: "#e0e0e0",
    muted: "#666666",
    dim: "#333333",
    accent: "#00ff41",
    cyan: "#00e5ff",
    success: "#00ff41",
    danger: "#ff003c",
    warning: "#ffd700",
  },
  text: {
    primary: "#e0e0e0",
    secondary: "#888888",
    tertiary: "#555555",
    link: "#00e5ff",
    success: "#00ff41",
    danger: "#ff003c",
    received: "#ffd700",
    sent: "#00e5ff",
  },
} as const;

// ─── COM Port Types ───
export interface ComPortInfo {
  name: string;
  description: string;
  status: "active" | "inactive";
  baudRate?: string;
}

// ─── Auth Types ───
export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  username?: string;
  error?: string;
}

// ─── Terminal Types ───
export type BaudRate =
  | 300 | 1200 | 2400 | 4800 | 9600
  | 19200 | 38400 | 57600 | 115200 | 230400;

export const BAUD_RATES: BaudRate[] = [
  300, 1200, 2400, 4800, 9600,
  19200, 38400, 57600, 115200, 230400,
];

export interface TerminalMessage {
  id: number;
  timestamp: string;
  text: string;
  type: "info" | "sent" | "received" | "error" | "system";
}

// ─── Log entry for the system log panel ───
export interface LogEntry {
  id: number;
  timestamp: string;
  text: string;
  level: "info" | "success" | "warn" | "error";
}

// ─── Sidebar navigation items ───
export type NavItem =
  | "dashboard"
  | "serial-ports"
  | "connections"
  | "logs"
  | "settings"
  | "about"
  | "exit";

export interface NavEntry {
  id: NavItem;
  icon: string;
  label: string;
}

export const NAV_ITEMS: NavEntry[] = [
  { id: "dashboard",     icon: "◈", label: "Dashboard" },
  { id: "serial-ports",  icon: "⏚", label: "Serial Ports" },
  { id: "connections",   icon: "⇌", label: "Connections" },
  { id: "logs",          icon: "☰", label: "Logs" },
  { id: "settings",      icon: "⚙", label: "Settings" },
  { id: "about",         icon: "◎", label: "About" },
  { id: "exit",          icon: "✕", label: "Exit" },
];

// ─── Screen Router Types ───
export type Screen =
  | { name: "login" }
  | { name: "dashboard"; username: string }
  | { name: "terminal"; username: string; port: ComPortInfo };
