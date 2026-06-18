import type { ReactNode } from "react";
import { theme } from "../../types";

interface StatusBarItem {
  key: string;
  label: string;
  accent?: boolean;
  color?: string;
}

interface StatusBarProps {
  items: StatusBarItem[];
  children?: ReactNode;
}

/**
 * StatusBar — macOS Terminal-style bottom status bar.
 * Thin border on top, dark background, keyboard hints separated by thin bars.
 */
export function StatusBar({ items, children }: StatusBarProps) {
  return (
    <box
      height={2}
      borderStyle="single"
      borderColor={theme.border.muted}
      backgroundColor={theme.bg.surface}
      alignItems="center"
      paddingLeft={3}
      paddingRight={3}
      gap={2}
    >
      {items.map((item, i) => (
        <box key={item.key} flexDirection="row" gap={1} alignItems="center">
          {i > 0 && (
            <text content="┃" fg={theme.border.default} />
          )}
          <text
            content={item.key}
            fg={item.color ?? (item.accent ? theme.fg.accent : theme.fg.dim)}
            attributes={item.accent ? 1 : 0}
          />
          <text
            content={item.label}
            fg={item.color ?? (item.accent ? theme.fg.accent : theme.fg.muted)}
          />
        </box>
      ))}
      {children}
    </box>
  );
}
