import { useState } from 'react';
import { BUILDER, CONSENT_URL, PRIVACY_URL } from '../config';
import { Sheet } from './Sheet';
import { ReviewNote } from './Reviewed';
import { PwaBar } from './Pwa';
import { Icon } from './NavIcon';
import { Onboarding } from '../screens/Onboarding';
import { fill, useApp } from '../state/AppState';
import { formatDate } from '../lib/when';
import type { ThemePref } from '../lib/theme';

const THEMES: { id: ThemePref; icon: string }[] = [
  { id: 'light', icon: 'sun' },
  { id: 'dark', icon: 'moon' },
  { id: 'system', icon: 'system' },
];

export function Settings({ onClose, aboutOnly }: { onClose: () => void; aboutOnly?: boolean }) {
  const { t, lang, setLang, data, clearAll, themePref, setThemePref } = useApp();
  const s = t.ui.settings;
  const [confirming, setConfirming] = useState(false);
  const [changing, setChanging] = useState(false);

  const about = (
    <>
      <section className="sheet-section">
        <h3>{s.about}</h3>
        <p>{s.aboutBody}</p>
        <p>{s.alongside}</p>
        <p className="muted small">{t.app.medicalDisclaimer}</p>
        <ReviewNote />
      </section>
      <section className="sheet-section">
        <h3>{s.projectTitle}</h3>
        <p>{s.projectBody}</p>
        <p className="small">{fill(s.builtBy, { name: BUILDER.name, college: BUILDER.college })}</p>
        <ul className="contact">
          <li>
            <a href={`mailto:${BUILDER.email}`}>
              <Icon name="mail" size={18} /> <span className="sr-only">{s.emailLabel}: </span>{BUILDER.email}
            </a>
          </li>
          <li>
            <a href={`tel:${BUILDER.phone}`}>
              <Icon name="phone" size={18} /> <span className="sr-only">{s.phoneLabel}: </span>{BUILDER.phoneDisplay}
            </a>
          </li>
        </ul>
      </section>
    </>
  );

  return (
    <Sheet title={aboutOnly ? s.about : s.title} onClose={onClose} closeLabel={s.close}>
      {!aboutOnly && (
        <>
          <section className="sheet-section">
            <h3 id="set-lang">{s.language}</h3>
            <div className="seg" role="group" aria-labelledby="set-lang">
              <button type="button" className={`seg-opt ${lang === 'en' ? 'selected' : ''}`} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
                English
              </button>
              <button type="button" className={`seg-opt ${lang === 'hinglish' ? 'selected' : ''}`} aria-pressed={lang === 'hinglish'} onClick={() => setLang('hinglish')}>
                Hinglish
              </button>
            </div>
          </section>
          <section className="sheet-section">
            <h3 id="set-theme">{s.theme}</h3>
            <div className="seg" role="group" aria-labelledby="set-theme">
              {THEMES.map((th) => (
                <button
                  type="button"
                  key={th.id}
                  className={`seg-opt ${themePref === th.id ? 'selected' : ''}`}
                  aria-pressed={themePref === th.id}
                  onClick={() => setThemePref(th.id)}
                  data-testid={`theme-${th.id}`}
                >
                  <Icon name={th.icon} size={18} /> {s.themeOptions[th.id]}
                </button>
              ))}
            </div>
          </section>
          {data.startDate && (
            <section className="sheet-section">
              <h3>{s.startDate}</h3>
              <p>{formatDate(data.startDate, t.ui.when.dateLocale)}</p>
              {changing ? (
                <Onboarding initial={data.startDate} onDone={() => setChanging(false)} />
              ) : (
                <button type="button" className="btn btn-secondary" onClick={() => setChanging(true)}>
                  {s.changeDate}
                </button>
              )}
            </section>
          )}
          <section className="sheet-section">
            <h3>{s.appTitle}</h3>
            <PwaBar />
            <p className="muted small">{t.app.privacyNote}</p>
            {confirming ? (
              <div role="alertdialog" aria-label={t.app.clearData}>
                <p>{t.app.clearDataConfirm}</p>
                <div className="actions">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      clearAll();
                      setConfirming(false);
                      onClose();
                    }}
                  >
                    {s.confirm}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)}>
                    {s.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={() => setConfirming(true)}>
                {t.app.clearData}
              </button>
            )}
          </section>
        </>
      )}
      {about}
      <p className="links small">
        <a href={CONSENT_URL} target="_blank" rel="noopener noreferrer">{t.links.consent}</a>
        {' · '}
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">{t.links.privacy}</a>
      </p>
    </Sheet>
  );
}
