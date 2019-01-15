import * as Config from '../external/config';
import { PullRequestListPage } from '../external/pr-list-page';
import { injectReviewStatus } from '../usecase/inject-review-status';
import { SSOT } from '../util/ssot';

(async () => {
  const page = new PullRequestListPage();

  const isDisplayReviewStatus = new SSOT(await Config.get('isDisplayDefault'));

  // button -> isDisplayReviewStatus
  page.button.click.on((isDisplay) => isDisplayReviewStatus.change(isDisplay));

  // isDisplayReviewStatus -> config
  isDisplayReviewStatus.onChange((isDisplay) => Config.set('isDisplayDefault', isDisplay));

  // isDisplayReviewStatus -> row
  page.rows.forEach((row) => {
    row.toggleDisplayReviewStatusColumn(isDisplayReviewStatus.value);
    isDisplayReviewStatus.onChange((isDisplay) => row.toggleDisplayReviewStatusColumn(isDisplay));
  });

  let username = page.loginUsername;
  if (ENVIRONMENT === 'development') {
    const debugUsername = await Config.get('debugUsername');
    if (debugUsername !== '') {
      username = debugUsername;
    }
  }

  const injectionProgress = new SSOT(0);
  injectionProgress.onChange((done) => page.button.textContent.change(`Fetching... (${done}/${page.rows.length})`));

  page.button.state.change('fetching');
  await injectReviewStatus(username, await Config.get('enableBackgroundColor'), page.rows, injectionProgress);
  page.button.state.change(isDisplayReviewStatus.value ? 'awaitingHide' : 'awaitingShow');
})();
