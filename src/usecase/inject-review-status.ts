import { SSOT } from '../common/ssot';
import { PullRequestListPage } from '../domain/pr-list-page';
import { fetchReviews } from '../external/review';

export async function injectReviewStatus(page: PullRequestListPage, injectionProgress: SSOT<number>) {
  const processes = page.rows.map(async (row) => {
    const reviews = await fetchReviews(row.pullRequestPageUrl);
    row.updateReviewStatusColumn(reviews);
    row.updateMyReviewState(page.loginUsername.value);
  });

  let done = 0;
  processes.forEach((p) => p.then(() => injectionProgress.change(++done)));

  await Promise.all(processes);
}
