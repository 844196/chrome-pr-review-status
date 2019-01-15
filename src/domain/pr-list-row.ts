import { ReviewCollection } from './review';

export interface PullRequestListRow {
  readonly pullRequestPageUrl: string;
  updateReviewerState(reviews: ReviewCollection): void;
  changeBackgroundColor(color: string): void;
}
