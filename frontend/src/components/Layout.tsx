import React, { useEffect, useState } from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
  IonMenuToggle,
  IonButtons,
  IonMenuButton,
  IonPage,
} from '@ionic/react';
import { useLocation, Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode; onSearch?: (text: string) => void; title?: string }> = ({
  children,
  onSearch,
  title,
}) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const pages = [
    { label: 'Todos', path: '/todos', icon: '📝' },
    { label: 'Categories', path: '/categories', icon: '🏷️' },
    { label: 'Statistics', path: '/statistics', icon: '📊' },
  ];

  const pageTitle = title || pages.find((p) => p.path === location.pathname)?.label || 'App';

  return (
    <>
      {/* ─── SIDEBAR ──────────────────────────────────── */}
      <IonMenu contentId="main-content">
        <IonHeader style={{ boxShadow: 'none' }}>
          <div style={{
            padding: '24px 20px 16px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>✅ TodoApp</div>
            <div style={{ fontSize: '0.75rem', color: 'color-mix(in srgb, var(--text) 50%, transparent)', marginTop: 2 }}>
              Manage your tasks
            </div>
          </div>
        </IonHeader>
        <IonContent>
          <nav style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pages.map((page) => {
              const isActive = location.pathname === page.path;
              return (
                <IonMenuToggle key={page.path} autoHide={false}>
                  <Link
                    to={page.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      color: isActive ? 'var(--primary)' : 'color-mix(in srgb, var(--text) 75%, transparent)',
                      background: isActive ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.95rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.15rem' }}>{page.icon}</span>
                    {page.label}
                  </Link>
                </IonMenuToggle>
              );
            })}
          </nav>
        </IonContent>
      </IonMenu>

      {/* ─── MAIN PAGE ──────────────────────────────────── */}
      <IonPage id="main-content">
        <IonHeader style={{ boxShadow: 'none' }}>
          <IonToolbar style={{ '--background': 'var(--surface)', '--border-color': 'var(--border)', padding: '0 8px' }}>
            <IonButtons slot="start">
              <IonMenuButton style={{ color: 'var(--text)' }} />
            </IonButtons>

            {/* Page title */}
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', padding: '0 4px' }}>
              {pageTitle}
            </span>

            {/* Inline search */}
            {onSearch && (
              <div slot="end" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '5px 10px',
                  gap: 6,
                  marginRight: 8,
                }}>
                  <span style={{ color: 'color-mix(in srgb, var(--text) 45%, transparent)', fontSize: '0.9rem' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search todos…"
                    value={searchVal}
                    onChange={(e) => {
                      setSearchVal(e.target.value);
                      onSearch(e.target.value);
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      width: 180,
                    }}
                  />
                  {searchVal && (
                    <button
                      onClick={() => { setSearchVal(''); onSearch(''); }}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'color-mix(in srgb, var(--text) 40%, transparent)', padding: 0, lineHeight: 1 }}
                    >×</button>
                  )}
                </div>
              </div>
            )}

            {/* Theme toggle */}
            <IonButtons slot="end">
              <button
                onClick={toggleTheme}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginRight: 4,
                  transition: 'background 0.2s',
                }}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent style={{ '--background': 'var(--bg)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
            {children}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Layout;
