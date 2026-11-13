import { useState } from 'react';
import { CONSENT_URL, PRIVACY_URL } from '../config';
import { Sheet } from './Sheet';
import { ReviewNote } from './Reviewed';
import { Onboarding } from '../screens/Onboarding';
import { useApp } from '../state/AppState';

export function Settings({ onClose, aboutOnly }: { onClose: () => void; aboutOnly?: boolean }) {
  const { t, lang, setLang, data, clearAll } = useApp();
  const s = t.ui.settings;
  const [confirming, setConfirming] = useState(false);
  const [changing, setChanging] = useState(false);
  const [cleared, setCleared] = useState(false);

  return (
    <Sheet title={aboutOnly ? s.about : s.title} onClose={onClose} closeLabel={s.close}>
      {cleared && <p role="status">{s.cleared}</p>}
      <section>
        <h3>{s.about}</h3>
        <p>{s.aboutBody}</p>
        <p>{s.alongside}</p>
        <p>{t.app.conceptDisclaimer}</p>
        <p className="muted">{t.app.medicalDisclaimer}</p>
        <h3>{s.reviewTitle}</h3>
        <ReviewNote />
      </section>
      {!aboutOnly && (
        <>
          <section>
            <h3>{s.language}</h3>
            <div className="seg" role="group" aria-label={s.language}>
              <button type="button" className={`seg-opt ${lang === 'en' ? 'selected' : ''}`} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
                English
              </button>
              <button type="button" className={`seg-opt ${lang === 'hinglish' ? 'selected' : ''}`} aria-pressed={lang === 'hinglish'} onClick={() => setLang('hinglish')}>
                Hinglish
              </button>
            </div>
          </section>
          {data.startDate && (
            <section>
              <h3>{s.startDate}</h3>
              <p>{data.startDate}</p>
              {changing ? (
                <Onboarding initial={data.startDate} onDone={() => setChanging(false)} />
              ) : (
                <button type="button" className="btn btn-secondary" onClick={() => setChanging(true)}>
                  {s.changeDate}
                </button>
              )}
            </section>
          )}
          <section>
            <p className="muted">{t.app.privacyNote}</p>
            {confirming ? (
              <div role="alertdialog" aria-label={t.app.clearData}>
                <p>{t.app.clearDataConfirm}</p>
                <div className="actions">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      clearAll();
                      setCleared(true);
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
      <p className="links">
        <a href={CONSENT_URL} target="_blank" rel="noopener noreferrer">{t.links.consent}</a>
        {' | '}
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">{t.links.privacy}</a>
      </p>
    </Sheet>
  );
}
