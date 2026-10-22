import {
  ChevronDown,
  CircleHelp,
  GraduationCap,
  LogOut,
  Settings2,
  X,
} from "lucide-react";
import { navItems, pageLabels } from "../resources";
import type { DataStore, PageKey } from "../types";

type SidebarProps = {
  page: PageKey;
  data: DataStore;
  profileName: string;
  open: boolean;
  onNavigate: (page: PageKey) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onHelp: () => void;
  onClose: () => void;
};

export function Sidebar({
  page,
  data,
  profileName,
  open,
  onNavigate,
  onSignIn,
  onSignOut,
  onHelp,
  onClose,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <GraduationCap size={21} strokeWidth={2.4} />
        </div>
        <div>
          <strong>Ratanak</strong>
          <span>ACADEMIC PORTAL</span>
        </div>
        <button
          className="icon-button close-nav"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>
      <div className="workspace-chip">
        <div className="workspace-logo">N</div>
        <div>
          <b>Northstar Academy</b>
          <small>Administrator workspace</small>
        </div>
        <ChevronDown size={15} />
      </div>
      {["Workspace", "Academic", "Management"].map((group) => (
        <div className="nav-group" key={group}>
          <p className="nav-heading">{group}</p>
          {navItems
            .filter((item) => item.group === group)
            .map((item) => {
              const Icon = item.icon;
              const count =
                item.key !== "dashboard" ? data[item.key]?.length : undefined;
              return (
                <button
                  key={item.key}
                  className={`nav-item ${page === item.key ? "active" : ""}`}
                  onClick={() => onNavigate(item.key)}
                >
                  <Icon size={18} />
                  <span>{pageLabels[item.key]}</span>
                  {count !== undefined && <small>{count}</small>}
                </button>
              );
            })}
        </div>
      ))}
      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">
            <CircleHelp size={17} />
          </div>
          <b>Need a hand?</b>
          <p>Get help using your workspace.</p>
          <button onClick={onHelp}>
            Visit help center <span>↗</span>
          </button>
        </div>
        <div className="user-card">
          <div className="avatar">
            {(profileName || "AD").slice(0, 2).toUpperCase()}
          </div>
          <div className="user-meta">
            <b>{profileName || "Administrator"}</b>
            <small>{profileName ? "Signed in" : "Workspace admin"}</small>
          </div>
          <button
            className="icon-button user-action"
            onClick={profileName ? onSignOut : onSignIn}
            aria-label={profileName ? "Sign out" : "Sign in"}
          >
            {profileName ? <LogOut size={17} /> : <Settings2 size={17} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
