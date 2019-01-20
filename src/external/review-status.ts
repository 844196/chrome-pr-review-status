import { findFirst } from 'fp-ts/lib/Array';
import { Either, fromOption, left } from 'fp-ts/lib/Either';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import { fromEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { Review, ReviewResult } from '../domain/review';
import { ReviewStatus, ReviewStatusRepository } from '../domain/review-status';
import { h } from '../util/create-element';
import { $all, select } from '../util/query-selector';

const svgClassToResultMap = new StrMap<ReviewResult>({
  'octicon-check': 'approved',
  'octicon-x': 'requestedChanges',
  'octicon-request-changes': 'requestedChanges',
  'octicon-comment': 'leftComments',
  'octicon-primitive-dot': 'unreviewed',
});

export class ReviewStatusRepositoryImpl implements ReviewStatusRepository {
  public async findByUrl(url: string) {
    return await this.fetchFromPage(url);
  }

  private async fetchFromPage(url: string): Promise<Either<string, ReviewStatus>> {
    return await tryCatch(() => fetch(url, { credentials: 'include' }), (reason) => String(reason))
      .chain((res) => tryCatch(() => res.text(), (reason) => String(reason)))
      .map((innerHTML) => h('html', { props: { innerHTML } }))
      .chain(($html) => fromEither(fromOption('')(select('.js-issue-sidebar-form', $html))))
      .map(($form) => $all<HTMLSpanElement>($form, '[data-assignee-name]'))
      .map((spans) => spans.map(this.reviewFromSpan))
      .map((reviews) => reviews.reduce((status, review) => status.add(review), new ReviewStatus()))
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
