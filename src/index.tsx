import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { useState, useCallback } from "react";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { TerminalScreen } from "./screens/TerminalScreen";
import type { Screen, ComPortInfo } from "./types";

function App() {
  const [screen, setScreen] = useState<Screen>({ name: "login" });

  const handleLogin = useCallback((username: string) => {
    setScreen({ name: "dashboard", username });
  }, []);

  const handleLogout = useCallback(() => {
    setScreen({ name: "login" });
  }, []);

  const handleSelectPort = useCallback(
    (port: ComPortInfo) => {
      const current = screen;
      if (current.name === "dashboard") {
        setScreen({ name: "terminal", username: current.username, port });
      }
    },
    [screen],
  );

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

const renderer = await createCliRenderer({ exitOnCtrlC: true });
createRoot(renderer).render(<App />);
