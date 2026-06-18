import { theme } from "../types";

interface LabeledInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onInput: (value: string) => void;
  onSubmit?: () => void;
  focused: boolean;
  width?: number;
}

/**
 * Cyberpunk-styled input: dark background, thin border,
 * accent-coloured border on focus, subtle label above.
 */
export function LabeledInput({
  label,
  placeholder,
  value,
  onInput,
  onSubmit,
  focused,
  width = 40,
}: LabeledInputProps) {
  const borderColor = focused ? theme.border.focus : theme.border.default;

  return (
    <box flexDirection="column" gap={0}>
      <text content={`  ${label}`} fg={theme.fg.muted} />
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
          cursorColor={theme.fg.accent}
        />
      </box>
    </box>
  );
}
