import { findFirst } from 'fp-ts/lib/Array';
import { Either } from 'fp-ts/lib/Either';
import { none, Option } from 'fp-ts/lib/Option';
import { Review, ReviewResult } from './review';

type ReviewSet<T extends ReviewResult> = Set<Review<T>>;

export class ReviewStatus {
  private readonly container: { readonly [P in ReviewResult]: ReviewSet<P> } = {
    approved: new Set(),
    leftComments: new Set(),
    requestedChanges: new Set(),
    unreviewed: new Set(),
  };

  public add<T extends ReviewResult>(review: Review<T>): this {
    (this.container[review.result] as ReviewSet<T>).add(review);
    return this;
  }

  public reviewsOf<T extends ReviewResult>(result: T): ReviewSet<T> {
    return this.container[result] as ReviewSet<T>;
  }

  public findByReviewerName(reviewerName: string): Option<Review<ReviewResult>> {
    for (const [, reviews] of Object.entries(this.container)) {
      const review = findFirst<Review<ReviewResult>>([...reviews], ({ reviewer }) => reviewer.name === reviewerName);
      if (review.isSome()) {
        return review;
      }
    }
    return none;
  }
}

export interface ReviewStatusRepository {
  findByUrl(url: string): Promise<Either<string, ReviewStatus>>;
}
