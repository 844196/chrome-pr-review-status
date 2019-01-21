import { findFirst } from 'fp-ts/lib/Array';
import { Either, right } from 'fp-ts/lib/Either';
import { none, Option } from 'fp-ts/lib/Option';
import { Cacheable, CacheStore } from './cache-store';
import { Review, ReviewResult } from './review';

type ReviewSet<T extends ReviewResult> = Set<Review<T>>;

export type RawReviewStatus = {
  [P in ReviewResult]: Array<Review<P>> // 一意であることは考慮しない
} & { url: string };

export class ReviewStatus implements Cacheable<RawReviewStatus> {
  private readonly container: { readonly [P in ReviewResult]: ReviewSet<P> } = {
    approved: new Set(),
    leftComments: new Set(),
    requestedChanges: new Set(),
    unreviewed: new Set(),
  };

  public constructor(public readonly url: string) {}

  public static empty(): ReviewStatus {
    return new this('');
  }

  public static inflate(raw: RawReviewStatus): ReviewStatus {
    const self = new ReviewStatus(raw.url);
    for (const result of ['approved', 'leftComments', 'requestedChanges', 'unreviewed'] as ReviewResult[]) {
      for (const review of raw[result]) {
        self.add(review);
      }
    }
    return self;
  }

  public deflate(): RawReviewStatus {
    return {
      url: this.url,
      approved: [...this.reviewsOf('approved')],
      leftComments: [...this.reviewsOf('leftComments')],
      requestedChanges: [...this.reviewsOf('requestedChanges')],
      unreviewed: [...this.reviewsOf('unreviewed')],
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
    private readonly cacheStore: CacheStore<RawReviewStatus, ReviewStatus>,
    private readonly connection: GithubConnection,
  ) {}

  public async findByUrl(url: string): Promise<Either<string, ReviewStatus>> {
    const logError = (message: string) => (reason: any) =>
      console.error(`error at ${url}: ${message} - ${String(reason)}`);

    const cache = (await this.cacheStore.get(url, ReviewStatus.inflate))
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
