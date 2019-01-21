import { PullRequestListPageImpl } from '../external/pr-list-page';
import { ReviewStatusRepositoryImpl } from '../external/review-status';
import { InjectReviewStatus } from '../usecase/inject-review-status';

(async () => {
  const page = await PullRequestListPageImpl.mount(document);

  const repository = new ReviewStatusRepositoryImpl();
  const usecase = new InjectReviewStatus(repository);
  await page.doInjectReviewStatus(usecase.invoke.bind(usecase));
})();
