import { none, some } from 'fp-ts/lib/Option';
import { ReviewStatus } from './review-status';
import { Reviewer } from './reviewer';

export type ReviewResult = 'unreviewed' | 'leftComments' | 'requestedChanges' | 'approved';

export type MyReviewState = ReviewResult | 'notReviewer';
export const myReviewState = (given: any) =>
  ['notReviewer', 'unreviewed', 'leftComments', 'requestedChanges', 'approved'].includes(given)
    ? some(given as MyReviewState)
    : none;

export interface Review {
  reviewer: Reviewer;
  result: ReviewResult;
}

export class ReviewCollection {
  public constructor(private readonly container: Review[]) {}

  public toReviewStatus(pullRequestPageUrl: string): ReviewStatus {
    return this.container.reduce((acc, next) => acc.push(next), new ReviewStatus(pullRequestPageUrl));
  }
}
