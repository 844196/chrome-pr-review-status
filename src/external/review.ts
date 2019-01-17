import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import { Review, ReviewCollection, ReviewResult } from '../domain/review';
import { h } from '../util/create-element';
import { $, $all } from '../util/query-selector';

const svgClassToResultMap = new StrMap<ReviewResult>({
  'octicon-check': 'approved',
  'octicon-x': 'requestedChanges',
  'octicon-request-changes': 'requestedChanges',
  'octicon-comment': 'leftComments',
  'octicon-primitive-dot': 'unreviewed',
});

export async function fetchReviews(url: string): Promise<ReviewCollection> {
  const page = h('html', {
    props: {
      innerHTML: await (await fetch(url, { credentials: 'include' })).text(),
    },
  });

  const reviews = $all<HTMLSpanElement>(page, '[data-assignee-name]').map<Review>(($span) => {
    const reviewer = {
      name: $span.dataset.assigneeName!,
      iconUrl: $<HTMLImageElement>($span, 'img')!.src,
    };

    const $svg = $($span.nextElementSibling!, '.reviewers-status-icon svg')!;
    const svgClass = Array.from($svg.classList).find((a) => a.startsWith('octicon-'))!;
    const result = lookup(svgClass, svgClassToResultMap).getOrElse('unreviewed');

    return { result, reviewer };
  });

  return new ReviewCollection(reviews);
}
