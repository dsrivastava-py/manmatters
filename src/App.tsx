import { useCallback, useEffect, useState } from 'react';
import { CONSENT_URL, LOGO, PRIVACY_URL } from './config';
import { AppProvider, useApp } from './state/AppState';
import { Settings } from './components/Settings';
import { ReviewNote } from './components/Reviewed';
import { Onboarding } from './screens/Onboarding';
import { YourWeek } from './screens/YourWeek';
import { ShedCheck } from './screens/ShedCheck';
import { Checkpoint } from './screens/Checkpoint';
import { Slipped } from './screens/Slipped';
import { HowToApply } from './screens/HowToApply';

const ROUTES = ['week', 'shed', 'checkpoint', 'slipped', 'apply'] as const;
type Route = (typeof ROUTES)[number];

function readRoute(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  return (ROUTES as readonly string[]).includes(h) ? (h as Route) : 'week';
}

const ICONS: Record<Route, string> = { week: '◔', shed: '✦', checkpoint: '✓', slipped: '↺', apply: '☰' };

function Shell() {
  const { t, lang, setLang, data } = useApp();
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

  const started = !!data.startDate;

  return (
    <div className={`app ${started ? 'with-nav' : ''}`}>
      <a className="skip" href="#main">{t.ui.header.skip}</a>
      <header className="topbar">
        <div className="brand">
          <img src={LOGO} alt="Man Matters" className="logo" height={22} />
          <span className="appname">{t.app.name}</span>
        </div>
        <button type="button" className="pill" onClick={() => setSheet('about')}>
          {t.ui.header.conceptPill}
        </button>
        <div className="tools">
          <button
            type="button"
            className="btn btn-lang"
            onClick={() => setLang(lang === 'en' ? 'hinglish' : 'en')}
            aria-label={`${t.ui.header.langLabel}: ${t.app.languageToggle}`}
            data-testid="lang-toggle"
          >
            {t.app.languageToggle}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setSheet('settings')}>
            {t.ui.header.settings}
          </button>
        </div>
      </header>

      {started && (
        <nav className="nav" aria-label={t.ui.nav.label}>
          {ROUTES.map((r) => (
            <button
              type="button"
              key={r}
              className={`nav-item ${route === r ? 'active' : ''}`}
              aria-current={route === r ? 'page' : undefined}
              onClick={() => go(r)}
            >
              <span className="nav-ico" aria-hidden="true">{ICONS[r]}</span>
              <span>{t.ui.nav[r]}</span>
            </button>
          ))}
        </nav>
      )}

      <main id="main" className="main" tabIndex={-1}>
        {!started ? (
          <>
            <Onboarding onDone={() => go('week')} />
            <ul className="marketing">
              {t.app.marketingLines.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </>
        ) : route === 'week' ? (
          <YourWeek go={go} />
        ) : route === 'shed' ? (
          <ShedCheck />
        ) : route === 'checkpoint' ? (
          <Checkpoint />
        ) : route === 'slipped' ? (
          <Slipped />
        ) : (
          <HowToApply />
        )}
        <footer className="footer">
          <ReviewNote />
          <p>{t.app.conceptDisclaimer}</p>
          <p>{t.app.medicalDisclaimer}</p>
          <p>
            <a href={CONSENT_URL} target="_blank" rel="noopener noreferrer">{t.links.consent}</a>
            {' | '}
            <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">{t.links.privacy}</a>
          </p>
          <p className="muted">{t.ui.footer.line}</p>
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
