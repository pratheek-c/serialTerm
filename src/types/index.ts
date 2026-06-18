// ═══════════════════════════════════════════════════════════════
//  macOS Terminal "Pro" Inspired Theme
//  Dark, clean, monospace-first with refined color hierarchy.
// ═══════════════════════════════════════════════════════════════
export const theme = {
  bg: {
    /** Deepest background — the terminal void. */
    base: "#1a1a1a",
    /** Card / surface backgrounds. */
    surface: "#252525",
    /** Slightly elevated panels. */
    elevated: "#2d2d2d",
    /** Overlay backdrop at 60% opacity. */
    overlay: "#1a1a1a99",
    /** Text input backgrounds. */
    input: "#1e1e1e",
    /** Selected / highlighted row fill. */
    selected: "#00e5ff22",
    /** Hover state fill. */
    hover: "#ffffff08",
    /** Terminal output area — pure terminal black. */
    terminal: "#0d0d0d",
  },
  border: {
    /** Default subtle border — glass-like. */
    default: "#3a3a3a",
    /** Muted divider. */
    muted: "#2a2a2a",
    /** Focus / accent border (cyan cursor color). */
    focus: "#00e5ff",
    /** Success border. */
    success: "#00ff87",
    /** Danger / error border. */
    danger: "#ff5555",
    /** Terminal box-drawing borders. */
    terminal: "#00e5ff44",
  },
  fg: {
    /** Primary text — warm white. */
    default: "#e0e0e0",
    /** Muted / secondary text. */
    muted: "#888888",
    /** Dim / tertiary / hints. */
    dim: "#555555",
    /** Accent (cyan, like macOS Terminal cursor). */
    accent: "#00e5ff",
    /** Success green (like terminal green text). */
    success: "#00ff87",
    /** Danger red. */
    danger: "#ff5555",
    /** Warning amber. */
    warning: "#ffd700",
  },
  text: {
    primary: "#e0e0e0",
    secondary: "#888888",
    tertiary: "#555555",
    link: "#00e5ff",
    /** Bright green for sent data. */
    success: "#00ff87",
    danger: "#ff5555",
    /** Received data — amber tint. */
    received: "#ffd700",
  },
} as const;

// ─── Responsive Breakpoints (in terminal columns) ───
export const breakpoints = {
  /** < 60 cols: phone-narrow, single-column layouts. */
  sm: 60,
  /** 60–90 cols: tablet, two-column starts working. */
  md: 90,
  /** > 90 cols: desktop, full side-by-side panels. */
  lg: 120,
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
  | 300
  | 1200
  | 2400
  | 4800
  | 9600
  | 19200
  | 38400
  | 57600
  | 115200
  | 230400;

export const BAUD_RATES: BaudRate[] = [
  300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400,
];

export interface TerminalMessage {
  id: number;
  timestamp: string;
  text: string;
  type: "info" | "sent" | "received" | "error" | "system";
}

// ─── Responsive Size ───
export type ScreenSize = "sm" | "md" | "lg";

// ─── Screen Router Types ───
export type Screen =
  | { name: "login" }
  | { name: "dashboard"; username: string }
  | { name: "terminal"; username: string; port: ComPortInfo };
