import { Reviewer } from './reviewer';

export type ReviewStatus = 'notReviewer' | 'unreviewed' | 'leftComments' | 'requestedChanges' | 'approved';
export const isReviewStatus = (v: any): v is ReviewStatus =>
  ['notReviewer', 'unreviewed', 'leftComments', 'requestedChanges', 'approved'].includes(v);

export interface Review {
  reviewer: Reviewer;
  status: Exclude<ReviewStatus, 'notReviewer'>;
}

export class ReviewCollection {
  public constructor(private readonly container: Review[]) {}

  public getStatusByReviewerName(reviewerName: string) {
    for (const review of this.container) {
      if (review.reviewer.name === `@${reviewerName}`) {
        return review.status;
      }
    }
    return 'notReviewer';
  }

  public groupingReviewerByStatus() {
    const grouped: { [_ in ReviewStatus]?: Reviewer[] } = {};
    for (const { reviewer, status } of this.container) {
      if (typeof grouped[status] === 'undefined') {
        grouped[status] = [];
      }
      grouped[status]!.push(reviewer);
    }
    return grouped;
  }
}
