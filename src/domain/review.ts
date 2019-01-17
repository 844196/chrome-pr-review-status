import { ReviewStatus } from './review-status';
import { Reviewer } from './reviewer';

export type ReviewResult = 'unreviewed' | 'leftComments' | 'requestedChanges' | 'approved';

export type MyReviewState = ReviewResult | 'notReviewer';
export const isMyReviewState = (v: any): v is MyReviewState =>
  ['notReviewer', 'unreviewed', 'leftComments', 'requestedChanges', 'approved'].includes(v);

export interface Review {
  reviewer: Reviewer;
  result: ReviewResult;
}

export class ReviewCollection {
  public constructor(private readonly container: Review[]) {}

  public findOrNullByReviewerUsername(reviewerUsername: string): Review | null {
    for (const review of this.container) {
      if (review.reviewer.name === `@${reviewerUsername}`) {
        return review;
      }
    }
    return null;
  }

  public toReviewStatus(): ReviewStatus {
    const status: ReviewStatus = {
      approved: [],
      leftComments: [],
      requestedChanges: [],
      unreviewed: [],
    };
    for (const review of this.container) {
      status[review.result].push(review);
    }
    return status;
  }
}
