import { ReviewCollection } from './review';

export interface PullRequestListRow {
  readonly pullRequestPageUrl: string;
  updateReviewStatusColumn(reviews: ReviewCollection, myUsername: string): void;
}
