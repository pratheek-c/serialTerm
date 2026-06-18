import { TextAttributes } from "@opentui/core";
import { theme, NAV_ITEMS, type NavItem } from "../types";

interface SidebarProps {
  activeItem: NavItem;
  username?: string;
  onNavigate: (item: NavItem) => void;
}

/**
 * Sidebar — k9s-style compact navigation panel.
 *
 * ├────────────────┤
 * │ DMS TERMINAL   │
 * ├────────────────┤
 * │▶ Ports         │  ← active
 * │  Connections   │
 * │  Logs          │
 * │  Settings      │
 * │  About         │
 * │  Exit          │
 * ├────────────────┤
 * │ @admin         │
 * └────────────────┘
 */
export function Sidebar({ activeItem, username, onNavigate }: SidebarProps) {
  return (
    <box
      width={18}
      flexDirection="column"
      backgroundColor={theme.bg.sidebar}
      borderStyle="single"
      borderColor={theme.border.default}
    >
      {/* ── Header ── */}
      <box
        height={2}
        alignItems="center"
        justifyContent="center"
        backgroundColor={theme.bg.header}
      >
        <text content="DMS" fg={theme.fg.cyan} attributes={TextAttributes.BOLD} />
        <text content=" TERMINAL" fg={theme.fg.grey} />
      </box>

      {/* ── Nav items ── */}
      <box flexDirection="column" gap={0} flexGrow={1} paddingTop={1}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <box
              key={item.id}
              height={2}
              alignItems="center"
              paddingLeft={1}
              gap={1}
              backgroundColor={
                isActive ? theme.bg.selected : "transparent"
              }
            >
              {/* Selection indicator */}
              <text
                content={isActive ? "▶" : " "}
                fg={isActive ? theme.fg.cyan : "transparent"}
                attributes={TextAttributes.BOLD}
              />
              <text
                content={item.icon}
                fg={isActive ? theme.fg.cyan : theme.fg.dim}
              />
              <text
                content={item.label}
                fg={isActive ? theme.fg.white : theme.fg.grey}
                attributes={isActive ? TextAttributes.BOLD : 0}
              />
            </box>
          );
        })}
      </box>

      {/* ── Footer ── */}
      {username && (
        <box
          height={2}
          alignItems="center"
          justifyContent="center"
          borderStyle="single"
          borderColor={theme.border.muted}
          backgroundColor={theme.bg.header}
        >
          <text content="@" fg={theme.fg.dim} />
          <text content={username} fg={theme.fg.cyan} />
        </box>
      )}
    </box>
  );
}
