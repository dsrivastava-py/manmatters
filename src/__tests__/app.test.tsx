import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import App from '../App';
import { CONSULT_URL } from '../config';
import { clearAllData, loadData, updateData } from '../lib/storage';
import { isoDaysAgo } from '../state/AppState';
import { en } from '../content/en';
import { hinglish } from '../content/hinglish';

beforeEach(() => {
  cleanup();
  localStorage.clear();
  clearAllData();
  window.location.hash = '';
});

const start = (days: number) => updateData({ startDate: isoDaysAgo(days), onboardingSeen: true });

describe('onboarding', () => {
  it('start date chip lands on Your Week with the right week', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: en.ui.onboarding.title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: en.ui.onboarding.chips.monthAgo }));
    expect(screen.getByTestId('week-number')).toHaveTextContent('5');
    expect(screen.getByText(en.phases['shed-settling'].body)).toBeInTheDocument();
    expect(loadData().startDate).not.toBeNull();
  });

  it('shows friendly error for a future date', () => {
    render(<App />);
    const input = screen.getByLabelText(en.ui.onboarding.dateLabel);
    fireEvent.change(input, { target: { value: '2999-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: en.ui.onboarding.start }));
    expect(screen.getByRole('alert')).toHaveTextContent(en.ui.onboarding.errors.future);
  });

  it('Not started yet begins at week 1', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.onboarding.notStarted }));
    expect(screen.getByTestId('week-number')).toHaveTextContent('1');
  });
});

describe('shed check', () => {
  it('red flag path shows doctor CTA linking to CONSULT_URL', () => {
    start(21);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.week.shedCta }));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.next }));
    fireEvent.click(screen.getByLabelText(en.shedCheck.amountOptions['a-bit-more']));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.next }));
    fireEvent.click(screen.getByLabelText(en.shedCheck.flags.chest));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.seeResult }));
    const result = screen.getByTestId('result-doctor-now');
    expect(within(result).getByText(en.shedCheck.outcomes['doctor-now'].title)).toBeInTheDocument();
    expect(result).toHaveTextContent(/stop using the product and consult a doctor/i);
    expect(within(result).getByTestId('consult-cta')).toHaveAttribute('href', CONSULT_URL);
    expect(loadData().lastShedCheck?.outcome).toBe('doctor-now');
  });
});

describe('emergency path', () => {
  const run = (flag: 'chest' | 'swelling' | 'dizziness') => {
    start(21);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.week.shedCta }));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.next }));
    fireEvent.click(screen.getByLabelText(en.shedCheck.amountOptions['a-bit-more']));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.next }));
    fireEvent.click(screen.getByLabelText(en.shedCheck.flags[flag]));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.seeResult }));
    return screen.getByTestId('result-doctor-now');
  };

  it.each(['chest', 'swelling'] as const)('%s flag leads with a tel:112 link and a non-urgent consult link', (flag) => {
    const result = run(flag);
    expect(within(result).getByTestId('emergency-call')).toHaveAttribute('href', 'tel:112');
    expect(result).toHaveTextContent(/stop using the product and consult a doctor/i);
    expect(within(result).getByTestId('consult-cta')).toHaveTextContent(en.links.consultNotUrgent);
  });

  it('dizziness keeps the consult link and has no emergency call', () => {
    const result = run('dizziness');
    expect(within(result).queryByTestId('emergency-call')).toBeNull();
    expect(within(result).getByTestId('consult-cta')).toHaveTextContent(en.links.consult);
  });
});

describe('language toggle', () => {
  it('switches visible text and persists', () => {
    start(7);
    const { unmount } = render(<App />);
    expect(screen.getByText(en.ui.week.commonlyTitle)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('lang-toggle'));
    expect(screen.getByText(hinglish.ui.week.commonlyTitle)).toBeInTheDocument();
    expect(screen.queryByText(en.ui.week.commonlyTitle)).toBeNull();
    expect(loadData().language).toBe('hinglish');
    unmount();
    render(<App />);
    expect(screen.getByText(hinglish.ui.week.commonlyTitle)).toBeInTheDocument();
  });
});

describe('checkpoint', () => {
  it('not-responding result shows consult CTA', () => {
    start(7 * 11);
    window.location.hash = '/checkpoint';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.checkpoint.start }));
    const form = document.querySelector('form')!;
    for (const q of Object.keys(en.checkpoint.questions)) {
      const val = q === 'consistentUse' ? 'yes' : 'no';
      const radios = form.querySelectorAll<HTMLInputElement>(`input[name="${q}"]`);
      fireEvent.click(radios[val === 'yes' ? 0 : 1]);
    }
    fireEvent.click(screen.getByRole('button', { name: en.ui.checkpoint.submit }));
    const result = screen.getByTestId('result-not-responding');
    expect(result).toHaveTextContent(en.checkpoint.results['not-responding'].title);
    expect(within(result).getByTestId('consult-cta')).toHaveAttribute('href', CONSULT_URL);
    expect(loadData().checkpoints).toHaveLength(1);
  });
});

describe('checkpoint outcomes', () => {
  const idx = { yes: 0, no: 1, unsure: 2 } as const;
  type Q = keyof typeof en.checkpoint.questions;
  const answer = (vals: Partial<Record<Q, 'yes' | 'no' | 'unsure'>>, rest: 'yes' | 'no' | 'unsure' = 'no') => {
    fireEvent.click(screen.getByRole('button', { name: en.ui.checkpoint.start }));
    const form = document.querySelector('form')!;
    for (const q of Object.keys(en.checkpoint.questions) as Q[]) {
      const v = vals[q] ?? (q === 'consistentUse' ? 'yes' : rest);
      fireEvent.click(form.querySelectorAll<HTMLInputElement>(`input[name="${q}"]`)[idx[v]]);
    }
    fireEvent.click(screen.getByRole('button', { name: en.ui.checkpoint.submit }));
  };

  it('before week 12 shows a clear too-early card with the checkpoint 1 date, no questions, nothing saved', () => {
    start(14);
    window.location.hash = '/checkpoint';
    render(<App />);
    const card = screen.getByTestId('result-too-early');
    expect(card).toHaveTextContent(en.checkpoint.results['too-early'].title);
    expect(card).toHaveTextContent(/Checkpoint 1 is on .+ \(in 9 weeks\)/);
    expect(card).toHaveTextContent(en.ui.checkpoint.baselineTitle);
    expect(screen.queryByRole('button', { name: en.ui.checkpoint.start })).toBeNull();
    expect(screen.queryByTestId('consult-cta')).toBeNull();
    expect(loadData().checkpoints).toHaveLength(0);
  });

  it('less shedding only at week 12 is "Early signs, keep going" with the week 24 date and a breakdown', () => {
    start(7 * 11);
    window.location.hash = '/checkpoint';
    render(<App />);
    answer({ lessShedding: 'yes' });
    const result = screen.getByTestId('result-early-signs');
    expect(result).toHaveTextContent(en.checkpoint.results['early-signs'].title);
    expect(within(result).getByTestId('reason')).toHaveTextContent('You said yes to: Less shedding.');
    expect(within(result).getByTestId('kabtak')).toHaveTextContent(/checkpoint 2, .+ \(in 12 weeks\)/);
    expect(result).toHaveTextContent(en.ui.checkpoint.whyTitle);
    expect(result).toHaveTextContent(en.checkpoint.roles.main);
    expect(within(result).getByTestId('review-note')).toBeInTheDocument();
    expect(within(result).queryByTestId('consult-cta')).toBeNull();
    expect(loadData().checkpoints[0]).toMatchObject({ week: 12, result: 'early-signs' });
  });

  it('routine not followed is "Fix the routine first" with a recheck date and a consult option', () => {
    start(7 * 11);
    window.location.hash = '/checkpoint';
    render(<App />);
    answer({ consistentUse: 'no', lessShedding: 'yes' });
    const result = screen.getByTestId('result-fix-routine');
    expect(within(result).getByTestId('kabtak')).toHaveTextContent(/in 8 weeks/);
    expect(within(result).getByTestId('consult-cta')).toHaveAttribute('href', CONSULT_URL);
  });

  it('all "Not sure" at week 12 is need-better-look with photo steps and a retake button, saved as week 12', () => {
    start(7 * 11);
    window.location.hash = '/checkpoint';
    render(<App />);
    answer({ newThinning: 'no' }, 'unsure');
    const result = screen.getByTestId('result-need-better-look');
    expect(result).toHaveTextContent(en.checkpoint.lookSteps[0]);
    expect(loadData().checkpoints.map((c) => c.week)).toEqual([12]);
    fireEvent.click(within(result).getByRole('button', { name: en.ui.checkpoint.retakeLook }));
    expect(screen.getByRole('button', { name: en.ui.checkpoint.submit })).toBeInTheDocument();
  });

  it('week 24 with two visible signs is on track', () => {
    start(7 * 23);
    window.location.hash = '/checkpoint';
    render(<App />);
    answer({ fillIn: 'yes', photoBetter: 'yes' });
    expect(screen.getByTestId('result-on-track')).toHaveTextContent(en.checkpoint.results['on-track'].title);
    expect(loadData().checkpoints[0].week).toBe(24);
  });
});

describe('Your Week journey', () => {
  it('shows the next milestone with a date and "in 1 week"', () => {
    start(7 * 10);
    render(<App />);
    expect(screen.getByTestId('next-milestone')).toHaveTextContent(/Next: Checkpoint 1 on .+, in 1 week/);
    expect(screen.getByText(en.ui.journey.youAreHere)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').some((li) => li.getAttribute('aria-current') === 'step')).toBe(true);
  });

  it('uses Hinglish for the milestone too', () => {
    updateData({ language: 'hinglish' });
    start(7 * 10);
    render(<App />);
    expect(screen.getByTestId('next-milestone')).toHaveTextContent(/Agla: Checkpoint 1, .+ ko, 1 hafte mein/);
  });
});

describe('Kab tak? lines', () => {
  it('shed check at week 3 says when it commonly settles and when to check again', () => {
    start(14);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.week.shedCta }));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.next }));
    fireEvent.click(screen.getByLabelText(en.shedCheck.amountOptions['a-bit-more']));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.next }));
    fireEvent.click(screen.getByRole('button', { name: en.ui.wizard.seeResult }));
    const result = screen.getByTestId('result-commonly-reported');
    expect(within(result).getByTestId('kabtak')).toHaveTextContent(/between weeks 5 and 8\. Check again on .+ \(in 2 weeks\)/);
    expect(result).toHaveTextContent(en.shedCheck.actions['commonly-reported']);
  });

  it('slipped result moves the next milestone by the gap', () => {
    start(14);
    window.location.hash = '/slipped';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: `10 ${en.ui.slipped.unit}` }));
    const result = screen.getByTestId('result-lapse-reset-expectations');
    expect(within(result).getByTestId('kabtak')).toHaveTextContent(/roughly 2 weeks\. Expect Shed settling around/);
    expect(result).toHaveTextContent(en.lapse.actions['lapse-reset-expectations']);
  });
});

describe('footer and header', () => {
  it('has one compact footer with a single concept line, links and the builder credit', () => {
    start(14);
    render(<App />);
    const footer = document.querySelector('footer')!;
    expect(footer.textContent!.match(/independent concept/gi)).toHaveLength(1);
    expect(footer).toHaveTextContent('Built by Devansh Srivastava (Kirori Mal College, DU) for the Mosaic Wellness Fellowship Builder Challenge.');
    expect(within(footer).getByRole('link', { name: en.links.privacy })).toBeInTheDocument();
    expect(within(footer).queryByTestId('review-note')).toBeNull();
  });
});

describe('theme', () => {
  it('switches dark, light and system from Settings and persists the choice', () => {
    start(14);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.header.settings }));
    fireEvent.click(screen.getByTestId('theme-dark'));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('kabtak.theme')).toBe('dark');
    fireEvent.click(screen.getByTestId('theme-light'));
    expect(document.documentElement.dataset.theme).toBe('light');
    fireEvent.click(screen.getByTestId('theme-system'));
    expect(localStorage.getItem('kabtak.theme')).toBeNull();
  });

  it('about sheet has the project section with mailto and tel links', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.header.conceptPillLabel }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent(en.ui.settings.projectTitle);
    expect(within(dialog).getByRole('link', { name: /devanshsrivastava\.reads@gmail\.com/ })).toHaveAttribute('href', 'mailto:devanshsrivastava.reads@gmail.com');
    expect(within(dialog).getByRole('link', { name: /8736956764/ })).toHaveAttribute('href', 'tel:+918736956764');
  });
});

describe('invalid stored start date', () => {
  it('falls back to onboarding instead of a blank screen', () => {
    updateData({ startDate: '2999-01-01', onboardingSeen: true });
    render(<App />);
    expect(screen.getByRole('heading', { name: en.ui.onboarding.title })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});

describe('sheet focus', () => {
  it('traps Tab, and returns focus to the opener on close', () => {
    start(14);
    render(<App />);
    const opener = screen.getByRole('button', { name: en.ui.header.settings });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
    const items = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])');
    const last = items[items.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });
});

describe('settings', () => {
  it('clear data resets to onboarding', () => {
    start(14);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.header.settings }));
    fireEvent.click(screen.getByRole('button', { name: en.app.clearData }));
    fireEvent.click(screen.getByRole('button', { name: en.ui.settings.confirm }));
    expect(screen.getByRole('heading', { name: en.ui.onboarding.title })).toBeInTheDocument();
    expect(loadData().startDate).toBeNull();
  });

  it('shows the medical review pending note in Settings', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: en.ui.header.settings }));
    expect(screen.getAllByTestId('review-note').length).toBeGreaterThan(0);
  });
});

describe('doctor summary', () => {
  it('shows start date, weeks and disclaimer', () => {
    start(30);
    window.location.hash = '/doctor';
    render(<App />);
    expect(screen.getByRole('heading', { name: en.ui.doctor.title })).toBeInTheDocument();
    expect(screen.getByText(en.ui.doctor.disclaimer)).toBeInTheDocument();
    expect(screen.getAllByText(en.ui.doctor.none).length).toBeGreaterThan(0);
  });
});

describe('share card screen', () => {
  it('renders with no-personal-data note', () => {
    start(30);
    window.location.hash = '/share';
    render(<App />);
    expect(screen.getByRole('heading', { name: en.ui.share.title })).toBeInTheDocument();
    expect(screen.getByText(en.ui.share.noPersonal)).toBeInTheDocument();
  });
});
