import { ROW_BG_COLOR_MAP } from '../constant';
import { PullRequestListRow } from '../domain/pr-list-row';
import { fetchReviews } from '../external/review';
import { SSOT } from '../util/ssot';

export async function injectReviewStatus(
  username: string,
  enableBackgroundColor: boolean,
  rows: PullRequestListRow[],
  injectionProgress: SSOT<number>,
) {
  const processes = rows.map(async (row) => {
    const reviews = await fetchReviews(row.pullRequestPageUrl);

    row.updateReviewerState(reviews);

    const myState = reviews.getStatusByReviewerName(username);
    if (enableBackgroundColor && myState !== 'not reviewer') {
      row.changeBackgroundColor(ROW_BG_COLOR_MAP[myState]);
    }
  });

  let done = 0;
  processes.forEach((p) => p.then(() => injectionProgress.change(++done)));

  await Promise.all(processes);
}
