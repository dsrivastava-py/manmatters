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

describe('checkpoint edge cases', () => {
  const answerAll = (val: 'yes' | 'no' | 'unsure') => {
    fireEvent.click(screen.getByRole('button', { name: en.ui.checkpoint.start }));
    const form = document.querySelector('form')!;
    const idx = { yes: 0, no: 1, unsure: 2 }[val];
    for (const q of Object.keys(en.checkpoint.questions)) {
      fireEvent.click(form.querySelectorAll<HTMLInputElement>(`input[name="${q}"]`)[idx]);
    }
    fireEvent.click(screen.getByRole('button', { name: en.ui.checkpoint.submit }));
  };

  it('early peek is not saved and cannot say not-responding', () => {
    start(14);
    window.location.hash = '/checkpoint';
    render(<App />);
    answerAll('no');
    expect(screen.queryByTestId('result-not-responding')).toBeNull();
    expect(screen.getByTestId('result-unclear')).toHaveTextContent(en.ui.checkpoint.notSaved);
    expect(screen.queryByTestId('consult-cta')).toBeNull();
    expect(loadData().checkpoints).toHaveLength(0);
  });

  it('all "Not sure" at week 12 is unclear and is saved as week 12', () => {
    start(7 * 11);
    window.location.hash = '/checkpoint';
    render(<App />);
    answerAll('unsure');
    expect(screen.getByTestId('result-unclear')).toBeInTheDocument();
    expect(loadData().checkpoints.map((c) => c.week)).toEqual([12]);
  });
});

describe('week label', () => {
  it('uses the singular for 1 week to go', () => {
    start(7 * 10 + 1);
    render(<App />);
    expect(screen.getByText('Checkpoint 1 is in 1 week')).toBeInTheDocument();
  });

  it('uses the singular in Hinglish too', () => {
    updateData({ language: 'hinglish' });
    start(7 * 10 + 1);
    render(<App />);
    expect(screen.getByText('Checkpoint 1 1 hafte mein hai')).toBeInTheDocument();
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

  it('shows the medical review pending note', () => {
    render(<App />);
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
