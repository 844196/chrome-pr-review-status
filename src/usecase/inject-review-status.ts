import { SSOT } from '../common/ssot';
import { PullRequestListPage } from '../domain/pr-list-page';
import { ReviewStatusRepository } from '../domain/review-status';

export class InjectReviewStatus {
  public constructor(private readonly reviewStatusRepository: ReviewStatusRepository) {}

  public async invoke(page: PullRequestListPage, injectionProgress: SSOT<number>) {
    const processes = page.rows.map(async (row) => {
      const reviewStatus = await this.reviewStatusRepository.findByUrl(row.pullRequestPageUrl);
      if (reviewStatus.isLeft()) {
        throw new Error(reviewStatus.value);
      }
      row.$props.reviewStatus.change(reviewStatus.value);
    });

    let done = 0;
    processes.forEach((p) => p.then(() => injectionProgress.change(++done)));

    await Promise.all(processes);
  }
}
