import { theme } from "../../types";

interface LabeledInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onInput: (value: string) => void;
  onSubmit?: () => void;
  focused: boolean;
  width?: number;
  accentColor?: string;
}

/**
 * LabeledInput — macOS Terminal clean input field.
 *
 *  Username
 * ┌──────────────────────────────────┐
 * │ admin                            │
 * └──────────────────────────────────┘
 *
 * Border glows with the accent color when focused.
 */
export function LabeledInput({
  placeholder,
  value,
  onInput,
  onSubmit,
  focused,
  label,
  width = 44,
  accentColor = theme.fg.accent,
}: LabeledInputProps) {
  const borderColor = focused ? accentColor : theme.border.default;

  return (
    <box flexDirection="column" gap={0}>
      {/* ── Label ── */}
      <text content={`  ${label}`} fg={theme.fg.default} />

      {/* ── Bordered input ── */}
      <box borderStyle="single" borderColor={borderColor}>
        <input
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}...`}
          value={value}
          onInput={onInput}
          onSubmit={onSubmit}
          focused={focused}
          width={width}
          textColor={theme.fg.default}
          backgroundColor={theme.bg.input}
          cursorColor={accentColor}
        />
      </box>
    </box>
  );
}

interface FormHelpProps {
  items: { key: string; label: string }[];
}

/**
 * FormHelp — keyboard shortcut hints centered below a form.
 */
export function FormHelp({ items }: FormHelpProps) {
  return (
    <box justifyContent="center" flexDirection="column" gap={0} alignItems="center">
      {items.map((item) => (
        <box key={item.key} flexDirection="row" gap={1}>
          <text content={item.key} fg={theme.fg.accent} attributes={1} />
          <text content={`— ${item.label}`} fg={theme.fg.dim} />
        </box>
      ))}
    </box>
  );
}
