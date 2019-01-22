import { findFirst } from 'fp-ts/lib/Array';
import { Either, right } from 'fp-ts/lib/Either';
import { none, Option } from 'fp-ts/lib/Option';
import { Cacheable, CacheStore } from './cache-store';
import { Review, ReviewResult } from './review';

type ReviewSet<T extends ReviewResult> = Set<Review<T>>;

interface ReviewStatusJSON {
  url: string;
  reviews: {
    [P in ReviewResult]: Array<Review<P>> // 一意であることは考慮しない
  };
}

export class ReviewStatus implements Cacheable<ReviewStatusJSON> {
  private readonly container: { readonly [P in ReviewResult]: ReviewSet<P> } = {
    approved: new Set(),
    leftComments: new Set(),
    requestedChanges: new Set(),
    unreviewed: new Set(),
  };

  public constructor(public readonly url: string) {}

  public static fromJSON(json: ReviewStatusJSON): ReviewStatus {
    const self = new ReviewStatus(json.url);
    for (const [, reviews] of Object.entries(json.reviews)) {
      for (const review of reviews) {
        self.add(review);
      }
    }
    return self;
  }

  public toJSON(): ReviewStatusJSON {
    return {
      url: this.url,
      reviews: {
        approved: [...this.reviewsOf('approved')],
        leftComments: [...this.reviewsOf('leftComments')],
        requestedChanges: [...this.reviewsOf('requestedChanges')],
        unreviewed: [...this.reviewsOf('unreviewed')],
      },
    };
  }

  public get cacheKey() {
    return this.url;
  }

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

export class ReviewStatusRepository {
  public constructor(
    private readonly cacheStore: CacheStore<ReviewStatus>,
    private readonly connection: GithubConnection,
  ) {}

  public async findByUrl(url: string): Promise<Either<string, ReviewStatus>> {
    const logError = (message: string) => (reason: string) => console.error(`error at ${url}: ${message} - ${reason}`);

    const cache = (await this.cacheStore.get(url, ReviewStatus.fromJSON))
      .mapLeft(logError('キャッシュの取得に失敗'))
      .getOrElse(none);
    if (cache.isSome()) {
      return right<string, ReviewStatus>(cache.value);
    }

    const fetched = await this.connection.fetchReviewStatus(url);
    if (fetched.isRight()) {
      (await this.cacheStore.set(fetched.value)).mapLeft(logError('キャッシュの保存に失敗'));
    }

    return fetched;
  }
}

export interface GithubConnection {
  fetchReviewStatus(url: string): Promise<Either<string, ReviewStatus>>;
}
