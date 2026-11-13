import { CONSULT_URL } from '../config';

export function ConsultCta({ label, urgent }: { label: string; urgent?: boolean }) {
  return (
    <a
      className={`btn ${urgent ? 'btn-danger' : 'btn-primary'}`}
      href={CONSULT_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="consult-cta"
    >
      {label}
    </a>
  );
}
