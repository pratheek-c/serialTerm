// ═══════════════════════════════════════════════════════════════
//  K9S / LAZYGIT-INSPIRED TERMINAL THEME
//  Professional NOC dashboard — clean, dense, hierarchial.
// ═══════════════════════════════════════════════════════════════
export const theme = {
  bg: {
    base: "#000000",
    surface: "#0a0a0a",
    elevated: "#111111",
    overlay: "#000000cc",
    input: "#050505",
    selected: "#00e5ff11",
    hover: "#ffffff08",
    terminal: "#000000",
    sidebar: "#050505",
    header: "#0a0a0a",
    log: "#050505",
  },
  border: {
    default: "#1e1e1e",
    muted: "#141414",
    focus: "#00e5ff",
    success: "#00ff41",
    danger: "#ff003c",
    warning: "#ffd700",
  },
  // Colour hierarchy (k9s-style):
  //   white  → main content / headings
  //   green  → success / active / connected
  //   yellow → warning / busy
  //   red    → error / disconnected
  //   cyan   → selection highlight / links
  //   grey   → metadata / labels / dim
  fg: {
    white:    "#f0f0f0",
    green:    "#00ff41",
    yellow:   "#ffd700",
    red:      "#ff003c",
    cyan:     "#00e5ff",
    grey:     "#888888",
    dim:      "#444444",
    muted:    "#666666",
  },
} as const;

// ─── Serial Port Types ─────────────────────────────────────
export type PortStatus = "active" | "busy" | "idle" | "error";

export interface ComPortInfo {
  name: string;
  description: string;
  status: PortStatus;
  baudRate?: string;
  vendor?: string;
  deviceType?: string;
}

// ─── Auth Types ─────────────────────────────────────────────
export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  username?: string;
  error?: string;
}

// ─── Terminal Types ─────────────────────────────────────────
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

// ─── Log Entry ──────────────────────────────────────────────
export interface LogEntry {
  id: number;
  timestamp: string;
  text: string;
  level: "info" | "success" | "warn" | "error";
}

// ─── Sidebar Navigation ─────────────────────────────────────
export type NavItem =
  | "dashboard"
  | "ports"
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
  { id: "dashboard",    icon: "◈", label: "Dashboard" },
  { id: "ports",        icon: "⏚", label: "Ports" },
  { id: "connections",  icon: "⇌", label: "Connections" },
  { id: "logs",         icon: "☰", label: "Logs" },
  { id: "settings",     icon: "⚙", label: "Settings" },
  { id: "about",        icon: "◎", label: "About" },
  { id: "exit",         icon: "✕", label: "Exit" },
];

// ─── Screen Router ──────────────────────────────────────────
export type Screen =
  | { name: "login" }
  | { name: "dashboard"; username: string }
  | { name: "terminal"; username: string; port: ComPortInfo };
