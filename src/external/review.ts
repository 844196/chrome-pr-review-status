import { Review, ReviewCollection, ReviewStatus } from '../domain/review';
import { Reviewer } from '../domain/reviewer';
import { $ } from '../util/query-selector';

export async function fetchReviews(url: string): Promise<ReviewCollection> {
  const page = document.createElement('html');
  page.innerHTML = await (await fetch(url, { credentials: 'include' })).text();

  const reviews: Review[] = [];
  Array.from($<HTMLSpanElement>(page, '.discussion-sidebar-item .css-truncate')!.children).forEach((ele) => {
    let reviewer: Reviewer;
    try {
      const icon = $<HTMLImageElement>(ele, 'img')!;
      reviewer = {
        name: icon.alt,
        iconUrl: icon.src,
      };
    } catch (_) {
      console.info('レビュワーの取得に失敗したため、レビュワー0人として扱う', { url, ele });
      return;
    }

    let status: ReviewStatus;
    const classes = $(ele, '.reviewers-status-icon svg')!.classList;
    if (classes.contains('octicon-check')) {
      status = 'approved';
    } else if (classes.contains('octicon-x')) {
      status = 'requestedChanges';
    } else if (classes.contains('octicon-primitive-dot')) {
      status = 'unreviewed';
    } else {
      status = 'leftComments';
    }

    reviews.push({ reviewer, status });
  });

  return new ReviewCollection(reviews);
}
