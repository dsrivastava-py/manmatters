import { useCallback, useEffect, useState } from 'react';
import { BUILDER, CONSENT_URL, LOGO, PRIVACY_URL } from './config';
import { AppProvider, fill, useApp } from './state/AppState';
import { Settings } from './components/Settings';
import { Onboarding } from './screens/Onboarding';
import { YourWeek } from './screens/YourWeek';
import { ShedCheck } from './screens/ShedCheck';
import { Checkpoint } from './screens/Checkpoint';
import { Slipped } from './screens/Slipped';
import { HowToApply } from './screens/HowToApply';
import { ShareCard } from './screens/ShareCard';
import { DoctorSummary } from './screens/DoctorSummary';
import { Icon, NavIcon } from './components/NavIcon';

const NAV_ROUTES = ['week', 'shed', 'checkpoint', 'slipped', 'apply'] as const;
const ROUTES = [...NAV_ROUTES, 'share', 'doctor'] as const;
type Route = (typeof ROUTES)[number];

function readRoute(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  return (ROUTES as readonly string[]).includes(h) ? (h as Route) : 'week';
}

function Shell() {
  const { t, lang, setLang, data, week, theme, setThemePref } = useApp();
  const [route, setRoute] = useState<Route>(readRoute);
  const [sheet, setSheet] = useState<null | 'settings' | 'about'>(null);

  useEffect(() => {
    const on = () => setRoute(readRoute());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const go = useCallback((r: string) => {
    window.location.hash = `/${r}`;
    setRoute(r as Route);
    window.scrollTo?.(0, 0);
  }, []);

  // A stored date that is no longer valid (future or too old) falls back to onboarding.
  const started = !!data.startDate && week !== null;
  const onWeek = started && route === 'week';
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const h = t.ui.header;

  return (
    <div className={`app ${started ? 'with-nav' : ''} ${onWeek ? 'with-fab' : ''} route-${started ? route : 'onboarding'}`}>
      <a className="skip" href="#main">{h.skip}</a>
      <header className="topbar no-print">
        <div className="brand">
          <span className="logo-plate"><img src={LOGO} alt="Man Matters" className="logo" height={18} /></span>
          <span className="brand-text">
            <span className="appname">{t.app.name}</span>
            <button type="button" className="pill" onClick={() => setSheet('about')} aria-label={h.conceptPillLabel}>
              {h.conceptPill}
            </button>
          </span>
        </div>
        <div className="tools">
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(lang === 'en' ? 'hinglish' : 'en')}
            aria-label={`${h.langLabel}: ${t.app.languageToggle}`}
            data-testid="lang-toggle"
          >
            <span className={lang === 'en' ? 'on' : ''} aria-hidden="true">EN</span>
            <span className={lang === 'hinglish' ? 'on' : ''} aria-hidden="true">Hinglish</span>
          </button>
          <button
            type="button"
            className="icon-btn theme-btn"
            onClick={() => setThemePref(nextTheme)}
            aria-label={`${h.themeLabel}: ${t.ui.settings.themeOptions[nextTheme]}`}
            data-testid="theme-toggle"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
          <button type="button" className="icon-btn" onClick={() => setSheet('settings')} aria-label={h.settings}>
            <Icon name="settings" size={20} />
          </button>
        </div>
      </header>

      {started && (
        <nav className="nav no-print" aria-label={t.ui.nav.label}>
          {NAV_ROUTES.map((r) => (
            <button
              type="button"
              key={r}
              className={`nav-item ${route === r ? 'active' : ''}`}
              aria-current={route === r ? 'page' : undefined}
              onClick={() => go(r)}
            >
              <span className="nav-ico" aria-hidden="true"><NavIcon name={r} size={22} /></span>
              <span className="nav-label">{t.ui.nav[r]}</span>
            </button>
          ))}
        </nav>
      )}

      <main id="main" className="main" tabIndex={-1}>
        {!started ? (
          <Onboarding onDone={() => go('week')} showFeatures />
        ) : route === 'week' ? (
          <YourWeek go={go} />
        ) : route === 'shed' ? (
          <ShedCheck />
        ) : route === 'checkpoint' ? (
          <Checkpoint />
        ) : route === 'slipped' ? (
          <Slipped />
        ) : route === 'share' ? (
          <ShareCard go={go} />
        ) : route === 'doctor' ? (
          <DoctorSummary go={go} />
        ) : (
          <HowToApply />
        )}
        <footer className="footer no-print">
          <p className="footer-main">{t.ui.footer.disclaimer} {t.ui.footer.alongside}</p>
          <p className="footer-links">
            <a href={CONSENT_URL} target="_blank" rel="noopener noreferrer">{t.links.consent}</a>
            <span aria-hidden="true">·</span>
            <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">{t.links.privacy}</a>
            <span aria-hidden="true">·</span>
            <button type="button" className="link-btn" onClick={() => setSheet('about')}>{t.ui.footer.about}</button>
          </p>
          <p className="footer-credit">{fill(t.ui.footer.credit, { name: BUILDER.name, college: BUILDER.collegeShort })}</p>
        </footer>
      </main>

      {sheet && <Settings aboutOnly={sheet === 'about'} onClose={() => setSheet(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
