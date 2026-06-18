import { TextAttributes } from "@opentui/core";
import { theme } from "../types";

interface ShellPromptProps {
  text: string;
  variant?: "green" | "cyan" | "yellow" | "red";
}

const colorMap = {
  green:  theme.fg.green,
  cyan:   theme.fg.cyan,
  yellow: theme.fg.yellow,
  red:    theme.fg.red,
};

/**
 * Renders a `>_` shell prompt prefix + text.
 */
export function ShellPrompt({ text, variant = "green" }: ShellPromptProps) {
  return (
    <box flexDirection="row" gap={1} alignItems="center">
      <text content=">_" fg={colorMap[variant]} attributes={TextAttributes.BOLD} />
      <text content={text} fg={theme.fg.white} />
    </box>
  );
}
