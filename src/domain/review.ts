export type ReviewResult = 'unreviewed' | 'leftComments' | 'requestedChanges' | 'approved';

export type ReviewState = ReviewResult | 'notReviewer';

export interface Reviewer {
  name: string;
  iconUrl: string;
}

export interface Review<T extends ReviewResult> {
  reviewer: Reviewer;
  result: T;
}
