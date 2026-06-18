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
 * Cyberpunk input — dark bg, thin border, cyan glow on focus.
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
      <text content={`  ${label}`} fg={theme.fg.grey} />
      <box borderStyle="single" borderColor={borderColor}>
        <input
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}...`}
          value={value}
          onInput={onInput}
          onSubmit={onSubmit}
          focused={focused}
          width={width}
          textColor={theme.fg.white}
          backgroundColor={theme.bg.input}
          cursorColor={theme.fg.cyan}
        />
      </box>
    </box>
  );
}
