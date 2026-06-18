import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

interface ShellPromptProps {
  text: string;
  variant?: "accent" | "cyan" | "success" | "danger";
}

/**
 * Renders a `>_` shell prompt prefix + text.
 * Used as section headers throughout the app.
 */
export function ShellPrompt({ text, variant = "accent" }: ShellPromptProps) {
  const colorMap = {
    accent: theme.fg.accent,
    cyan: theme.fg.cyan,
    success: theme.fg.success,
    danger: theme.fg.danger,
  };

  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text
        content=">_"
        fg={colorMap[variant]}
        attributes={TextAttributes.BOLD}
      />
      <text content={text} fg={theme.fg.default} />
    </box>
  );
}
