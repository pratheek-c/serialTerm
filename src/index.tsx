import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { useState, useCallback } from "react";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { TerminalScreen } from "./screens/TerminalScreen";
import type { Screen, ComPortInfo } from "./types";

/**
 * App — top-level screen router.
 *
 * Manages three screens:
 *   login     → authentication gateway
 *   dashboard → COM port listing with detail panel
 *   terminal  → serial communication terminal
 */
function App() {
  const [screen, setScreen] = useState<Screen>({ name: "login" });

  /** Login succeeded → go to dashboard. */
  const handleLogin = useCallback((username: string) => {
    setScreen({ name: "dashboard", username });
  }, []);

  /** Logout → return to login screen. */
  const handleLogout = useCallback(() => {
    setScreen({ name: "login" });
  }, []);

  /** User selected an active port → open terminal. */
  const handleSelectPort = useCallback(
    (port: ComPortInfo) => {
      const current = screen;
      if (current.name === "dashboard") {
        setScreen({ name: "terminal", username: current.username, port });
      }
    },
    [screen],
  );

  /** Terminal back → return to dashboard. */
  const handleBackToDashboard = useCallback(() => {
    const current = screen;
    if (current.name === "terminal") {
      setScreen({ name: "dashboard", username: current.username });
    }
  }, [screen]);

  switch (screen.name) {
    case "login":
      return <LoginScreen onLogin={handleLogin} />;

    case "dashboard":
      return (
        <DashboardScreen
          username={screen.username}
          onSelectPort={handleSelectPort}
          onLogout={handleLogout}
        />
      );

    case "terminal":
      return (
        <TerminalScreen
          port={screen.port}
          onBack={handleBackToDashboard}
        />
      );

    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}

// ─── Bootstrap ───

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
});

createRoot(renderer).render(<App />);
