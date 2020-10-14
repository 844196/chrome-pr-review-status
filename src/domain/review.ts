export type ReviewState = 'Unreviewed' | 'LeftComments' | 'RequestedChanges' | 'Approved';

export interface Reviewer {
  name: string;
  iconUrl: string;
}

export interface Review {
  reviewer: Reviewer;
  state: ReviewState;
}
