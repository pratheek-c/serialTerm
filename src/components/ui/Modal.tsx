import { TextAttributes } from "@opentui/core";
import type { ReactNode } from "react";
import { theme } from "../../types";

interface ModalProps {
  open: boolean;
  title?: string;
  accentColor?: string;
  width?: number;
  children?: ReactNode;
}

/**
 * Modal — centered overlay dialog with a frosted backdrop.
 * macOS Terminal style: clean border, subtle backdrop.
 */
export function Modal({
  open,
  title,
  accentColor = theme.fg.accent,
  width = 36,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <box
      position="absolute"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      backgroundColor={theme.bg.overlay}
    >
      <box
        borderStyle="rounded"
        borderColor={accentColor}
        backgroundColor={theme.bg.elevated}
        padding={2}
        width={width}
        flexDirection="column"
        gap={1}
      >
        {title && (
          <text
            content={title}
            fg={theme.fg.default}
            attributes={TextAttributes.BOLD}
          />
        )}

        {children}
      </box>
    </box>
  );
}

interface ModalHelpProps {
  items: { key: string; label: string }[];
}

/**
 * ModalHelp — keyboard hints at the bottom of a modal.
 */
export function ModalHelp({ items }: ModalHelpProps) {
  return (
    <box flexDirection="row" gap={2} justifyContent="center">
      {items.map((item, i) => (
        <box key={item.key} flexDirection="row" gap={1}>
          {i > 0 && <text content="┃" fg={theme.border.default} />}
          <text content={item.key} fg={theme.fg.accent} attributes={1} />
          <text content={item.label} fg={theme.fg.dim} />
        </box>
      ))}
    </box>
  );
}
