import { SSOT } from '../common/ssot';
import { ROW_BG_COLOR_MAP } from '../constant';
import { PullRequestListRow } from '../domain/pr-list-row';
import { MyReviewState, myReviewState, ReviewCollection } from '../domain/review';
import { $ } from '../util/query-selector';
import { ReviewStatusColumn } from './review-status-column';

export class PullRequestListRowImpl implements PullRequestListRow {
  public readonly pullRequestPageUrl: string;
  public readonly reviewStatusColumn: ReviewStatusColumn;
  public readonly enableBackgroundColor = new SSOT(true);
  private readonly myReviewState: SSOT<MyReviewState>;

  public constructor(
    private readonly dom: HTMLDivElement,
    makeColumn: (rowDom: HTMLDivElement, pullRequestPageUrl: string) => ReviewStatusColumn,
  ) {
    this.pullRequestPageUrl = $<HTMLAnchorElement>(this.dom, 'a.h4')!.href;
    this.reviewStatusColumn = makeColumn(this.dom, this.pullRequestPageUrl);
    this.myReviewState = new SSOT(myReviewState(this.dom.dataset.myReviewState).getOrElse('notReviewer'))
      .onChange((state) => {
        this.dom.dataset.myReviewState = state;
      })
      .onChange(this.updateBackgroundColor.bind(this));
    this.enableBackgroundColor.onChange(this.updateBackgroundColor.bind(this));
  }

  public updateReviewStatusColumn(reviews: ReviewCollection) {
    this.reviewStatusColumn.reviewStatus.change(reviews.toReviewStatus(this.pullRequestPageUrl));
  }

  public updateMyReviewState(myUsername: string) {
    const state = this.reviewStatusColumn.reviewStatus.value
      .findByUsername(myUsername)
      .fold<MyReviewState>('notReviewer', ({ result }) => result);
    this.myReviewState.change(state);
  }

  private updateBackgroundColor() {
    this.dom.style.backgroundColor = this.enableBackgroundColor.value
      ? ROW_BG_COLOR_MAP[this.myReviewState.value]
      : 'inherit';
  }
}
