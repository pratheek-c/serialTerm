import { TextAttributes } from "@opentui/core";
import { theme } from "../../types";

interface HeaderProps {
  title: string;
  icon?: string;
  rightContent?: string;
  rightLabel?: string;
  backgroundColor?: string;
  height?: number;
}

/**
 * Header — macOS Terminal-style title bar.
 * Dark background, left-aligned icon + bold title,
 * right-aligned status info.
 *
 * On narrow terminals (< 60 cols) the right label is hidden
 * to save space — only the icon + title + rightContent are shown.
 */
export function Header({
  title,
  icon,
  rightContent,
  rightLabel,
  backgroundColor = theme.bg.surface,
  height = 3,
}: HeaderProps) {
  return (
    <box
      height={height}
      backgroundColor={backgroundColor}
      alignItems="center"
      justifyContent="space-between"
      paddingLeft={3}
      paddingRight={3}
    >
      {/* ── Left side ── */}
      <box alignItems="center" gap={2}>
        {icon && (
          <text content={icon} fg={theme.fg.accent} attributes={TextAttributes.BOLD} />
        )}
        <text
          content={title}
          fg={theme.fg.default}
          attributes={TextAttributes.BOLD}
        />
      </box>

      {/* ── Right side ── */}
      {rightContent && (
        <box alignItems="center" gap={2}>
          {rightLabel && (
            <text content={rightLabel} fg={theme.fg.dim} />
          )}
          <text
            content={rightContent}
            fg={theme.fg.accent}
            attributes={TextAttributes.BOLD}
          />
        </box>
      )}
    </box>
  );
}
