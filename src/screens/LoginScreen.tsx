import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useState, useCallback } from "react";
import { AsciiLogo, VersionBadge } from "../components/AsciiLogo";
import { LabeledInput } from "../components/LabeledInput";
import { theme } from "../types";
import { authenticate } from "../services/authService";

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

/**
 * LoginScreen — split-screen Cyberpunk login.
 * ASCII logo on left, authentication form on right.
 */
export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"username" | "password">("username");
  const [error, setError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!username.trim() || !password.trim()) {
      setError("Both fields are required");
      return;
    }
    setAuthenticating(true);
    setError("");
    const result = await authenticate({ username, password });
    setAuthenticating(false);
    if (result.success && result.username) {
      onLogin(result.username);
    } else {
      setError(result.error ?? "Authentication failed");
      setPassword("");
    }
  }, [username, password, onLogin]);

  useKeyboard((key) => {
    if (key.name === "tab" && !authenticating) {
      setFocused((prev) => (prev === "username" ? "password" : "username"));
    }
  });

  return (
    <box flexGrow={1} flexDirection="column" backgroundColor={theme.bg.base}>
      <box flexGrow={1} flexDirection="row" alignItems="center" justifyContent="center">
        {/* ── Left: Branding ── */}
        <box width={40} flexDirection="column" gap={2} alignItems="center" marginRight={4}>
          <AsciiLogo />
          <text content="" />
          <VersionBadge />
          <text content="Serial Port Management Console" fg={theme.fg.grey} attributes={TextAttributes.DIM} />
          <text content="For embedded systems & industrial debug" fg={theme.fg.dim} />
        </box>

        {/* ── Right: Login form ── */}
        <box
          borderStyle="rounded"
          borderColor={theme.border.default}
          backgroundColor={theme.bg.surface}
          width={46}
          padding={3}
          flexDirection="column"
          gap={1}
        >
          <text content=">_ AUTHENTICATION REQUIRED" fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
          <text content={"─".repeat(42)} fg={theme.border.default} />
          <text content="" />

          <LabeledInput
            label="Username"
            placeholder="Enter username..."
            value={username}
            onInput={setUsername}
            focused={focused === "username" && !authenticating}
            width={38}
          />

          <box marginTop={1}>
            <LabeledInput
              label="Password"
              placeholder="Enter password..."
              value={password}
              onInput={setPassword}
              onSubmit={handleSubmit}
              focused={focused === "password" && !authenticating}
              width={38}
            />
          </box>

          {error && (
            <box marginTop={1}>
              <text content={`⚠  ${error}`} fg={theme.fg.red} />
            </box>
          )}

          {authenticating && (
            <box marginTop={1}>
              <text content="⏳  Authenticating..." fg={theme.fg.grey} />
            </box>
          )}

          <text content="" />
          <text content=" Tab — Switch field" fg={theme.fg.dim} />
          <text content=" Enter — Authenticate" fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
          <text content=" Ctrl+C — Quit" fg={theme.fg.dim} />
          <text content="" />
          <text content="Demo: admin/admin, user/1234" fg={theme.fg.dim} attributes={TextAttributes.DIM} />
        </box>
      </box>
    </box>
  );
}
