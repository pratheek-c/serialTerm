import { TextAttributes } from "@opentui/core";
import { theme } from "../../types";

export interface SelectItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SelectListProps {
  items: SelectItem[];
  selectedIndex: number;
}

/**
 * SelectList — a keyboard-navigable vertical list.
 * Clean macOS Terminal style with subtle highlight on the selected row.
 *
 *   ● COM1
 *      Standard Serial Port
 *   ○ COM3
 *      Debug interface
 */
export function SelectList({ items, selectedIndex }: SelectListProps) {
  return (
    <box flexDirection="column" gap={0}>
      {items.map((item, i) => {
        const isSelected = i === selectedIndex;
        const isDisabled = item.disabled ?? false;

        return (
          <box
            key={item.id}
            flexDirection="column"
            backgroundColor={
              isSelected && !isDisabled ? theme.bg.selected : "transparent"
            }
            paddingLeft={2}
          >
            {/* ── Primary row ── */}
            <text
              content={`  ${isDisabled ? "○" : "●"} ${item.label}`}
              fg={
                isDisabled
                  ? theme.fg.dim
                  : isSelected
                    ? theme.fg.accent
                    : theme.fg.success
              }
              attributes={
                isSelected && !isDisabled
                  ? TextAttributes.BOLD
                  : isDisabled
                    ? TextAttributes.DIM
                    : 0
              }
            />

            {/* ── Description row ── */}
            {item.description && (
              <text
                content={`     ${item.description}`}
                fg={isSelected ? theme.fg.muted : theme.fg.dim}
              />
            )}
          </box>
        );
      })}
    </box>
  );
}

interface SectionHeaderProps {
  label: string;
  count: number;
  color?: string;
}

/**
 * SectionHeader — a labelled divider within a list.
 *
 *   ── ACTIVE (3) ──
 */
export function SectionHeader({
  label,
  count,
  color = theme.fg.muted,
}: SectionHeaderProps) {
  return (
    <text
      content={`  ── ${label} (${count}) ──`}
      fg={color}
      attributes={TextAttributes.DIM}
    />
  );
}
