import { none, some } from 'fp-ts/lib/Option';
import { ReviewResult } from './review';

export type ReviewState = ReviewResult | 'notReviewer';
export const reviewState = (given: any) =>
  ['notReviewer', 'unreviewed', 'leftComments', 'requestedChanges', 'approved'].includes(given)
    ? some(given as ReviewState)
    : none;
