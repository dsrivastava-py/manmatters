import { useEffect, useState } from 'react';
import { useApp } from '../state/AppState';

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isStandalone(): boolean {
  return window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function PwaBar() {
  const { t } = useApp();
  const p = t.ui.pwa;
  const [ready, setReady] = useState(false);
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [hintOpen, setHintOpen] = useState(true);

  useEffect(() => {
    let alive = true;
    navigator.serviceWorker?.ready.then(() => alive && setReady(true)).catch(() => undefined);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => setEvt(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      alive = false;
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const showIos = typeof navigator !== 'undefined' && isIos() && !isStandalone() && hintOpen;

  return (
    <div className="pwa-bar">
      <span className={`badge-offline ${ready ? '' : 'pending'}`} data-testid="offline-badge" hidden={!ready}>{p.offline}</span>
      {evt && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={async () => {
            await evt.prompt();
            setEvt(null);
          }}
        >
          {p.install}
        </button>
      )}
      {showIos && (
        <p className="notice">
          {p.iosHint}{' '}
          <button type="button" className="btn btn-link" onClick={() => setHintOpen(false)}>{p.dismiss}</button>
        </p>
      )}
    </div>
  );
}
