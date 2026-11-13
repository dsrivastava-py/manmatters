import { en } from './en';
import { hinglish } from './hinglish';
import type { Content, Lang } from './types';

export { CLINICAL_REVIEW_PENDING } from './types';
export type { Content, Lang } from './types';

export const CONTENT: Record<Lang, Content> = { en, hinglish };
export const getContent = (lang: Lang): Content => CONTENT[lang];
