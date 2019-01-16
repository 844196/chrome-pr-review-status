import { config } from '../external/config';
import { PullRequestListPageImpl } from '../external/pr-list-page';
import { injectReviewStatus } from '../usecase/inject-review-status';

(async () => {
  const page = new PullRequestListPageImpl(
    await config.isDisplayDefault,
    await config.enableBackgroundColor,
    await config.debugUsername,
  );

  if (page.alreadyProcessed) {
    return;
  }

  await page.doInjectReviewStatus(injectReviewStatus);
})();
