import { TextAttributes } from "@opentui/core";
import type { ReactNode } from "react";
import { theme } from "../../types";

type Dim = number | `${number}%` | "auto";

interface CardProps {
  title?: string;
  width?: Dim;
  height?: Dim;
  flexGrow?: number;
  borderStyle?: "single" | "double" | "rounded" | "heavy";
  borderColor?: string;
  backgroundColor?: string;
  padding?: number;
  gap?: number;
  flexDirection?: "row" | "column";
  children?: ReactNode;
}

/**
 * Card — macOS Terminal glass-morphism panel.
 * Minimal border, clean padding, optional title in the top border.
 */
export function Card({
  title,
  width,
  height,
  flexGrow,
  borderStyle = "rounded",
  borderColor,
  backgroundColor = theme.bg.surface,
  padding = 2,
  gap = 1,
  flexDirection = "column",
  children,
}: CardProps) {
  return (
    <box
      borderStyle={borderStyle}
      borderColor={borderColor ?? theme.border.default}
      width={width}
      height={height}
      flexGrow={flexGrow}
      backgroundColor={backgroundColor}
      padding={padding}
      gap={gap}
      flexDirection={flexDirection}
      title={title}
      titleColor={theme.fg.accent}
      titleAlignment="left"
    >
      {children}
    </box>
  );
}

interface CardSectionProps {
  children?: ReactNode;
  /** Label for this section, rendered as a subtle header. */
  label?: string;
  /** Extra right-side content in the header row. */
  right?: ReactNode;
  flexGrow?: number;
  padding?: number;
}

/**
 * CardSection — a labelled section inside a Card.
 * Renders a subtle header line with optional right content,
 * then the children below.
 */
export function CardSection({
  children,
  label,
  right,
  flexGrow,
  padding: pad = 1,
}: CardSectionProps) {
  return (
    <box flexDirection="column" gap={0} flexGrow={flexGrow}>
      {label && (
        <box
          flexDirection="row"
          alignItems="center"
          paddingLeft={pad}
          paddingRight={pad}
          height={2}
          gap={1}
        >
          <text content={label} fg={theme.fg.muted} />
          <box flexGrow={1} />
          {right}
        </box>
      )}
      <box paddingLeft={pad} paddingRight={pad} flexDirection="column" gap={0}>
        {children}
      </box>
    </box>
  );
}

interface CardFooterProps {
  children?: ReactNode;
}

/**
 * CardFooter — a minimal bottom bar with a thin top border.
 */
export function CardFooter({ children }: CardFooterProps) {
  return (
    <box
      height={2}
      borderStyle="single"
      borderColor={theme.border.muted}
      alignItems="center"
      paddingLeft={2}
      gap={1}
    >
      {children}
    </box>
  );
}
