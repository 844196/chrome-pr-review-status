import { Reviewer } from './reviewer';

export type ReviewStatus = 'unreviewed' | 'leftComments' | 'requestedChanges' | 'approved';

export interface Review {
  reviewer: Reviewer;
  status: ReviewStatus;
}

export class ReviewCollection {
  public constructor(private readonly container: Review[]) {}

  public getStatusByReviewerName(reviewerName: string) {
    for (const review of this.container) {
      if (review.reviewer.name === reviewerName) {
        return review.status;
      }
    }
    return 'not reviewer';
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
