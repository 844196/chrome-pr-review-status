import { ReviewCollection } from './review';

export interface PullRequestListRow {
  readonly pullRequestPageUrl: string;
  updateReviewStatusColumn(reviews: ReviewCollection): void;
  updateMyReviewState(myUsername: string): void;
}
