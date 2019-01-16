import { ReviewCollection } from './review';

export interface PullRequestListRow {
  readonly pullRequestPageUrl: string;
  updateReviewerState(reviews: ReviewCollection, myUsername: string): void;
}
