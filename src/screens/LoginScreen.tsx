import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useState, useCallback } from "react";
import { AppLayout, CenterContent } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { LabeledInput, FormHelp } from "../components/ui/Input";
import { theme } from "../types";
import { authenticate } from "../services/authService";
import { useResponsive } from "../hooks/useResponsive";

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

/**
 * LoginScreen — macOS Terminal-styled authentication gateway.
 *
 * Responsive card: full-width on narrow terminals,
 * centered at a comfortable 54–58 cols on wide ones.
 */
export function LoginScreen({ onLogin }: LoginScreenProps) {
  const resp = useResponsive();
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
      setFocused((prev) =>
        prev === "username" ? "password" : "username",
      );
    }
  });

  const inputWidth = resp.isSmall ? resp.width - 12 : resp.loginCardWidth - 8;

  return (
    <AppLayout>
      <CenterContent>
        <Card
          width={resp.loginCardWidth}
          padding={3}
          gap={1}
        >
          {/* ── App Title ── */}
          <box justifyContent="center" marginBottom={1}>
            <text
              content="Device Management System"
              fg={theme.fg.accent}
              attributes={TextAttributes.BOLD}
            />
          </box>

          {/* ── Divider ── */}
          <box justifyContent="center">
            <text content="─── Login ───" fg={theme.fg.dim} />
          </box>

          <text content="" />

          {/* ── Username ── */}
          <LabeledInput
            label="Username"
            placeholder="Enter username..."
            value={username}
            onInput={setUsername}
            focused={focused === "username" && !authenticating}
            width={inputWidth}
          />

          {/* ── Password ── */}
          <box marginTop={1}>
            <LabeledInput
              label="Password"
              placeholder="Enter password..."
              value={password}
              onInput={setPassword}
              onSubmit={handleSubmit}
              focused={focused === "password" && !authenticating}
              width={inputWidth}
            />
          </box>

          {/* ── Error ── */}
          {error && (
            <box marginTop={1} paddingLeft={2}>
              <text content={`⚠  ${error}`} fg={theme.fg.danger} />
            </box>
          )}

          {/* ── Loading ── */}
          {authenticating && (
            <box marginTop={1} paddingLeft={2}>
              <text content="⏳  Authenticating..." fg={theme.fg.muted} />
            </box>
          )}

          <text content="" />

          {/* ── Shortcuts ── */}
          <FormHelp
            items={[
              { key: "Tab", label: "Switch field" },
              { key: "Enter", label: "Login" },
              { key: "Ctrl+C", label: "Quit" },
            ]}
          />
        </Card>
      </CenterContent>
    </AppLayout>
  );
}
