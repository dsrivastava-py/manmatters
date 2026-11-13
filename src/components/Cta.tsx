import { CONSULT_URL } from '../config';

export function ConsultCta({ label, urgent, secondary }: { label: string; urgent?: boolean; secondary?: boolean }) {
  return (
    <a
      className={`btn ${urgent ? 'btn-danger' : secondary ? 'btn-secondary' : 'btn-primary'}`}
      href={CONSULT_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="consult-cta"
    >
      {label}
    </a>
  );
}
