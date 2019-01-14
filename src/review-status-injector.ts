import { AbstractComponent } from './component/abstract-component';
import { ReviewStatus as ReviewStatusComponent } from './component/review-status';
import { ROW_BG_COLOR_MAP, STATUS_DOM_CLASSNAME } from './constant';
import { fetchReviews } from './external/review';
import { SSOT } from './util/ssot';

export interface GithubIssueListRow {
  readonly pullRequestPageUrl: string;
  insertReviewStatusColumn(status: AbstractComponent<any>): void;
  changeBackgroundColor(color: string): void;
}

export class ReviewStatusInjector {
  public readonly state = new SSOT<'initialized' | 'doing' | 'done'>('initialized');

  public constructor(
    private readonly params: {
      username: Promise<string>;
      isDisplayDefault: Promise<boolean>;
      enableBackgroundColor: Promise<boolean>;
      listRows: GithubIssueListRow[];
      injectionProgress: SSOT<number>;
    },
  ) {}

  public async invoke() {
    this.state.change('doing');

    const processes = this.params.listRows.map(async (row) => {
      // 要素追加によるガタツキを防ぐため、予め挿入しておく
      // 高さはRowの実装側に持つ
      const reviewStatus = new ReviewStatusComponent()
        .isDisplay(await this.params.isDisplayDefault)
        .addClass(STATUS_DOM_CLASSNAME);
      row.insertReviewStatusColumn(reviewStatus);

      const reviews = await fetchReviews(row.pullRequestPageUrl);
      reviewStatus.fillRows(reviews);

      const status = reviews.getStatusByReviewerName(await this.params.username);
      if ((await this.params.enableBackgroundColor) && status !== 'not reviewer') {
        row.changeBackgroundColor(ROW_BG_COLOR_MAP[status]);
      }
    });

    let done = 0;
    processes.forEach((p) => p.then(() => this.params.injectionProgress.change(++done)));

    await Promise.all(processes);
    this.state.change('done');
    this.params.injectionProgress.change(0);
  }
}
