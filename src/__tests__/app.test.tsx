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
