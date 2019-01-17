import { none, Option, some } from 'fp-ts/lib/Option';
import { Review, ReviewResult } from './review';

export class ReviewStatus implements Iterable<[ReviewResult, Review[]]> {
  public readonly approved: Review[] = [];
  public readonly leftComments: Review[] = [];
  public readonly requestedChanges: Review[] = [];
  public readonly unreviewed: Review[] = [];

  public constructor(public readonly pullRequestPageUrl: string) {}

  public [Symbol.iterator]() {
    const a: Array<[ReviewResult, Review[]]> = [
      ['approved', this.approved],
      ['leftComments', this.leftComments],
      ['requestedChanges', this.requestedChanges],
      ['unreviewed', this.unreviewed],
    ];
    return a[Symbol.iterator]();
  }

  public push(review: Review) {
    this[review.result].push(review);
    return this;
  }

  public findByUsername(username: string): Option<Review> {
    for (const [, reviews] of this) {
      const review = reviews.find(({ reviewer }) => reviewer.name === username);
      if (review) {
        return some(review);
      }
    }
    return none;
  }
}
