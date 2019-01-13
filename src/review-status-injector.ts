import { ReviewStatus as ReviewStatusComponent } from './component/review-status';
import { ToggleStatusButton } from './component/toggle-status-button';
import { ROW_BG_COLOR_MAP, STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from './constant';
import { fetchReviews } from './external/review';
import { GithubIssueListRow } from './util/github-issue-list-row';
import * as Logger from './util/logger';
import { $, $all } from './util/query-selector';

export class ReviewStatusInjector {
  private processed: boolean;
  private toggleButton: ToggleStatusButton;
  private listRows: GithubIssueListRow[];

  public constructor(
    private readonly params: {
      username: Promise<string>;
      isDisplayDefault: Promise<boolean>;
      enableBackgroundColor: Promise<boolean>;
    },
  ) {
    const existedButton = $<HTMLButtonElement>(`#${TOGGLE_STATUS_BUTTON_ID}`);
    if (existedButton) {
      Logger.debug('挿入済みボタンを検出', { existedButton });

      // TODO: 挿入済みボタンが `fetching` 状態だった時の考慮

      this.toggleButton = ToggleStatusButton.fromDom(existedButton);
      this.processed = true;
    } else {
      this.toggleButton = ToggleStatusButton.make('fetching').addClass('btn', 'btn-default', 'float-right', 'mr-2');
      $('.subnav')!.append(this.toggleButton.dom);
      this.processed = false;
    }
    this.listRows = $all<HTMLDivElement>('.js-issue-row').map((row) => new GithubIssueListRow(row));
  }

  public needProcess() {
    return this.processed === false;
  }

  public async invoke() {
    const processes = this.listRows.map(async (row) => {
      // 要素追加によるガタツキを防ぐため、高さ固定のコンテナを予め挿入しておく
      const reviewStatus = new ReviewStatusComponent()
        .setHeight('105.312px')
        .isDisplay(await this.params.isDisplayDefault)
        .addClass(STATUS_DOM_CLASSNAME, 'float-left', 'p-2');
      row.insertAfterTitleColumn(reviewStatus.dom, 'col-2');

      const reviews = await fetchReviews(row.parsePullRequestPageUrl());
      reviewStatus.fillRows(reviews);

      const status = reviews.getStatusByReviewerName(await this.params.username);
      if ((await this.params.enableBackgroundColor) && status !== 'not reviewer') {
        row.changeBackgroundColor(ROW_BG_COLOR_MAP[status]);
      }
    });

    let done = 0;
    processes.forEach((p) => p.then(() => this.toggleButton.updateFetchProgress(++done, processes.length)));

    await Promise.all(processes);
    this.toggleButton.changeState((await this.params.isDisplayDefault) ? 'awaitingHide' : 'awaitingShow');

    this.processed = true;
  }
}
