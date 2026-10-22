import { Bell, ChevronDown, Command, Menu } from 'lucide-react';
import { pageLabels } from '../resources';
import type { PageKey } from '../types';

export function AppHeader({
  page, apiOnline, profileName, onMenu, onNotification, onUserAction,
}: {
  page: PageKey;
  apiOnline: boolean | null;
  profileName: string;
  onMenu: () => void;
  onNotification: () => void;
  onUserAction: () => void;
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
        <span className="crumb">Workspace</span><span className="crumb-separator">/</span><b>{pageLabels[page]}</b>
      </div>
      <div className="topbar-actions">
        <div className={`connection ${apiOnline === false ? 'offline' : ''}`}><span />{apiOnline === null ? 'Connecting' : apiOnline ? 'All systems live' : 'API issue'}</div>
        <button className="icon-button notification" aria-label="Notifications" onClick={onNotification}><Bell size={18} /><i /></button>
        <div className="top-divider" />
        <button className="top-user" onClick={onUserAction}>
          <div className="avatar avatar-small">{(profileName || 'AD').slice(0, 2).toUpperCase()}</div>
          <span>{profileName || 'Admin'}</span><ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}

export function AppFooter({ onAbout }: { onAbout: () => void }) {
  return (
    <footer className="page-footer">
      <span>© 2027 Ratanak Secondary School</span>
      <span><span className="footer-dot" /> Your school, beautifully organized</span>
      <button onClick={onAbout}><Command size={13} /> About</button>
    </footer>
  );
}
