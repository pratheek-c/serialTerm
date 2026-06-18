import { TextAttributes } from "@opentui/core";
import { theme, NAV_ITEMS, type NavItem } from "../types";

interface SidebarProps {
  activeItem: NavItem;
  username?: string;
  onNavigate: (item: NavItem) => void;
}

/**
 * Left navigation sidebar.
 * Renders vertically-stacked nav items with icon + label.
 * The active item is highlighted with the accent colour.
 */
export function Sidebar({ activeItem, username, onNavigate }: SidebarProps) {
  return (
    <box
      width={22}
      flexDirection="column"
      backgroundColor={theme.bg.sidebar}
      borderStyle="single"
      borderColor={theme.border.default}
    >
      {/* ── Sidebar header ── */}
      <box
        height={3}
        alignItems="center"
        justifyContent="center"
        backgroundColor={theme.bg.header}
      >
        <text content=">_ DMS" fg={theme.fg.accent} attributes={TextAttributes.BOLD} />
      </box>

      {/* ── Nav items ── */}
      <box flexDirection="column" gap={0} flexGrow={1} paddingTop={1}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <box
              key={item.id}
              height={3}
              alignItems="center"
              paddingLeft={2}
              gap={2}
              backgroundColor={
                isActive ? theme.bg.selected : "transparent"
              }
            >
              <text
                content={item.icon}
                fg={isActive ? theme.fg.accent : theme.fg.dim}
                attributes={isActive ? TextAttributes.BOLD : 0}
              />
              <text
                content={item.label}
                fg={isActive ? theme.fg.accent : theme.fg.muted}
                attributes={isActive ? TextAttributes.BOLD : 0}
              />
            </box>
          );
        })}
      </box>

      {/* ── Footer: username ── */}
      {username && (
        <box
          height={2}
          alignItems="center"
          justifyContent="center"
          borderStyle="single"
          borderColor={theme.border.muted}
          backgroundColor={theme.bg.header}
        >
          <text content={`@${username}`} fg={theme.fg.dim} />
        </box>
      )}
    </box>
  );
}
