import { CLINICAL_REVIEW_PENDING } from '../content';
import { useApp } from '../state/AppState';

export function ReviewNote() {
  const { t } = useApp();
  if (!CLINICAL_REVIEW_PENDING) return null;
  return (
    <p className="review-note" data-testid="review-note">
      {t.app.reviewPending}
    </p>
  );
}
