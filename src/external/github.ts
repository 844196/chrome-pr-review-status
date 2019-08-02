import { findFirst } from 'fp-ts/lib/Array';
import { Either, fromOption, left } from 'fp-ts/lib/Either';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import { fromEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { Review, ReviewResult } from '../domain/review';
import { GithubConnection, ReviewStatus } from '../domain/review-status';
import { select, selectAll } from '../util/query-selector';

const svgClassToResultMap = new StrMap<ReviewResult>({
  'octicon-check': 'approved',
  'octicon-x': 'requestedChanges',
  'octicon-request-changes': 'suggestedChanges',
  'octicon-comment': 'leftComments',
  'octicon-primitive-dot': 'unreviewed',
});

export class GithubConnectionImpl implements GithubConnection {
  private readonly domParser: DOMParser = new DOMParser();

  public async fetchReviewStatus(url: string): Promise<Either<string, ReviewStatus>> {
    return await tryCatch(() => fetch(url, { credentials: 'include' }).then((res) => res.text()), String)
      .map((htmlText) => this.domParser.parseFromString(htmlText, 'text/html'))
      .chain(($html) => fromEither(fromOption('')(select('.js-issue-sidebar-form', $html))))
      .map(($form) => selectAll<HTMLSpanElement>('[data-assignee-name]', $form))
      .map((spans) => spans.map(this.reviewFromSpan))
      .map((reviews) => reviews.reduce((status, review) => status.add(review), new ReviewStatus(url)))
      .run()
      .catch((reason) => left<string, ReviewStatus>(`error at ${url}: ${String(reason)}`));
  }

  private reviewFromSpan($span: HTMLSpanElement): Review<ReviewResult> {
    const reviewer = {
      name: $span.dataset.assigneeName!,
      iconUrl: select('img', $span).fold('', ($img) => $img.src),
    };

    const result = select('.reviewers-status-icon svg', $span.nextElementSibling!)
      .map(($svg) => Array.from($svg.classList))
      .chain((cs) => findFirst(cs, (c) => c.startsWith('octicon-')))
      .chain((c) => lookup(c, svgClassToResultMap))
      .getOrElse('unreviewed');

    return { result, reviewer };
  }
}
